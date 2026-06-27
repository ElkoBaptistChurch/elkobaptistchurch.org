# Elko Baptist Church — Agent Coordination Guide

## Project Overview
A premium, modern church website for Elko Baptist Church (Elko, GA). Built with Astro 5 + Tailwind CSS v4. Target: Cloudflare Pages static deployment.

## Critical Rules for All Agents

### 1. File Ownership — Never touch files outside your scope
See CHANGELOG.md for the live file ownership map. If you need something from another agent's scope, read their file but do not modify it.

### 2. Log every change to CHANGELOG.md
Before completing your task, append your changes to `.claude/CHANGELOG.md` using this format:
```
## [AGENT-NAME] YYYY-MM-DD HH:MM
### Files Created/Modified
- path/to/file — brief description
### Decisions Made
- Why you chose X over Y
```

### 3. Design system — Always use these tokens
Colors are defined in `src/styles/global.css` `@theme {}` block. Use the CSS custom property names as Tailwind utilities:

| Token | Value | Use |
|-------|-------|-----|
| `bg-burgundy-950` | #3C141E | Deepest wine, text on light |
| `bg-burgundy-900` | #5C1F2E | Rich burgundy backgrounds, headings |
| `bg-burgundy-800` | #6C2D3C | Dark burgundy backgrounds |
| `bg-burgundy-700` | #7C3C49 | Hover states, focus rings |
| `bg-burgundy-100` | #F3DBD7 | Light blush tints |
| `bg-burgundy-50` | #FBF1EF | Very light blush/cream |
| `bg-wheat-900` | #8A6526 | Dark cream-gold, strong CTAs |
| `bg-wheat-700` | #B18F49 | Warm cream-gold |
| `bg-wheat-500` | #D9B96C | Cream-gold accent |
| `bg-cream` | #F7F3EB | Main warm background |
| `bg-parchment` | #EDE8DC | Card/section backgrounds |
| `bg-warm-white` | #FEFCF9 | Section backgrounds |

### 4. Typography
- **Display/headings**: `font-display` → Playfair Display (serif)
- **Body**: `font-body` → Inter (sans)
- **Heading sizes**: `text-5xl md:text-6xl` (hero), `text-3xl md:text-4xl` (section), `text-xl md:text-2xl` (sub)
- **Body text**: `text-base md:text-lg leading-relaxed`
- **Minimum body size**: 18px for accessibility (older readers)

### 5. Accessibility requirements
- All images MUST have descriptive `alt` text
- All interactive elements MUST have visible focus states (`focus-visible:outline-2 focus-visible:outline-burgundy-700`)
- Color contrast MUST meet WCAG AA (4.5:1 text, 3:1 large text)
- All form inputs MUST have associated `<label>` elements
- Use semantic HTML: `<main>`, `<nav>`, `<section aria-label="...">`, `<footer>`, `<header>`
- `aria-current="page"` on active nav links

### 6. Component interfaces — Use these exact prop signatures

**BaseLayout.astro**
```ts
interface Props {
  title: string;          // Page title (do NOT include site name, it's appended in BaseLayout)
  description: string;    // Meta description (150-160 chars ideal)
  image?: string;         // OG image path (defaults to /images/og-default.jpg)
  canonicalUrl?: string;  // Canonical URL override
  noIndex?: boolean;      // Set true for pages like prayer-requests
  pageClass?: string;     // Extra class on <main>
}
```

**Button.astro**
```ts
interface Props {
  href?: string;          // If set, renders as <a>; otherwise <button>
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  [key: string]: any;     // Spread for aria-*, data-*, etc.
}
```

**SectionHeading.astro**
```ts
interface Props {
  label?: string;         // Small uppercase eyebrow label
  heading: string;        // Main heading text
  subheading?: string;    // Optional paragraph below heading
  centered?: boolean;     // Default false (left-aligned)
  light?: boolean;        // True when on dark backgrounds
  as?: 'h1'|'h2'|'h3';  // Default h2
}
```

