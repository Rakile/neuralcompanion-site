# Neural Companion Console Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an NC-themed Astro website with authentic application screenshots, an accessible pointer-following web orb, and prerecorded configured-voice demonstrations.

**Architecture:** Keep the site fully static. New Astro components own the product gallery and orb presentation, a focused browser module owns pointer/audio behavior, and a typed data module owns the published response metadata. Neural Companion remains unmodified and is used only to create media assets.

**Tech Stack:** Astro 7, TypeScript, semantic HTML, CSS, browser Audio API, Node test runner, PySide6 desktop capture, configured Neural Companion Chatterbox TTS.

**Spec:** `docs/superpowers/specs/2026-08-18-nc-console-redesign.md`

## Global Constraints

- Do not modify Neural Companion source, settings, source voice files, or runtime behavior.
- Do not expose local paths, secrets, private conversations, or the source voice sample.
- Do not autoplay audio; provide visible Speak and Mute controls and transcripts.
- Respect reduced motion, keyboard input, mobile layouts, and existing routes/SEO.
- Do not add third-party frontend dependencies.
- Do not commit or push without a new explicit user request.

---

### Task 1: Capture authentic product media

**Files:**
- Create: `scripts/render-orb-voice.py`
- Create: `public/media/screenshots/nc-host.png`
- Create: `public/media/screenshots/nc-memory.png`
- Create: `public/media/screenshots/nc-addons.png`
- Create: `public/media/screenshots/nc-visual-reply.png`
- Create: `public/media/screenshots/nc-companion-orb.png`
- Create: `public/media/screenshots/nc-musetalk.png`
- Create: `public/media/voice/orb-button.wav`
- Create: `public/media/voice/orb-memory.wav`
- Create: `public/media/voice/orb-setup.wav`
- Create: `public/media/voice/orb-cursor.wav`

**Interfaces:**
- Produces: six normalized PNG assets and four browser-playable WAV assets referenced by later tasks.

- [ ] Launch `.venv\Scripts\python.exe qt_app.py` from the Neural Companion repository.
- [ ] Confirm the visible window contains no secrets or private chat text.
- [ ] Capture the six approved application views at a consistent window size.
- [ ] Render the four approved lines with the configured Chatterbox backend and authorized voice.
- [ ] Copy only the generated audio results into `public/media/voice/` and validate each WAV header and duration.

### Task 2: Define media metadata and failing output tests

**Files:**
- Create: `src/data/showcase.ts`
- Create: `tests/experience-output.test.mjs`

**Interfaces:**
- Produces: `SHOWCASE_SHOTS`, `ORB_RESPONSES`, `ShowcaseShot`, and `OrbResponse`.

- [ ] Add typed metadata with paths, concise alt text, labels, captions, transcripts, and mood names.
- [ ] Add a failing build-output test that requires the product showcase, orb stage, four transcript buttons, mute control, future-video placeholders, and all local media paths.
- [ ] Run `npm run build && node --test tests/experience-output.test.mjs` and confirm the new assertions fail because the components do not exist yet.

### Task 3: Build the accessible web orb

**Files:**
- Create: `src/components/CompanionOrb.astro`
- Create: `src/scripts/companion-orb.ts`

**Interfaces:**
- Consumes: `ORB_RESPONSES` from `src/data/showcase.ts`.
- Produces: `[data-companion-orb]` with pointer tracking, response selection, playback state, transcript announcements, and mute control.

- [ ] Render the orb as layered semantic decoration beside a real control panel with buttons and a live transcript region.
- [ ] Implement bounded pointer targets and eased `requestAnimationFrame` movement.
- [ ] Stop movement when reduced motion is requested and reset cleanly on pointer leave.
- [ ] Start audio only from explicit button activation; stop prior clips before playing another.
- [ ] Keep visual speaking/muted states synchronized with `play`, `ended`, `error`, and mute actions.

### Task 4: Build the NC product showcase

**Files:**
- Create: `src/components/ProductShowcase.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SHOWCASE_SHOTS` and the PNG media files.
- Produces: a screenshot-led hero, six-card application gallery, and two future-video placeholders.

- [ ] Replace the abstract hero-only visual with a framed real NC screenshot and compact status chrome.
- [ ] Add the orb experience immediately after the hero.
- [ ] Add a semantic screenshot gallery with intrinsic dimensions, lazy loading below the fold, captions, and alt text.
- [ ] Add labeled Companion Orb and MuseTalk video placeholders without empty video elements or fake playback controls.

### Task 5: Apply the NC console visual system

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: shared console colors, bordered panels, tab accents, status treatments, responsive layout, and focus/motion safeguards across every route.

- [ ] Add app-derived navy, cyan, violet, green, amber, and red tokens while preserving accessible text contrast.
- [ ] Restyle the header as a compact application bar with tab-like navigation and a responsive overflow treatment.
- [ ] Restyle cards and page sections as calm console panels with consistent borders and corner radii.
- [ ] Add orb animation styles and explicitly disable nonessential motion under `prefers-reduced-motion: reduce`.
- [ ] Keep all content usable at 360px, 768px, and desktop widths.

### Task 6: Verify the finished experience

**Files:**
- Modify: `tests/experience-output.test.mjs` only if an assertion needs to reflect the final semantic structure.

**Interfaces:**
- Consumes: the complete static site.
- Produces: passing automated and visual verification evidence.

- [ ] Run `npm test` and require all tests to pass.
- [ ] Run `npm run check` and require zero Astro or TypeScript errors.
- [ ] Run `npm run build` and require successful static validation.
- [ ] Reload the local homepage and inspect desktop and narrow layouts.
- [ ] Activate each voice response, mute control, keyboard focus path, and reduced-motion behavior.
- [ ] Confirm the browser console contains no errors and every media request succeeds.
