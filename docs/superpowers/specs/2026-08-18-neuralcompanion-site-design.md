# Neural Companion Website Design

## Goal

Build the official Neural Companion website as a fast, accessible, static Astro site deployed to GitHub Pages at `https://neuralcompanion.app`.

The site will explain the product accurately, help users install it, and make verified feature and integration information understandable to both search engines and answer systems. Its primary outbound destination is the public application repository at `https://github.com/Rakile/NeuralCompanion`.

## Constraints

- Use Astro with strict TypeScript, static generation, semantic HTML, and modern CSS.
- Keep client-side JavaScript minimal and add no UI framework, backend, database, CMS, Tailwind, or tracker.
- Treat the public Neural Companion repository and its documentation as the factual source of truth.
- Do not publish thin keyword pages or unverified product claims.
- Preserve production canonical URLs at `https://neuralcompanion.app`.
- Deploy pushes to `main` through GitHub Actions and GitHub Pages.
- Leave DNS changes and repository Pages settings to the owner.

## Recommended Architecture

Use a hybrid content model:

- Explicit Astro pages for the homepage, download, installation, and section indexes.
- Typed TypeScript catalogs for features and integrations.
- Static detail routes generated from those catalogs.
- Astro content collections for guides and changelog entries, where Markdown is a better authoring format.

This centralizes factual metadata and relationships without forcing long-form editorial content into TypeScript objects.

## Proposed Project Structure

```text
.github/
  workflows/
    deploy-pages.yml
public/
  images/
  favicon assets
src/
  components/
    Header.astro
    Footer.astro
    Hero.astro
    FeatureCard.astro
    IntegrationCard.astro
    CallToAction.astro
    SeoHead.astro
  content/
    guides/
    changelog/
  data/
    site.ts
    features.ts
    integrations.ts
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    download.astro
    install.astro
    features/
    integrations/
    guides/
    changelog/
    [feature-slug].astro
    robots.txt.ts
  styles/
    global.css
astro.config.mjs
package.json
tsconfig.json
```

Final filenames may be adjusted where Astro routing requires a clearer distinction between generated feature and integration routes, but public URLs and content ownership will remain as designed.

## Pages and Navigation

The first release will support:

- `/`
- `/download/`
- `/install/`
- `/features/`
- `/guides/`
- `/changelog/`
- `/local-ai-companion/`
- `/ai-companion-windows/`
- `/voice-ai-companion/`
- `/ai-avatar/`
- `/memory/`
- `/visual-replies/`
- `/integrations/ollama/`
- `/integrations/lm-studio/`
- `/integrations/musetalk/`
- `/integrations/vseeface/`
- `/integrations/vam/`

Each detail page must have a distinct user purpose and quickly answer what the capability is, how Neural Companion uses it, requirements, configuration direction, related features, and where to learn more.

Global navigation will prioritize Features, Integrations, Guides, Install, and GitHub. Download and GitHub calls to action will appear prominently without turning every link into a tracked URL.

## Reusable Components

- `BaseLayout` owns the document shell, landmarks, global styles, header, footer, and SEO integration.
- `SeoHead` owns canonical, description, Open Graph, X card, and sitemap-discovery metadata.
- `Header` and `Footer` own navigation and project links.
- `Hero` provides the homepage's first-screen product definition and primary calls to action.
- `FeatureCard` and `IntegrationCard` render catalog records consistently.
- `CallToAction` provides reusable download, documentation, release, and repository actions.

Components will remain presentational. Catalog lookup, route generation, and metadata derivation stay in page frontmatter or small data helpers.

## Content Model

Feature and integration records will include only fields needed by the site, such as:

```ts
interface FeatureRecord {
  name: string;
  slug: string;
  route: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  requirements: string[];
  relatedFeatures: string[];
  documentationUrl?: string;
  sourceUrl: string;
  enabled: boolean;
}
```

Integration records add category and configuration-oriented fields. Records are authoritative for cards, generated routes, metadata, internal relationships, and future Search Console query-to-page mapping.

Long-form guides and changelog entries use schema-validated Astro content collections. Empty or placeholder entries will not be published.

## Factual Source Policy

The public `Rakile/NeuralCompanion` README, install documentation, manual, changelog, addon documentation, and releases are the source of truth. Claims must be traceable to those sources. Experimental or incomplete features must retain their status in website copy.

The first release will not fabricate version numbers, ratings, reviews, download counts, pricing, hardware compatibility, testimonials, logos, or awards.

## SEO and Retrieval Architecture

`astro.config.mjs` will set:

- `site: "https://neuralcompanion.app"`
- no `base`, because production is served from the custom-domain root
- the official `@astrojs/sitemap` integration

Every indexable page supplies a unique title, description, canonical URL, Open Graph metadata, X metadata, semantic heading structure, and useful related links. Canonicals are derived from the production site URL plus the rendered pathname.

