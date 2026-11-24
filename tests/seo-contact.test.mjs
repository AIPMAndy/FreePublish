import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('landing metadata and public brand links remain grounded', () => {
  assert.match(html, /rel="canonical" href="https:\/\/aipmandy\.github\.io\/FreePublish\/"/);
  for (const url of ['https://metaver.vip/', 'https://www.a6no1.cn/', 'https://metaver.vip/services', 'https://github.com/AIPMAndy/FreePublish']) assert.ok(html.includes(url), url);
  assert.match(html, /id="copy-wechat"/);
  assert.match(html, /src="\.\/src\/contact\.mjs"/);
  assert.doesNotMatch(html, /github\.com\/AIPMAndy\/free-publish/);
});
test('WebApplication JSON-LD is valid and CSP allows its exact bytes', () => {
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(raw, 'missing structured data');
  const data = JSON.parse(raw);
  assert.equal(data['@type'], 'WebApplication');
  assert.equal(data.url, 'https://aipmandy.github.io/FreePublish/');
  assert.equal(data.isAccessibleForFree, true);
  const hash = createHash('sha256').update(raw).digest('base64');
  assert.ok(html.includes("'sha256-" + hash + "'"), 'JSON-LD CSP hash mismatch');
});
test('contact control has explicit success and failure copy states', () => {
  const src = readFileSync(new URL('../src/contact.mjs', import.meta.url), 'utf8');
  assert.match(src, /navigator\.clipboard\.writeText/);
  assert.match(src, /复制失败/);
  assert.match(src, /addEventListener\('click'/);
});
