# Navajeevan Seva Ashram

A fully static community-welfare website built with Astro, TypeScript, and Tailwind CSS. Includes an editorial homepage, Donation, Contact, three historical events, five service stories, a Ganesh Puja photo album and one AI-generated gallery illustration, a legacy About redirect, and a custom 404 page.

## Guide for teachers and staff

See [Adding events, stories, and photo galleries](docs/CONTENT-GUIDE.md) for step-by-step instructions, copy-and-paste examples, and help with common errors. No coding experience is required.

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
npm run preview
```

The production output is `dist/`. It consists only of HTML, CSS, JavaScript, fonts, and images. Serve it with any static web host; there is no application server or database.

## Content and images

- `src/config/site.ts`: NGO name, short name, city, address lines, phones, emails, community link, and logo asset. Shared by the header, footer, contact page, and page metadata.
- `src/config/donation.ts`: published sponsorship amounts, bank accounts, QR provenance, and source-check date. The original donation QR image is retained without recompression.
- `src/config/navigation.ts`: navigation links; adding an entry updates desktop and mobile menus.
- `src/config/home.ts`: typed slider, About, featured project IDs, values, services, team profiles, and calls to action.
- `src/config/reference-photos.ts`: original photo URLs, local paths, alt text, and actual dimensions.
- `src/config/photos.ts`: image paths and accessible descriptions.
- `src/lib/site.ts`: base-aware URLs, date formatting, and stable story sorting (undated entries follow dated entries).

Config files are typed TypeScript. Add phone/email entries to their arrays and all contact lists update automatically. Address lines are rendered as separate lines in the footer and joined on the contact page. Store logo/image files in `public/` and use paths relative to that folder. Logo lettering is part of the image, so changing the organization name also requires an updated logo image. Story/event prose remains editable Markdown under `src/content/`; other page-specific copy remains in `src/pages/`. Run `npm run check` and rebuild for deployment after editing config.
- `src/content/events/`: Markdown events; filenames become public event IDs. Each event includes title, excerpt, date, image filename and imageAlt, category, status (`upcoming` or `past`), location. Time and schedule are optional. Update status manually when an event passes, then rebuild.
- `src/content/stories/`: Markdown articles; filenames become public story IDs. Include title, excerpt, image filename and imageAlt, category. Publication date, author, and reading time are optional. Reference-derived entries include a source URL.
- `src/content.config.ts`: schemas validated during builds.
- `src/pages/index.astro`: homepage section composition. Featured project and service IDs are validated during build.
- `src/styles/global.css`: palette, local fonts, shared components, and responsive behavior.
- `public/images/`: images grouped by purpose. The retained gallery illustration prompt is in `scripts/gallery-image-prompts.json`.

### Image folders

```text
public/images/
├── branding/logo.png
├── home/
│   ├── hero/
│   └── about/
├── team/
├── donation/                 # Includes the original, unmodified QR file
├── events/<event-id>/cover.webp
├── stories/<story-id>/cover.webp
├── gallery/<album-id>/

