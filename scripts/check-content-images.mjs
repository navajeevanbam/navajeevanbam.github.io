import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { contentImage } from '../src/lib/content-images.ts';

const folder = await mkdtemp('public/images/events/image-check-');
const id = folder.split('/').at(-1).toLowerCase();
// mkdtemp may generate uppercase characters; use a lowercase entry folder.
const { rename } = await import('node:fs/promises');
const localFolder = `public/images/events/${id}`;
if (folder !== localFolder) await rename(folder, localFolder);
const entry = { collection: 'events', id, data: { image: 'cover.webp', imageAlt: 'A test image' } };
try {
  for (const format of ['webp', 'jpeg', 'png']) {
    entry.data.image = `cover.${format}`;
    await sharp({ create: { width: 37, height: 23, channels: 3, background: '#203e32' } }).toFormat(format).toFile(`${localFolder}/${entry.data.image}`);
    const image = await contentImage(entry);
    assert.equal(image.width, 37);
    assert.equal(image.height, 23);
    assert.equal(image.src, `images/events/${id}/${entry.data.image}`);
  }
  await assert.rejects(contentImage({ ...entry, data: { ...entry.data, image: 'missing.webp' } }), /cannot read public\/images\/events/);
  await assert.rejects(contentImage({ ...entry, data: { ...entry.data, imageAlt: ' ' } }), /imageAlt/);
  await assert.rejects(contentImage({ ...entry, data: { ...entry.data, image: '..\/cover.webp' } }), /local lowercase filename/);
  await writeFile(`${localFolder}/broken.webp`, 'not an image');
  await assert.rejects(contentImage({ ...entry, data: { ...entry.data, image: 'broken.webp' } }), /cannot read/);
  console.log('Content images: formats, dimensions, missing files, invalid files, and alt text verified.');
} finally {
  await rm(localFolder, { recursive: true, force: true });
}
