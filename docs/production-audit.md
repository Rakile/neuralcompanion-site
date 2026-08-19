# Neural Companion website production audit

Generated: 2026-08-19

## Verified inventory

| Item | Count |
| --- | ---: |
| Neural Companion addon manifests represented | 44 |
| Generated addon detail pages | 44 |
| Official addon icons available | 20 |
| Real optimized addon screenshots published | 16 |
| Addons using a documented shared interface | 16 |
| Headless addons with no standalone UI | 12 |
| Editable TTS scripts | 44 |
| Optimized MP3 commentary files | 44 |
| Canonical URLs in the generated sitemap | 63 |

All addon names, manifest IDs, versions, categories, summaries, requirements, and relationships are maintained in `src/data/addons.ts`. `public/images/addons/capture-manifest.json` records why each addon has a dedicated screenshot, a shared interface, or no standalone interface.

## Media and privacy

The site uses real Neural Companion application captures. Corsair device identifiers, Main Chat Remote pairing information, and LAN details were redacted before publication. No voice-reference file, API key, local account path, pairing code, or LAN address is shipped.

The 44 generated voice clips use the configured Neural Companion Chatterbox voice with permission. Editable text remains separate in `src/content/addon-voice/`. Delivery files are 112 kbps MP3 and total approximately 21 MB. Playback begins only after a visitor presses play; `preload="metadata"` asks the browser to fetch only enough data for duration when it honors that hint.

## Technical production state

- Static Astro output with canonical `https://neuralcompanion.app` URLs.
- Sitemap and robots directives generated for the production origin.
- Local favicon and 1200 × 630 Open Graph image.
- SoftwareApplication, Offer, WebPage, and breadcrumb structured data where appropriate.
- Lightweight addon search and category filtering without a SPA framework.
- Consent-first conditional GA4 loader driven by `PUBLIC_GA_MEASUREMENT_ID`.
- Meaningful event allowlist for downloads, GitHub, addon discovery, audio, screenshots, install guides, and documentation.
- Pointer-following visual orb that respects coarse pointers and reduced motion; it never autoplays sound.
- Keyboard-visible focus, semantic landmarks, transcripts, explicit audio controls, lazy screenshots, and no horizontal overflow at tested desktop/mobile widths.

## Known limitations and manual work

1. Sixteen configurable addons live inside shared Host, provider, sensory, or addon-management panels. They intentionally do not show fabricated standalone screenshots. The capture manifest gives the exact clean-profile capture needed for each future dedicated image.
2. Twelve runtime addons are headless and have no meaningful standalone panel to capture.
3. Companion Orb and MuseTalk videos are not included because final recordings have not been supplied. Add them as compressed WebM/MP4 with captions, poster images, and a text transcript when available.
4. Set a real GA4 measurement ID in the production build environment; none is invented here.
5. Domain verification, sitemap submission, indexing requests, and report monitoring require the site owner's Google Search Console access. Follow `docs/search-console.md`.
6. Deployment, DNS changes, commit, and push remain separate release actions.

## Additional recommendations

1. **Automate clean-profile screenshots next.** Add a deterministic NC test profile and capture checklist so release screenshots never contain live paths, devices, accounts, or pairing state.
2. **Use Search Console before expanding topic clusters.** Prioritize pages already earning impressions—for example Ollama, local Windows AI, MuseTalk, memory, or Corsair RGB—rather than publishing speculative keyword pages.
3. **Create an install troubleshooter.** A concise CUDA/Python/provider decision tree can improve both successful installs and search intent coverage without duplicating the manual.
4. **Add release data from one source of truth.** When the app exposes a reliable current version/release feed, add changelog RSS and version-aware schema without hard-coding claims.
5. **Prepare video delivery deliberately.** Capture 1080p interface demos, remove private data, provide captions/transcripts, and avoid autoplay. Use poster frames already present in the screenshot gallery.