```

Every event and story owns its image folder, including service stories. Folder names match the Markdown filename without `.md`. Use lowercase, hyphenated names for entries and files. A copy of the same photograph in different entry folders is intentional: replacing one entry’s cover does not change another. Homepage service cards reuse the corresponding story’s cover.

### Add an event or story

1. Create `src/content/events/community-lunch.md` or `src/content/stories/community-lunch.md`, using an existing entry as your template. Keep required fields.
2. Create `public/images/events/community-lunch/` or `public/images/stories/community-lunch/` to match.
3. Place the main photograph in that folder as `cover.webp` (JPEG and PNG are also supported).
4. Set these fields in the Markdown frontmatter:

   ```yaml
   image: "cover.webp"
   imageAlt: "Volunteers sharing lunch with community members"
   # Optional internal provenance, never displayed as a source notice:
   imageSource: "https://example.org/original-photo.jpg"
   ```

5. Run `npm run check` and `npm run build`. No TypeScript image registry edit is needed. Actual dimensions are read automatically during rendering; missing or unreadable images fail the build with the entry name and expected path.

Additional photographs can live beside the cover with names such as `meal-preparation.webp` or `volunteers.jpg`. Storing them does not automatically create a gallery. Image filenames must be local basenames, not URLs or paths. Rename the matching image folder whenever an entry’s Markdown filename changes; that also changes its public page URL.

Site-wide images (homepage, team, branding, and donation) remain configured in typed TypeScript. Font files are bundled locally. The gallery illustration uses a descriptive caption without a public generation label.

The NGO name, address, phone numbers, and emails remain as configured. The homepage, three historical 2022 projects, and five service summaries use content verified against https://www.navajeevanbam.com/home on 21 September 2026. Photographs are organized by use under `public/images/`; original URLs are retained in site configuration and content imageSource fields. Sample stories and events have been removed. Current service counts and schedules have not been inferred from the historical reference. Donation amounts and bank details are transcribed from the main website’s donation section. Do not add tax benefits, registrations, or financial claims without verification.

## Site-wide motion

Motion follows the reference website: sections rise 100px over 600ms with ease-in-out timing, cards use staggered delays, and team portraits zoom from 60% scale. Hero headings and descriptions fade downward over one second; the button rises with a 400ms delay. These text entrances replay on each slide. The shared layout enables the same scroll reveals on all content pages. Scroll reveals play once, with pending items hidden before first paint to prevent flashes. A script-load fallback restores visibility if initialization fails. Content remains visible without JavaScript; reduced-motion preferences disable reveals, and keyboard focus immediately reveals the focused content.

## Interactive features

The homepage carousel crossfades over 650ms, preloads its photographs, rotates every five seconds, loops continuously through all slides, and disables autoplay for reduced motion. Hover, focus, arrows, and indicators preserve playback; Pause stops it and Play resumes it, including for reduced-motion users. Without JavaScript its first slide and donation link remain visible. The donation page lists seven sponsorship options, nine published amounts, the original QR image, and three bank accounts. Payment takes place in the visitor’s payment or banking app; there is no on-site payment form or payment-provider integration. Event filters and the mobile menu run in the browser. The contact form requires an Indian mobile number and accepts optional email. Its Google Form URLs and field IDs are configured in `src/config/contact.ts`. After submission, a thank-you panel explains that receipt cannot be confirmed in the browser. See [Contact setup](docs/CONTACT-SETUP.md) for configuration and delivery checks. Form values are not stored in browser storage. Form submit buttons are enabled only after their handlers are installed. Core content and navigation remain available without JavaScript.

There are no analytics, embedded maps, or remote image dependencies. Contact delivery uses the configured external API once supplied; creating and deploying that API is separate from this static website. Adding on-site payment processing is also a separate integration.

## GitHub Pages

1. Push this project to a GitHub repository using `main` or `master` as the deployment branch (or update the workflow branch filter).
2. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` checks and builds the site, then publishes `dist/` on a push to `main` or `master`, or a manual run.

The workflow obtains the deployment origin and base path from GitHub Pages, supporting both `https://owner.github.io/repository/` and root/custom-domain hosting. Every page is generated as a directory containing `index.html`; direct loading and refreshing detail routes work without SPA rewrites.

For manual builds, set the origin and base explicitly:

```sh
SITE_URL=https://owner.github.io BASE_PATH=/repository npm run build
```

For a custom domain, configure the domain in GitHub Pages, and use `/` as the base. For manual custom-domain builds, set `SITE_URL=https://your-domain.example BASE_PATH=/`. Canonical and absolute social image URLs are emitted when `SITE_URL` is available. No invented production hostname is included in local builds.

No repository remote or live deployment is configured by this implementation.

### Favicons and social link

The favicon source is `public/images/branding/favicon.svg`. Run `node scripts/generate-favicons.mjs` after editing it to regenerate browser PNGs, the Apple touch icon, and the root `public/favicon.ico` fallback. The footer Facebook link uses `site.community.href` from `src/config/site.ts`.

### Gallery albums

Navigation links to `/gallery/`; the homepage shows the three newest albums. Albums sort by date descending, then title. To add one, create `src/content/gallery/your-album.md` and put its photographs in `public/images/gallery/your-album/`:

```yaml
---
title: "A community gathering"
date: "2026-09-06"
description: "A short description of the gathering."
cover: "shared-meal.webp"
images:
  - filename: "shared-meal.webp"
    alt: "Community members sharing lunch in a courtyard"
    caption: "Lunch together in the courtyard."
  - filename: "volunteers.webp"
    alt: "Volunteers preparing the tables"
---
```

List photos in their display order. `cover` must match a listed filename; filenames must be unique within the album. Use lowercase hyphenated filenames and WebP, JPEG, or PNG images. Captions are optional and fall back to alt text. Dimensions are read automatically; no image registry edits are required. Run `npm run check` and `npm run build` before publishing. Album IDs come from Markdown filenames.

The gallery contains the real Ganesh Puja album and one gallery illustration. Generation prompts are recorded in `scripts/gallery-image-prompts.json`. The viewer supports previous/next, arrow keys, Escape, focus restoration, and direct full-image links without JavaScript. There is no autoplay.
