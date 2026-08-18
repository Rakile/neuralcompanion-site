import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('built crawler files expose the production sitemap', async () => {
  const [robots, sitemapIndex, sitemapPages] = await Promise.all([
    readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8'),
    readFile(new URL('../dist/sitemap-index.xml', import.meta.url), 'utf8'),
    readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8'),
  ]);

  assert.equal(
    robots,
    'User-agent: *\nAllow: /\n\nSitemap: https://neuralcompanion.app/sitemap-index.xml\n',
  );
  assert.match(sitemapIndex, /https:\/\/neuralcompanion\.app\/sitemap-0\.xml/);
  assert.match(sitemapPages, /https:\/\/neuralcompanion\.app\/install\//);
});
