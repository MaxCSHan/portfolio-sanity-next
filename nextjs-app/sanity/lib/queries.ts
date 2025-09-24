import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

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

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

export const paginatedPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [$offset...$limit] {
    ${postFields}
  }
`);

export const totalPostsCountQuery = defineQuery(`
  count(*[_type == "post" && defined(slug.current)])
`);

// Portfolio Project Queries

const portfolioProjectFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  category,
  shortDescription,
  "heroImage": heroMedia.image,
  "heroVideo": heroMedia.video,
  "heroGallery": heroMedia.gallery,
  "mediaType": heroMedia.type,
  featured,
  tags,
  completionDate,
  client,
  status,
  technicalDetails,
  "technologies": technicalDetails.technologies[]->{ name, color, icon },
  _createdAt,
  _updatedAt
`;

// All portfolio projects with filtering support
export const portfolioProjectsQuery = defineQuery(`
  *[_type == "portfolioProject" 
    && ($category == null || category == $category)
    && ($featured == null || featured == $featured)
    && ($technologies == null || count(technicalDetails.technologies[]->name[@ in $technologies]) > 0)
    && ($search == null || title match $search + "*" || shortDescription match $search + "*" || tags[] match $search + "*")
  ] | order(featured desc, completionDate desc, _createdAt desc) [$offset...$limit] {
    ${portfolioProjectFields}
  }
`);

// Featured projects for homepage integration
export const featuredPortfolioProjectsQuery = defineQuery(`
  *[_type == "portfolioProject" && featured == true] 
  | order(completionDate desc, _createdAt desc) [0...6] {
    ${portfolioProjectFields}
  }
`);

// Single project with detailed information and related projects
export const portfolioProjectQuery = defineQuery(`
  *[_type == "portfolioProject" && slug.current == $slug][0] {
    ${portfolioProjectFields},
    description,
    "heroMedia": heroMedia {
      type,
      image,
      video,
      gallery[] {
        asset,
        alt,
        caption
      }
    },
    "relatedProjects": *[_type == "portfolioProject" 
      && category == ^.category 
      && _id != ^._id 
      && featured == true] 
    | order(completionDate desc) [0...3] {
      _id,
      title,
      "slug": slug.current,
      "heroImage": heroMedia.image,
      shortDescription,
      category
    }
  }
`);

// Category counts for filter sidebar
export const portfolioCategoryCountsQuery = defineQuery(`
  {
    "coding": count(*[_type == "portfolioProject" && category == "coding"]),
    "photography": count(*[_type == "portfolioProject" && category == "photography"]),
    "creative": count(*[_type == "portfolioProject" && category == "creative"]),
    "data": count(*[_type == "portfolioProject" && category == "data"]),
    "animation": count(*[_type == "portfolioProject" && category == "animation"]),
    "design": count(*[_type == "portfolioProject" && category == "design"]),
    "total": count(*[_type == "portfolioProject"])
  }
`);

// Technology aggregation for filter options
export const portfolioTechnologiesQuery = defineQuery(`
  *[_type == "technology"] | order(name asc) {
    _id,
    name,
    category,
    color,
    "projectCount": count(*[_type == "portfolioProject" && references(^._id)])
  }
`);

// Total portfolio projects count for pagination
export const totalPortfolioProjectsCountQuery = defineQuery(`
  count(*[_type == "portfolioProject" 
    && ($category == null || category == $category)
    && ($featured == null || featured == $featured)
    && ($technologies == null || count(technicalDetails.technologies[]->name[@ in $technologies]) > 0)
    && ($search == null || title match $search + "*" || shortDescription match $search + "*" || tags[] match $search + "*")
  ])
`);

// Portfolio project slugs for static generation
export const portfolioProjectSlugs = defineQuery(`
  *[_type == "portfolioProject" && defined(slug.current)]
  {"slug": slug.current}
`);