The sitemap integration generates `sitemap-index.xml` and numbered sitemap files. `src/pages/robots.txt.ts` derives its sitemap URL from Astro's configured `site`, preventing the domain from being duplicated in static configuration.

The homepage emits factual `SoftwareApplication` JSON-LD. Optional breadcrumb or article schemas are used only on pages where they accurately describe visible content. Structured data will not contain inferred ratings, pricing, version, or install counts.

Copy will begin with explicit, answerable descriptions instead of vague marketing language. Headings and summaries will use the same product vocabulary as the public documentation.

## Visual and Accessibility Direction

The design will be dark-theme friendly, technical, calm, and recognizably related to a local desktop AI project rather than a generic SaaS landing page.

It will use system fonts, a restrained color palette, strong type hierarchy, subtle CSS-only depth, visible focus states, sufficient contrast, semantic landmarks, keyboard-friendly navigation, responsive layouts, and reduced-motion handling. Existing project screenshots may be reused when suitable and accurately captioned. Any unavailable artwork will be omitted or clearly identified as a placeholder.

## Performance

The site is pre-rendered HTML with shared CSS and no framework runtime. JavaScript is added only for an interaction that cannot be expressed accessibly with HTML and CSS. Images will use appropriate dimensions and Astro image handling where practical. No autoplay media, third-party trackers, or remote font dependency is included initially.

## GitHub Pages Deployment

`.github/workflows/deploy-pages.yml` will run on pushes to `main` and manual dispatches. It will grant only `contents: read`, `pages: write`, and `id-token: write`; build with the current official Astro Pages action; and deploy with the current official GitHub Pages action. The deploy job depends on a successful build and uses the `github-pages` environment.

The repository is currently private, so Pages availability depends on the GitHub account's plan. Pages must be configured to use GitHub Actions as its source.

## Custom Domain

The production build targets `https://neuralcompanion.app` with no Astro base path. One artifact cannot simultaneously use root-relative production paths and behave as a repository-subpath build at `https://rakile.github.io/neuralcompanion-site/`; local preview and the custom-domain deployment are the supported validation targets.

Because deployment uses a custom GitHub Actions workflow, GitHub's current documentation says a repository `CNAME` file is ignored and unnecessary. The owner will set `neuralcompanion.app` in repository Pages settings, configure the apex DNS records GitHub specifies, and point `www.neuralcompanion.app` by CNAME to `rakile.github.io`. GitHub can then redirect `www` to the configured apex domain. HTTPS will be enabled after DNS validation.

No registrar or DNS changes are part of implementation.

## Future Search Console Automation

No Search Console integration is included initially. A later read-only reporting workflow can:

1. retrieve query and page performance data through the Search Console API;
2. map URLs to the stable feature, integration, and content records;
3. identify high-impression queries, positions approximately 8–30, and weak click-through rates;
4. produce a reviewable opportunity report.

It will propose improvements and will not automatically publish generated pages.

## Error Handling and Quality Controls

Astro schema validation and strict TypeScript will reject malformed content during builds. Missing catalog relationships or required SEO fields will be checked before release. External links remain explicit constants so repository or documentation destinations can be audited.

The site will fail its deployment when installation or build fails. No partial artifact will be deployed.

## Verification

Before completion, run and inspect:

- `npm install`
- `npm run build`
- any configured checks
- generated homepage and route output
- `sitemap-index.xml`, sitemap entries, and `robots.txt`
- canonical, Open Graph, X, and JSON-LD output
- representative internal links
- workflow YAML
- secret and credential scan of the change set
- `git status`
- `git diff --stat`

The final handoff will list changed files, risks, validation results, and the owner's required GitHub Pages and DNS steps.

## Implementation Phases

### Phase 1: Foundation and representative slice

1. Initialize minimal Astro with strict TypeScript in the repository root.
2. Add shared layout, navigation, footer, design tokens, responsive styling, and SEO support.
3. Add verified site, feature, and integration data records.
4. Build the homepage, download, install, feature index, and integration index.
5. Build one representative generated feature page and one representative integration page.
6. Add sitemap, dynamic robots output, structured data, and GitHub Pages workflow.
7. Validate the production build and generated metadata.

### Phase 2: Complete useful initial content

1. Add the remaining approved feature and integration routes from verified documentation.
2. Add useful guides and the changelog landing experience.
3. Add and optimize approved screenshots or product assets.
4. Audit content accuracy, accessibility, responsive behavior, and internal links.

### Phase 3: Production launch

1. Review the complete diff before committing.
2. Commit and push only after owner approval.
3. Enable GitHub Actions as the Pages source and configure the custom domain.
4. Apply DNS records manually, enable HTTPS, and verify the live site.
