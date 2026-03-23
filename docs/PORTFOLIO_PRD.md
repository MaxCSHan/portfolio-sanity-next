# Portfolio Entity - Product Requirements Document

## Executive Summary

### Vision Statement
Create a sophisticated, interactive portfolio showcase that distinguishes professional projects from blog content, featuring dynamic presentations tailored to different project types (coding, photography, creative content, data analysis, animations) with professional aesthetics and engaging user experiences.

### Product Goals
- **Differentiation**: Clear distinction between portfolio projects and blog posts
- **Versatility**: Support multiple content types with appropriate presentations
- **Engagement**: Interactive features that showcase project quality and depth
- **Professional Branding**: Maintain sophisticated, modern design language
- **Discoverability**: Enhanced filtering, categorization, and search capabilities

---

## Problem Statement

### Current State
- Homepage has placeholder project cards with static content
- Links to `/portfolio` route that doesn't exist
- No dedicated portfolio entity in Sanity CMS
- Blog posts are the only content type for showcasing work
- Limited ability to showcase visual projects (photography, animations, etc.)

### User Pain Points
1. **Visitors** cannot easily distinguish between blog content and professional work
2. **Hiring managers** lack quick access to relevant project types
3. **Photography enthusiasts** cannot view high-quality visual content with appropriate presentation
4. **Technical evaluators** need code repositories, live demos, and technical details
5. **Content creator** (you) cannot effectively categorize and present diverse work types

---

## Target Users

### Primary Personas

#### 1. **Technical Recruiter/Hiring Manager**
- **Goals**: Quickly assess technical capabilities, see live projects, understand tech stack expertise
- **Behaviors**: Scans for relevant technologies, looks for GitHub links, wants to see production-quality work
- **Pain Points**: Information overload, unclear project relevance, missing technical details

#### 2. **Potential Client/Collaborator**
- **Goals**: Understand work quality, see design aesthetics, assess project scope capabilities
- **Behaviors**: Browses visually, reads case studies, looks for similar project experience
- **Pain Points**: Difficulty finding relevant work examples, unclear project outcomes

#### 3. **Photography Enthusiast/Potential Client**
- **Goals**: View high-quality images, understand photography style, see technical proficiency
- **Behaviors**: Expects gallery-style viewing, full-screen capabilities, EXIF data interest
- **Pain Points**: Poor image presentation, slow loading, limited viewing options

#### 4. **Fellow Developer/Designer**
- **Goals**: Understand implementation approaches, see code quality, learn from techniques
- **Behaviors**: Deep dives into technical details, explores GitHub repositories, analyzes design patterns
- **Pain Points**: Lack of technical documentation, missing implementation insights

---

## Product Requirements

### Functional Requirements

#### Core Features

##### 1. **Multi-Type Project Support**
- Support 5+ project categories: Coding, Photography, Creative Content, Data Analysis, Animation, Design
- Category-specific metadata and presentation templates
- Flexible content blocks for different media types
- Tag-based classification for cross-category filtering

##### 2. **Interactive Project Cards**
- **Coding Projects**: Live preview on hover, tech stack badges, GitHub integration
- **Photography**: Lightbox galleries, EXIF data overlay, category filtering
- **Creative Content**: Video autoplay on hover, thumbnail grids, interactive previews
- **Data Analysis**: Chart previews, dataset information, methodology snippets
- **Animation**: GIF/video previews, performance metrics, tool information

##### 3. **Advanced Filtering & Search**
- Multi-select category filters
- Technology stack filtering
- Date range selection
- Text search across titles, descriptions, and tags
- "Featured" vs "All" project views
- Sort by: Date, Category, Popularity, Complexity

##### 4. **Dynamic Layout System**
- Masonry grid for mixed content types
- Full-screen detail modals
- Responsive breakpoints optimized for each content type
- Lazy loading with progressive image enhancement

##### 5. **Interactive Elements**
- Hover effects revealing additional information
- Click-to-expand galleries
- Inline video/animation players
- Quick-action buttons (Live Demo, GitHub, Case Study)
- Social sharing capabilities

#### Enhanced Features

##### 1. **Portfolio Analytics**
- View tracking per project
- Popular technology identification
- Engagement metrics for optimization
- Client/recruiter behavior insights

##### 2. **Content Management**
- Bulk import capabilities
- Version control for project updates
- Publication scheduling
- SEO optimization tools

