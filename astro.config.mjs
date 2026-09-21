import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const defaultBase = repository && !repository.endsWith('.github.io') ? `/${repository}` : '/';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || (owner ? `https://${owner}.github.io` : undefined),
  base: process.env.BASE_PATH || defaultBase,
  // Accept both URL forms so missing paths reach the custom 404 in dev too.
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
