import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const shared = {
  title: z.string(),
  excerpt: z.string(),
  sample: z.boolean(),
  source: z.url().optional(),
  image: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(webp|jpe?g|png)$/, 'Use a local image filename such as cover.webp'),
  imageAlt: z.string().trim().min(1, 'Describe the image in imageAlt'),
  imageSource: z.url().optional(),
  category: z.string(),
};

export const collections = {
  events: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
    schema: z.object({ ...shared, date: z.coerce.date(), status: z.enum(['upcoming', 'past']), location: z.string(), time: z.string().optional(), schedule: z.array(z.object({ time: z.string(), activity: z.string() })).optional() }),
  }),
  stories: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
    schema: z.object({ ...shared, date: z.coerce.date().optional(), author: z.string().optional(), readTime: z.number().optional() }),
  }),
};
