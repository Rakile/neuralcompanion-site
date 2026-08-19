import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { ADDONS } from '../src/data/addons.ts';
import { IMAGE_MEDIA } from '../src/data/media.ts';

const webpDimensions = (bytes) => {
  const chunk = bytes.subarray(12, 16).toString('ascii');
  if (chunk === 'VP8 ') {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === 'VP8X') {
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    };
  }
  throw new Error(`Unsupported WebP chunk ${chunk}`);
};

test('official logo and every declared addon icon are published', async () => {
  const logo = await readFile(new URL('../public/media/brand/nc-logo.png', import.meta.url));
  assert.deepEqual([...logo.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(ADDONS.length, 44);
  assert.equal(new Set(ADDONS.map(({ manifestId }) => manifestId)).size, ADDONS.length);

  for (const addon of ADDONS.filter(({ iconSrc }) => iconSrc)) {
    const bytes = await readFile(new URL(`../public${addon.iconSrc}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], addon.slug);
  }
});

test('typed media dimensions match the encoded WebP assets', async () => {
  for (const media of Object.values(IMAGE_MEDIA)) {
    const bytes = await readFile(new URL(`../public${media.src}`, import.meta.url));
    assert.deepEqual(webpDimensions(bytes), { width: media.width, height: media.height }, media.src);
  }
});

test('capture manifest accounts for all addons and never leaks private paths', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../public/images/addons/capture-manifest.json', import.meta.url), 'utf8'),
  );

  assert.deepEqual(manifest.map(({ manifestId }) => manifestId).sort(), ADDONS.map(({ manifestId }) => manifestId).sort());
  for (const item of manifest) {
    assert.match(item.status, /^(captured|headless|shared-interface)$/);
    assert.doesNotMatch(JSON.stringify(item), /[A-Z]:\\|Users\\|\b(?:192\.168|10\.0)\./i);
    if (item.status === 'captured') {
      const bytes = await readFile(new URL(`../public${item.file}`, import.meta.url));
      assert.equal(bytes.subarray(0, 4).toString('hex'), '52494646', `${item.slug} must be WebP`);
      assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', item.slug);
      assert.ok(bytes.length > 20_000, `${item.slug} should contain a useful capture`);
    }
  }
});
