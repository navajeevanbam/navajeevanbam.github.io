import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const shared = {
  title: z.string(),
  excerpt: z.string(),
  date: z.coerce.date(),
  image: z.enum(['community', 'education', 'food', 'elders', 'health', 'volunteers']),
  category: z.string(),
};

export const collections = {
  events: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
    schema: z.object({ ...shared, status: z.enum(['upcoming', 'past']), location: z.string(), time: z.string(), schedule: z.array(z.object({ time: z.string(), activity: z.string() })) }),
  }),
  blogs: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blogs' }),
    schema: z.object({ ...shared, author: z.string(), readTime: z.number() }),
  }),
};
