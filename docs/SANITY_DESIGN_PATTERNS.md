# Sanity CMS Design Patterns & Architecture Guide

## Overview

This Next.js portfolio uses Sanity CMS as a headless content management system. This document outlines the design patterns, data fetching strategies, and component architecture for creating new entities and features.

## Project Structure

```
nextjs-app/
├── app/
│   ├── components/          # Reusable UI components
│   ├── posts/              # Blog post routes
│   │   ├── [slug]/         # Individual post pages
│   │   └── page.tsx        # Posts list page
│   └── [slug]/             # Dynamic pages from Sanity
├── sanity/
│   ├── lib/
│   │   ├── queries.ts      # GROQ queries
│   │   ├── live.ts         # Live preview configuration
│   │   ├── client.ts       # Sanity client
│   │   └── utils.ts        # Image utilities
│   └── types.ts            # Generated TypeScript types
└── studio/                 # Sanity Studio configuration
    └── src/
        ├── schemaTypes/
        │   ├── documents/   # Document schemas (post, person, page)
        │   └── objects/     # Object schemas (infoSection, link, etc.)
        └── structure/       # Studio structure
```

## Core Design Patterns

### 1. Data Fetching with `sanityFetch`

The project uses the `sanityFetch` function from `next-sanity` for all data operations:

```typescript
// Basic fetch
const { data } = await sanityFetch({
  query: postQuery,
  params: { slug },
});

// With pagination
const { data: posts } = await sanityFetch({
  query: paginatedPostsQuery,
  params: { offset, limit },
});
```

**Key Features:**
- Automatic TypeScript type generation
- Live preview support during development
- Caching and revalidation
- Draft mode support

### 2. GROQ Query Patterns

#### Document Fields Template
```groq
const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;
```

#### Common Query Patterns
```groq
// All documents of a type
*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc)

// Single document by slug
*[_type == "post" && slug.current == $slug] [0]

// Pagination
*[_type == "post"] | order(date desc) [$offset...$limit]

// Count total documents
count(*[_type == "post" && defined(slug.current)])

// Reference expansion
author->{firstName, lastName, picture}
```

### 3. Component Architecture

#### Reusable Components
- **Avatar**: Author information with image
- **CoverImage**: Responsive image with Sanity image optimization
- **Date**: Consistent date formatting
- **PortableText**: Rich text content rendering
- **Posts**: Container for post listings

#### Pattern: Compound Components
```typescript
// Container component
const Posts = ({ children, heading, subHeading }) => (
  <div>
    {heading && <h2>{heading}</h2>}
    {subHeading && <p>{subHeading}</p>}
    <div>{children}</div>
  </div>
);

// Usage with different data sources
export const MorePosts = async ({ skip, limit }) => {
  const { data } = await sanityFetch({ query: morePostsQuery, params: { skip, limit } });
  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post) => <Post key={post._id} post={post} />)}
    </Posts>
  );
};
```

### 4. Schema Design Patterns

#### Document Schema Structure
```typescript
export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    // Required fields
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', validation: (rule) => rule.required() }),

    // Content fields
    defineField({ name: 'content', type: 'blockContent' }),
    defineField({ name: 'excerpt', type: 'text' }),

    // Media fields
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string' }]
    }),

    // Metadata fields
    defineField({ name: 'date', type: 'datetime' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'person' }] }),
  ],
  preview: { /* preview configuration */ }
});
```

## Creating New Entities

### Step 1: Define Schema
Create a new document schema in `studio/src/schemaTypes/documents/`:

```typescript
// Example: project.ts
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'technologies', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'liveUrl', type: 'url' }),
    defineField({ name: 'githubUrl', type: 'url' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
});
```

### Step 2: Add Queries
Create queries in `sanity/lib/queries.ts`:

```typescript
const projectFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  description,
  technologies,
  liveUrl,
  githubUrl,
  featured,
`;

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(featured desc, _createdAt desc) {
    ${projectFields}
  }
`);

export const featuredProjectsQuery = defineQuery(`
  *[_type == "project" && featured == true] | order(_createdAt desc) {
    ${projectFields}
  }
`);
```

### Step 3: Create Components
Follow the established component patterns:

```typescript
// components/ProjectCard.tsx
const ProjectCard = ({ project }: { project: ProjectType }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      {/* Technologies, links, etc. */}
    </div>
  );
};

// components/Projects.tsx
export const FeaturedProjects = async () => {
  const { data } = await sanityFetch({ query: featuredProjectsQuery });
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {data?.map((project) => <ProjectCard key={project._id} project={project} />)}
    </div>
  );
};
```

### Step 4: Create Pages
Create route handlers following Next.js App Router patterns:

```typescript
// app/projects/page.tsx - List page
export default async function ProjectsPage() {
  const { data: projects } = await sanityFetch({ query: allProjectsQuery });
  // Implementation...
}

// app/projects/[slug]/page.tsx - Detail page
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { data: project } = await sanityFetch({
    query: projectQuery,
    params: { slug: params.slug },
  });
  // Implementation...
}
```

## Pagination Implementation

### Query Pattern
```groq
*[_type == "post"] | order(date desc) [$offset...$limit] {
  ${postFields}
}
```

### Component Implementation
```typescript
const ITEMS_PER_PAGE = 6;

export default async function ListPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const limit = offset + ITEMS_PER_PAGE;

  const [{ data: items }, { data: totalCount }] = await Promise.all([
    sanityFetch({ query: paginatedQuery, params: { offset, limit } }),
    sanityFetch({ query: totalCountQuery }),
  ]);

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);
  // Render items and pagination...
}
```

## Image Optimization

### Sanity Image URLs
```typescript
// utils.ts
export function urlForImage(source: any) {
  return imageUrlBuilder(client).image(source);
}

// Component usage
<Image
  src={urlForImage(image)?.height(720).width(1280).auto("format").url() as string}
  alt={image?.alt || ""}
  fill={true}
  sizes="100vw"
/>
```

## TypeScript Integration

### Auto-generated Types
Run `npm run typegen` to generate TypeScript types from your Sanity schemas:

```typescript
// Generated types are available as:
import { Post, Project, Person } from "@/sanity.types";
```

### Query Result Types
```typescript
import type { AllPostsQueryResult } from "@/sanity.types";

const { data }: { data: AllPostsQueryResult } = await sanityFetch({
  query: allPostsQuery,
});
```

## Best Practices

### 1. Content Modeling
- Use descriptive field names
- Include validation rules
- Add helpful descriptions
- Use appropriate field types
- Consider preview configurations

### 2. Query Optimization
- Select only needed fields
- Use coalesce for fallbacks
- Order by relevant fields
- Include proper filtering
- Implement pagination for large datasets

### 3. Component Design
- Create reusable components
- Follow compound component patterns
- Use TypeScript for props
- Handle loading and error states
- Implement proper SEO metadata

### 4. Performance
- Use Next.js Image component
- Implement proper caching
- Optimize Sanity image URLs
- Use Suspense for loading states
- Consider static generation where possible

## Development Workflow

1. **Schema First**: Define content types in Sanity Studio
2. **Generate Types**: Run `npm run typegen` after schema changes
3. **Create Queries**: Add GROQ queries for data fetching
4. **Build Components**: Create reusable UI components
5. **Implement Pages**: Create Next.js route handlers
6. **Test & Iterate**: Test with real content in Sanity Studio

This architecture provides a solid foundation for scalable content management while maintaining type safety and performance optimization.