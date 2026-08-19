import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('built homepage includes shared metadata and semantic landmarks', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

  assert.match(html, /<link rel="canonical" href="https:\/\/neuralcompanion\.app\/">/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/neuralcompanion\.app\/images\/social\/neural-companion-og\.webp">/,
  );
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<a class="skip-link" href="#main-content">Skip to content<\/a>/);
  assert.match(html, /<nav[^>]+aria-label="Primary navigation"[^>]*>/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<footer class="site-footer">/);
});

test('built homepage explains the product and emits factual software data', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

  assert.match(html, /open-source Windows AI companion platform/i);
  assert.match(html, /Real-time voice, persistent memory, AI avatars, visual replies/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount/);
  assert.match(html, /"price":"0"/);
});

test('feature and integration indexes are generated', async () => {
  const [features, integrations] = await Promise.all([
    readFile(new URL('../dist/features/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/integrations/index.html', import.meta.url), 'utf8'),
  ]);

  assert.match(features, /<h1>Features<\/h1>/);
  assert.match(integrations, /<h1>Integrations<\/h1>/);
});
