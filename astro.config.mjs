import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elkobaptistchurch.org',
  output: 'static',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://elkobaptistchurch.org/',
        'https://elkobaptistchurch.org/about/',
        'https://elkobaptistchurch.org/ministries/',
        'https://elkobaptistchurch.org/sermons/',
        'https://elkobaptistchurch.org/plan-your-visit/',
        'https://elkobaptistchurch.org/staff/',
        'https://elkobaptistchurch.org/contact/',
        'https://elkobaptistchurch.org/prayer-requests/',
      ],
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
