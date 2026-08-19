import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('production head uses local brand assets and complete application schema', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /<link rel="icon" href="\/favicon\.png"/);
  assert.match(html, /property="og:image" content="https:\/\/neuralcompanion\.app\/images\/social\/neural-companion-og\.webp"/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"operatingSystem":"Windows"/);
  assert.match(html, /"price":"0"/);
  assert.match(html, /"priceCurrency":"USD"/);
});

test('GA4 remains dormant without configuration and exposes a consent-first event model', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const analyticsSource = await readFile(new URL('../src/scripts/analytics.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /googletagmanager\.com/);
  assert.match(analyticsSource, /PUBLIC_GA_MEASUREMENT_ID|measurementId/);
  assert.match(analyticsSource, /analytics_consent/);
  for (const event of ['github_click', 'download_click', 'release_click', 'addon_open', 'addon_audio_play', 'install_guide_open', 'screenshot_gallery_open', 'outbound_docs_click']) {
    assert.match(analyticsSource, new RegExp(event));
  }
  assert.match(analyticsSource, /astro:page-load/);
  assert.match(analyticsSource, /page_view/);
});

test('production operations documentation covers GA4 and Search Console', async () => {
  const [analytics, searchConsole] = await Promise.all([
    readFile(new URL('../docs/analytics.md', import.meta.url), 'utf8'),
    readFile(new URL('../docs/search-console.md', import.meta.url), 'utf8'),
  ]);
  assert.match(analytics, /PUBLIC_GA_MEASUREMENT_ID/);
  assert.match(analytics, /G-XXXXXXXXXX/);
  assert.match(searchConsole, /sitemap-index\.xml/);
  assert.match(searchConsole, /URL Inspection/i);
  assert.match(searchConsole, /queries|clicks|impressions|position/i);
});

test('favicon and local social preview exist', async () => {
  await access(new URL('../public/favicon.png', import.meta.url));
  await access(new URL('../public/images/social/neural-companion-og.webp', import.meta.url));
});

test('release funnel CTAs emit meaningful events and campaign attribution', async () => {
  const [download, install, changelog] = await Promise.all([
    readFile(new URL('../dist/download/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/install/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/changelog/index.html', import.meta.url), 'utf8'),
  ]);
  assert.match(download, /data-analytics-event="release_click"/);
  assert.match(download, /data-analytics-event="github_click"/);
  assert.match(download, /data-analytics-event="install_guide_open"/);
  assert.match(install, /data-analytics-event="release_click"/);
  assert.match(changelog, /data-analytics-event="outbound_docs_click"/);
  for (const html of [download, install, changelog]) {
    assert.match(html, /utm_source=neuralcompanion_site/);
    assert.match(html, /utm_medium=website/);
  }
});
