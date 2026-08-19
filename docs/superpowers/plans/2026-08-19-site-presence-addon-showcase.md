# Site Presence and Addon Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an official-logo first-visit consent flow, persistent site-wide Companion Orb narration, and a curated authentic addon showcase backed by a complete safe screenshot library.

**Architecture:** Astro's shared layout hosts a client-side navigation shell and one site-presence controller. Page and addon components declare narration metadata, while the controller owns consent, session playback history, audio interruption, captions, and orb state. Authentic logo/icon/screenshot/audio assets remain static files with typed catalogue metadata and a capture manifest.

**Tech Stack:** Astro 7.2, TypeScript 6, browser Web Storage and HTMLAudioElement APIs, CSS, Node 24 test runner, Python/Chatterbox voice renderer, PySide6 application capture.

**Spec:** `docs/superpowers/specs/2026-08-19-site-orb-audio-addon-design.md`

## Global Constraints

- Do not alter Neural Companion application code or settings while collecting website media.
- Do not activate microphones, cameras, clipboard capture, screen capture, external avatar runtimes, or account-linked services for screenshots.
- Never publish secrets, API keys, usernames, private conversations, local paths, source voice samples, or personal data.
- Audio never starts before an explicit first-visit or header-control gesture.
- The saved voice choice lives in `localStorage`; once-per-page and once-per-addon history lives in `sessionStorage`.
- Fine-pointer hover intent is exactly 650 ms; orb parking begins after exactly 2.5 seconds of pointer inactivity.
- The orb visual layer is click-through and respects `prefers-reduced-motion` and coarse pointers.
- Internal navigation and all page content must still work when scripts, storage, or audio playback fail.
- Preserve all existing SEO routes, canonical URLs, JSON-LD, sitemap validation, and media placeholders.
- Do not add runtime dependencies.
- Do not commit or push without explicit user approval.

---

## File Map

- `src/data/presence.ts` — typed page and curated-addon narration catalogue.
- `src/data/addons.ts` — complete addon inventory, official icon locations, capture status, and optional screenshot metadata.
- `src/components/VoiceConsent.astro` — first-visit logo dialog and two consent actions.
- `src/components/CompanionOrb.astro` — fixed decorative orb, live caption, and playback status only.
- `src/components/Header.astro` — official compact logo and persistent voice toggle.
- `src/components/ProductShowcase.astro` — curated, narratable addon cards backed by real captures.
- `src/layouts/BaseLayout.astro` — shared `ClientRouter`, page narration attributes, consent, orb, and controller mount.
- `src/scripts/presence-state.ts` — storage-safe pure helpers and route/addon session keys.
- `src/scripts/site-presence.ts` — DOM event, audio, hover intent, client-navigation, and orb motion orchestration.
- `src/styles/global.css` — consent/orb/control styles and restrained NC application visual system.
- `scripts/render-orb-voice.py` — deterministic page/addon voice batch definitions using the existing configured NC pipeline.
- `public/media/brand/nc-logo.png` — official supplied logo.
- `public/media/addons/icons/*.png` — official supplied side-tab icons.
- `public/media/addons/screenshots/*.png` — sanitized addon captures.
- `public/media/voice/pages/*.wav` — page-entry voice clips.
- `public/media/voice/addons/*.wav` — curated addon narration clips.
- `public/media/addons/capture-manifest.json` — complete capture result inventory without private source paths.
- `tests/presence-state.test.mjs` — pure consent/session/clamping tests.
- `tests/presence-output.test.mjs` — generated HTML and source-level interaction contracts.
- `tests/addon-assets.test.mjs` — inventory, manifest, PNG, and WAV validation.

---

### Task 1: Official Assets and Typed Narration Catalogue

**Files:**
- Create: `src/data/presence.ts`
- Create: `src/data/addons.ts`
- Create: `tests/addon-assets.test.mjs`
- Create: `public/media/brand/nc-logo.png`
- Create: `public/media/addons/icons/*.png`
- Test: `tests/addon-assets.test.mjs`