##### 3. **Integration Capabilities**
- GitHub API integration for live repository data
- Behance/Dribbble import options
- Google Analytics event tracking
- Social media auto-posting

---

## User Experience Design

### Information Architecture

```
Portfolio
├── Landing/Grid View
│   ├── Filter Sidebar
│   ├── Search Bar
│   ├── Sort Controls
│   └── Project Grid (Masonry)
├── Project Detail Modal/Page
│   ├── Hero Media Section
│   ├── Project Information
│   ├── Technical Details
│   ├── Process Documentation
│   └── Related Projects
└── Category Views
    ├── Coding Projects
    ├── Photography Gallery
    ├── Creative Showcase
    ├── Data Visualizations
    └── Animation Demos
```

### UI/UX Design Specifications

#### Visual Design Language — Neo Brutalism

The portfolio uses a **Neo Brutalism** design system, replacing the original indigo/amber gradient SaaS aesthetic. The goal: a "tech hipster" identity that signals both engineering depth and visual design sensibility.

##### Design Principles
- **Bold flat colors** — no gradients, no frosted glass
- **Hard offset drop shadows** — `box-shadow: 4px 4px 0px #0D0D0D` (no blur radius)
- **Thick black borders** — `border: 2px solid #0D0D0D`
- **Near-zero border radius** — `rounded-none` everywhere except photography
- **Display typeface** — Bricolage Grotesque for all headings (variable weight, strong at heavy weights)
- **Press hover effect** — `translate(2px, 2px)` + shadow reduction instead of float/lift

##### Color Tokens

```css
--nb-black:  #0D0D0D;  /* Borders, hard shadows, body text */
--nb-bg:     #F2EFE9;  /* Warm off-white page background */
--nb-white:  #FFFFFF;  /* Card surfaces, reading columns */
--nb-yellow: #FFE500;  /* Primary CTA, active states, hover accents */
--nb-red:    #FF3B00;  /* Secondary accent, error/destructive states */
--nb-green:  #00E87A;  /* Coding/tech category accent */
--nb-blue:   #0062FF;  /* Data category accent */
```

##### Category Badge Colors

| Category | Background | Text |
|---|---|---|
| coding | `#00E87A` | `#0D0D0D` |
| photography | `#FFE500` | `#0D0D0D` |
| data | `#0062FF` | white |
| creative | `#FF3B00` | white |
| animation | `#0D0D0D` | white |
| design | `#F2EFE9` | `#0D0D0D` (+ border) |

##### Typography

- **Display:** Bricolage Grotesque (`font-bricolage font-black`) — h1/h2/section headings
- **Body:** Inter — prose, descriptions
- **Mono:** JetBrains Mono — labels, badges, slugs, dates, filter UI

##### Shadow & Border Utilities

```css
.nb-shadow    { box-shadow: 4px 4px 0px #0D0D0D; }
.nb-shadow-sm { box-shadow: 2px 2px 0px #0D0D0D; }
.nb-shadow-y  { box-shadow: 4px 4px 0px #FFE500; }
.nb-border    { border: 2px solid #0D0D0D; }
.nb-press:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px #0D0D0D; }
```

##### Component Specifications

###### 1. **Project Card**

```html
<article class="group bg-white border-2 border-[#0D0D0D] rounded-none
                shadow-[4px_4px_0px_#0D0D0D]
                hover:translate-x-[2px] hover:translate-y-[2px]
                hover:shadow-[2px_2px_0_#0D0D0D] transition-all duration-100">

  <!-- Media section -->
  <div class="aspect-video relative overflow-hidden">
    <!-- image/video -->
    <!-- Hover overlay: GitHub + Live Demo buttons in #FFE500 -->
  </div>

  <!-- Content section -->
  <div class="p-6">
    <!-- Category badge: rounded-none font-mono text-xs uppercase border border-[#0D0D0D] -->
    <span class="px-3 py-1 font-mono text-xs uppercase border border-[#0D0D0D] bg-[#00E87A]">
      Coding
    </span>

    <!-- Title hover: yellow underline decoration -->
    <h3 class="font-bold text-[#0D0D0D] group-hover:underline decoration-[#FFE500] underline-offset-2">
      Project Title
    </h3>

    <!-- Tech tags: rounded-none font-mono border border-[#0D0D0D] -->
    <span class="px-2 py-0.5 font-mono text-xs border border-[#0D0D0D] rounded-none">React</span>
  </div>
</article>
```

###### 2. **Filter Sidebar**

