import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Astro exports the production static-site configuration', async () => {
  const { default: config } = await import('../astro.config.mjs');

  assert.equal(config.site, 'https://neuralcompanion.app');
  assert.equal(config.output, 'static');
  assert.equal(config.trailingSlash, 'always');
  assert.equal(config.base, undefined);
  assert.equal(config.integrations.length, 1);
});

test('global styles protect keyboard focus and reduced-motion preferences', async () => {
  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:/);
});
