import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.mjs',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
test('state transition uses one bounded interruptible composited animation',()=>{
  assert.match(app,/viewAnimation\?\.cancel\(\)/);
  assert.match(app,/duration: 170/);
  assert.match(app,/translateY\(5px\)/);
  assert.match(app,/prefersReducedMotion\.matches/);
  assert.match(app,/render\(!changed\)/);
});
test('approval check does not discard typed receipt or focus',()=>{
  assert.match(app,/workspace\.querySelectorAll\('\[data-action="open-platform"\]/);
  assert.match(app,/preventScroll: true/);
  assert.doesNotMatch(app,/persist\(\); render\(\); return;\s*\}\s*const obj/);
});
test('light dark and reduced-motion support share one timing language',()=>{
  assert.match(css,/--motion-quick:/);
  assert.match(css,/--motion-standard:/);
  assert.match(css,/@media \(prefers-color-scheme: dark\)/);
  assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css,/:focus-visible/);
});
