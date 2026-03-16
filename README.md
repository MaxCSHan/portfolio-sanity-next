# Max's Portfolio — Next.js + Sanity CMS

> **Status: Work In Progress** — Core portfolio infrastructure is built and functional. Several features remain in active development.

A personal portfolio site for **SIH-HAN (Max) CHEN**, Software Engineer & Data Specialist. Built with Next.js 15 (App Router) for the frontend and Sanity Studio as the headless CMS, living in a monorepo with npm workspaces.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & How Things Connect](#architecture--how-things-connect)
- [Routes & Pages](#routes--pages)
- [Key Components & Files](#key-components--files)
- [Sanity CMS — How It Works](#sanity-cms--how-it-works)
- [Feature Status](#feature-status)
- [Getting Started (Local Dev)](#getting-started-local-dev)
- [Adding New Features with CMS](#adding-new-features-with-cms)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## Project Overview

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS, Lucide React |
| CMS | Sanity (`next-sanity`, `@sanity/client`) |
| Language | TypeScript 5.6 |
| Utilities | date-fns, Sonner (toasts), Vercel Speed Insights |
| Dev Tools | ESLint, npm workspaces, sanity typegen |

### Monorepo Structure

```
portfolio-sanity-next/          ← root (npm workspaces)
├── nextjs-app/                 ← Next.js 15 frontend (runs on :3000)
├── studio/                     ← Sanity Studio (runs on :3333)
├── PORTFOLIO_PRD.md            ← Product requirements doc
├── SANITY_DESIGN_PATTERNS.md   ← Developer guide for CMS patterns
└── package.json                ← Root workspace config
```

---

## Architecture & How Things Connect

```
┌──────────────────────────────────────────────────────────────────┐
│                         Sanity Cloud                             │
│  (Hosted dataset — stores all content: projects, posts, pages)   │
└───────────────────────────┬──────────────────────────────────────┘
                            │ GROQ queries via @sanity/client
              ┌─────────────┴──────────────┐
              │                            │
     ┌────────▼────────┐          ┌────────▼────────┐
     │   Next.js App   │          │  Sanity Studio  │
     │  nextjs-app/    │          │    studio/      │
     │  (localhost:3000)│          │  (localhost:3333)│
     └────────┬────────┘          └─────────────────┘
              │
    ┌─────────▼──────────┐
    │  sanity/lib/        │
    │  ├── client.ts      │  ← Sanity client instance
    │  ├── live.ts        │  ← Live Content API + Draft Mode
    │  ├── queries.ts     │  ← All GROQ queries
    │  └── utils.ts       │  ← Image URL builder
    └─────────┬──────────┘
              │  sanityFetch()
    ┌─────────▼──────────┐
    │  Next.js Pages      │  ← Server Components fetch data at request time
    │  (app/...)          │     or build time (static generation)
    └────────────────────┘
```

### Data Flow

1. **Content authoring**: Editors create/edit content in Sanity Studio (`localhost:3333`)
2. **Data storage**: Content is saved to Sanity's hosted cloud dataset
3. **Data fetching**: Next.js pages call `sanityFetch()` with GROQ queries — these are typed against `sanity.types.ts`
4. **Live updates**: `<SanityLive>` in the root layout keeps pages updated in real time without reloading
5. **Draft mode**: When enabled, `sanityFetch` fetches draft content — toggled via `/api/draft-mode/enable`
6. **Visual Editing**: With Draft Mode on, `<VisualEditing>` overlays click-to-edit overlays on rendered pages

### TypeScript Types

Types are **auto-generated** from Sanity schemas. Run `npm run typegen` inside `nextjs-app/` after any schema change. Types live in `nextjs-app/sanity.types.ts` and are imported directly:

```typescript
import { PortfolioProject, PortfolioProjectsQueryResult } from "@/sanity.types";
```

---

## Routes & Pages

### Implemented

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — hero, about, featured projects (placeholder), blog preview, contact CTA |
| `/portfolio` | `app/portfolio/page.tsx` | Portfolio grid with filtering, search, pagination |
| `/portfolio/[slug]` | `app/portfolio/[slug]/page.tsx` | Individual project detail page |
| `/posts` | `app/posts/page.tsx` | Blog post listing |
| `/posts/[slug]` | `app/posts/[slug]/page.tsx` | Individual blog post |
| `/resume` | `app/resume/page.tsx` | Interactive resume (static data, print/PDF capable) |
| `/[slug]` | `app/[slug]/page.tsx` | Dynamic pages managed in Sanity CMS |
| `/portfolio/demo` | `app/portfolio/demo/page.tsx` | Dev demo/testing page |
| `/api/draft-mode/enable` | `app/api/draft-mode/enable/route.ts` | Enables Sanity draft mode |

### Linked But Not Yet Built

These routes are referenced in the header and homepage but have no route handlers yet:

| Route | Where Referenced |
|---|---|
| `/about` | Header nav, homepage "Learn more" |
| `/photography` | Header nav, homepage photography section |
| `/contact` | Header nav, homepage CTA |

---

## Key Components & Files

### Portfolio Feature (`app/portfolio/`)

```
app/portfolio/
├── page.tsx                    ← Server component: fetches data, passes to client grid
├── [slug]/
│   └── page.tsx                ← Server component: project detail page
├── components/
│   ├── PortfolioGrid.tsx       ← Client: layout toggle (masonry/grid), pagination
│   ├── FilterSidebar.tsx       ← Client: search, category, technology, featured filters
│   ├── ProjectCard.tsx         ← Renders a single project card with category-specific styling
│   ├── MasonryGrid.tsx         ← CSS columns-based masonry with IntersectionObserver lazy loading
│   └── MasonryGridSkeleton.tsx ← Loading skeleton for the grid
└── hooks/
    ├── usePortfolioFilters.ts  ← URL-synced filter state management with 500ms search debounce
    ├── useResponsiveColumns.ts ← Returns column count based on current breakpoint
    ├── useIntersectionObserver.ts
    └── useMasonryPerformance.ts
```

**How the portfolio page works:**

1. `portfolio/page.tsx` reads `searchParams` (category, search, featured, technologies, page) from the URL
2. Fires 4 parallel `sanityFetch` calls: projects, category counts, total count, available technologies
3. Passes results as props to `<FilterSidebar>` and `<PortfolioGrid>`
4. `FilterSidebar` uses `usePortfolioFilters` hook which manages filter state purely via URL params — changing a filter does `router.push()` with updated params, causing the server component to re-render with new data
5. `PortfolioGrid` offers a toggle between CSS columns masonry layout and a uniform grid layout

### Shared Components (`app/components/`)

| Component | Purpose |
|---|---|
| `Header.tsx` | Fixed top nav with logo, nav links, Resume + Contact CTA buttons |
| `Footer.tsx` | Site footer |
| `CoverImage.tsx` | Sanity image rendered via `next/image` with proper sizing |
| `PortableText.tsx` | Renders Sanity `blockContent` rich text |
| `Date.tsx` | Consistent date formatting with `date-fns` |
| `DraftModeToast.tsx` | Toast notification shown when draft mode is active |
| `BlockRenderer.tsx` | Handles page builder block types |
| `PageBuilder.tsx` | Renders pages built with Sanity page builder |

### Sanity Client (`nextjs-app/sanity/`)

```
sanity/
├── lib/
│   ├── client.ts    ← createClient() with projectId, dataset, apiVersion
│   ├── live.ts      ← sanityFetch() + <SanityLive> component (Live Content API)
│   ├── queries.ts   ← All GROQ queries (portfolio, posts, pages, settings)
│   ├── utils.ts     ← urlForImage(), resolveOpenGraphImage()
│   └── demo.ts      ← Fallback demo content when no Sanity content exists
└── sanity-typegen.json ← Config for type generation
```

---

## Sanity CMS — How It Works

### Studio Access

- **Local**: `http://localhost:3333`
- Log in with the same Google/GitHub account used for the Sanity CLI

### Studio Structure

The studio sidebar is organized as:

```
Website Content
├── Portfolio
│   ├── Portfolio Projects   ← portfolioProject documents
│   ├── Technologies         ← technology reference documents
│   └── Project Categories   ← projectCategory documents
├── Content
│   ├── Pages               ← page documents (page builder)
│   ├── Blog Posts          ← post documents
│   └── People              ← person documents (authors)
└── Site Settings           ← settings singleton (title, OG image, etc.)
```

### Document Types

#### `portfolioProject` — The main portfolio content type

Fields organized into tabs in the Studio:

| Tab | Fields |
|---|---|
| **Content** | title, slug (auto-generated), short description (≤200 chars), full description (rich text) |
| **Media** | Hero media object: type (image/video/gallery) + the media itself; additional project gallery |
| **Technical Details** | Conditional fields based on category — see below |
| **Metadata** | category, featured flag, tags, completion date, client, project status |
| **SEO** | Custom SEO title (≤60), SEO description (≤160) |

**Category-specific technical fields:**

| Category | Fields Available |
|---|---|
| `coding` | Technologies (refs to `technology` docs), GitHub URL, Live Demo URL, code snippet |
| `photography` | Camera model, lens, settings, location, shoot date, photo subcategory |
| `data` | Data tools (tags), dataset info, methodology |
| `creative` / `animation` / `design` | Creative tools (tags), project duration |

**Project Status options:** `completed`, `in-progress`, `on-hold`, `archived`

**Studio preview:** Shows status emoji (✅/🚧/⏸️/📦), featured star (⭐), and category label

#### `technology` — Referenced by coding projects

Fields: name, category (Frontend/Backend/Database/DevOps/Design), hex color, icon image

#### `projectCategory` — Custom category management

Fields: name, slug, description, accent color, icon name

#### `post` — Blog posts

Fields: title, slug, excerpt, coverImage, content (blockContent), date, author (→ person)

#### `page` — CMS-managed pages (page builder)

Fields: name, slug, heading, subheading, pageBuilder array (callToAction, infoSection blocks)

#### `settings` (singleton) — Global site settings

Title, description, OG image used in `layout.tsx` for global metadata

### GROQ Queries Reference

All queries live in `nextjs-app/sanity/lib/queries.ts`.

**Portfolio queries:**

| Export | Purpose |
|---|---|
| `portfolioProjectsQuery` | Paginated + filtered list — accepts `$offset`, `$limit`, `$category`, `$search`, `$featured`, `$technologies` |
| `portfolioProjectQuery` | Single project by slug with full details + related projects |
| `featuredPortfolioProjectsQuery` | Up to 6 featured projects (for homepage) |
| `portfolioCategoryCountsQuery` | Returns count per category + total (for filter sidebar badges) |
| `portfolioTechnologiesQuery` | All technology docs with `projectCount` (for filter sidebar) |
| `totalPortfolioProjectsCountQuery` | Count matching current filters (for pagination) |
| `portfolioProjectSlugs` | All slugs (for `generateStaticParams`) |

### Important Rules When Creating New CMS Features

1. **Schema first** → Add schema in `studio/src/schemaTypes/documents/`
2. **Register it** → Add to `studio/src/schemaTypes/index.ts`
3. **Run typegen** → `cd nextjs-app && npm run typegen` to regenerate `sanity.types.ts`
4. **Add to studio structure** → Update `studio/src/structure/index.ts` if you want it in the sidebar
5. **Write GROQ queries** → Add to `nextjs-app/sanity/lib/queries.ts` using `defineQuery()`
6. **Use `sanityFetch()`** → Never call the Sanity client directly in components; always go through `sanityFetch` so Live Content API works
7. **Never skip `stega: false`** → Metadata requests (used in `generateMetadata`) must pass `stega: false` to prevent encoded data leaking into meta tags
8. **Images** → Use `<CoverImage>` or `urlForImage()` from `sanity/lib/utils.ts`, never hardcode image URLs
9. **Add `generateStaticParams`** → For detail pages (`[slug]`), add this function to pre-render routes at build time

---

## Feature Status

### Done ✅

- **Sanity schema** — `portfolioProject`, `technology`, `projectCategory` schemas with full field sets, validation, and studio previews
- **GROQ queries** — Complete query set with filtering, pagination, aggregations, and related projects
- **Portfolio listing page** (`/portfolio`) — Server-fetched with URL-based filter state
- **FilterSidebar** — Category filter, technology multi-select, featured toggle, text search with 500ms debounce, active filter chips, clear all
- **Project card** — Category badges, tech stack display, featured/status indicators, hover overlay with GitHub/live links for coding projects
- **Masonry grid** — CSS columns layout with responsive breakpoints, IntersectionObserver lazy loading, stagger animation on reveal
- **Grid toggle** — Switch between masonry and uniform grid layouts
- **Pagination** — URL-based pagination (12 per page), preserves active filters
- **Project detail page** (`/portfolio/[slug]`) — Hero media, rich text description, technical details sidebar (category-specific), tags, related projects section, back navigation, Open Graph metadata
- **Resume page** — Static resume with print/save-as-PDF capability via `window.print()`
- **Blog posts** — Listing and detail pages reading from Sanity
- **Draft mode & Visual Editing** — Full Sanity draft mode pipeline with `<SanityLive>` and `<VisualEditing>`
- **Sanity Studio structure** — Custom sidebar organizing portfolio, content, and settings
- **Homepage** — Layout, hero section, about section, skill badges, language cards — built out but project cards are still placeholder data (not connected to Sanity)
- **Header** — Fixed top nav with all primary nav links
- **Seed script** — `npm run seed-portfolio` in `nextjs-app/` for adding demo data

### In Progress / Partially Done 🚧

- **Project detail page** — Basic structure exists; missing lightbox gallery, video player, full-screen modal system, social sharing
- **Homepage featured projects** — Section exists with placeholder cards; `FeaturedProjects` async component imported but commented out (needs `featuredPortfolioProjectsQuery` integration)
- **Presentation tool** — Studio configured but `resolveHref` only handles `post` and `page` types, not `portfolioProject`

### To-Do 📋

From the implementation roadmap (`.kiro/specs/portfolio-showcase/tasks.md`):

| # | Feature | Notes |
|---|---|---|
| 7 | Full project detail modal/lightbox | Lightbox for galleries, video player, social sharing |
| 8 | Media optimization | `OptimizedProjectImage` with blur-to-sharp, video autoplay |
| 9 | Hover effects & animations | Category-specific overlays, staggered animations |
| 10 | Homepage portfolio integration | Replace placeholder cards with live Sanity data |
| 11 | SEO — structured data & sitemap | Portfolio projects in sitemap, JSON-LD markup |
| 12 | Analytics tracking | GA events for project views, filter usage, external links |
| 13 | Error handling | Error boundaries, retry mechanisms, offline states |
| 14 | Performance & caching | ISR strategies, code splitting, prefetching |
| 15 | Mobile interactions | Touch targets, swipe gestures, collapsible mobile filters |
| 16 | Test suite | Unit tests for components/hooks, integration + E2E tests |

### Missing Pages (Linked but Not Built)

| Page | Status |
|---|---|
| `/about` | Not created |
| `/photography` | Not created |
| `/contact` | Not created |
| `/blog/[slug]` (homepage links) | Route exists at `/posts/[slug]`, homepage links point to wrong path |

---

## Getting Started (Local Dev)

### Prerequisites

- Node.js 18+
- A Sanity account (free tier works)
- The Sanity project ID and a read token (ask Max or create your own project)

### 1. Install dependencies

```bash
# From the repo root
npm install
```

### 2. Set up environment variables

```bash
cp nextjs-app/.env.example nextjs-app/.env.local
```

Edit `nextjs-app/.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-28"
NEXT_PUBLIC_SANITY_STUDIO_URL="http://localhost:3333"
SANITY_API_READ_TOKEN="your-read-token"
```

Get these values from [Sanity Manage](https://www.sanity.io/manage) → your project → API tab.

Also set up the Studio environment:

```bash
# studio/.env already exists — verify it has:
# SANITY_STUDIO_PROJECT_ID=your-project-id
# SANITY_STUDIO_DATASET=production
```

### 3. Start development servers

```bash
# From root — starts both Next.js (:3000) and Studio (:3333) concurrently
npm run dev

# Or run individually:
npm run dev:next    # Next.js only
npm run dev:studio  # Studio only
```

### 4. Import sample data (optional)

```bash
npm run import-sample-data
```

This imports `studio/sample-data.tar.gz` into your Sanity dataset.

### 5. Seed portfolio demo data (optional)

```bash
cd nextjs-app
npm run seed-portfolio
```

### 6. Regenerate TypeScript types after schema changes

```bash
cd nextjs-app
npm run typegen
# or: npx sanity typegen generate
```

This regenerates `sanity.types.ts` from your current Sanity schema. Always run this after modifying any schema in `studio/src/schemaTypes/`.

---

## Adding New Features with CMS

Follow this workflow for any new CMS-backed content type. See `SANITY_DESIGN_PATTERNS.md` for detailed examples.

### Step 1 — Define the schema

Create `studio/src/schemaTypes/documents/myFeature.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const myFeature = defineType({
  name: 'myFeature',
  title: 'My Feature',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    // ...more fields
  ],
})
```

### Step 2 — Register the schema

In `studio/src/schemaTypes/index.ts`:

```typescript
import { myFeature } from './documents/myFeature'
export const schemaTypes = [...existing, myFeature]
```

### Step 3 — Add to Studio sidebar (optional)

In `studio/src/structure/index.ts`, add a list item inside the relevant section.

### Step 4 — Regenerate types

```bash
cd nextjs-app && npm run typegen
```

### Step 5 — Write GROQ queries

In `nextjs-app/sanity/lib/queries.ts`:

```typescript
export const myFeatureQuery = defineQuery(`
  *[_type == "myFeature" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    // ...select only fields you need
  }
`)
```

### Step 6 — Fetch in a Server Component

```typescript
import { sanityFetch } from "@/sanity/lib/live"
import { myFeatureQuery } from "@/sanity/lib/queries"

export default async function MyPage() {
  const { data } = await sanityFetch({ query: myFeatureQuery })
  return <MyComponent items={data} />
}
```

### Step 7 — For detail pages, add static params

```typescript
// app/my-feature/[slug]/page.tsx
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: myFeatureSlugsQuery,
    perspective: "published",
    stega: false,
  })
  return data || []
}
```

### Key Gotchas

- **Always** use `sanityFetch` (not the raw client) so Live Content API and Draft Mode work
- **Images**: Use `<CoverImage image={doc.image} />` or `urlForImage(doc.image).width(800).url()`
- **Rich text**: Use `<PortableText value={doc.content} />`
- **Metadata functions**: Pass `stega: false` to avoid encoded data in `<meta>` tags
- **Technology references in portfolio**: Technologies are Sanity `reference` types — the GROQ query dereferences them with `technologies[]->{ name, color, icon }`

---

## Deployment

### Next.js App → Vercel

The project is already linked to a Vercel project. To redeploy:

```bash
# From repo root or nextjs-app/
vercel --prod --yes
```

The `vercel.json` overrides the build command to `next build` (skipping `typegen`, which needs the studio files and can't run on Vercel's build machines). Types are committed to the repo via `sanity.types.ts`.

#### First-time setup (new machine or new Vercel project)

1. Install the Vercel CLI: `npm i -g vercel`
2. Log in: `vercel login`
3. Link the project: `cd nextjs-app && vercel link --yes --project maxcsh`
4. Add all environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
   vercel env add NEXT_PUBLIC_SANITY_DATASET production
   vercel env add NEXT_PUBLIC_SANITY_API_VERSION production
   vercel env add SANITY_API_READ_TOKEN production
   ```
5. Deploy: `vercel --prod --yes`

### Sanity Studio → Sanity Hosting

```bash
cd studio
npx sanity deploy
```

This deploys the Studio to `https://your-project-name.sanity.studio`. After deploying, update the `CORS origins` in Sanity Manage to include your production domain.

### After Deployment — Update CORS

In [Sanity Manage](https://www.sanity.io/manage) → your project → API → CORS origins:
- Add your production Next.js URL (e.g. `https://maxcsh.vercel.app`)
- Add your deployed Studio URL

### Current Deployment

| | URL |
|---|---|
| **Production** | https://maxcsh.vercel.app |
| **Vercel Project** | `maxcsh` (`prj_Y1v4UNzK4XBVHO5dfbmLyALC23RX`) |
| **Vercel Team** | `maxcshans-projects` |

Inspect deployments and logs:

```bash
vercel inspect maxcsh.vercel.app --logs
```

---

## Environment Variables

### `nextjs-app/.env.local`

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional | API version date, default `2024-10-28` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Optional | Studio URL, default `http://localhost:3333` |
| `SANITY_API_READ_TOKEN` | ✅ | Server-side read token for draft mode and private queries |

### `studio/.env`

| Variable | Description |
|---|---|
| `SANITY_STUDIO_PROJECT_ID` | Same project ID as above |
| `SANITY_STUDIO_DATASET` | Same dataset as above |
| `SANITY_STUDIO_PREVIEW_URL` | Next.js URL for presentation tool preview (default: `http://localhost:3000`) |

---

## Additional Docs

- `PORTFOLIO_PRD.md` — Full product requirements: personas, UX specs, interaction designs, data schemas, and implementation roadmap
- `SANITY_DESIGN_PATTERNS.md` — Developer reference: data fetching patterns, GROQ examples, component architecture, pagination, image optimization
- `nextjs-app/MASONRY_IMPLEMENTATION.md` — Technical notes on the masonry grid implementation
- `.kiro/specs/portfolio-showcase/tasks.md` — Tracked implementation tasks with completion status
