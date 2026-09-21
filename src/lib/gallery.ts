import type { CollectionEntry } from 'astro:content';
import { contentImage } from './content-images';
export function sortAlbums(a: CollectionEntry<'gallery'>, b: CollectionEntry<'gallery'>) {
  return +b.data.date - +a.data.date || a.data.title.localeCompare(b.data.title, 'en');
}
export async function albumPhotos(album: CollectionEntry<'gallery'>) {
  return Promise.all(album.data.images.map(async image => ({
    ...await contentImage({ collection: 'gallery', id: album.id, data: { image: image.filename, imageAlt: image.alt } }),
    filename: image.filename, caption: image.caption ?? image.alt,
  })));
}
