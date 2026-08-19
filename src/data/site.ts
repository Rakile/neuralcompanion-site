export const SITE = {
  name: 'Neural Companion',
  origin: 'https://neuralcompanion.app',
  repository: 'https://github.com/Rakile/NeuralCompanion',
  websiteRepository: 'https://github.com/Rakile/neuralcompanion-site',
  releases: 'https://github.com/Rakile/NeuralCompanion/releases',
  installGuide: 'https://github.com/Rakile/NeuralCompanion/blob/main/docs/install.md',
  manual: 'https://github.com/Rakile/NeuralCompanion/blob/main/docs/manual/index.md',
  changelog: 'https://github.com/Rakile/NeuralCompanion/blob/main/CHANGELOG.md',
  license: 'https://github.com/Rakile/NeuralCompanion/blob/main/LICENSE',
  socialImage: 'https://neuralcompanion.app/images/social/neural-companion-og.webp',
  socialImageAlt: 'Neural Companion Windows application interface',
  description:
    'A configurable desktop AI companion for real-time chat, speech, memory, avatars, visual replies, and addon-driven workflows.',
} as const;

export const NAV_ITEMS = [
  { label: 'Addons', href: '/addons/' },
  { label: 'Features', href: '/features/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'Install', href: '/install/' },
] as const;

export function trackedExternalUrl(destination: string, campaign: string): string {
  const url = new URL(destination);
  url.searchParams.set('utm_source', 'neuralcompanion_site');
  url.searchParams.set('utm_medium', 'website');
  url.searchParams.set('utm_campaign', campaign);
  return url.href;
}
