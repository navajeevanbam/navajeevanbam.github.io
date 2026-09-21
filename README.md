# Navajeevan Seva Ashram

A fully static community-welfare website built with Astro, TypeScript, and Tailwind CSS. Includes an editorial homepage, Donation, Contact, nine events, eleven stories/services, a legacy About redirect, and a custom 404 page.

## Local development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro (normally `http://localhost:4321`).

```sh
npm run check
npm run build
npm test
npm run preview
```

The production output is `dist/`. It consists only of HTML, CSS, JavaScript, fonts, and images. Serve it with any static web host; there is no application server or database.

## Content and images

- `src/config/site.ts`: NGO name, short name, city, address lines, phones, emails, community link, and logo asset. Shared by the header, footer, contact page, and page metadata.
- `src/config/navigation.ts`: navigation links; adding an entry updates desktop and mobile menus.
- `src/config/home.ts`: typed slider, About, featured project IDs, values, services, team profiles, and calls to action.
- `src/config/reference-photos.ts`: original photo URLs, local paths, alt text, and actual dimensions.
- `src/config/photos.ts`: image paths and accessible descriptions.
- `src/lib/site.ts`: base-aware URLs, date formatting, and stable story sorting (undated entries follow dated entries).

Config files are typed TypeScript. Add phone/email entries to their arrays and all contact lists update automatically. Address lines are rendered as separate lines in the footer and joined on the contact page. Store logo/image files in `public/` and use paths relative to that folder. Logo lettering is part of the image, so changing the organization name also requires an updated logo image. Story/event prose remains editable Markdown under `src/content/`; other page-specific copy remains in `src/pages/`. Run `npm run check` and rebuild for deployment after editing config.
- `src/content/events/`: Markdown events; filenames become public event IDs. Each event includes title, excerpt, date, image key, category, status (`upcoming` or `past`), location, and explicit `sample` status. Time and schedule are optional. Update status manually when an event passes, then rebuild.
- `src/content/stories/`: Markdown articles; filenames become public story IDs. Include title, excerpt, image key, category, and explicit `sample` status. Publication date, author, and reading time are optional. Reference-derived entries include a source URL.
- `src/content.config.ts`: schemas validated during builds.
- `src/pages/index.astro`: homepage section composition. Featured project and service IDs are validated during build.
- `src/styles/global.css`: palette, local fonts, shared components, and responsive behavior.
- `public/images/`: six optimized WebP photos generated with the built-in image generation tool. Prompt records are in `scripts/image-prompts.json`. The original image source filenames are provenance only and are never required by the website or build.

Available image keys: `community`, `education`, `food`, `elders`, `health`, and `volunteers`. All generated photos are fictional illustrations. Replace the appropriate WebP and update alt text when using real photography. Font files are bundled locally by the build.

The NGO name, address, phone numbers, and emails remain as configured. The homepage, three historical 2022 projects, and five service summaries use content verified against https://www.navajeevanbam.com/home on 21 September 2026. Ten reference photographs are optimized locally under `public/images/reference/`; original URLs are recorded in configuration. Sample stories and events are explicitly labeled. Current service counts, schedules, and donation amounts have not been inferred from the historical reference. Do not add tax benefits, registrations, or financial claims without verification.

## Homepage motion

Motion follows the reference website: sections rise 100px over 600ms with ease-in-out timing, cards use staggered delays, and team portraits zoom from 60% scale. Hero headings and descriptions fade downward over one second; the button rises with a 400ms delay. These text entrances replay on each slide. Scroll reveals play once, with pending items hidden before first paint to prevent flashes. A script-load fallback restores visibility if initialization fails. Content remains visible without JavaScript; reduced-motion preferences disable reveals, and keyboard focus immediately reveals the focused content.

## Interactive demos

The homepage carousel crossfades over 650ms, preloads its photographs, rotates every five seconds, loops continuously through all slides, and disables autoplay for reduced motion. Hover, focus, arrows, and indicators preserve playback; Pause stops it and Play resumes it, including for reduced-motion users. Without JavaScript its first slide and donation link remain visible. Donation selections, custom whole-rupee amounts, event filters, and the mobile menu run in the browser. The donation form does not accept payment details or process payments. The contact form validates inputs and displays a demo notice; it sends no requests and stores no personal data. Form submit buttons are enabled only after their handlers are installed. Core content and navigation remain available without JavaScript.

There are no external form services, analytics, embedded maps, or remote image dependencies. Adding real payments or message delivery is a separate integration.

## GitHub Pages

1. Push this project to a GitHub repository using `main` or `master` as the deployment branch (or update the workflow branch filter).
2. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` checks and builds the site, verifies local references, and publishes `dist/` on a push to `main` or `master`, or a manual run.

The workflow obtains the deployment origin and base path from GitHub Pages, supporting both `https://owner.github.io/repository/` and root/custom-domain hosting. Every page is generated as a directory containing `index.html`; direct loading and refreshing detail routes work without SPA rewrites.

For manual builds, set the origin and base explicitly:

```sh
SITE_URL=https://owner.github.io BASE_PATH=/repository npm run build
BASE_PATH=/repository npm test
```

For a custom domain, configure the domain in GitHub Pages, and use `/` as the base. For manual custom-domain builds, set `SITE_URL=https://your-domain.example BASE_PATH=/`. Canonical and absolute social image URLs are emitted when `SITE_URL` is available. No invented production hostname is included in local builds.

No repository remote or live deployment is configured by this implementation.

## Browser verification

The browser checks cover 375px, 768px, 1024px, and 1440px viewports, route loading and refreshes, missing pages, local images, forms, filters, keyboard navigation, and accessibility. See `scripts/browser-check.mjs` for the runnable acceptance checks. It expects a built site and uses the installed Playwright Chromium browser.

```sh
npx playwright install chromium
node scripts/browser-check.mjs
```

For a subpath build, run `BASE_PATH=/repository node scripts/browser-check.mjs`. Screenshots and test results go into the ignored `test-results/` directory.