```html
<aside class="space-y-6">
  <!-- Labels: font-mono text-xs uppercase tracking-widest -->
  <h3 class="font-mono text-xs uppercase tracking-widest text-[#0D0D0D]">Categories</h3>

  <!-- Search input: border-2 focus:shadow-[2px_2px_0_#FFE500] -->
  <input class="border-2 border-[#0D0D0D] rounded-none focus:shadow-[2px_2px_0_#FFE500]" />

  <!-- Category buttons: toggle style, active = bg-[#FFE500] -->
  <button class="w-full border-2 border-[#0D0D0D] rounded-none
                 active:bg-[#FFE500]">
    Coding Projects
  </button>

  <!-- Clear all: border-2 border-[#FF3B00] text-[#FF3B00] hover:bg-[#FF3B00] hover:text-white -->
  <button class="border-2 border-[#FF3B00] text-[#FF3B00] rounded-none
                 hover:bg-[#FF3B00] hover:text-white">
    Clear all
  </button>
</aside>
```

###### 3. **Project Detail Page**

- Back link: `font-mono text-xs uppercase tracking-widest`
- Title: `font-bricolage font-black text-5xl lg:text-7xl`
- Hero image: `border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D]`
- Sidebar info boxes: each wrapped in `border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] bg-white p-5`

#### Section-Specific Design Exceptions

##### Blog Posts — Reading Experience

Blog articles use a **three-zone layout** to separate navigation from content:

1. **NB Masthead** (`bg-[#F2EFE9]`, `border-b-2 border-[#0D0D0D]`) — back link, Bricolage title, byline
2. **White reading column** (`bg-white`) — `prose-lg` typography, no thick borders inside prose. Blockquotes use `border-l-4 border-[#FFE500] bg-[#F2EFE9]`. Links use yellow underline decoration.
3. **NB "More Posts"** (`bg-[#F2EFE9]`, `border-t-2`) — visual bookend returning to the site frame

**Rationale:** Comfortable reading contrast requires white on `#F2EFE9`'s warm tone for long-form articles. The NB aesthetic frames the article without invading the reading experience.

##### Photography — Gallery-First

`/photography` and all sub-routes stay clean and white:
- White backgrounds on all photo cells and viewers
- No yellow accents, no thick black borders on images
- No dark panel backgrounds
- **Only structural NB elements:** page titles use Bricolage Grotesque, section labels use `font-mono uppercase tracking-widest`, back links match site-wide mono style
- Tag pills: `rounded-none border border-gray-300` — neutral, not bold NB

**Rationale:** Photos are the content. The UI should disappear.

#### Interactive Behaviors

##### 1. **Hover Effects (NB Press)**
- **Card Press**: `translate(2px, 2px)` + shadow reduction from `4px 4px` → `2px 2px`
- **No card lift** — translateY float is the old SaaS aesthetic; NB uses a physical "press" instead
- **Image Zoom**: `scale(1.03–1.05)` kept on photography cells only
- **Link hover**: Yellow underline decoration (`decoration-[#FFE500]`) or color shift to `#FF3B00`

##### 2. **Loading States**
- Skeleton placeholders use `bg-gray-200 animate-pulse` — keep neutral
- No rounded-full skeletons; match the rectangular NB card shapes

##### 3. **Mobile**
- Touch-friendly targets: minimum 44px
- Header: flat `bg-[#F2EFE9]` border-b (no backdrop-blur artifacts on scroll)
- Filter sidebar: collapsible on mobile

---

## Technical Specifications

### Data Schema Design

