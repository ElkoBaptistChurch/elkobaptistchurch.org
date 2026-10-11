import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elkobaptistchurch.org',
  output: 'static',
  integrations: [
    sitemap({
      // Exclude noIndex pages (prayer-requests, 404) from the sitemap.
      filter: (page) =>
        !/\/(prayer-requests|404)\/?$/.test(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: '_assets',
  },
  compressHTML: true,
});
