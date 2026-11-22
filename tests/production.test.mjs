import test from 'node:test';
import assert from 'node:assert/strict';
import { buildZip, crc32, safeFileName } from '../src/zip.mjs';
import { validateMedia, ratioLabel, orientation } from '../src/media.mjs';
import { exportCalendar } from '../src/calendar.mjs';

test('CRC32 standard vector', () => assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926));
test('ZIP with UTF-8 files has PK local and central directory headers', async () => {
  const blob = await buildZip([
    { name: '发布说明.txt', data: '你好 FreePublish' },
    { name: 'frame.webp', data: new Uint8Array([1, 2, 3]) }
  ]);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  assert.deepEqual(Array.from(bytes.slice(0, 4)), [0x50, 0x4b, 0x03, 0x04]);
  assert.deepEqual(Array.from(bytes.slice(-22, -18)), [0x50, 0x4b, 0x05, 0x06]);
  assert.equal(new DataView(bytes.buffer).getUint16(bytes.length - 12, true), 2);
});
test('ZIP rejects duplicate and unsafe filenames', async () => {
  assert.equal(safeFileName('../private/token.txt'), '__private_token.txt');
  await assert.rejects(buildZip([
    { name: '../secret.txt', data: 'a' }, { name: '..\\secret.txt', data: 'b' }
  ]), /重名/);
});
test('media validation and orientation rules', () => {
  assert.equal(validateMedia({ name:'a.mp4', size:1000, type:'video/mp4' }), 'video');
  assert.throws(() => validateMedia({ name:'a.exe', size:100, type:'application/octet-stream' }));
  assert.throws(() => validateMedia({ name:'empty.png', size:0, type:'image/png' }));
  assert.equal(orientation(1080, 1920), 'portrait');
  assert.equal(ratioLabel(1080, 1920), '9:16 竖版');
});
test('calendar export schedules human reminders, not publication', () => {
  const posts = [{ id:'post-1',variants:{xiaohongshu:{ title:'测验', plannedAt:'2026-12-01T15:00:00' }}}];
  const platforms = {xiaohongshu:{name:'小红书',url:'https://creator.xiaohongshu.com'}};
  const r = exportCalendar(posts, platforms);
  assert.equal(r.count, 1);
  assert.match(r.contents, /BEGIN:VEVENT/);
  assert.match(r.contents, /人工发布/);
  assert.match(r.contents, /TRIGGER:-PT30M/);
});
