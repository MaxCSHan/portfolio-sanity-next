# Personal Website System Design Document

## Project Overview

This document outlines the system design for a personal website that includes:
- Professional resume
- Project portfolio (web applications, data science demos)
- Photography galleries
- Blog posts with markdown support

The system will use Next.js with static generation for SEO optimization and cost efficiency, while leveraging Sanity.io as a headless CMS to manage content.

## 1. Technology Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (built on Tailwind)
- **Animation**: framer-motion (for subtle UI enhancements)
- **Rendering Strategy**: Static Site Generation (SSG) with incremental static regeneration

### Content Management
- **CMS**: Sanity.io (headless)
- **Content Format**: Primarily Markdown/MDX

### Infrastructure
- **Hosting**: Vercel (Free tier)
- **Media Storage**: Sanity's built-in asset pipeline or Firebase Storage
- **Domain**: Custom domain to be connected to Vercel deployment

## 2. Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Sanity CMS    │────▶│    Next.js      │────▶│    Vercel       │
│   (Content)     │     │  (Frontend)     │     │   (Hosting)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       ▲
        │                       │
        │                       │
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Content       │     │    Firebase     │
│   Creation      │     │    Storage      │
│                 │     │    (Optional)   │
└─────────────────┘     └─────────────────┘
```

## 3. Site Structure

### Pages
- **Home** (`/`) - Landing page with introduction and featured content
- **Resume** (`/resume`) - Professional experience and skills
- **Portfolio** (`/portfolio`) - Projects showcase
  - Project Detail (`/portfolio/[slug]`) - Individual project pages
- **Photography** (`/photography`) - Photo galleries
  - Gallery Detail (`/photography/[slug]`) - Individual galleries
- **Blog** (`/blog`) - Blog post listing with filters
  - Blog Post (`/blog/[slug]`) - Individual blog posts
- **About** (`/about`) - Personal information and contact details

### Components
- Navigation
- Footer
- Theme switcher (dark/light mode)
- Portfolio project card
- Blog post card
- Photography gallery grid
- Content renderer (for markdown/MDX)
- Code syntax highlighter
- LaTeX equation renderer
- Contact form

## 4. Content Management (Sanity.io)

### Content Types (Schemas)
1. **Portfolio Project**
   - Title
   - Slug
   - Description (rich text)
   - Featured image
   - Technologies used (array)
   - Project URL
   - GitHub URL
   - Content (rich text/MDX)
   - Featured (boolean)
   - Publication date

2. **Blog Post**
   - Title
   - Slug
   - Summary
   - Featured image
   - Content (rich text/MDX)
   - Categories (reference)
   - Tags (array)
   - Publication date
   - Featured (boolean)

3. **Photography Gallery**
   - Title
   - Slug
   - Description
   - Cover image
   - Images (array of assets with captions)
   - Categories (reference)
   - Publication date

4. **Resume Section**
   - Section type (education, experience, skills)
   - Title
   - Organization/Company
   - Location
   - Start date
   - End date
   - Description (rich text)
   - Order (for sorting)

### Sanity Studio Customization
- Custom rich text editor with markdown support
- Image upload interface
- Preview functionality
- Custom input components for specialized content

## 5. Frontend Implementation

### Next.js Configuration
- TypeScript setup
- File-based routing
- API routes for any dynamic functionality
- Static site generation with `getStaticProps` and `getStaticPaths`
- Image optimization with Next.js Image component
- SEO optimization with next-seo

### Content Rendering
- MDX integration for rendering markdown with React components
- Code blocks with syntax highlighting using Prism.js
- LaTeX rendering using KaTeX
- Image galleries with lightbox functionality

### Styling and UI
- TailwindCSS configuration
- Dark/light mode support
- Responsive design for all screen sizes
- Animation with framer-motion
- shadcn/ui components for consistent UI

### Data Fetching
- Sanity.io client integration
- GROQ queries for content fetching
- Static props and paths generation
- Incremental Static Regeneration for content updates

## 6. Third-Party Libraries

### Core Dependencies
- **Next.js** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **@sanity/client** - Sanity API client

### Content Rendering
- **next-mdx-remote** - MDX rendering
- **@sanity/block-content-to-react** - Sanity block content renderer
- **prismjs** - Code syntax highlighting
- **react-katex** - LaTeX rendering

### UI Components
- **shadcn/ui** - UI component library
- **framer-motion** - Animation library
- **react-photo-album** - Photo gallery grid
- **yet-another-react-lightbox** - Image lightbox
- **react-masonry-css** - Masonry layout for portfolio

### Utilities
- **next-themes** - Dark/light mode
- **next-seo** - SEO management
- **date-fns** - Date formatting

## 7. Deployment Strategy

### Vercel Setup
- GitHub integration for CI/CD
- Environment variable configuration
- Custom domain setup
- Preview deployments for PRs

### Build Process
- Static site generation at build time
- Content fetched from Sanity.io during build
- Assets optimized during build

### Performance Optimization
- Code splitting
- Lazy loading of components
- Image optimization
- Font optimization
- Bundle analysis

## 8. Implementation Plan

### Phase 1: Setup and Infrastructure
1. Initialize Next.js project with TypeScript and TailwindCSS
2. Set up Sanity.io project and schemas
3. Configure Vercel deployment
4. Establish repository and CI/CD pipeline

### Phase 2: Core Functionality
1. Create basic page layouts and navigation
2. Implement Sanity client and data fetching
3. Develop content rendering components (MDX, code blocks, LaTeX)
4. Create resume page structure

### Phase 3: Portfolio and Blog
1. Implement portfolio listing and detail pages
2. Develop blog listing and post pages
3. Create filtering and search functionality
4. Add code syntax highlighting and LaTeX rendering

### Phase 4: Photography and UI Polish
1. Implement photography galleries
2. Add lightbox functionality
3. Refine UI/UX across all pages
4. Implement dark/light mode

### Phase 5: Optimization and Launch
1. SEO optimization
2. Performance testing and optimization
3. Accessibility testing
4. Content population and final review
5. Launch and domain configuration

## 9. Future Enhancements

- Comment system for blog posts
- Newsletter subscription
- Analytics integration
- Search functionality
- Contact form with email notifications
- RSS feed
- Social media sharing
- Content recommendations

## 10. Resources and Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity.io Documentation](https://www.sanity.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)