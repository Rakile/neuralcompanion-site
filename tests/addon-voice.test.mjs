import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

import { ADDONS } from '../src/data/addons.ts';

test('every addon has unique editable first-person commentary of a useful length', async () => {
  const scripts = [];

  for (const addon of ADDONS) {
    const path = new URL(`../src/content/addon-voice/${addon.slug}.txt`, import.meta.url);
    const script = (await readFile(path, 'utf8')).trim();
    const words = script.split(/\s+/u);

    assert.ok(words.length >= 55, `${addon.slug} commentary is too short`);
    assert.ok(words.length <= 125, `${addon.slug} commentary is too long`);
    assert.match(script, /\b(?:I|I'm|I've|me|my)\b/i, `${addon.slug} must use first person`);
    assert.match(script, new RegExp(addon.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    scripts.push(script);
  }

  assert.equal(new Set(scripts).size, ADDONS.length);
});

test('addon pages provide deliberate single-player audio with no autoplay', async () => {
  const pageSource = await readFile(new URL('../src/pages/addons/[addonSlug].astro', import.meta.url), 'utf8');
  const playerSource = await readFile(new URL('../src/components/AddonVoicePlayer.astro', import.meta.url), 'utf8');
  const controllerSource = await readFile(new URL('../src/scripts/addon-audio.ts', import.meta.url), 'utf8');

  assert.match(pageSource, /AddonVoicePlayer/);
  assert.match(playerSource, /data-addon-audio/);
  assert.match(playerSource, /data-addon-audio-toggle/);
  assert.doesNotMatch(playerSource, /autoplay/i);
  assert.match(controllerSource, /pause\(\)/);
  assert.match(controllerSource, /addon_audio_play/);
});

test('every addon exposes an optimized MP3 commentary file', async () => {
  for (const addon of ADDONS) {
    assert.equal(addon.voiceAudio, `/audio/addons/${addon.slug}.mp3`);
    const path = new URL(`../public/audio/addons/${addon.slug}.mp3`, import.meta.url);
    const [bytes, details] = await Promise.all([readFile(path), stat(path)]);
    const signature = bytes.subarray(0, 3).toString('ascii');
    assert.ok(signature === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0), `${addon.slug} must be MP3`);
    assert.ok(details.size > 40_000, `${addon.slug} audio should contain full commentary`);
  }
});
