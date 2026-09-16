import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : join(dir, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter(file => extname(file) === '.html');
const contentCount = (await walk(resolve('src/content'))).filter(file => extname(file) === '.md').length;
assert.equal(pages.length, 7 + contentCount, 'Expected six primary pages, all content detail pages, and a 404 page');
const titles = new Set();
let checked = 0;
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, `Missing title: ${file}`);
  assert.ok(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one h1: ${file}`);
  for (const [, attribute] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!attribute.startsWith('/') || attribute.startsWith('//')) continue;
    const [pathname] = attribute.split(/[?#]/);
    assert.ok(!base || pathname.startsWith(base + '/'), `Missing base: ${attribute} in ${file}`);
    const relative = decodeURIComponent(pathname.slice(base.length)).replace(/^\//, '');
    let target = resolve(root, relative);
    if (pathname.endsWith('/')) target = join(target, 'index.html');
    assert.ok((await stat(target).catch(() => null))?.isFile(), `Broken local reference: ${attribute} in ${file}`);
    checked++;
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /alt="[^"]+"/, `Missing alt text: ${file}`);
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
  }
}
console.log(`Verified ${pages.length} static pages, unique titles, image attributes, and ${checked} local references with base ${base || '/'}.`);