**Interfaces:**
- Produces: `PageNarration`, `AddonNarration`, `PAGE_NARRATION`, `CURATED_ADDONS`, `AddonRecord`, and `ADDONS`.
- Produces: stable addon ids matching `/media/addons/icons/<id>.png` and optional `/media/addons/screenshots/<id>.png`.
- Consumes: the official files supplied by the user; no generated substitutes.

- [ ] **Step 1: Write the failing asset/catalogue test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { ADDONS } from '../src/data/addons.ts';
import { CURATED_ADDONS, PAGE_NARRATION } from '../src/data/presence.ts';

test('official logo and complete addon icon inventory are published', async () => {
  const logo = await readFile(new URL('../public/media/brand/nc-logo.png', import.meta.url));
  assert.deepEqual([...logo.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(ADDONS.length, 25);
  assert.equal(new Set(ADDONS.map(({ id }) => id)).size, ADDONS.length);
  for (const addon of ADDONS) {
    const bytes = await readFile(new URL(`../public${addon.iconSrc}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  }
});

test('every generated route and curated addon has narration metadata', () => {
  const routes = ['/', '/download/', '/install/', '/features/', '/integrations/', '/guides/', '/changelog/', '/local-ai-companion/', '/ai-companion-windows/', '/voice-ai-companion/', '/ai-avatar/', '/memory/', '/visual-replies/', '/integrations/ollama/', '/integrations/lm-studio/', '/integrations/musetalk/', '/integrations/vseeface/', '/integrations/vam/'];
  assert.deepEqual(Object.keys(PAGE_NARRATION).sort(), routes.sort());
  assert.ok(CURATED_ADDONS.length >= 6 && CURATED_ADDONS.length <= 8);
  for (const addon of CURATED_ADDONS) {
    assert.ok(addon.transcript.length > 30);
    assert.match(addon.audioSrc, /^\/media\/voice\/addons\/[a-z0-9-]+\.wav$/);
  }
});
```

- [ ] **Step 2: Run the focused test and verify the missing modules fail**

Run: `npm test -- --test-name-pattern="official logo|every generated route"`

Expected: FAIL because `src/data/addons.ts` and `src/data/presence.ts` do not exist.

- [ ] **Step 3: Copy official media with explicit file targets**

Use PowerShell `Copy-Item -LiteralPath` after creating only these directories: `public/media/brand` and `public/media/addons/icons`. Copy `C:\Users\lainol\Downloads\NC_logo.png` to `public/media/brand/nc-logo.png`. Copy the 25 feature icons from the authorized checkout and rename them to stable kebab-case ids; retain `scroll_up.png` and `scroll_down.png` only if needed as non-addon utility assets.

Expected ids:

```text
ai-presence artifacts brain-memory buddy-chat chat chat-player chunking
companion-orb desktop-bridge discord-chat dry-run host hotkeys
multi-persona-story-mode musetalk persona scenic spotisense story-visuals
themes tutorials vam vision visuals vseeface
```

- [ ] **Step 4: Implement the typed catalogues**

```ts
export interface PageNarration {
  transcript: string;
  audioSrc: `/media/voice/pages/${string}.wav`;
  mood: 'curious' | 'wry' | 'pleased' | 'watching';
}

export interface AddonNarration extends PageNarration {
  id: string;
  name: string;
  iconSrc: `/media/addons/icons/${string}.png`;
  screenshotSrc: `/media/addons/screenshots/${string}.png`;
  summary: string;
}

export const PAGE_NARRATION = {
  '/': { transcript: 'Welcome to Neural Companion. Yes, the orb follows you. It has trust issues.', audioSrc: '/media/voice/pages/home.wav', mood: 'watching' },
  '/download/': { transcript: 'Downloads live here. Reading the requirements first remains technically legal.', audioSrc: '/media/voice/pages/download.wav', mood: 'wry' },
  '/install/': { transcript: 'Installation instructions: the ancient ritual of reading before clicking.', audioSrc: '/media/voice/pages/install.wav', mood: 'curious' },
  '/features/': { transcript: 'These are the features. Apparently one personality needed several departments.', audioSrc: '/media/voice/pages/features.wav', mood: 'pleased' },
  '/integrations/': { transcript: 'Integrations: because even artificial minds need an unnecessarily elaborate social circle.', audioSrc: '/media/voice/pages/integrations.wav', mood: 'wry' },
  '/guides/': { transcript: 'Guides are available. I admire your unexpected commitment to documentation.', audioSrc: '/media/voice/pages/guides.wav', mood: 'pleased' },
  '/changelog/': { transcript: 'The changelog: proof that software can evolve without pretending it was perfect.', audioSrc: '/media/voice/pages/changelog.wav', mood: 'curious' },
  '/local-ai-companion/': { transcript: 'Local AI keeps the important machinery on your computer, where it can judge you privately.', audioSrc: '/media/voice/pages/local-ai-companion.wav', mood: 'watching' },
  '/ai-companion-windows/': { transcript: 'Built for Windows, with enough controls to make a spaceship feel underconfigured.', audioSrc: '/media/voice/pages/ai-companion-windows.wav', mood: 'pleased' },
  '/voice-ai-companion/': { transcript: 'Voice gives the companion timing, tone, and fresh opportunities for sarcasm.', audioSrc: '/media/voice/pages/voice-ai-companion.wav', mood: 'wry' },
  '/ai-avatar/': { transcript: 'Avatars provide a face for the voice. Dramatic lighting remains your responsibility.', audioSrc: '/media/voice/pages/ai-avatar.wav', mood: 'curious' },
  '/memory/': { transcript: 'Memory keeps useful context nearby. Unlike you, it has a search button.', audioSrc: '/media/voice/pages/memory.wav', mood: 'wry' },
  '/visual-replies/': { transcript: 'Visual replies turn conversation into images when words are being suspiciously insufficient.', audioSrc: '/media/voice/pages/visual-replies.wav', mood: 'pleased' },
  '/integrations/ollama/': { transcript: 'Ollama brings local models into the conversation without sending them sightseeing.', audioSrc: '/media/voice/pages/ollama.wav', mood: 'curious' },
  '/integrations/lm-studio/': { transcript: 'LM Studio connects your local model collection. Collect responsibly. Or at least label them.', audioSrc: '/media/voice/pages/lm-studio.wav', mood: 'wry' },
  '/integrations/musetalk/': { transcript: 'MuseTalk animates a speaking face in real time. The eyebrows may become ambitious.', audioSrc: '/media/voice/pages/musetalk.wav', mood: 'pleased' },
  '/integrations/vseeface/': { transcript: 'VSeeFace connects the companion to a live avatar, because a floating window lacked drama.', audioSrc: '/media/voice/pages/vseeface.wav', mood: 'watching' },
  '/integrations/vam/': { transcript: 'VaM integration brings the companion into a three-dimensional scene. Subtlety has left the room.', audioSrc: '/media/voice/pages/vam.wav', mood: 'wry' },
} as const satisfies Record<string, PageNarration>;
```

Create `ADDONS` with all 25 ids, official names, icon sources, `captureStatus: 'pending'`, and no private filesystem paths. Create a 6–8 item `CURATED_ADDONS` list for Companion Orb, MuseTalk, Brain/Memory, Visuals, Multi-Persona Story Mode, Desktop Bridge, SpotiSense, and VSeeFace, each with a factual one-sentence summary and a short playful transcript.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --test-name-pattern="official logo|every generated route"`

Expected: PASS.

- [ ] **Step 6: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; official assets and typed catalogue files are listed as uncommitted changes.

---

### Task 2: First-Visit Consent and Persistent Header Control

**Files:**
- Create: `src/components/VoiceConsent.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `tests/presence-output.test.mjs`
- Modify: `src/styles/global.css`
- Test: `tests/presence-output.test.mjs`

**Interfaces:**
- Produces DOM hooks: `[data-voice-consent]`, `[data-voice-enable]`, `[data-voice-disable]`, `[data-voice-toggle]`, `[data-voice-toggle-label]`.
- Produces layout attributes: `data-page-path`, `data-page-audio-src`, `data-page-transcript`, `data-page-mood`.
- Consumes `PAGE_NARRATION[Astro.url.pathname]` and `/media/brand/nc-logo.png`.

- [ ] **Step 1: Write failing generated-output tests**

```js
test('every page includes consent, official logo, and a persistent voice control', async () => {
  for (const route of ['index.html', 'features/index.html', 'download/index.html']) {
    const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
    assert.match(html, /data-voice-consent/);
    assert.match(html, /\/media\/brand\/nc-logo\.png/);
    assert.match(html, /data-voice-enable/);
    assert.match(html, /data-voice-disable/);
    assert.match(html, /data-voice-toggle/);
    assert.match(html, /aria-pressed="false"/);
    assert.match(html, /data-page-audio-src="\/media\/voice\/pages\//);
  }
});
```

- [ ] **Step 2: Build and verify the test fails**

Run: `npm run build && npm test -- --test-name-pattern="every page includes consent"`

Expected: FAIL because the consent and voice-toggle hooks are absent.

- [ ] **Step 3: Implement semantic consent and header markup**

`VoiceConsent.astro` renders a fixed `<section role="dialog" aria-modal="true" aria-labelledby="voice-consent-title" hidden data-voice-consent>` with the official logo, concise sound explanation, `Enter with voice`, and `Enter silently` buttons. `Header.astro` replaces the generated CSS brand mark with the official logo and adds a text-labelled button whose initial server state is `aria-pressed="false"` and label `Orb voice: off`.

- [ ] **Step 4: Mount shared controls and route metadata**

Add Astro's built-in `ClientRouter` from `astro:transitions` to the shared `<head>`. Resolve narration with:

```ts
const pageNarration = PAGE_NARRATION[pathname] ?? PAGE_NARRATION['/'];
```

Mount `<VoiceConsent />` and the global `<CompanionOrb />` once in `BaseLayout.astro`, and put the page narration data attributes on `<body>`. Remove the homepage-only `<CompanionOrb />` import and render from `src/pages/index.astro`.

- [ ] **Step 5: Add minimal accessible styling**

The dialog covers the viewport with an opaque dark backdrop, uses the logo at a responsive maximum size, exposes visible focus rings, and keeps both choices equal in visual weight. The header toggle remains visible at desktop and mobile widths. CSS alone must not hide the dialog permanently; JavaScript decides whether `[hidden]` is removed.

- [ ] **Step 6: Build and run the focused test**

Run: `npm run build && npm test -- --test-name-pattern="every page includes consent"`

Expected: PASS.

- [ ] **Step 7: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and no commit created.

---

### Task 3: Storage-Safe Presence State

**Files:**
- Create: `src/scripts/presence-state.ts`
- Create: `tests/presence-state.test.mjs`
- Test: `tests/presence-state.test.mjs`

**Interfaces:**
- Produces: `VOICE_PREFERENCE_KEY`, `PAGE_SESSION_PREFIX`, `ADDON_SESSION_PREFIX`.
- Produces: `readVoicePreference(storage): boolean | null`, `writeVoicePreference(storage, enabled): boolean`, `wasPlayedThisSession(storage, namespace, id): boolean`, `markPlayedThisSession(storage, namespace, id): void`, and `clampOrbPosition(position, viewport, orbSize, margin): Point`.
- Consumes: a `Pick<Storage, 'getItem' | 'setItem'>`-compatible object and plain numeric geometry.

- [ ] **Step 1: Write the failing pure-state tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { clampOrbPosition, markPlayedThisSession, readVoicePreference, wasPlayedThisSession, writeVoicePreference } from '../src/scripts/presence-state.ts';

const memoryStorage = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};

test('voice preference distinguishes unknown, enabled, and disabled', () => {
  const storage = memoryStorage();
  assert.equal(readVoicePreference(storage), null);
  assert.equal(writeVoicePreference(storage, true), true);
  assert.equal(readVoicePreference(storage), true);
  assert.equal(writeVoicePreference(storage, false), false);
  assert.equal(readVoicePreference(storage), false);
});

test('successful playback can be recorded for a page or addon', () => {
  const storage = memoryStorage();
  assert.equal(wasPlayedThisSession(storage, 'page', '/features/'), false);
  markPlayedThisSession(storage, 'page', '/features/');
  assert.equal(wasPlayedThisSession(storage, 'page', '/features/'), true);
  assert.equal(wasPlayedThisSession(storage, 'addon', 'musetalk'), false);
});

test('orb coordinates stay inside the viewport margin', () => {
  assert.deepEqual(clampOrbPosition({ x: -20, y: 900 }, { width: 800, height: 600 }, 96, 16), { x: 16, y: 488 });
});
```

- [ ] **Step 2: Run and verify the missing module fails**

Run: `node --test tests/presence-state.test.mjs`

Expected: FAIL with module-not-found for `presence-state.ts`.

- [ ] **Step 3: Implement defensive pure helpers**

Use the exact keys `nc:orb-voice`, `nc:page-played:`, and `nc:addon-played:`. Store preference values as `'enabled'` or `'disabled'`; malformed values return `null`. Wrap every storage read/write in `try/catch`; failed preference writes return the requested runtime state without crashing. `wasPlayedThisSession` returns true only when the exact key equals `'1'`; `markPlayedThisSession` writes `'1'`. Clamp x/y independently between `margin` and `viewport - orbSize - margin`.

- [ ] **Step 4: Run the pure-state tests**

Run: `node --test tests/presence-state.test.mjs`

Expected: 3 PASS.

- [ ] **Step 5: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and no commit created.

---

### Task 4: Global Orb, Audio Controller, and Navigation Playback

**Files:**
- Modify: `src/components/CompanionOrb.astro`
- Replace: `src/scripts/companion-orb.ts` with `src/scripts/site-presence.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/presence-output.test.mjs`
- Modify: `tests/experience-output.test.mjs`
- Test: `tests/presence-state.test.mjs`
- Test: `tests/presence-output.test.mjs`

**Interfaces:**
- Consumes Task 2 DOM hooks and Task 3 state helpers.
- Produces custom event `nc:presence-request` with detail `{ id, transcript, audioSrc, mood, source, replay }`.
- Produces orb states `idle | tracking | speaking | muted | blocked` and `[data-orb-caption]` live text.

- [ ] **Step 1: Replace obsolete orb assertions with failing global-controller assertions**

```js
test('site presence is global, consent-aware, and motion-safe', async () => {
  const [html, script] = await Promise.all([
    readFile(new URL('../dist/features/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/scripts/site-presence.ts', import.meta.url), 'utf8'),
  ]);
  assert.match(html, /data-companion-orb/);
  assert.match(html, /data-orb-caption/);
  assert.match(script, /astro:page-load/);
  assert.match(script, /localStorage/);
  assert.match(script, /sessionStorage/);
  assert.match(script, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /pointer:\s*coarse/);
  assert.match(script, /650/);
  assert.match(script, /2500/);
  assert.match(script, /\.pause\(\)/);
  assert.doesNotMatch(html, /<audio[^>]+autoplay/);
});
```

- [ ] **Step 2: Build and verify the focused test fails**

Run: `npm run build && npm test -- --test-name-pattern="site presence is global"`

Expected: FAIL because the global controller and caption hooks are absent.

- [ ] **Step 3: Simplify the orb component into a fixed overlay**

Render one decorative `[data-orb-tracker]` with the existing core/ring structure, plus a separate `[data-orb-caption]` containing an `aria-live="polite"` paragraph and playback status. Remove the boxed section, prompt buttons, stage grid, and component-local mute button. Keep the visual wrapper `aria-hidden="true"`; keep the caption available to assistive technology.

- [ ] **Step 4: Implement one idempotent site controller**

`site-presence.ts` must:

1. Initialize once using a `document.documentElement.dataset.presenceReady` guard.
2. Read the stored choice; show the consent dialog only for `null`.
3. On either consent choice, save the preference, hide the dialog, update the header, and request the current page only if voice was enabled.
4. Listen for `astro:page-load`, refresh references after DOM swaps, and skip a route already recorded in `sessionStorage`.
5. Listen for header toggle clicks and immediately stop audio when disabled.
6. Maintain exactly one `HTMLAudioElement`; pause, reset, and detach stale listeners before a new request.
7. Update caption text even when voice is disabled; play only when enabled.
8. Record the page or addon session key only after `audio.play()` resolves. On rejection, leave it unrecorded, set state `blocked`, leave the toggle truthful, and expose `Voice blocked — press the header control to retry.`
9. Track `document` pointer movement, offset the orb by 22 px, clamp it using `clampOrbPosition`, ease with `requestAnimationFrame`, and park after 2500 ms.
10. Keep the orb parked for coarse pointers and reduced motion.

- [ ] **Step 5: Add overlay and state styling**

Use `position: fixed`, `z-index` below the consent dialog but above page content, and `pointer-events: none` for both visual and caption. Keep the orb between 64 px and 96 px depending on viewport. Speaking animation may pulse the core but must not use particle fields or multi-screen glow clouds. Park above the mobile footer/navigation safe area.

- [ ] **Step 6: Build and run focused and regression tests**

Run: `npm run build && node --test tests/presence-state.test.mjs tests/presence-output.test.mjs tests/experience-output.test.mjs`

Expected: all selected tests PASS.

- [ ] **Step 7: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and no commit created.

---

### Task 5: Render Authorized Page and Curated-Addon Voice Assets

**Files:**
- Modify: `scripts/render-orb-voice.py`
- Create: `public/media/voice/pages/*.wav`
- Create: `public/media/voice/addons/*.wav`
- Modify: `tests/addon-assets.test.mjs`

**Interfaces:**
- Consumes exact `PAGE_NARRATION` and `CURATED_ADDONS` ids/transcripts from Task 1.
- Produces one valid mono WAV file for every declared `audioSrc` using the currently configured authorized companion voice.

- [ ] **Step 1: Extend the failing media-integrity test**

```js
test('every declared narration clip is a useful WAV file', async () => {
  const clips = [
    ...Object.values(PAGE_NARRATION).map(({ audioSrc }) => audioSrc),
    ...CURATED_ADDONS.map(({ audioSrc }) => audioSrc),
  ];
  for (const src of clips) {
    const bytes = await readFile(new URL(`../public${src}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WAVE');
    assert.ok(bytes.length > 40_000, `${src} should contain rendered speech`);
  }
});
```

- [ ] **Step 2: Run and verify missing clips fail**

Run: `node --test --test-name-pattern="every declared narration clip" tests/addon-assets.test.mjs`

Expected: FAIL with `ENOENT` for the first missing page clip.

- [ ] **Step 3: Convert the renderer to an explicit deterministic batch**

Keep the existing Neural Companion Chatterbox configuration and source-voice lookup unchanged. Add two literal dictionaries named `PAGE_LINES` and `ADDON_LINES` whose keys and text exactly match Task 1. Resolve only the output directories inside this website worktree. Refuse to overwrite files outside `public/media/voice`, print one line per rendered clip, and return a nonzero exit if any declared clip fails.

- [ ] **Step 4: Render the clips using the authorized local NC environment**

Run:

```powershell
& 'Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev\.venv\Scripts\python.exe' `
  'Q:\neuralcompanion-site\.worktrees\site-phase-1\scripts\render-orb-voice.py' `
  --nc-root 'Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev' `
  --output-dir 'Q:\neuralcompanion-site\.worktrees\site-phase-1\public\media\voice'
```

The renderer itself creates the `pages` and `addons` child directories. Do not copy the source voice, configuration, or cache into the website.

Expected: all declared page and curated-addon WAV files exist under their two output directories.

- [ ] **Step 5: Run media and catalogue tests**

Run: `node --test tests/addon-assets.test.mjs`

Expected: all tests PASS.

- [ ] **Step 6: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: only rendered WAV outputs, renderer changes, and prior planned work are listed.

---

### Task 6: Capture Every Safe Addon and Record the Manifest

**Files:**
- Create: `public/media/addons/screenshots/*.png`
- Create: `public/media/addons/capture-manifest.json`
- Modify: `src/data/addons.ts`
- Modify: `tests/addon-assets.test.mjs`

**Interfaces:**
- Consumes the 25-record `ADDONS` inventory from Task 1 and the authorized application checkout.
- Produces manifest records `{ id, status: 'captured' | 'unavailable' | 'unsafe', file?: string, note: string, width?: number, height?: number }`.
- Produces screenshot paths only for records with `status: 'captured'`.

- [ ] **Step 1: Write the failing manifest test**

```js
test('capture manifest accounts for every addon without private paths', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/media/addons/capture-manifest.json', import.meta.url), 'utf8'));
  assert.deepEqual(manifest.map(({ id }) => id).sort(), ADDONS.map(({ id }) => id).sort());
  for (const item of manifest) {
    assert.match(item.status, /^(captured|unavailable|unsafe)$/);
    assert.doesNotMatch(JSON.stringify(item), /[A-Z]:\\|Users\\|API[_ -]?KEY/i);
    if (item.status === 'captured') {
      const bytes = await readFile(new URL(`../public${item.file}`, import.meta.url));
      assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
      assert.ok(bytes.length > 80_000);
    }
  }
});
```

- [ ] **Step 2: Run and verify the missing manifest fails**

Run: `node --test --test-name-pattern="capture manifest" tests/addon-assets.test.mjs`

Expected: FAIL with `ENOENT` for `capture-manifest.json`.

- [ ] **Step 3: Launch and arrange Neural Companion safely**

Use the computer-control skill to run:

```powershell
& 'Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev\.venv\Scripts\python.exe' `
  'Q:\NC TEST NEW AFTER ARC\NeuralCompanion-dev\qt_app.py'
```

Do not use an updater or modify app files. Bring the main window and addon window onto the two visible displays, then use the app's existing docking behavior to place addon content in the main NC window.

- [ ] **Step 4: Capture the explicit inventory**

Visit these 25 tabs one at a time: AI Presence, Artifacts, Brain/Memory, Buddy Chat, Chat, Chat Player, Chunking, Companion Orb, Desktop Bridge, Discord Chat, Dry Run, Host, Hotkeys, Multi-Persona Story Mode, MuseTalk, Persona, Scenic, SpotiSense, Story Visuals, Themes, Tutorials, VAM, Vision, Visuals, and VSeeFace.

For each tab, wait for the visible interface to settle, inspect the frame for private information, and capture one full main-window PNG only when safe. Do not click start/connect/record/capture/login controls. If the tab requires such an action to show a meaningful interface, record `unsafe`; if it does not load, record `unavailable` with a factual note.

- [ ] **Step 5: Normalize safe web copies and write the manifest**

Crop only desktop chrome outside the Neural Companion main window, preserve the app interface, and use lossless PNG output with stable filenames matching addon ids. Write one manifest record for every id. Update `ADDONS` so captured records reference the matching screenshot and unavailable/unsafe records omit it.

- [ ] **Step 6: Close Neural Companion without saving settings**

Use the normal window close action. If prompted to save altered layout or configuration, decline unless the application normally persists window placement automatically and no functional setting changed.

- [ ] **Step 7: Run manifest and asset tests**

Run: `node --test tests/addon-assets.test.mjs`

Expected: complete inventory PASS; every captured PNG passes signature and size checks; no record leaks a local path.

- [ ] **Step 8: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: normalized web media and manifest are present; application checkout has no website-induced source edits.

---

### Task 7: Narratable Curated Gallery and Non-Generic Visual Pass

**Files:**
- Modify: `src/components/ProductShowcase.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/FeatureCard.astro`
- Modify: `src/components/IntegrationCard.astro`
- Modify: `src/styles/global.css`
- Modify: `src/scripts/site-presence.ts`
- Modify: `tests/presence-output.test.mjs`
- Modify: `tests/layout-output.test.mjs`

**Interfaces:**
- Consumes `CURATED_ADDONS`, captured screenshot status, and the global `nc:presence-request` controller contract.
- Produces addon hooks `[data-addon-card]`, `[data-addon-id]`, `[data-addon-transcript]`, `[data-addon-audio-src]`, `[data-addon-mood]`, and `[data-addon-listen]`.

- [ ] **Step 1: Write failing curated-gallery interaction tests**

```js
test('curated addon cards use official media and narration hooks', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /data-addon-card/);
  assert.match(html, /data-addon-transcript/);
  assert.match(html, /data-addon-audio-src="\/media\/voice\/addons\//);
  assert.match(html, /\/media\/addons\/icons\/companion-orb\.png/);
  assert.match(html, /\/media\/addons\/screenshots\//);
  assert.match(html, /data-addon-listen/);
  assert.doesNotMatch(html, /orb-section|orb-console__grid|orb-stage__grid/);
});
```

- [ ] **Step 2: Build and verify the test fails**

Run: `npm run build && npm test -- --test-name-pattern="curated addon cards"`

Expected: FAIL because the curated cards and narration hooks are absent.

- [ ] **Step 3: Rebuild the homepage showcase from curated addon data**

Each card includes the official icon, safe screenshot when captured, addon name, factual summary, exact visible narration transcript, and a `Listen` button for explicit replay. If a curated screenshot is unavailable, render the icon and text without a broken image. Keep the Companion Orb and MuseTalk future-video placeholders below the gallery.

- [ ] **Step 4: Add hover, focus, and tap narration wiring**

In `site-presence.ts`, delegate from `document` so swapped pages work. On `pointerenter` for fine pointers, start a 650 ms timer; cancel it on `pointerleave`. On `focusin`, use the same automatic once-per-session claim. On `[data-addon-listen]` click or coarse-pointer card activation, dispatch with `replay: true`. Every request updates the caption, and enabled audio interrupts the active clip before starting.

- [ ] **Step 5: Apply the restrained NC control-surface visual system**

Flatten the page background to one dark base plus at most one subtle header gradient. Remove decorative particle fields, broad radial glow clouds, unnecessary pill badges, and repeated oversized rounded cards. Standardize panels to 1 px borders and 2–6 px radii, use a single accent per control group, enlarge authentic screenshots, reduce ornamental title bars, and rewrite vague homepage sentences as factual capability descriptions. Preserve visible focus, readable contrast, responsive stacking, and all existing routes.

- [ ] **Step 6: Build and run focused tests**

Run: `npm run build && node --test tests/presence-output.test.mjs tests/layout-output.test.mjs tests/experience-output.test.mjs`

Expected: all selected tests PASS.

- [ ] **Step 7: Checkpoint without committing**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and no commit created.

---

### Task 8: Full Verification and Manual Acceptance

**Files:**
- Modify only files required to fix verification defects found in Tasks 1–7.
- Test: all `tests/*.test.mjs`

**Interfaces:**
- Consumes all previous task outputs.
- Produces a verified static build and a concise capture/behavior handoff.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Run Astro diagnostics**

Run: `npm run check`

Expected: 0 errors, 0 warnings, and 0 hints.

- [ ] **Step 3: Build and validate every generated route**

Run: `npm run build`

Expected: 18 routes generated and `Generated site validation passed.`

- [ ] **Step 4: Run repository hygiene checks**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only intended website/spec/plan/media changes are present; no NC application source, virtual environment, cache, secret, or local configuration is included.

- [ ] **Step 5: Manually validate interaction behavior**

In the existing local website session, clear only the site's `localStorage` and `sessionStorage`, then verify:

1. The splash appears with the official logo and focus stays inside it.
2. `Enter silently` closes it without audio and the header reports off.
3. The header enables voice and a new page speaks once.
4. Returning to that route in the same session stays silent.
5. A 650 ms addon hover speaks once; sweeping across cards does not.
6. Listen buttons replay and interrupt prior audio cleanly.
7. The orb follows without blocking links, then parks after 2.5 seconds.
8. Reduced motion and mobile/coarse-pointer modes keep the orb parked.
9. A forced rejected `audio.play()` leaves navigation usable and reports blocked playback.
10. Both consent choices persist across reloads while session narration resets only in a new session.

- [ ] **Step 6: Review captured media and manifest**

Open every captured PNG and confirm it is sharp, contains the intended addon interface, and includes no private information. Compare the manifest count to the 25-record catalogue. Verify homepage cards use only the strongest safe captures.

- [ ] **Step 7: Prepare the handoff without committing**

Report touched files, captured/unavailable/unsafe addon counts, test/build results, known browser autoplay limitations, and exact local preview URL. Do not commit or push until the user explicitly requests it.
