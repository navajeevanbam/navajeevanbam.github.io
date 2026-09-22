import sharp from 'sharp';
import type { PhotoData } from './image-types';

interface ImageEntry {
  collection: 'events' | 'stories' | 'gallery';
  id: string;
  data: { image: string; imageAlt: string; imageSource?: string };
}

/** Resolve an entry's own image; no shared registry registration is needed. */
export async function contentImage(entry: ImageEntry): Promise<PhotoData> {
  const { collection, id, data } = entry;
  const label = `${collection}/${id}`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`${label}: use a lowercase, hyphenated Markdown filename.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.(webp|jpe?g|png)$/i.test(data.image)) throw new Error(`${label}: image must be a local filename such as cover.webp, cover.jpg, or cover.png.`);
  if (!data.imageAlt?.trim()) throw new Error(`${label}: imageAlt must describe the image.`);
  const src = `images/${collection}/${id}/${data.image}`;
  try {
    const metadata = await sharp(`public/${src}`).metadata();
    if (!metadata.width || !metadata.height || !['webp', 'jpeg', 'png'].includes(metadata.format ?? '')) throw new Error('Unsupported or invalid image');
    return { src, alt: data.imageAlt, width: metadata.autoOrient.width, height: metadata.autoOrient.height, source: data.imageSource };
  } catch (error) {
    throw new Error(`${label}: cannot read public/${src}. Add a valid WebP, JPEG, or PNG image matching the Markdown image field.`, { cause: error });
  }
}
