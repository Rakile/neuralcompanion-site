import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const routes = [
  'download',
  'install',
  'guides',
  'changelog',
  'local-ai-companion',
  'ai-companion-windows',
  'voice-ai-companion',
  'ai-avatar',
  'memory',
  'visual-replies',
  'integrations/ollama',
  'integrations/lm-studio',
  'integrations/musetalk',
  'integrations/vseeface',
  'integrations/vam',
];

test('every approved content route is generated with production metadata', async () => {
  for (const route of routes) {
    const html = await readFile(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8');
    assert.match(html, /<h1>[^<]+<\/h1>/, `${route} needs one visible heading`);
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="https://neuralcompanion\\.app/${route}/">`),
      `${route} needs its production canonical`,
    );
  }
});

test('install output keeps core and MuseTalk requirements distinct', async () => {
  const html = await readFile(new URL('../dist/install/index.html', import.meta.url), 'utf8');

  assert.match(html, /Python 3\.11/);
  assert.match(html, /INSTALL_NEURAL_COMPANION\.bat/);
  assert.match(html, /run_neural_companion\.bat/);
  assert.match(html, /MuseTalk requires an NVIDIA CUDA GPU/);
});

test('detail routes answer requirements and link to source documentation', async () => {
  const [feature, integration] = await Promise.all([
    readFile(new URL('../dist/memory/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/integrations/ollama/index.html', import.meta.url), 'utf8'),
  ]);

  assert.match(feature, /<h2>Requirements<\/h2>/);
  assert.match(feature, /Verify in the project documentation/);
  assert.match(integration, /<h2>Configuration<\/h2>/);
  assert.match(integration, /Verify in the project source/);
});
