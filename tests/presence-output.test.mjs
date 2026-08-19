import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the companion orb follows pointer-capable visitors without blocking content', async () => {
  const [html, script] = await Promise.all([
    readFile(new URL('../dist/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/site-presence.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(html, /<aside class="companion-presence" data-companion-orb aria-hidden="true">/);
  assert.match(script, /pointermove/);
  assert.match(script, /pointer: coarse/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /clampPosition/);
  assert.doesNotMatch(script, /voice|audio|speech/i);
});
