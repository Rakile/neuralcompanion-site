import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://neuralcompanion.app',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
