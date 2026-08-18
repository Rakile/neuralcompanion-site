import assert from 'node:assert/strict';
import test from 'node:test';

import { validateBuild } from '../scripts/validate-build.mjs';

test('generated site satisfies the production build contract', async () => {
  const errors = await validateBuild(new URL('../dist/', import.meta.url));

  assert.deepEqual(errors, []);
});
