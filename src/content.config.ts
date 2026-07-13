import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sermons = defineCollection({
  // n8n drops one JSON file per sermon into data/sermons/, organized into
  // year/month subfolders. The glob loader reads them all recursively at build,
  // so each deploy reflects whatever files are present — no generated index file.
  loader: glob({
    pattern: '**/*.json',
    base: 'data/sermons',
    // Prefer an explicit "id" slug in the file; fall back to the filename.
    generateId: ({ entry, data }) =>
      typeof data.id === 'string' && data.id
        ? data.id
        : entry.replace(/\.json$/, '').split('/').pop()!,
  }),
  schema: z.object({
    title: z.string(),
    speaker: z.string().default('Pastor Wayne Holcomb'),
    date: z.string(), // ISO 8601 (YYYY-MM-DD)
    scripture: z.string(),
    description: z.string(),
    duration: z.string().optional(),
    youtubeId: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { sermons };
