import assert from 'node:assert/strict';
import test from 'node:test';

import { FEATURES } from '../src/data/features.ts';
import { INTEGRATIONS } from '../src/data/integrations.ts';
import { SITE } from '../src/data/site.ts';

const expectedFeatureRoutes = [
  '/ai-avatar/',
  '/ai-companion-windows/',
  '/local-ai-companion/',
  '/memory/',
  '/visual-replies/',
  '/voice-ai-companion/',
];

const expectedIntegrationRoutes = [
  '/integrations/lm-studio/',
  '/integrations/musetalk/',
  '/integrations/ollama/',
  '/integrations/vam/',
  '/integrations/vseeface/',
];

test('site constants use verified production destinations', () => {
  assert.equal(SITE.origin, 'https://neuralcompanion.app');
  assert.equal(SITE.repository, 'https://github.com/Rakile/NeuralCompanion');
  assert.equal(SITE.releases, 'https://github.com/Rakile/NeuralCompanion/releases');
});

test('feature catalog exposes the approved routes with useful metadata', () => {
  assert.deepEqual(FEATURES.map(({ route }) => route).sort(), expectedFeatureRoutes);
  assert.equal(new Set(FEATURES.map(({ key }) => key)).size, FEATURES.length);

  for (const feature of FEATURES) {
    assert.ok(feature.summary.length >= 60, `${feature.key} needs a fuller summary`);
    assert.ok(feature.seoDescription.length >= 80, `${feature.key} needs a fuller SEO description`);
    assert.equal(feature.sourceUrl.startsWith(SITE.repository), true);
    assert.equal(feature.enabled, true);
  }
});

test('integration catalog exposes the approved routes and valid relationships', () => {
  assert.deepEqual(INTEGRATIONS.map(({ route }) => route).sort(), expectedIntegrationRoutes);
  assert.equal(new Set(INTEGRATIONS.map(({ slug }) => slug)).size, INTEGRATIONS.length);

  const featureKeys = new Set(FEATURES.map(({ key }) => key));
  for (const integration of INTEGRATIONS) {
    assert.ok(integration.summary.length >= 60, `${integration.slug} needs a fuller summary`);
    assert.ok(integration.seoDescription.length >= 80, `${integration.slug} needs a fuller SEO description`);
    assert.equal(integration.sourceUrl.startsWith(SITE.repository), true);
    assert.equal(integration.relatedFeatures.every((key) => featureKeys.has(key)), true);
    assert.ok(integration.configuration.length >= 2);
    assert.equal(integration.enabled, true);
  }
});
