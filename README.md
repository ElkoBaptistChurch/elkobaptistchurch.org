# Elko Baptist Church Website

The official website for Elko Baptist Church — a warm, historic Southern Baptist congregation in Elko, Georgia, serving families and first-time visitors in Houston County since 1891.

This project is built with [Astro 5](https://astro.build) and deployed to [Cloudflare Pages](https://pages.cloudflare.com) as a fully static site. It is designed for fast load times, strong search engine visibility, and ease of content updates.

---

## Quick Start

**Prerequisites:** Node.js 20 or newer, npm

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

The site will be available at `http://localhost:4321`.

---

## Site Overview

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Main landing page: hero, service times, gospel message, ministries preview |
| About | `/about/` | Church history, mission statement, beliefs |
| Ministries | `/ministries/` | Overview of all church ministries |
| Sermons | `/sermons/` | Sermon archive with links to recordings |
| Plan Your Visit | `/plan-your-visit/` | What to expect, directions, FAQ for first-time guests |
| Staff | `/staff/` | Staff and leadership directory |
| Contact | `/contact/` | Contact form and church information |
| Prayer Requests | `/prayer-requests/` | Private prayer request submission form |

---

## Tech Stack

| Area | Technology | Notes |
|------|-----------|-------|
| Framework | [Astro 5](https://astro.build) | Static output, zero JavaScript by default |
| CSS | [Tailwind CSS v4](https://tailwindcss.com) | CSS-based config — no `tailwind.config.js` file |
| Tailwind plugin | `@tailwindcss/vite` | Replaces the deprecated `@astrojs/tailwind` integration |
| Sitemap | `@astrojs/sitemap` | Auto-generates `/sitemap-index.xml` at build time |
| TypeScript | Strict mode | `@/` path alias points to `src/` |
| Build output | `dist/` | Fully static HTML/CSS/JS |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | CDN-distributed global edge deployment |
| Build command | `npm run build` | |
| Node version | 20+ | Required for Astro 5 |

---

## File Structure

```
elkobaptistchurch.org/
├── public/                  # Static assets served as-is
│   ├── images/              # Photos (add real photos here — see Images section)
│   ├── _redirects           # Cloudflare Pages URL redirect rules
│   ├── robots.txt           # Search engine crawl instructions
│   └── favicon.svg          # Browser tab icon
│
├── src/
│   ├── components/
│   │   ├── layout/          # Site-wide structural components
│   │   │   ├── BaseLayout.astro   # HTML shell, <head>, fonts, SEO meta
│   │   │   ├── Header.astro       # Navigation bar
│   │   │   └── Footer.astro       # Footer with links and contact info
│   │   ├── sections/        # Full-width page sections
│   │   │   ├── Hero.astro
│   │   │   ├── GospelSection.astro
│   │   │   ├── MinistriesGrid.astro
│   │   │   ├── NewHereSection.astro
│   │   │   ├── ServiceTimesBar.astro
│   │   │   └── StaffGrid.astro
│   │   └── ui/              # Reusable small components
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       ├── MinistryCard.astro
│   │       ├── SectionHeading.astro
│   │       ├── SermonCard.astro
│   │       └── StaffCard.astro
│   │
│   ├── data/                # All editable content lives here (see Content section)
│   │   ├── site.ts          # Church name, address, phone, service times, social links
│   │   ├── ministries.ts    # Ministry listings
│   │   └── staff.ts         # Staff members and bios
│   │
│   ├── content/
│   │   └── sermons/
│   │       └── sermons.json # Sermon archive (Astro content collection — see Sermon Archive section)
│   │
│   ├── pages/               # One file = one URL
│   │   ├── index.astro      # Home page (/)
│   │   ├── about.astro      # /about/
│   │   ├── ministries.astro # /ministries/
│   │   ├── sermons.astro    # /sermons/
│   │   ├── plan-your-visit.astro
│   │   ├── staff.astro      # /staff/
│   │   ├── contact.astro    # /contact/
│   │   ├── prayer-requests.astro
│   │   └── 404.astro        # Custom not-found page
│   │
│   ├── styles/
│   │   └── global.css       # Tailwind v4 design system (see Design System section)
│   │
│   └── utils/
│       └── seo.ts           # JSON-LD schema generators, OG tag helpers
│
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and npm scripts
```

---

## Design System

All design tokens are defined in `src/styles/global.css` inside a `@theme {}` block — this is how Tailwind v4 works. There is no separate `tailwind.config.js` file.

### Color Palette

| Name | Hex | Tailwind class | Use |
|------|-----|---------------|-----|
| Burgundy 950 | `#3c141e` | `burgundy-950` | Deepest wine, primary text on light |
| Burgundy 900 | `#5c1f2e` | `burgundy-900` | Rich burgundy backgrounds, headings |
| Burgundy 800 | `#6c2d3c` | `burgundy-800` | Dark burgundy backgrounds |
| Burgundy 700 | `#7c3c49` | `burgundy-700` | Focus rings, hover states |
| Burgundy 100 | `#f3dbd7` | `burgundy-100` | Light blush tints |
| Burgundy 50 | `#fbf1ef` | `burgundy-50` | Very light blush/cream backgrounds |
| Wheat 700 | `#b18f49` | `wheat-700` | Warm cream-gold CTAs |
| Wheat 600 | `#c5a45a` | `wheat-600` | Decorative rules and accents |
| Wheat 500 | `#d9b96c` | `wheat-500` | Cream-gold highlight |
| Cream | `#f7f3eb` | `cream` | Main page background |
| Parchment | `#ede8dc` | `parchment` | Card and section backgrounds |
| Warm White | `#fefcf9` | `warm-white` | High-contrast section backgrounds |

### Typography

| Role | Font | Tailwind class |
|------|------|---------------|
| Headings (h1–h3) | Playfair Display (serif) | `font-display` |
| Body text | Inter (sans-serif) | `font-body` (default) |

Both fonts are loaded from Google Fonts in `BaseLayout.astro`. The base font size is **18px** (set on `<html>`) for accessibility — the congregation includes older readers.

### Custom Utility Classes

These classes are defined in `src/styles/global.css` and available everywhere:

| Class | What it does |
|-------|-------------|
| `section-container` | Centers content with responsive horizontal padding (max-width 1280px) |
| `section-py` | Adds consistent vertical padding to page sections (5rem mobile, 7rem desktop) |
| `font-display` | Applies Playfair Display (use on headings you want to stand out) |
| `eyebrow` | Small uppercase label above section headings (e.g., "Our Story") |
| `section-rule` | Short decorative amber horizontal rule |
| `verse-text` | Italic serif styling for scripture quotations |
| `card-lift` | Adds a subtle hover lift animation to cards |
| `photo-overlay` | Dark burgundy gradient overlay for hero/photo backgrounds |

---

## Content Management

All site content lives in TypeScript files under `src/data/`. You do not need to understand TypeScript to edit these — just follow the existing patterns.

**To update any content: edit the relevant file and redeploy the site.**

### `src/data/site.ts`
The single source of truth for church-wide information:
- Church name, tagline, and description
- Physical address and phone number
- Email address
- Service times (Morning Worship, Children's Church)
- Facebook and YouTube links
- Pastor name and bio
- Founding history

> **Warning:** Several fields in `site.ts` are marked as placeholders — the address, phone, and email need to be verified with the church before launch. Search for comments marked `*(placeholder — verify before launch)*`.

### `src/data/ministries.ts`
List of church ministries. Each ministry has a name, description, icon, and optional link. Add, remove, or edit ministries here.

### `src/data/staff.ts`
Staff directory. Each person has a name, title, bio, and optional photo path. Add or update staff members here.

### `src/content/sermons/sermons.json`
Sermon archive, kept in sync automatically — see **Sermon Archive** below. You can still hand-edit entries here for small corrections, but new sermons are added by the sync script, not by hand.

---

## Sermon Archive

The `/sermons/` page is backed by an Astro content collection (`src/content/sermons/sermons.json`, schema in `src/content.config.ts`) instead of a hand-maintained list. It's kept current automatically:

- **Daily sync** — `.github/workflows/sync-sermons.yml` runs `scripts/sync-sermons.mjs` every day, pulling any new videos from the church's YouTube uploads and committing them straight to `sermons.json`.
- **Manual sync** — run `npm run sermons:sync` locally any time (e.g. right after recording a sermon, without waiting for the daily cron).
- **Full reimport** — `npm run sermons:reimport` ignores the existing file and rebuilds the entire archive from the channel's full upload history. Use this for the initial historical backfill, or if you ever need to start over.
- Both require `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` environment variables. For the GitHub Action, add these as **repo secrets** (Settings → Secrets and variables → Actions). For local runs, export them in your shell first.

**AI-generated tagging (n8n):** the sync script only knows what YouTube's metadata tells it (title, description, duration) — it can't reliably determine a sermon's series or topic tags. If your video descriptions follow the `Summary: ... | Scripture: ...` format, the scripture reference is parsed automatically; otherwise the entry is flagged `needsReview: true` (shown as a "Needs tagging" badge on the sermon card) until enriched.

To enrich a sermon with an AI-generated summary, series, or tags (e.g. from an n8n workflow that reads the YouTube transcript), commit a file to `data/sermon-enrichments/<youtubeId>.json` — see `data/sermon-enrichments/README.md` for the exact shape. The next sync run merges it into the matching sermon and deletes the file.

The archive page itself (`src/pages/sermons.astro`) supports client-side search and filtering by series, book, and year via `SermonFilter.astro` — no backend or admin UI required, just a "Load More" button over the full sorted list.

---

## Images

Real photos are not yet included in the project. Sections that need photography use a CSS gradient placeholder until real images are provided.

Placeholder locations are marked in component files with a `data-photo-needed` attribute, like this:

```html
<div data-photo-needed="Church exterior from the front, daytime, showing the sign"></div>
```

### Recommended Photos

Add these to `public/images/` when they are available:

| File name | Description |
|-----------|-------------|
| `church-exterior.jpg` | Front of the church building, daytime, showing the sign |
| `church-interior.jpg` | Inside the sanctuary during or before a worship service |
| `congregation.jpg` | Congregation together — pews, greeting before service, or fellowship meal |
| `pastor-headshot.jpg` | Professional or high-quality photo of Pastor Wayne Holcomb |
| `worship-team.jpg` | Music/worship team playing (acoustic instruments — guitar, mandolin, banjo) |
| `childrens-church.jpg` | Children's Church class in progress |
| `og-default.jpg` | Social media preview image (1200×630px) — shown when someone shares the site on Facebook or texts a link |

> **Note:** For best quality, photos should be at least 1200px wide. JPG or WebP format preferred. You can optimize images for free at [squoosh.app](https://squoosh.app) before adding them.

---

## Forms

This is a **static site** — there is no server running that can process form submissions by default. You must connect the contact and prayer request forms to a form-handling service.

### Option A: Cloudflare Pages Functions (Recommended)

If you are already hosting on Cloudflare Pages, this is the best option. Create a file at `functions/api/contact.js` in the project root. Cloudflare will automatically run it as a serverless function when the form submits to `/api/contact`.

Example using the [Resend](https://resend.com) email API:

```js
// functions/api/contact.js
export async function onRequestPost(context) {
  const data = await context.request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'website@elkobaptistchurch.org',
      to: 'info@elkobaptistchurch.org',
      subject: `Contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  return Response.redirect('/contact/?sent=true', 303);
}
```

Set `RESEND_API_KEY` as an environment variable in the Cloudflare Pages dashboard (Settings > Environment variables). See `DEPLOYMENT.md` for details.

### Option B: Formspree (Simplest)

Sign up at [formspree.io](https://formspree.io), create a form, and add the Formspree URL as the `action` attribute on the form elements in `src/pages/contact.astro` and `src/pages/prayer-requests.astro`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Free tier allows 50 submissions per month. No code changes beyond updating the `action` attribute.

### Option C: Netlify Forms

If you switch hosting from Cloudflare Pages to [Netlify](https://netlify.com), add `netlify` and `data-netlify="true"` attributes to each form element. Netlify will handle submission capture automatically.

---

## SEO

The site is built with strong search engine optimization out of the box.

### JSON-LD Structured Data
Every page outputs structured data in `<script type="application/ld+json">` format so that Google can understand the church's name, address, phone number, service hours, and location. The schema types used are:
- `Organization` + `Church` — site-wide
- `LocalBusiness` — contact and home pages
- `WebPage` with `BreadcrumbList` — every interior page
- `Event` — event listings

These are generated by helper functions in `src/utils/seo.ts`.

### Sitemap
A sitemap is automatically generated at `/sitemap-index.xml` every time the site is built. After launch, submit this URL to [Google Search Console](https://search.google.com/search-console) to help Google discover and index all pages quickly.

### OpenGraph Tags
Every page outputs `og:title`, `og:description`, `og:image`, and `og:type` meta tags. These control how the site looks when shared on Facebook, iMessage, or other platforms. The default OG image is `public/images/og-default.jpg` — add a real photo there before launch.

---

## Performance Targets

The site is designed to meet or exceed these [Lighthouse](https://developer.chrome.com/docs/lighthouse/) scores:

| Category | Target |
|----------|--------|
| Performance | 95 or above |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Because Astro generates plain static HTML with zero client-side JavaScript by default, performance scores are high out of the box. The main variable is image optimization — use properly sized, compressed photos.

---

## Local Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build the site for production (output goes to dist/)
npm run build

# Preview the production build locally
npm run preview

# Run TypeScript type checks
npm run check
```

---

## Before Launch Checklist

Complete all items before making the site live.

| | Task |
|-|------|
| [ ] | Verify and update church address in `src/data/site.ts` |
| [ ] | Verify and update church phone number in `src/data/site.ts` |
| [ ] | Verify and update church email address in `src/data/site.ts` |
| [ ] | Add real photos to `public/images/` (see Images section above) |
| [ ] | Replace `og-default.jpg` with a real 1200×630px church photo |
| [ ] | Configure a form handler for the contact and prayer request forms (see Forms section) |
| [ ] | Test both forms end-to-end to confirm submissions are received |
| [ ] | Verify all navigation links work correctly |
| [ ] | Test the site on a mobile phone |
| [ ] | Test the site on a tablet |
| [ ] | Run a Lighthouse audit and address any issues |
| [ ] | Submit `/sitemap-index.xml` to Google Search Console after launch |
| [ ] | Set up real Facebook and YouTube links in `src/data/site.ts` (already set — verify they are correct) |
| [ ] | Optionally add Google Analytics or similar by inserting the tracking snippet in `src/components/layout/BaseLayout.astro` |
| [ ] | Set up a social media sharing preview by adding a real OG image |
| [ ] | Review all sermon and staff data for accuracy |
