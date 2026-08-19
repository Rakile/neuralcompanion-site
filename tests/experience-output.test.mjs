import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('homepage publishes authentic application captures and configurable personality', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /Real application captures/);
  assert.match(html, /\/images\/product\/nc-host\.webp/);
  assert.match(html, /\/images\/product\/nc-addons\.webp/);
  assert.match(html, /\/images\/product\/nc-visual-reply\.webp/);
  assert.match(html, /\/images\/product\/nc-musetalk\.webp/);
  assert.match(html, /Same engine\. Completely different personality\./);
  assert.match(html, /44<\/strong><span>addon modules/);
});

test('orb is visual-only and addon narration is always deliberate', async () => {
  const [home, addon, script] = await Promise.all([
    readFile(new URL('../dist/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/addons/ollama-chat-provider/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/site-presence.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(home, /data-companion-orb/);
  assert.match(home, /data-orb-tracker/);
  assert.doesNotMatch(home, /data-voice-consent|data-page-audio-src|<audio/);
  assert.doesNotMatch(script, /new Audio|\.play\(|autoplay/i);
  assert.match(addon, /data-addon-audio-toggle/);
  assert.match(addon, /Read transcript/);
  assert.doesNotMatch(addon, /autoplay/);
});
