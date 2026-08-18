# Neural Companion Website Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the first production-ready slice of the official Neural Companion Astro website, including shared UI, verified content, core routes, SEO output, and GitHub Pages deployment.

**Architecture:** Astro statically generates explicit landing pages and catalog-driven detail routes. Typed feature and integration records drive cards, metadata, routes, and related links. Shared layout components own document metadata and JSON-LD, while Node-based checks validate catalogs and generated output.

**Tech Stack:** Astro 7.2.3, TypeScript 6.0.3, `@astrojs/sitemap` 3.7.3, `@astrojs/check` 0.9.10, Node.js 24, npm, CSS, Node's built-in test runner, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-18-neuralcompanion-site-design.md`

## Global Constraints

- Use strict TypeScript, static generation, semantic HTML, modern CSS, and minimal JavaScript.
- Set `site` to exactly `https://neuralcompanion.app` and do not configure an Astro `base` path.
- Treat `https://github.com/Rakile/NeuralCompanion` and its documentation as the factual source of truth.
- Add no React, Vue, database, backend, CMS, Tailwind, tracker, or remote font.
- Publish no fabricated ratings, reviews, counts, pricing, versions, awards, testimonials, or compatibility claims.
- Preserve experimental or incomplete labels found in source documentation.
- Do not change DNS or registrar settings.
- Do not commit or push until the owner reviews the planned Git changes and explicitly approves those operations.

## File Map

- `package.json`, `package-lock.json`: dependencies and validation scripts.
- `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`: Astro and TypeScript configuration.
- `src/data/site.ts`: identity, verified destinations, and navigation.
- `src/data/features.ts`, `src/data/integrations.ts`: typed factual catalogs.
- `src/lib/seo.ts`: canonical URL and safe JSON-LD helpers.
- `src/components/*.astro`: metadata, navigation, hero, cards, and calls to action.
- `src/layouts/BaseLayout.astro`: semantic document shell.
- `src/styles/global.css`: tokens, layout, responsiveness, focus, and reduced motion.
- `src/pages/`: explicit pages, generated detail routes, and robots output.
- `tests/*.test.mjs`: configuration, catalog, and helper contracts.
- `scripts/validate-build.mjs`: generated-output assertions.
- `.github/workflows/deploy-pages.yml`: Pages build and deployment.

---

### Task 1: Initialize a Reproducible Astro Build

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `tests/foundation.test.mjs`

**Interfaces:**
- Consumes: Node.js 24 and npm.
- Produces: `npm run dev`, `npm run check`, `npm test`, `npm run build`, and static `dist/`.

- [ ] **Step 1: Write the failing configuration test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('production origin and sitemap are fixed in Astro config', async () => {
  const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  assert.match(config, /site:\\s*['"]https:\\/\\/neuralcompanion\\.app['"]/);
  assert.match(config, /integrations:\\s*\\[sitemap\\(\\)\\]/);
  assert.doesNotMatch(config, /\\bbase\\s*:/);
});
```

- [ ] **Step 2: Run `node --test tests/foundation.test.mjs`**

Expected: FAIL because `astro.config.mjs` is absent.

- [ ] **Step 3: Create package and Astro configuration**

```json
{
  "name": "neuralcompanion-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24.0.0" },
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "test": "node --test tests/*.test.mjs",
    "build": "astro build && node scripts/validate-build.mjs",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.7.3",
    "astro": "^7.2.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "typescript": "^6.0.3"
  }
}
```

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://neuralcompanion.app',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

Create `tsconfig.json` extending `astro/tsconfigs/strict` with `noUncheckedIndexedAccess: true`. Add the Astro client reference. Ignore `node_modules/`, `dist/`, `.astro/`, logs, and local environment files.

- [ ] **Step 4: Create the smallest semantic homepage with one Neural Companion `h1`**

Task 4 replaces this page after the build foundation passes.

- [ ] **Step 5: Run `npm install`, then `npm test && npm run check && npx astro build`**

Expected: exit 0, a lockfile, static homepage, and sitemap output.

- [ ] **Step 6: Prepare the reviewed commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src tests/foundation.test.mjs
git commit -m "chore: initialize Astro website"
```

