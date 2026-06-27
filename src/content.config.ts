import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const sermons = defineCollection({
  loader: file('src/content/sermons/sermons.json'),
  schema: z.object({
    title: z.string(),
    series: z.string().optional(),
    speaker: z.string().default('Pastor Wayne Holcomb'),
    date: z.string(), // ISO 8601 (YYYY-MM-DD)
    scripture: z.string(),
    description: z.string(),
    duration: z.string().optional(),
    youtubeId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // True when the sync script couldn't confidently parse scripture/summary
    // from the YouTube metadata and an AI/human pass still needs to tag it.
    needsReview: z.boolean().default(false),
  }),
});

export const collections = { sermons };
