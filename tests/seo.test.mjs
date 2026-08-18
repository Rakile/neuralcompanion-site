import assert from 'node:assert/strict';
import test from 'node:test';

import { canonicalUrl, safeJsonLd } from '../src/lib/seo.ts';

test('canonical URLs normalize paths against the production origin', () => {
  assert.equal(canonicalUrl('/'), 'https://neuralcompanion.app/');
  assert.equal(canonicalUrl('/install'), 'https://neuralcompanion.app/install/');
  assert.equal(
    canonicalUrl('integrations/ollama/'),
    'https://neuralcompanion.app/integrations/ollama/',
  );
});

test('safe JSON-LD escapes markup without changing parsed data', () => {
  const serialized = safeJsonLd({ text: '</script><script>alert(1)</script>' });

  assert.equal(serialized.includes('</script>'), false);
  assert.deepEqual(JSON.parse(serialized), { text: '</script><script>alert(1)</script>' });
});