Do not execute the commit without owner approval.

### Task 2: Add Verified Typed Content Catalogs

**Files:**
- Create: `src/data/site.ts`
- Create: `src/data/features.ts`
- Create: `src/data/integrations.ts`
- Create: `tests/catalogs.test.mjs`

**Interfaces:**
- Produces: `SITE`, `NAV_ITEMS`, `FEATURES`, `INTEGRATIONS`, `FeatureKey`, `FeatureRecord`, and `IntegrationRecord`.

- [ ] **Step 1: Write failing catalog tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { FEATURES } from '../src/data/features.ts';
import { INTEGRATIONS } from '../src/data/integrations.ts';
import { SITE } from '../src/data/site.ts';

test('site constants use verified destinations', () => {
  assert.equal(SITE.origin, 'https://neuralcompanion.app');
  assert.equal(SITE.repository, 'https://github.com/Rakile/NeuralCompanion');
});

test('catalog routes and SEO fields are complete', () => {
  const records = [...FEATURES, ...INTEGRATIONS];
  assert.equal(new Set(records.map(({ route }) => route)).size, records.length);
  for (const record of records) {
    assert.ok(record.summary.length >= 60);
    assert.ok(record.seoDescription.length >= 80);
    assert.equal(record.sourceUrl.startsWith(SITE.repository), true);
  }
});
```

- [ ] **Step 2: Run `node --test tests/catalogs.test.mjs`**

Expected: FAIL because the modules are absent.

- [ ] **Step 3: Create site constants**

```ts
export const SITE = {
  name: 'Neural Companion',
  origin: 'https://neuralcompanion.app',
  repository: 'https://github.com/Rakile/NeuralCompanion',
  releases: 'https://github.com/Rakile/NeuralCompanion/releases',
  installGuide: 'https://github.com/Rakile/NeuralCompanion/blob/main/docs/install.md',
  description: 'A configurable desktop AI companion for real-time chat, speech, memory, avatars, visual replies, and addon-driven workflows.',
} as const;
```

Add `NAV_ITEMS` for Features, Integrations, Guides, and Install.

- [ ] **Step 4: Create six complete `FeatureRecord` entries**

Required routes:

```text
/local-ai-companion/
/ai-companion-windows/
/voice-ai-companion/
/ai-avatar/
/memory/
/visual-replies/
```

Each record contains key, name, slug, route, summary, SEO fields, requirements, related feature keys, documentation URL, source URL, and enabled state. Every claim is paraphrased from its linked README or manual page.

- [ ] **Step 5: Create five complete `IntegrationRecord` entries**

Required routes:

```text
/integrations/ollama/
/integrations/lm-studio/
/integrations/musetalk/
/integrations/vseeface/
/integrations/vam/
```

Each record adds category and ordered configuration guidance. The MuseTalk record alone states its NVIDIA CUDA requirement; other external-tool requirements remain explicit where documented.

- [ ] **Step 6: Extend tests to assert exact approved route sets and valid related feature keys**

- [ ] **Step 7: Run `npm test`**

Expected: all tests pass.

- [ ] **Step 8: Prepare the reviewed commit**

```bash
git add src/data tests/catalogs.test.mjs
git commit -m "feat: add verified product catalogs"
```

### Task 3: Build SEO Helpers and Shared Layout

**Files:**
- Create: `src/lib/seo.ts`
- Create: `tests/seo.test.mjs`
- Create: `src/components/SeoHead.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/CallToAction.astro`
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: `canonicalUrl(pathname: string): string`, `safeJsonLd(value: unknown): string`, and shared layout props.

- [ ] **Step 1: Write failing helper tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalUrl, safeJsonLd } from '../src/lib/seo.ts';

test('canonical URLs use production', () => {
  assert.equal(canonicalUrl('/install'), 'https://neuralcompanion.app/install/');
});

test('JSON-LD cannot emit a closing script tag', () => {
  const value = safeJsonLd({ text: '</script>' });
  assert.equal(value.includes('</script>'), false);
  assert.equal(JSON.parse(value).text, '</script>');
});
```

