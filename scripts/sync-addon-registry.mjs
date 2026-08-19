import { readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

const ncRootArgument = process.argv.at(2);
if (!ncRootArgument) {
  throw new Error('Usage: node scripts/sync-addon-registry.mjs <NeuralCompanion-root>');
}

const addonsRoot = resolve(ncRootArgument, 'addons');
const entries = await readdir(addonsRoot, { withFileTypes: true });
const addons = [];

for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const manifestPath = join(addonsRoot, entry.name, 'addon.json');
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') continue;
    throw error;
  }
  if (!manifest.id || !manifest.name || !manifest.version) {
    throw new Error(`${manifestPath} is missing id, name, or version.`);
  }
  addons.push({
    id: String(manifest.id),
    name: String(manifest.name),
    version: String(manifest.version),
    description: String(manifest.description ?? ''),
    hasUi: Array.isArray(manifest.ui) && manifest.ui.length > 0,
    sourceDirectory: basename(entry.name),
  });
}

addons.sort((a, b) => a.id.localeCompare(b.id));
if (addons.length !== 44) {
  throw new Error(`Expected 44 Neural Companion addon manifests; found ${addons.length}.`);
}

const snapshot = {
  schemaVersion: 1,
  generatedFrom: 'NeuralCompanion/addons/*/addon.json',
  addons,
};

await writeFile(new URL('../src/data/addon-registry.json', import.meta.url), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Synchronized ${addons.length} addon manifests.`);
