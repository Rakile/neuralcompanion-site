import { mkdir, writeFile } from 'node:fs/promises';

import { ADDONS } from '../src/data/addons.ts';
import { IMAGE_MEDIA } from '../src/data/media.ts';

const records = ADDONS.map((addon) => {
  if (addon.screenshotSrc) {
    const media = IMAGE_MEDIA[addon.screenshotSrc];
    if (!media) throw new Error(`Missing typed media metadata for ${addon.screenshotSrc}.`);
    return {
      manifestId: addon.manifestId,
      slug: addon.slug,
      status: 'captured',
      file: addon.screenshotSrc,
      width: media.width,
      height: media.height,
      provenance: 'Real Neural Companion application capture; sensitive runtime identifiers are redacted where applicable.',
    };
  }

  if (!addon.hasUi) {
    return {
      manifestId: addon.manifestId,
      slug: addon.slug,
      status: 'headless',
      reason: 'This addon has no standalone panel; its state is represented in the shared Host runtime when selected.',
    };
  }

  return {
    manifestId: addon.manifestId,
    slug: addon.slug,
    status: 'shared-interface',
    reason: 'The addon uses a shared Host, sensory, provider, or addon-management interface. No fake standalone screenshot is published.',
    nextCapture: `Open ${addon.name} in a clean test profile and capture its shared panel without local paths, account names, device IDs, API keys, or pairing data.`,
  };
});

const output = new URL('../public/images/addons/capture-manifest.json', import.meta.url);
await mkdir(new URL('../public/images/addons/', import.meta.url), { recursive: true });
await writeFile(output, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
console.log(`Documented screenshot status for ${records.length} addons.`);
