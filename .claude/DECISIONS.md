# Architecture & Design Decisions

## Framework
**Decision**: Astro 5 (static output)
**Rationale**: Best static site performance, component-island architecture, zero JS by default, excellent build times. Cloudflare Pages deploys Astro static builds natively.
**Alternative considered**: Next.js static export — rejected due to heavier JS bundle overhead for a mostly-content site.

## CSS Framework
**Decision**: Tailwind CSS v4 via `@tailwindcss/vite`
**Rationale**: v4 is the current standard as of 2025-2026. CSS-native config is cleaner. Better performance than v3 PostCSS pipeline.
**Config location**: `src/styles/global.css` — `@theme {}` block defines all design tokens.
**Note**: No `tailwind.config.js` file exists — this is intentional for v4.

## Typography
**Decision**: Playfair Display (display/headings) + Inter (body)
**Rationale**:
- Playfair Display: Elegant serif with historical character — matches the church's 1891 heritage and pastoral warmth. Distinct from generic system fonts without feeling corporate.
- Inter: Maximum readability at all sizes. Critical for older congregation members. Excellent rendering on all screens.
**Loading**: Google Fonts via `<link rel="preconnect">` + `<link rel="stylesheet">` in BaseLayout head.

## Color Palette
**Decision**: Burgundy primary + cream-gold accent on cream/parchment backgrounds
**Rationale**:
- Burgundy: Rich, reverent, timeless — reads as warm and welcoming without feeling corporate or trendy.
- Cream gold: Adds warmth and a touch of celebration without tipping into "bright amber" territory.
- Cream/parchment backgrounds: Softer than white, easier on eyes, warmer feeling.
- Avoids: Blues (too corporate/cold), purples (too contemporary megachurch), bright reds (anxiety-inducing).

**History**:
- Originally launched with a pine green primary (`pine-*` tokens).
- Client feedback requested an all-earthy brown/tan palette instead, so `pine-*` was replaced with `umber-*` (brown/tan scale).
- **2026-06-14 — Burgundy & Cream Gold rebrand**: After reviewing 30 alternate palettes (10 lighter-brown variations plus 20 non-earth-tone options spanning blues, greens, black/white, teals, purples, and burgundy/red families), the team selected "Burgundy & Cream Gold." The `umber-*` scale was renamed to `burgundy-*` (new wine-red hex values, e.g. burgundy-900 `#5C1F2E`, burgundy-950 `#3C141E`) — renamed, not just re-valued, to keep the design system self-documenting. The `wheat-*` token name was kept, but its hex values were updated in place to a softer champagne "cream gold" (wheat-500 `#D9B96C`) — since Tailwind v4 generates utilities from CSS variables, this value-only change applied everywhere with zero file edits. Overlay/shadow `rgba()` values (`.photo-overlay`, `.card-lift:hover`) were updated from umber-950 `rgb(42, 27, 15)` to burgundy-950 `rgb(60, 20, 30)`. The favicon, both logo SVGs, and `themeColor` in `site.ts` were recolored to match. Cream/parchment neutrals were unaffected.

## Image Strategy
**Decision**: Gradient placeholders with `data-photo-needed` attributes
**Rationale**: No real church photos available. Placeholders maintain layout integrity and clearly flag what photos are needed for the client.
**For production**: Client should provide high-quality photography. Images go in `public/images/`.

## SEO Architecture
**Decision**: JSON-LD schema in each page, OpenGraph tags, sitemap via @astrojs/sitemap
**Schema types used**:
- `Organization` (global, in BaseLayout)
- `LocalBusiness` / `Church` (homepage and contact)
- `BreadcrumbList` (all inner pages)
- `Event` (events page)
- `WebPage` (all pages)
**Local SEO targets**: Elko GA, Perry GA, Warner Robins GA, Houston County Georgia

## Navigation Structure
**Decision**: 8 pages with mobile hamburger nav
```
Home → About → Ministries → Sermons → Plan Your Visit → Staff → Contact → Prayer Requests
```
**CTA prominence**: "Plan Your Visit" is styled as a button in the nav to stand out.

## Form Handling
**Decision**: Static forms pointing to Netlify Forms compatible syntax, or external form service
**Rationale**: Static site cannot process forms natively. Options for client:
1. Use Cloudflare Pages Functions for serverless form handler
2. Use Formspree or similar embedded service
3. Use mailto: fallback (implemented as fallback)
**Implementation**: Contact and Prayer Request forms use `action` pointing to a Cloudflare Function path, with a static fallback.

## Performance Strategy
- Zero client-side JS by default (Astro static)
- Only tiny vanilla JS for mobile nav toggle (< 500 bytes)
- Google Fonts loaded with `display=swap` and `preconnect`
- Images: `loading="lazy"` on below-fold images, `loading="eager"` on hero
- No JavaScript frameworks in components
- Inline critical CSS via Astro's built-in CSS optimization

## Accessibility Strategy
- WCAG 2.1 AA target
- Semantic HTML structure (header, main, nav, section, footer)
- Focus visible states on all interactive elements
- Skip-to-content link
- Screen reader text via `sr-only` for icon-only buttons
- Font size: minimum 18px body text, 16px minimum for any text
- Color contrast: all text meets 4.5:1 ratio
- Reduced motion: `@media (prefers-reduced-motion: reduce)` on animations

## Deployment
**Decision**: Cloudflare Pages
**Build command**: `npm run build`
**Output directory**: `dist/`
**Node version**: 20+
**No server-side functions needed** for core site (static). Forms can use Cloudflare Pages Functions if needed.
