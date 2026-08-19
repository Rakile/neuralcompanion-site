import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import * as addonModule from '../src/data/addons.ts';

const { ADDONS } = addonModule;

const EXPECTED_ADDON_IDS = [
  'nc.ai_presence_mode',
  'nc.audio_story_mode',
  'nc.buddy_chat',
  'nc.chat_provider_lmstudio',
  'nc.chat_provider_ollama',
  'nc.chat_provider_openai',
  'nc.chat_provider_xai',
  'nc.chat_session_player',
  'nc.chatterbox_multilingual_tts',
  'nc.chatterbox_tts',
  'nc.claude_provider',
  'nc.clipboard_source',
  'nc.clipboard_supervisor',
  'nc.companion_orb_overlay',
  'nc.corsair_visual_instrument',
  'nc.deepseek_provider',
  'nc.discord_voice_bridge',
  'nc.gemini_tts_preview',
  'nc.heart_rate_behavior',
  'nc.hotkeys',
  'nc.identity_artifacts',
  'nc.main_chat_remote',
  'nc.mock_heart_rate',
  'nc.multi_persona_roleplay',
  'nc.musetalk_avatar',
  'nc.musetalk_preprocess',
  'nc.no_avatar',
  'nc.no_stt',
  'nc.pockettts',
  'nc.pockettts_multilingual_tts',
  'nc.rag_context',
  'nc.scenic_avatar',
  'nc.screen_source',
  'nc.screen_supervisor',
  'nc.spotify_sense',
  'nc.ua_companion_orb_overlay',
  'nc.vam_avatar',
  'nc.visual_reply',
  'nc.visual_story_settings',
  'nc.vseeface_avatar',
  'nc.webcam_source',
  'nc.webcam_supervisor',
  'nc.whisper_english_stt',
  'nc.whisper_multilingual_stt',
];

test('addon model represents every Neural Companion manifest exactly once', () => {
  assert.deepEqual(ADDONS.map(({ manifestId }) => manifestId).sort(), EXPECTED_ADDON_IDS.sort());
  assert.equal(new Set(ADDONS.map(({ slug }) => slug)).size, 44);
  assert.equal(new Set(ADDONS.map(({ manifestId }) => manifestId)).size, 44);
});

test('editorial addon data matches the versioned application registry snapshot', async () => {
  const registry = JSON.parse(
    await readFile(new URL('../src/data/addon-registry.json', import.meta.url), 'utf8'),
  );
  assert.equal(registry.generatedFrom, 'NeuralCompanion/addons/*/addon.json');
  assert.equal(registry.addons.length, 44);
  assert.deepEqual(
    ADDONS.map(({ manifestId, name, version }) => ({ manifestId, name, version })).sort((a, b) => a.manifestId.localeCompare(b.manifestId)),
    registry.addons.map(({ id, name, version }) => ({ manifestId: id, name, version })).sort((a, b) => a.manifestId.localeCompare(b.manifestId)),
  );
});

test('addon model exposes useful route and relationship metadata', () => {
  const { ADDON_CATEGORIES, getAddonBySlug } = addonModule;
  assert.ok(Array.isArray(ADDON_CATEGORIES));
  assert.equal(typeof getAddonBySlug, 'function');
  assert.ok(ADDON_CATEGORIES.length >= 8);
  for (const addon of ADDONS) {
    assert.match(addon.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(addon.shortDescription.length >= 45, addon.slug);
    assert.ok(addon.longDescription.length >= addon.shortDescription.length, addon.slug);
    assert.ok(ADDON_CATEGORIES.some(({ id }) => id === addon.category), addon.slug);
    assert.match(addon.route, new RegExp(`^/addons/${addon.slug}/$`));
    assert.ok(addon.relatedAddons.every((slug) => getAddonBySlug(slug)), addon.slug);
  }
});

test('Corsair hardware addon uses its factual product identity and official icon', () => {
  const corsair = ADDONS.find(({ manifestId }) => manifestId === 'nc.corsair_visual_instrument');
  assert.ok(corsair);
  assert.equal(corsair.name, 'Corsair Visual Instrument');
  assert.equal(corsair.iconSrc, '/images/addons/corsair-visual-instrument/icon.png');
  assert.match(corsair.longDescription, /Corsair keyboards through iCUE/i);
});

test('production build publishes crawlable addon discovery and detail routes', async () => {
  const exists = async (url) => access(url).then(() => true, () => false);
  assert.equal(await exists(new URL('../dist/addons/index.html', import.meta.url)), true);
  for (const addon of ADDONS) {
    assert.equal(
      await exists(new URL(`../dist/addons/${addon.slug}/index.html`, import.meta.url)),
      true,
      addon.slug,
    );
  }

  const index = await readFile(new URL('../dist/addons/index.html', import.meta.url), 'utf8');
  assert.match(index, /data-addon-explorer/);
  assert.match(index, /id="addon-explorer-heading"[^>]*>Addon directory/);
  assert.match(index, /Search all 44 addons/);
  assert.match(index, /Corsair Visual Instrument/);
  assert.match(index, /href="\/addons\/corsair-visual-instrument\/"/);
});

test('homepage tells the configurable-product story without fake telemetry or audio coercion', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /Same engine\. Completely different personality\./);
  assert.match(html, /productive AI companion or a flat-out roasting bitch/);
  assert.match(html, /href="\/addons\/"/);
  assert.match(html, /data-mobile-menu-toggle/);
  assert.match(html, /data-mobile-menu/);
  assert.doesNotMatch(html, /GPU 3%|CPU 10%/);
  assert.doesNotMatch(html, /data-voice-consent/);
  assert.doesNotMatch(html, /data-page-audio-src/);
});
