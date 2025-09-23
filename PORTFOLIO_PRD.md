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

#### Visual Design Language

##### Color Palette Extensions
```css
/* Project-specific accents */
--coding-accent: #10b981;      /* Emerald-500 */
--photo-accent: #f59e0b;       /* Amber-500 */
--creative-accent: #8b5cf6;    /* Violet-500 */
--data-accent: #3b82f6;        /* Blue-500 */
--animation-accent: #ec4899;   /* Pink-500 */

/* Interactive states */
--hover-lift: translateY(-8px);
--hover-scale: scale(1.02);
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

##### Component Specifications

###### 1. **Project Card Variants**

**Base Card Structure:**
```html
<article class="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
  <!-- Category indicator -->
  <div class="absolute top-4 left-4 z-10">
    <span class="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full">
      Category
    </span>
  </div>

  <!-- Media section -->
  <div class="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Dynamic content based on project type -->
  </div>

  <!-- Content section -->
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
      Project Title
    </h3>
    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
      Project description...
    </p>

    <!-- Tech stack or meta info -->
    <div class="flex flex-wrap gap-2 mb-4">
      <!-- Dynamic badges -->
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2">
      <!-- Context-specific actions -->
    </div>
  </div>
</article>
```

**Coding Project Card:**
```html
<!-- Media section with code preview -->
<div class="aspect-video relative overflow-hidden bg-gray-900">
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    <div class="absolute bottom-4 left-4 right-4">
      <div class="flex gap-2">
        <button class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md hover:bg-white/30 transition-colors">
          Live Demo
        </button>
        <button class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md hover:bg-white/30 transition-colors">
          GitHub
        </button>
      </div>
    </div>
  </div>
  <!-- Code screenshot or live preview iframe -->
</div>

<!-- Tech stack badges -->
<div class="flex flex-wrap gap-1">
  <span class="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md">React</span>
  <span class="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">TypeScript</span>
</div>
```

**Photography Card:**
```html
<!-- High-quality image with overlay -->
<div class="aspect-square relative overflow-hidden">
  <img src="optimized-image.jpg" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    <div class="absolute bottom-4 left-4 text-white">
      <p class="text-sm font-medium">Camera: Sony A7R IV</p>
      <p class="text-xs opacity-80">f/2.8 • 1/200s • ISO 100</p>
    </div>
  </div>
</div>

<!-- Photography-specific badges -->
<div class="flex flex-wrap gap-1">
  <span class="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-md">Portrait</span>
  <span class="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-md">Studio</span>
</div>
```

###### 2. **Filter Sidebar**
```html
<aside class="w-64 bg-white border-r border-gray-200 p-6">
  <!-- Search -->
  <div class="mb-6">
    <input type="text" placeholder="Search projects..."
           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
  </div>

  <!-- Category filters -->
  <div class="mb-6">
    <h3 class="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
    <div class="space-y-2">
      <label class="flex items-center">
        <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <span class="ml-2 text-sm text-gray-700">Coding Projects</span>
        <span class="ml-auto text-xs text-gray-500">12</span>
      </label>
      <!-- More category options -->
    </div>
  </div>

  <!-- Technology filters -->
  <div class="mb-6">
    <h3 class="text-sm font-semibold text-gray-900 mb-3">Technologies</h3>
    <div class="flex flex-wrap gap-2">
      <button class="px-3 py-1 text-xs border border-gray-300 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-colors">
        React
      </button>
      <!-- More tech tags -->
    </div>
  </div>
</aside>
```

###### 3. **Project Detail Modal**
```html
<div class="fixed inset-0 z-50 overflow-y-auto">
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl">
      <!-- Close button -->
      <button class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
        <X class="w-5 h-5" />
      </button>

      <!-- Hero section -->
      <div class="aspect-video relative overflow-hidden rounded-t-2xl">
        <!-- Project hero media -->
      </div>

      <!-- Content sections -->
      <div class="p-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main content -->
          <div class="lg:col-span-2">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Project Title</h1>
            <div class="prose max-w-none">
              <!-- Rich content -->
            </div>
          </div>

          <!-- Sidebar info -->
          <div class="space-y-6">
            <!-- Project metadata -->
            <!-- Action buttons -->
            <!-- Related projects -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Interactive Behaviors

##### 1. **Hover Effects**
- **Card Lift**: `transform: translateY(-8px)` with enhanced shadow
- **Image Zoom**: `transform: scale(1.1)` on image elements
- **Color Transitions**: Category accent colors on hover
- **Backdrop Blur**: Information overlays with `backdrop-filter: blur(8px)`

##### 2. **Loading States**
- **Skeleton Loading**: Animated placeholders matching card structure
- **Progressive Image Loading**: Blur-to-sharp effect with fade-in
- **Staggered Animations**: Cards appear with 50ms delays in sequence

##### 3. **Mobile Interactions**
- **Touch-friendly targets**: Minimum 44px touch targets
- **Swipe gestures**: Horizontal swipe for category switching
- **Pull-to-refresh**: Reload portfolio content
- **Haptic feedback**: Subtle vibration on interactions (iOS)

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