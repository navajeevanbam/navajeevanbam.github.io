import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const shared = {
  title: z.string(),
  excerpt: z.string(),
  source: z.url().optional(),
  image: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(webp|jpe?g|png)$/, 'Use a local image filename such as cover.webp'),
  imageAlt: z.string().trim().min(1, 'Describe the image in imageAlt'),
  imageSource: z.url().optional(),
  category: z.string(),
};

const galleryImage = z.object({
  filename: shared.image,
  alt: z.string().trim().min(1),
  caption: z.string().trim().optional(),
});
export const collections = {
  gallery: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
    schema: z.object({
      title: z.string(), date: z.coerce.date(), description: z.string(),
      cover: shared.image, images: z.array(galleryImage).min(1),
    }).refine(album => album.images.some(image => image.filename === album.cover), { message: 'Cover must name an image in the album', path: ['cover'] })
      .refine(album => new Set(album.images.map(image => image.filename)).size === album.images.length, { message: 'Album filenames must be unique', path: ['images'] }),
  }),
  events: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
    schema: z.object({ ...shared, date: z.coerce.date(), status: z.enum(['upcoming', 'past']), location: z.string(), time: z.string().optional(), schedule: z.array(z.object({ time: z.string(), activity: z.string() })).optional() }),
  }),
  stories: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
    schema: z.object({ ...shared, date: z.coerce.date().optional(), author: z.string().optional(), readTime: z.number().optional() }),
  }),
};
