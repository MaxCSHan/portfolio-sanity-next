import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Technology schema for tagging portfolio projects with specific technologies
 * Used for filtering and displaying tech stacks
 */

export const technology = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Technology Name',
      type: 'string',
      description: 'Name of the technology (e.g., React, Python, Photoshop)',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the technology name',
      options: {
        source: 'name',
        maxLength: 50,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Technology Category',
      type: 'string',
      description: 'Category to group similar technologies',
      options: {
        list: [
          { title: 'Frontend Framework', value: 'frontend' },
          { title: 'Backend Framework', value: 'backend' },
          { title: 'Database', value: 'database' },
          { title: 'DevOps & Cloud', value: 'devops' },
          { title: 'Design Tool', value: 'design' },
          { title: 'Mobile Development', value: 'mobile' },
          { title: 'Data & Analytics', value: 'analytics' },
          { title: 'Programming Language', value: 'language' },
          { title: 'Creative Software', value: 'creative' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the technology and its use cases',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'color',
      title: 'Brand Color',
      type: 'string',
      description: 'Hex color code for technology badges (e.g., #61DAFB for React)',
      validation: (rule) =>
        rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
          invert: false,
        }),
    }),
    defineField({
      name: 'icon',
      title: 'Technology Icon',
      type: 'image',
      description: 'Logo or icon representing the technology',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: 'website',
      title: 'Official Website',
      type: 'url',
      description: 'Link to the technology\'s official website or documentation',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Technology',
      type: 'boolean',
      description: 'Show this technology prominently in filters',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      category: 'category',
      media: 'icon',
      featured: 'featured',
    },
    prepare({ title, category, media, featured }) {
      const categoryLabels: Record<string, string> = {
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'Database',
        devops: 'DevOps',
        design: 'Design',
        mobile: 'Mobile',
        analytics: 'Analytics',
        language: 'Language',
        creative: 'Creative',
        other: 'Other',
      }

      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: categoryLabels[category as string] || category,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'category',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
})