# Production deployment

Neural Companion is a static Astro site. The deployment target must serve the generated `dist/` directory and preserve trailing-slash routes.

## Required build

```powershell
npm ci
npm test
npm run check
npm run build
```

Use Node.js 24 or newer. The build command also runs the generated-site validator, which checks required routes, canonical URLs, internal links, SoftwareApplication data, robots, and sitemap output.

## Environment

Analytics is optional. To enable the consent-first GA4 integration, set this build-time variable in the production host:

```text
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Do not place API keys, voice references, Google verification secrets, local paths, or NC runtime settings in public environment variables.

## Release checks

1. Confirm the custom domain resolves to the selected static host and HTTPS is active.
2. Deploy `dist/` without rewriting canonical paths to another hostname.
3. Open the homepage, `/addons/`, one addon with a screenshot, one headless addon, `/install/`, `/robots.txt`, and `/sitemap-index.xml` on the production domain.
4. Verify one audio clip on desktop and mobile. It must not begin until play is pressed.
5. If GA4 is configured, verify decline makes no Google request; then use a clean browser session to allow analytics and validate `page_view`, `addon_open`, and `addon_audio_play` in DebugView.
6. Complete the Search Console steps in `docs/search-console.md`.

No hosting provider is hard-coded because the repository does not currently declare a production hosting platform. Add provider-specific configuration only after the owner selects the host and confirms DNS access.
