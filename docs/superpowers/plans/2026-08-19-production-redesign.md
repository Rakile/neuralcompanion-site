# Neural Companion Production Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current Astro site into a production-ready Neural Companion website that represents all 44 application addons, uses authentic application media and voice, and includes a complete SEO and privacy-conscious analytics foundation.

**Architecture:** Keep Astro static output and use a versioned addon registry plus editorial overlay as the single website source of truth. Generate the addon index and useful detail routes from that model, keep interactions client-light, render audio through Neural Companion's configured Chatterbox service, and conditionally load GA4 only when a measurement ID and analytics consent are present.

**Tech Stack:** Astro 7, TypeScript, static HTML/CSS, small framework-free browser modules, Node test runner, Neural Companion Chatterbox TTS, WebP media.

**Spec:** `C:/Users/lainol/.codex/attachments/27471354-87ca-41b0-99de-c5d4d29d82da/pasted-text.txt`

## Global Constraints

- Treat `Q:/NC TEST NEW AFTER ARC/NeuralCompanion-dev` as the factual source for addon names, descriptions, icons, UI and capabilities.
- Represent all 44 discovered addons; do not invent behavior.
- Use real application screenshots where a useful UI exists; document safe exceptions.
- Never autoplay website audio.
- Keep voice scripts editable and render with the configured, user-authorized NC companion voice.
- Preserve the Astro static architecture and current factual routes.
- Load GA4 only when `PUBLIC_GA_MEASUREMENT_ID` exists and the visitor permits analytics.
- Do not commit or push without an explicit request.

---

### Task 1: Production contracts and addon registry

**Files:**
- Create: `tests/production-redesign.test.mjs`
- Create: `src/data/addon-registry.ts`
- Create: `src/data/addon-editorial.ts`
- Create: `src/data/addons.ts`
- Create: `scripts/export-nc-addons.mjs`
- Create: `scripts/validate-production.mjs`

**Interfaces:**
- Produces `ADDONS`, `ADDON_CATEGORIES`, `getAddonBySlug()` and registry validation consumed by all addon routes and components.

- [ ] Write a failing test requiring all 44 manifest IDs, exact Corsair metadata, unique slugs, valid categories, related links, icons, voice scripts and route eligibility.
- [ ] Run the test and confirm it fails because the registry is incomplete.
- [ ] Implement the exported manifest registry and editorial overlay.
- [ ] Run the test and full suite.

### Task 2: Addon routes and discovery

**Files:**
- Create: `src/pages/addons/index.astro`
- Create: `src/pages/addons/[addonSlug].astro`
- Create: `src/components/AddonExplorer.astro`
- Create: `src/components/AddonDetail.astro`
- Create: `src/scripts/addon-explorer.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes the unified addon model.
- Produces crawlable `/addons/` and `/addons/<slug>/` routes with client-light filtering.

- [ ] Write failing route/build tests for the addon index, all eligible detail pages, filters, navigation and non-orphan internal links.
- [ ] Verify the expected failure.
- [ ] Implement static routes and accessible filtering.
- [ ] Run focused and full tests.

### Task 3: NC-derived visual system and homepage

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/ProductShowcase.astro`
- Create: `src/components/PersonalitySpectrum.astro`
- Create: `src/components/AddonEcosystem.astro`
- Create: `src/components/ProductGallery.astro`

**Interfaces:**
- Produces responsive NC-themed layout primitives and a coherent homepage story.

- [ ] Write failing output tests for the personality explanation, addon ecosystem, real screenshot gallery, absence of fake runtime metrics and a functional mobile menu.
- [ ] Verify the expected failure.
- [ ] Implement the components and NC-derived visual tokens.
- [ ] Run focused and full tests.

### Task 4: Real media pipeline

**Files:**
- Create: `public/images/addons/<slug>/*.webp`
- Create: `public/images/product/*.webp`
- Create: `src/data/media-manifest.ts`
- Create: `scripts/optimize-media.mjs`
- Modify: `tests/production-redesign.test.mjs`

**Interfaces:**
- Produces predictable media records with dimensions, privacy status and capture provenance.

- [ ] Write failing completeness tests for all declared screenshots and dimensions.
- [ ] Verify the expected failure.
- [ ] Capture or reuse only authentic NC UI, redact private data, and generate optimized WebP derivatives.
- [ ] Run media validation and the full suite.

### Task 5: Voice scripts and accessible player

**Files:**
- Create: `src/content/addon-voice/*.txt`
- Create: `public/audio/addons/*.{mp3,wav}`
- Create: `src/components/AddonVoicePlayer.astro`
- Create: `src/scripts/addon-audio.ts`
- Modify: `scripts/render-orb-voice.py`
- Remove: page and hover autoplay behavior from `src/scripts/site-presence.ts`

**Interfaces:**
- Produces one editable first-person transcript and deliberate audio control per addon.

- [ ] Write failing tests for 44 unique scripts, target speech length, no autoplay, one active player and accessible labels/durations.
- [ ] Verify the expected failure.
- [ ] Write technically accurate scripts, render through NC Chatterbox, and implement the minimal player.
- [ ] Run focused and full tests.

### Task 6: SEO, Search Console and analytics

**Files:**
- Modify: `src/components/SeoHead.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `src/components/Breadcrumbs.astro`
- Create: `src/components/AnalyticsConsent.astro`
- Create: `src/scripts/analytics.ts`
- Create: `docs/search-console.md`
- Create: `docs/analytics.md`
- Create: `public/favicon.png`
- Create: `public/images/social/default.webp`

**Interfaces:**
- Produces canonical addon metadata, breadcrumbs, JSON-LD, optional GA4 and a typed event contract.

- [ ] Write failing tests for metadata, schema, favicon, local social images, sitemap coverage, conditional GA4 and event allowlisting.
- [ ] Verify the expected failure.
- [ ] Implement metadata, documentation, analytics consent and meaningful event tracking.
- [ ] Run focused and full tests.

### Task 7: Production verification

**Files:**
- Modify: `scripts/validate-build.mjs`
- Modify: `README.md`

- [ ] Extend the validator to report addon, icon, screenshot, script, audio and sitemap totals.
- [ ] Run `npm test`, `npm run check` and `npm run build` from a clean command invocation.
- [ ] Inspect desktop and 390 px mobile output, keyboard navigation, console messages and audio controls in the in-app browser.
- [ ] Review `git diff --check`, status and production limitations.
- [ ] Prepare the deployment/Search Console/GA4 handoff without committing or pushing.