#### Portfolio Project Schema
```typescript
export const portfolioProject = defineType({
  name: 'portfolioProject',
  title: 'Portfolio Project',
  type: 'document',
  icon: BriefcaseIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'metadata', title: 'Metadata' },
    { name: 'technical', title: 'Technical Details' },
    { name: 'seo', title: 'SEO' }
  ],
  fields: [
    // Core Information
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: rule => rule.required().max(100)
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { title: 'Coding Project', value: 'coding' },
          { title: 'Photography', value: 'photography' },
          { title: 'Creative Content', value: 'creative' },
          { title: 'Data Analysis', value: 'data' },
          { title: 'Animation', value: 'animation' },
          { title: 'Design', value: 'design' }
        ]
      },
      validation: rule => rule.required()
    }),

    // Content
    defineField({
      name: 'shortDescription',
      type: 'text',
      group: 'content',
      description: 'Brief description for cards and previews',
      validation: rule => rule.required().max(200)
    }),
    defineField({
      name: 'description',
      type: 'blockContent',
      group: 'content',
      description: 'Detailed project description'
    }),

    // Media
    defineField({
      name: 'heroMedia',
      type: 'object',
      group: 'media',
      fields: [
        { name: 'type', type: 'string', options: { list: ['image', 'video', 'gallery'] } },
        { name: 'image', type: 'image', hidden: ({ parent }) => parent?.type !== 'image' },
        { name: 'video', type: 'file', hidden: ({ parent }) => parent?.type !== 'video' },
        { name: 'gallery', type: 'array', of: [{ type: 'image' }], hidden: ({ parent }) => parent?.type !== 'gallery' }
      ]
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'asset', type: 'image' },
            { name: 'caption', type: 'string' },
            { name: 'alt', type: 'string' }
          ]
        }
      ]
    }),

    // Technical Details (conditional based on category)
    defineField({
      name: 'technicalDetails',
      type: 'object',
      group: 'technical',
      fields: [
        // Coding projects
        {
          name: 'technologies',
          type: 'array',
          of: [{ type: 'string' }],
          hidden: ({ document }) => document?.category !== 'coding'
        },
        {
          name: 'githubUrl',
          type: 'url',
          hidden: ({ document }) => document?.category !== 'coding'
        },
        {
          name: 'liveUrl',
          type: 'url',
          hidden: ({ document }) => document?.category !== 'coding'
        },

        // Photography projects
        {
          name: 'cameraInfo',
          type: 'object',
          hidden: ({ document }) => document?.category !== 'photography',
          fields: [
            { name: 'camera', type: 'string' },
            { name: 'lens', type: 'string' },
            { name: 'settings', type: 'string' }
          ]
        },

        // Data projects
        {
          name: 'dataTools',
          type: 'array',
          of: [{ type: 'string' }],
          hidden: ({ document }) => document?.category !== 'data'
        },
        {
          name: 'datasetInfo',
          type: 'text',
          hidden: ({ document }) => document?.category !== 'data'
        }
      ]
    }),

    // Metadata
    defineField({
      name: 'featured',
      type: 'boolean',
      group: 'metadata',
      initialValue: false
    }),
    defineField({
      name: 'tags',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    defineField({
      name: 'completionDate',
      type: 'date',
      group: 'metadata'
    }),
    defineField({
      name: 'client',
      type: 'string',
      group: 'metadata'
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      type: 'string',
      group: 'seo',
      validation: rule => rule.max(60)
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      group: 'seo',
      validation: rule => rule.max(160)
    })
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'heroMedia.image',
      featured: 'featured'
    },
    prepare({ title, category, media, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: category?.toUpperCase(),
        media
      }
    }
  }
});
```

#### Supporting Schemas

```typescript
// Technology reference
export const technology = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'category', type: 'string', options: { list: ['Frontend', 'Backend', 'Database', 'DevOps', 'Design'] } }),
    defineField({ name: 'color', type: 'string', description: 'Hex color for badges' }),
    defineField({ name: 'icon', type: 'image', description: 'Technology icon/logo' })
  ]
});

// Project category
export const projectCategory = defineType({
  name: 'projectCategory',
  title: 'Project Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'color', type: 'string', description: 'Accent color for category' }),
    defineField({ name: 'icon', type: 'string', description: 'Lucide icon name' })
  ]
});
```

### GROQ Queries

```typescript
// All portfolio projects with pagination
export const portfolioProjectsQuery = defineQuery(`
  *[_type == "portfolioProject"] | order(featured desc, completionDate desc, _createdAt desc) [$offset...$limit] {
    _id,
    title,
    "slug": slug.current,
    category,
    shortDescription,
    "heroImage": heroMedia.image,
    "heroVideo": heroMedia.video,
    "mediaType": heroMedia.type,
    featured,
    tags,
    completionDate,
    client,
    technicalDetails,
    "technologies": technicalDetails.technologies[]
  }
`);

// Portfolio projects by category
export const portfolioProjectsByCategoryQuery = defineQuery(`
  *[_type == "portfolioProject" && category == $category] | order(featured desc, completionDate desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    "heroImage": heroMedia.image,
    featured,
    tags,
    completionDate,
    technicalDetails
  }