- [ ] **Step 2: Run the test and require the missing-module failure**

- [ ] **Step 3: Implement the helpers**

```ts
import { SITE } from '../data/site.ts';

export function canonicalUrl(pathname: string): string {
  const normalized = pathname === '/' ? '/' : `/${pathname.replace(/^\\/+|\\/+$/g, '')}/`;
  return new URL(normalized, SITE.origin).href;
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
```

- [ ] **Step 4: Implement `SeoHead.astro`**

Accept title, description, pathname, optional image, and optional JSON-LD. Emit one title, description, canonical, sitemap link, Open Graph title/description/URL, X title/description/card, optional absolute social image, and safe JSON-LD.

- [ ] **Step 5: Implement semantic shared shell**

`BaseLayout.astro` renders language, viewport and theme metadata, skip link, Header, `main#main-content`, and Footer. Header uses native links and no client script. Footer links to the verified repository and license.

- [ ] **Step 6: Run `npm test && npm run check`**

Expected: tests pass and Astro reports zero errors.

- [ ] **Step 7: Prepare the reviewed commit**

```bash
git add src/lib src/components src/layouts tests/seo.test.mjs
git commit -m "feat: add shared SEO and page layout"
```

### Task 4: Build the Visual System, Homepage, and Indexes

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/Hero.astro`
- Create: `src/components/FeatureCard.astro`
- Create: `src/components/IntegrationCard.astro`
- Replace: `src/pages/index.astro`
- Create: `src/pages/features/index.astro`
- Create: `src/pages/integrations/index.astro`

**Interfaces:**
- Produces: recognizable homepage plus complete catalog indexes.

- [ ] **Step 1: Add a failing test requiring `:focus-visible` and `prefers-reduced-motion: reduce` in global CSS**

- [ ] **Step 2: Run the test and require the missing-stylesheet failure**

- [ ] **Step 3: Implement the CSS system**

Define dark tokens, system fonts, a 72rem container, responsive grids, cards, buttons, header/footer, skip-link behavior, visible focus, mobile navigation wrapping, and reduced-motion handling. Use CSS gradients and borders rather than decorative assets.

- [ ] **Step 4: Implement product components**

Hero defines Neural Companion in the first screen as a Windows desktop AI companion for real-time chat, speech, memory, avatars, visual replies, and addon workflows. Add Download and GitHub actions. Cards accept exact record types and render name, summary, and route.

- [ ] **Step 5: Replace the homepage**

Use shared layout, Hero, three features, and three integrations. Emit factual `SoftwareApplication` JSON-LD containing name, description, Windows, category, URL, download URL, and code repository. Omit version, offers, ratings, reviews, and counts.

- [ ] **Step 6: Add `/features/` and `/integrations/`**

Each route has unique metadata, one `h1`, explicit introductory copy, and every enabled record.

- [ ] **Step 7: Run `npm test && npm run check && npx astro build`**

- [ ] **Step 8: Prepare the reviewed commit**

```bash
git add src/styles src/components src/pages/index.astro src/pages/features src/pages/integrations
git commit -m "feat: build homepage and catalog indexes"
```

### Task 5: Add Install, Download, Guide, Changelog, and Detail Routes

**Files:**
- Create: `src/pages/download.astro`
- Create: `src/pages/install.astro`
- Create: `src/pages/guides/index.astro`
- Create: `src/pages/changelog/index.astro`
- Create: `src/pages/[featureSlug].astro`
- Create: `src/pages/integrations/[integrationSlug].astro`

**Interfaces:**
- Produces: every phase-one route in the specification.

- [ ] **Step 1: Run exact-route catalog tests and require failure until all records match**

- [ ] **Step 2: Implement download and installation pages**

Download distinguishes app source from website source and links to releases, repository, and install docs. Install states Windows, Python 3.11, FFmpeg, and provider requirements; recommends `INSTALL_NEURAL_COMPANION.bat`; names `run_neural_companion.bat`; and limits NVIDIA CUDA to MuseTalk.

- [ ] **Step 3: Implement guide and changelog gateways**

Guides links to the manual, install, troubleshooting, avatar, and addon docs with explanations. Changelog links to authoritative history and releases without copying a version number.

- [ ] **Step 4: Generate feature pages**

`getStaticPaths` maps enabled feature records to `featureSlug` params and record props. Render name, summary, requirements, source documentation, and related feature cards using record metadata.

- [ ] **Step 5: Generate integration pages**

`getStaticPaths` maps enabled integration records to `integrationSlug`. Render category, summary, requirements, configuration steps, related features, documentation, and download/repository actions.

- [ ] **Step 6: Run `npm test && npm run check && npx astro build`**

Expected: every approved route has generated `index.html`.

- [ ] **Step 7: Prepare the reviewed commit**

```bash
git add src/pages tests/catalogs.test.mjs
git commit -m "feat: add installation and product detail routes"
```

### Task 6: Add Robots, Build Assertions, and Pages Deployment

**Files:**
- Create: `src/pages/robots.txt.ts`
- Create: `scripts/validate-build.mjs`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `tests/foundation.test.mjs`

**Interfaces:**
- Produces: crawler policy, enforceable static-output quality, and deployment from `main`.

- [ ] **Step 1: Add failing tests for robots deriving from `Astro.site` and the workflow containing `npm ci`, `npm test`, `npm run check`, `withastro/action@v6`, and `actions/deploy-pages@v5`**

- [ ] **Step 2: Run `npm test` and require missing-file failures**

- [ ] **Step 3: Implement robots**

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site URL is required to generate robots.txt');
  const sitemap = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\\nAllow: /\\n\\nSitemap: ${sitemap.href}\\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
```

