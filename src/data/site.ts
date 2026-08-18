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
  socialImage:
    'https://raw.githubusercontent.com/Rakile/NeuralCompanion/main/docs/readme_images/git_front.png',
  socialImageAlt: 'Neural Companion feature overview',
  description:
    'A configurable desktop AI companion for real-time chat, speech, memory, avatars, visual replies, and addon-driven workflows.',
} as const;

export const NAV_ITEMS = [
  { label: 'Features', href: '/features/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'Install', href: '/install/' },
] as const;