`);

// Featured portfolio projects
export const featuredPortfolioProjectsQuery = defineQuery(`
  *[_type == "portfolioProject" && featured == true] | order(completionDate desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    category,
    shortDescription,
    "heroImage": heroMedia.image,
    tags,
    technicalDetails
  }
`);

// Single portfolio project
export const portfolioProjectQuery = defineQuery(`
  *[_type == "portfolioProject" && slug.current == $slug][0] {
    _id,
    title,
    category,
    shortDescription,
    description,
    heroMedia,
    gallery,
    technicalDetails,
    featured,
    tags,
    completionDate,
    client,
    seoTitle,
    seoDescription,
    "relatedProjects": *[_type == "portfolioProject" && category == ^.category && _id != ^._id] | order(featured desc, completionDate desc) [0...3] {
      _id,
      title,
      "slug": slug.current,
      "heroImage": heroMedia.image,
      shortDescription
    }
  }
`);

// Technology aggregation
export const portfolioTechnologiesQuery = defineQuery(`
  array::unique(*[_type == "portfolioProject"].technicalDetails.technologies[])
`);

// Category counts
export const portfolioCategoryCountsQuery = defineQuery(`
  {
    "coding": count(*[_type == "portfolioProject" && category == "coding"]),
    "photography": count(*[_type == "portfolioProject" && category == "photography"]),
    "creative": count(*[_type == "portfolioProject" && category == "creative"]),
    "data": count(*[_type == "portfolioProject" && category == "data"]),
    "animation": count(*[_type == "portfolioProject" && category == "animation"]),
    "design": count(*[_type == "portfolioProject" && category == "design"])
  }
`);
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create Sanity schema for portfolio projects
- [ ] Set up basic GROQ queries
- [ ] Create portfolio project type generation
- [ ] Build basic portfolio listing page
- [ ] Implement category filtering

### Phase 2: Core Features (Week 3-4)
- [ ] Develop project card variants for each category
- [ ] Implement project detail modal/page
- [ ] Add search and filtering functionality
- [ ] Create responsive grid layout
- [ ] Build image optimization and galleries

### Phase 3: Interactive Features (Week 5-6)
- [ ] Add hover effects and animations
- [ ] Implement lightbox for photography
- [ ] Create video/animation players
- [ ] Add GitHub API integration
- [ ] Build social sharing features

### Phase 4: Polish & Optimization (Week 7-8)
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Analytics setup
- [ ] Mobile experience refinement
- [ ] Accessibility improvements

### Phase 5: Advanced Features (Week 9-10)
- [ ] Portfolio analytics dashboard
- [ ] Content management improvements
- [ ] Additional integrations (Behance, Dribbble)
- [ ] Advanced filtering options
- [ ] User feedback collection

---

## Success Metrics

### User Engagement
- **Time on Portfolio Pages**: Target 2+ minutes average
- **Project Detail Views**: >40% click-through rate from grid
- **Gallery Interactions**: >60% engagement with photography projects
- **External Link Clicks**: Track GitHub, live demo, case study clicks

### Technical Performance
- **Page Load Speed**: <2s First Contentful Paint
- **Image Loading**: Progressive enhancement with <1s perceived load
- **Mobile Performance**: >90 Lighthouse mobile score
- **SEO Score**: >95 Lighthouse SEO score

### Business Impact
- **Lead Generation**: Track contact form submissions from portfolio
- **Professional Inquiries**: Monitor job/project inquiries attribution
- **Portfolio Completion**: Track project view-to-inquiry conversion

### Content Quality
- **Project Documentation**: Maintain >95% complete project profiles
- **Visual Quality**: Ensure optimized images with <100KB average size
- **Content Freshness**: Add 2+ new projects monthly

---

## Risk Mitigation

### Technical Risks
- **Performance with Large Media**: Implement lazy loading, image optimization, CDN
- **Mobile Experience**: Progressive enhancement, touch-optimized interactions
- **Browser Compatibility**: Graceful degradation for older browsers

### Content Risks
- **Portfolio Maintenance**: Create content calendar and update workflows
- **Image Rights**: Ensure proper licensing and attribution for all media
- **Client Privacy**: Implement approval workflow for client project display

### User Experience Risks
- **Information Overload**: Implement progressive disclosure and clear hierarchies
- **Navigation Confusion**: User testing for intuitive categorization
- **Mobile Usability**: Touch-friendly design and simplified interactions

This PRD provides a comprehensive foundation for building a world-class portfolio system that effectively showcases your diverse professional work while maintaining the sophisticated design standards of your personal brand.