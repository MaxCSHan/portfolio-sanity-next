import {CaseIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Portfolio Project schema for showcasing diverse professional work
 * Supports coding projects, photography, creative content, data analysis, animations, and design
 */

export const portfolioProject = defineType({
  name: 'portfolioProject',
  title: 'Portfolio Project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'metadata', title: 'Metadata'},
    {name: 'technical', title: 'Technical Details'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // Core Information
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'The main title of your project',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Project Category',
      type: 'string',
      group: 'metadata',
      description: 'Primary category for this project',
      options: {
        list: [
          {title: 'Coding Project', value: 'coding'},
          {title: 'Photography', value: 'photography'},
          {title: 'Creative Content', value: 'creative'},
          {title: 'Data Analysis', value: 'data'},
          {title: 'Animation', value: 'animation'},
          {title: 'Design', value: 'design'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    // Content
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'content',
      description: 'Brief description for cards and previews (max 200 characters)',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      group: 'content',
      description: 'Detailed project description with rich text formatting',
    }),

    // Hero Media
    defineField({
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'object',
      group: 'media',
      description: 'Main visual for the project (image, video, or gallery)',
      fields: [
        {
          name: 'type',
          title: 'Media Type',
          type: 'string',
          options: {
            list: [
              {title: 'Single Image', value: 'image'},
              {title: 'Video', value: 'video'},
              {title: 'Image Gallery', value: 'gallery'},
            ],
          },
          initialValue: 'image',
        },
        {
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'alt',
            },
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
              validation: (rule) => {
                return rule.custom((alt, context) => {
                  if ((context.document?.heroMedia as any)?.image?.asset?._ref && !alt) {
                    return 'Required when image is present'
                  }
                  return true
                })
              },
            },
          ],
          hidden: ({parent}) => parent?.type !== 'image',
        },
        {
          name: 'video',
          title: 'Hero Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
          hidden: ({parent}) => parent?.type !== 'video',
        },
        {
          name: 'gallery',
          title: 'Hero Gallery',
          type: 'array',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                {
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'string',
                },
              ],
            },
          ],
          hidden: ({parent}) => parent?.type !== 'gallery',
        },
      ],
      validation: (rule) => rule.required(),
    }),

    // Additional Media Gallery
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      group: 'media',
      description: 'Additional images and media for the project',
      of: [
        {
          type: 'object',
          title: 'Gallery Item',
          fields: [
            {
              name: 'asset',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'asset',
            },
            prepare({title, media}) {
              return {
                title: title || 'Gallery Image',
                media,
              }
            },
          },
        },
      ],
    }),

    // Technical Details (conditional based on category)
    defineField({
      name: 'technicalDetails',
      title: 'Technical Details',
      type: 'object',
      group: 'technical',
      description: 'Technical information specific to the project category',
      fields: [
        // Coding projects
        {
          name: 'technologies',
          title: 'Technologies Used',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'technology'}]}],
          hidden: ({document}) => document?.category !== 'coding',
        },
        {
          name: 'githubUrl',
          title: 'GitHub Repository',
          type: 'url',
          hidden: ({document}) => document?.category !== 'coding',
        },
        {
          name: 'liveUrl',
          title: 'Live Demo URL',
          type: 'url',
          hidden: ({document}) => document?.category !== 'coding',
        },
        {
          name: 'codeSnippet',
          title: 'Featured Code Snippet',
          type: 'text',
          rows: 10,
          hidden: ({document}) => document?.category !== 'coding',
        },

        // Photography projects
        {
          name: 'cameraInfo',
          title: 'Camera Information',
          type: 'object',
          hidden: ({document}) => document?.category !== 'photography',
          fields: [
            {name: 'camera', title: 'Camera Model', type: 'string'},
            {name: 'lens', title: 'Lens', type: 'string'},
            {name: 'settings', title: 'Camera Settings', type: 'string'},
            {name: 'location', title: 'Location', type: 'string'},
            {name: 'shootDate', title: 'Shoot Date', type: 'date'},
          ],
        },
        {
          name: 'photoCategory',
          title: 'Photography Category',
          type: 'string',
          options: {
            list: [
              {title: 'Portrait', value: 'portrait'},
              {title: 'Landscape', value: 'landscape'},
              {title: 'Street', value: 'street'},
              {title: 'Studio', value: 'studio'},
              {title: 'Event', value: 'event'},
              {title: 'Architecture', value: 'architecture'},
              {title: 'Nature', value: 'nature'},
            ],
          },
          hidden: ({document}) => document?.category !== 'photography',
        },

        // Data projects
        {
          name: 'dataTools',
          title: 'Data Tools & Technologies',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
          hidden: ({document}) => document?.category !== 'data',
        },
        {
          name: 'datasetInfo',
          title: 'Dataset Information',
          type: 'text',
          hidden: ({document}) => document?.category !== 'data',
        },
        {
          name: 'methodology',
          title: 'Analysis Methodology',
          type: 'text',
          hidden: ({document}) => document?.category !== 'data',
        },

        // Creative & Animation projects
        {
          name: 'creativeTools',
          title: 'Creative Tools Used',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
          hidden: ({document}) =>
            !['creative', 'animation', 'design'].includes(document?.category as string),
        },
        {
          name: 'duration',
          title: 'Project Duration',
          type: 'string',
          hidden: ({document}) =>
            !['creative', 'animation', 'design'].includes(document?.category as string),
        },
      ],
    }),

    // Metadata
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      group: 'metadata',
      description: 'Display this project prominently on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'metadata',
      description: 'Keywords for filtering and search',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion Date',
      type: 'date',
      group: 'metadata',
      description: 'When the project was completed',
    }),
    defineField({
      name: 'client',
      title: 'Client/Organization',
      type: 'string',
      group: 'metadata',
      description: 'Client or organization this project was created for',
    }),
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          {title: 'Completed', value: 'completed'},
          {title: 'In Progress', value: 'in-progress'},
          {title: 'On Hold', value: 'on-hold'},
          {title: 'Archived', value: 'archived'},
        ],
      },
      initialValue: 'completed',
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Custom title for search engines (max 60 characters)',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      description: 'Custom description for search engines (max 160 characters)',
      validation: (rule) => rule.max(160),
    }),
  ],

  // List preview configuration
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'heroMedia.image',
      featured: 'featured',
      status: 'status',
    },
    prepare({title, category, media, featured, status}) {
      const statusIcon: Record<string, string> = {
        completed: '✅',
        'in-progress': '🚧',
        'on-hold': '⏸️',
        archived: '📦',
      }

      const categoryLabels: Record<string, string> = {
        coding: 'CODE',
        photography: 'PHOTO',
        creative: 'CREATIVE',
        data: 'DATA',
        animation: 'ANIM',
        design: 'DESIGN',
      }

      return {
        title: `${featured ? '⭐ ' : ''}${statusIcon[status as string] || ''} ${title}`,
        subtitle: categoryLabels[category as string] || (category as string)?.toUpperCase(),
        media,
      }
    },
  },

  // Ordering configuration
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'completionDate', direction: 'desc'},
        {field: '_createdAt', direction: 'desc'},
      ],
    },
    {
      title: 'Completion Date',
      name: 'completionDate',
      by: [{field: 'completionDate', direction: 'desc'}],
    },
    {
      title: 'Category',
      name: 'category',
      by: [{field: 'category', direction: 'asc'}, {field: 'title', direction: 'asc'}],
    },
  ],
})