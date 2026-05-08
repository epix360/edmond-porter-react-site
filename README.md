# Edmond A Porter — Author Website

The official website for author Edmond A Porter, live at [edmondaporter.com](https://edmondaporter.com). Built with Next.js (App Router) and exported as a fully static site.

## Stack

- **Next.js 16** — App Router, server components, static export (`output: 'export'`)
- **Tailwind CSS** — Material Design-inspired custom color tokens, `@tailwindcss/typography`
- **Sharp** — pre-generates responsive WebP image variants at build time
- **EmailJS** — contact form (no backend required)
- **react-markdown** — article and book description rendering

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── page.js                 # Homepage
│   ├── about/page.js           # About page (server component)
│   ├── books/[slug]/page.js    # Book detail pages
│   ├── articles/[slug]/page.js # Article detail pages
│   ├── links/page.js           # Link-in-bio page
│   ├── sitemap.js              # Auto-generated sitemap
│   ├── components/             # Page-level UI components
│   └── utils/                  # Shared utilities (images, markdown, CDN, SEO)
├── lib/
│   ├── books.js                # Book data and sort helpers
│   ├── medium.js               # Medium feed reader
│   └── medium-snapshot.json    # RSS snapshot committed for resilient builds
├── public/
│   ├── content/                # JSON content files (headless CMS)
│   │   ├── hero.json
│   │   ├── about-bio.json
│   │   ├── home-bio.json
│   │   ├── books/              # Per-book JSON
│   │   └── timeline/           # Per-year milestone JSON
│   └── images/                 # Source images + auto-generated WebP variants
├── scripts/
│   ├── build-image-sizes.js    # Generates responsive WebP variants via Sharp
│   └── fetch-medium.js         # Snapshots Medium RSS feed before build
├── src/
│   ├── components/             # Navigation, Footer
│   └── data/                   # Fallback content
├── next.config.js
└── tailwind.config.js
```

## Getting Started

Node.js 22+ is recommended.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # static export → out/
```

The `prebuild` step runs automatically before `next build`:

1. **`build:images`** — scans `public/images/`, generates resized WebP variants (e.g. `Hero@400w.webp`, `Hero@640w.webp`), and writes `app/utils/image-manifest.json` for `srcset` generation at render time.
2. **`fetch:medium`** — fetches the Medium RSS feed and writes `lib/medium-snapshot.json`. On failure the existing snapshot is used so the build stays green.

Both scripts are idempotent. Run them individually if needed:

```bash
npm run build:images
npm run fetch:medium
```

## Content

Page content is stored as JSON in `public/content/` and read at build time by server components. No CMS login required — edit the JSON files directly and redeploy.

| File | Controls |
|---|---|
| `hero.json` | Homepage hero (title, blurb, book status, CTA) |
| `about-bio.json` | About page copy, bio image, SEO metadata |
| `home-bio.json` | Homepage author teaser section |
| `books/*.json` | Per-book details, descriptions, Amazon links |
| `timeline/*.json` | Year-by-year milestone entries on the About page |

## Deployment

The build outputs a fully static site to `out/`. The `CNAME` file (`edmondaporter.com`) targets GitHub Pages, but any static host works.

## Colors

Custom Tailwind color tokens follow Material Design naming conventions:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#162839` | Dark navy — headings, nav, buttons |
| `secondary` | `#805533` | Warm brown — accents, links, CTAs |
| `background` | `#f9f9f7` | Off-white page background |

---

© 2026 Edmond A Porter. All rights reserved.