import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
const folder = 'public/images/branding';
const source = await readFile(`${folder}/favicon.svg`);
for (const size of [16, 32, 180]) {
  await sharp(source).resize(size, size).png().toFile(`${folder}/${size === 180 ? 'apple-touch-icon' : `favicon-${size}x${size}`}.png`);
}
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
// Root fallback for browsers that request /favicon.ico automatically.
await writeFile('public/favicon.ico', Buffer.concat([header, ...images]));