- [ ] **Step 4: Implement `scripts/validate-build.mjs` using Node built-ins**

Assert every approved route and crawler file exists; every HTML page has exactly one production canonical; homepage JSON-LD is `SoftwareApplication` without fabricated commercial/social properties; robots references the sitemap index; and every root-relative internal link resolves. Print filename and condition for each failure and exit nonzero.

- [ ] **Step 5: Add the Pages workflow**

Trigger on `main` pushes and manual dispatch. Grant only contents-read, pages-write, and ID-token-write. Build with checkout v7, setup-node v7 on Node 24, `npm ci`, tests, Astro check, and `withastro/action@v6`. Deploy in a dependent `github-pages` job using `actions/deploy-pages@v5`.

- [ ] **Step 6: Run the complete gate**

```bash
npm test
npm run check
npm run build
git diff --check
git grep -n -I -E '(API_KEY|SECRET|TOKEN|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY)' -- . ':!package-lock.json'
```

Expected: checks pass and no credentials are present.

- [ ] **Step 7: Prepare the reviewed commit**

```bash
git add src/pages/robots.txt.ts scripts .github tests/foundation.test.mjs
git commit -m "ci: validate and deploy website to Pages"
```

### Task 7: Phase-One Review and Owner Handoff

**Files:**
- Review: all files above.

**Interfaces:**
- Produces: a verified, unpushed change set and exact owner-controlled launch steps.

- [ ] **Step 1: Reinstall from the lockfile and verify**

```bash
npm ci
npm test
npm run check
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Inspect representative output**

Inspect homepage, install, one feature, one integration, robots, and sitemap. Confirm visible headings, requirements, source links, titles, descriptions, canonicals, social metadata, and JSON-LD match their records.

- [ ] **Step 3: Show planned Git changes before committing**

```bash
git status --short
git diff --stat
git diff -- . ':!package-lock.json'
```

Summarize file groups, factual-source choices, risks, and verification evidence. Ask for explicit commit approval. Do not push.

- [ ] **Step 4: Commit only after explicit owner approval**

If task commits were deferred, group reviewed files with the messages above. Leave the branch unpushed.

- [ ] **Step 5: Provide launch actions**

Tell the owner to push `main`, select GitHub Actions in Pages settings, confirm private-repository eligibility, set `neuralcompanion.app`, add GitHub's current apex A records, point `www` to `rakile.github.io` by CNAME, verify DNS, and enable HTTPS.
