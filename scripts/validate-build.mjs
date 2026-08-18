import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ORIGIN = 'https://neuralcompanion.app';
const REQUIRED_ROUTES = [
  '',
  'download',
  'install',
  'features',
  'integrations',
  'guides',
  'changelog',
  'local-ai-companion',
  'ai-companion-windows',
  'voice-ai-companion',
  'ai-avatar',
  'memory',
  'visual-replies',
  'integrations/ollama',
  'integrations/lm-studio',
  'integrations/musetalk',
  'integrations/vseeface',
  'integrations/vam',
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(path)));
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files;
}

function targetPathForHref(root, href) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (!pathname || pathname === '/') return join(root, 'index.html');
  const relative = pathname.replace(/^\//, '');
  return extname(relative) ? join(root, relative) : join(root, relative, 'index.html');
}

export async function validateBuild(rootUrl = new URL('../dist/', import.meta.url)) {
  const root = fileURLToPath(rootUrl);
  const errors = [];
  const requiredFiles = [
    ...REQUIRED_ROUTES.map((route) => join(root, route, 'index.html')),
    join(root, 'robots.txt'),
    join(root, 'sitemap-index.xml'),
    join(root, 'sitemap-0.xml'),
  ];

  for (const path of requiredFiles) {
    if (!(await exists(path))) errors.push(`${path}: required generated file is missing`);
  }

  if (!(await exists(root))) return errors;

  const htmlFiles = await listHtmlFiles(root);
  for (const path of htmlFiles) {
    const html = await readFile(path, 'utf8');
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)];
    if (canonicals.length !== 1) {
      errors.push(`${path}: expected exactly one canonical URL`);
    } else if (!canonicals[0][1].startsWith(`${ORIGIN}/`)) {
      errors.push(`${path}: canonical URL does not use ${ORIGIN}`);
    }

    const internalHrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => match[1]);
    for (const href of internalHrefs) {
      if (!(await exists(targetPathForHref(root, href)))) {
        errors.push(`${path}: internal link target is missing for ${href}`);
      }
    }
  }

  const homepagePath = join(root, 'index.html');
  if (await exists(homepagePath)) {
    const homepage = await readFile(homepagePath, 'utf8');
    const jsonLdMatch = homepage.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    if (!jsonLdMatch) {
      errors.push(`${homepagePath}: SoftwareApplication JSON-LD is missing`);
    } else {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        if (jsonLd['@type'] !== 'SoftwareApplication') {
          errors.push(`${homepagePath}: JSON-LD type is not SoftwareApplication`);
        }
        const serialized = JSON.stringify(jsonLd);
        for (const forbidden of ['aggregateRating', 'review', 'offers', 'price', 'softwareVersion', 'installCount']) {
          if (serialized.includes(`"${forbidden}"`)) {
            errors.push(`${homepagePath}: JSON-LD contains unsupported ${forbidden}`);
          }
        }
      } catch (error) {
        errors.push(`${homepagePath}: JSON-LD is invalid (${error.message})`);
      }
    }
  }

  const robotsPath = join(root, 'robots.txt');
  if (await exists(robotsPath)) {
    const robots = await readFile(robotsPath, 'utf8');
    if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)) {
      errors.push(`${robotsPath}: production sitemap URL is missing`);
    }
  }

  return errors;
}

const executedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (executedPath === import.meta.url) {
  const errors = await validateBuild();
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Generated site validation passed.');
  }
}
