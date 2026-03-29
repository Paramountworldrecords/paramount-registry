import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.paramountworldrecords.com',
  base: '/',
  trailingSlash: 'always',
  integrations: [tailwind(), sitemap()],
});
