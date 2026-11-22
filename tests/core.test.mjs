import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPost, generateVariant, ensureVariants, review, canApprove,
  approve, isApproved, fingerprint, confirmPublished, validPublishUrl,
  variantStatus, importState, exportState, emptyState, charLength
} from '../src/core.mjs';

function fixture() {
  const p = createPost('test-id');
  p.title = '第一性原理做内容';
  p.source = '分享我实际用过的内容工作流。';
  p.rights = 'owned';
  p.mediaNames = ['demo.mp4'];
  ensureVariants(p);
  return p;
}
test('支持中文 Unicode 计数，不把 emoji 错算成两个字', () => {
  assert.equal(charLength('中😀文'), 3);
});
test('未经权属声明不能批准', () => {
  const p = fixture(); p.rights = 'unknown';
  assert.equal(canApprove(p, 'xiaohongshu', [p]), false);
  assert.ok(review(p, 'xiaohongshu', [p]).some(i => i.code === 'rights'));
});
test('不同平台版本相同会提示，但人工确认后才可批准', () => {
  const p = fixture();
  assert.ok(review(p, 'xiaohongshu', [p]).some(i => i.code === 'same-content'));
  assert.equal(canApprove(p, 'xiaohongshu', [p]), false);
  p.variants.xiaohongshu.warningAcknowledged = true;
  approve(p, 'xiaohongshu', [p]);
  assert.equal(isApproved(p, 'xiaohongshu'), true);
});
test('编辑、修改 AI 声明与计划时间后旧审核立即失效', () => {
  const p = fixture(); p.variants.xiaohongshu.warningAcknowledged = true;
  approve(p, 'xiaohongshu', [p]);
  const original = fingerprint(p, 'xiaohongshu');
  p.variants.xiaohongshu.body += ' 有新内容';
  assert.notEqual(fingerprint(p, 'xiaohongshu'), original);
  assert.equal(isApproved(p, 'xiaohongshu'), false);
});
test('版本内容改回原文，也不能复用之前的人工审批', () => {
  const p = fixture(); p.variants.xiaohongshu.warningAcknowledged = true;
  approve(p, 'xiaohongshu', [p]);
  const old = p.variants.xiaohongshu.body;
  p.variants.xiaohongshu.body += '改动'; p.revision++;
  p.variants.xiaohongshu.body = old; p.revision++;
  assert.equal(isApproved(p, 'xiaohongshu'), false);
});
test('AI 生成和商业推广声明是阻断项', () => {
  const p = fixture(); p.aiUsed = true; p.commercial = true;
  const r = review(p, 'xiaohongshu', [p]);
  assert.ok(r.some(i => i.code === 'ai-label' && i.severity === 'block'));
  assert.ok(r.some(i => i.code === 'commercial-label' && i.severity === 'block'));
});
test('误用其他域名和不安全 scheme 不能登记为已发布', () => {
  assert.equal(validPublishUrl('xiaohongshu', 'https://creator.xiaohongshu.com.evil.test/123'), false);
  assert.equal(validPublishUrl('xiaohongshu', 'javascript:alert(1)'), false);
  assert.equal(validPublishUrl('xiaohongshu', 'https://www.xiaohongshu.com/explore/123'), true);
});
test('发布登记要求先通过审核且真实平台作品链接', () => {
  const p = fixture();
  assert.throws(() => confirmPublished(p, 'xiaohongshu', 'https://www.xiaohongshu.com/explore/123'));
  p.variants.xiaohongshu.warningAcknowledged = true;
  approve(p, 'xiaohongshu', [p]);
  confirmPublished(p, 'xiaohongshu', 'https://www.xiaohongshu.com/explore/123');
  assert.equal(variantStatus(p, 'xiaohongshu'), '已发布·人工登记');
});
test('导入备份不会信任伪造审核与已发布状态', () => {
  const p = fixture(); p.variants.xiaohongshu.warningAcknowledged = true;
  approve(p, 'xiaohongshu', [p]);
  confirmPublished(p, 'xiaohongshu', 'https://www.xiaohongshu.com/explore/123');
  const original = { ...emptyState(), posts: [p] };
  const restored = importState(JSON.parse(exportState(original)));
  assert.equal(isApproved(restored.posts[0], 'xiaohongshu'), false);
  assert.equal(restored.posts[0].variants.xiaohongshu.publishedUrl, '');
});
test('标题长度阈值：视频号阻断，其他平台提示', () => {
  const p = fixture(); p.variants.channels.title = '这是一个明显超过视频号十六字上限的内容标题，需要重写';
  assert.ok(review(p, 'channels', [p]).some(i => i.code === 'title-too-long' && i.severity === 'block'));
});
test('静态模式不包含任何实际平台请求', () => {
  const p = fixture();
  assert.equal(generateVariant(p, 'threads').body, p.source);
});
