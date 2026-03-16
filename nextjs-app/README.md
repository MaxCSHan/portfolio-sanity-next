# MaxCSH Portfolio — Next.js App

Personal portfolio for **SIH-HAN (Max) CHEN**, built with Next.js 15 App Router and Sanity CMS.

## Stack

- **Next.js 15** (App Router, React Server Components)
- **Sanity CMS** (live content, GROQ queries)
- **Tailwind CSS** — extended with Neo Brutalism design tokens
- **Fonts:** Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels/code)

## Design System — Neo Brutalism

The site uses a Neo Brutalism visual language: bold flat colors, hard offset drop shadows, thick black borders, near-zero border radius, and Bricolage Grotesque for display type.

### Color Tokens

| Token | Value | Use |
|---|---|---|
| `--nb-black` | `#0D0D0D` | Borders, hard shadows, body text |
| `--nb-bg` | `#F2EFE9` | Warm off-white page background |
| `--nb-white` | `#FFFFFF` | Card surfaces, reading columns |
| `--nb-yellow` | `#FFE500` | Primary CTA, active states, hover accents |
| `--nb-red` | `#FF3B00` | Secondary accent, tags, destructive actions |
| `--nb-green` | `#00E87A` | Coding/tech category accent |
| `--nb-blue` | `#0062FF` | Data category accent |

### Shadow & Border

```css
.nb-shadow    { box-shadow: 4px 4px 0px #0D0D0D; }
.nb-shadow-sm { box-shadow: 2px 2px 0px #0D0D0D; }
.nb-shadow-y  { box-shadow: 4px 4px 0px #FFE500; }
.nb-border    { border: 2px solid #0D0D0D; }
```

Hover press effect: `translate(2px, 2px)` + reduce shadow to `nb-shadow-sm`.

### Reading Exception

Blog post bodies (`/posts/[slug]`) use a white reading column (`bg-white`) with clean `prose-lg` typography — no thick borders inside the prose. The page "furniture" (masthead, more-posts section) returns to the NB frame.

### Photography Exception

`/photography` and its sub-routes stay clean and gallery-like (white backgrounds, no yellow/black accents on photo cells). Only structural elements (page title, section labels, back links) adopt the NB typography system.

## Dev

```bash
# Root — starts Next.js (:3000) + Sanity Studio (:3333) concurrently
npm run dev

# Regenerate TypeScript types after schema changes
cd nextjs-app && npm run typegen

# Seed demo portfolio data
cd nextjs-app && npm run seed-portfolio
```

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured projects, blog teaser, photography grid |
| `/portfolio` | Filterable project grid (category, tech, search, featured) |
| `/portfolio/[slug]` | Project detail — hero, description, sidebar info boxes |
| `/posts` | Blog post listing with pagination |
| `/posts/[slug]` | Article — NB masthead + white reading column |
| `/photography` | Photo gallery — series + post grid |
| `/photography/[slug]` | Photo post viewer with sidebar meta |
| `/photography/album/[tag]` | Tag-filtered photo album |
| `/about` | Personal narrative, focus areas, certifications, languages |
| `/resume` | Resume — dark NB hero + content cards (print-safe) |