### 7. Church facts — Use only these confirmed facts
- **Name**: Elko Baptist Church
- **Tagline**: "Where Everybody is Somebody in His Body!"
- **Pastor**: Wayne Holcomb (wife: Debbie Holcomb)
- **Founded**: 1891 (nine founding members)
- **Revitalized**: August 2014 by Pastor Wayne and Debbie Holcomb
- **Location**: Elko, Georgia 31025, Houston County
- **Address**: 112 Oak Street, Elko, GA 31025
- **Google Maps**: https://maps.app.goo.gl/PRmrZrpmdut3XkN4A
- **Phone**: None — the church does not have a phone number. Do not add `tel:` links or phone fields for the church.
- **Email**: elkobaptistchurch@gmail.com (confirmed)
- **YouTube**: https://www.youtube.com/c/ElkoBaptistChurch
- **Facebook**: https://www.facebook.com/ElkoBaptistChurchGA/
- **Service Times**:
  - Sunday Morning Worship: 11:00 AM
  - Children's Church: 11:30 AM (during worship)
  - No Sunday School or Wednesday Bible Study
- **No event calendar** — the church does not maintain an events calendar. Do not add an events feature, page, or preview section; only display the standing service times above.
- **Music style**: Acoustic worship (guitar, mandolin, piano)
- **Affiliation**: Southern Baptist Convention
- **Denomination**: Southern Baptist
- **Key messaging / taglines** — work these in where relevant, don't force all of them onto one page:
  - "Everybody is Somebody in His Body" (primary tagline — already in `siteConfig.tagline`)
  - "There is a freedom to worship here" (worship identity — About page Authentic Worship value, Worship & Music ministry)
  - "Whole Bible Believers — we believe in teaching the WHOLE Bible" (doctrinal distinctive — About page values)
  - Philippians 4:19 ("And my God will supply every need of yours according to his riches in glory in Christ Jesus.") — used on Prayer Requests page
  - "Whether you're part of our church family or visiting online, we're glad you're here!" (About page Spirit-Filled & Fruitful value, homepage Join Us Online section)
  - Spiritual fruit (Galatians 5:22-23) and desiring spiritual gifts (1 Corinthians 12:7-11) — About page "Spirit-Filled & Fruitful" value

### 8. Tone of voice
- Pastoral, warm, authentic — never corporate
- Biblically grounded but not preachy or exclusive
- Welcoming to first-time visitors and skeptics
- Celebrates heritage and community roots
- Speaks to rural/small-town Georgia culture honestly

### 9. Image handling
Real photos are not available yet. Use gradient placeholders:
```html
<div class="relative aspect-video bg-gradient-to-br from-burgundy-800 to-burgundy-950 overflow-hidden">
  <div class="absolute inset-0 opacity-10 bg-[url('/images/placeholder.svg')]"></div>
</div>
```
For `<img>` tags that need real photos, use descriptive `alt` and add `data-photo-needed="description of photo"` as a flag for the client.

### 10. Import paths
Always use `@/` alias for `src/` imports. Configured in `tsconfig.json`.
```ts
import { siteConfig } from '@/data/site';
import BaseLayout from '@/components/layout/BaseLayout.astro';
```

## Agent Scope Map
| Agent | Owns |
|-------|------|
| FOUNDATION | configs, styles, data files, utility components |
| LAYOUT | BaseLayout, Header, Footer, MobileNav, Button, SectionHeading, Card |
| HOMEPAGE | Hero, NewHere, ServiceTimes, Gospel, Ministries, Sermons, Events, Video, VisitCTA sections + index.astro |
| PAGES-A | about.astro, staff.astro, ministries.astro + MinistryCard, StaffCard |
| PAGES-B | sermons.astro, plan-your-visit.astro, SermonCard, SermonFilter |
| PAGES-C | contact.astro, prayer-requests.astro, 404.astro, EventCard |
| SEO | robots.txt, schema markup additions, sitemap config, OG images |
| DOCS | README.md, DEPLOYMENT.md, accessibility notes |
