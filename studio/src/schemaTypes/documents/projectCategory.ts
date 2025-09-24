import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Project Category schema for organizing portfolio projects
 * Provides structured categorization with visual styling
 */

export const projectCategory = defineType({
  name: 'projectCategory',
  title: 'Project Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'Display name for the category (e.g., "Coding Projects")',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the category name',
      options: {
        source: 'name',
        maxLength: 50,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of what projects belong in this category',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color code for category styling and badges',
      validation: (rule) =>
        rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
          invert: false,
        }),
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'string',
      description: 'Lucide icon name for the category (e.g., "code", "camera", "palette")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category appears in lists and filters',
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Category',
      type: 'boolean',
      description: 'Show this category prominently in navigation',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this category is currently active and visible',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      description: 'description',
      featured: 'featured',
      active: 'active',
      order: 'order',
    },
    prepare({title, description, featured, active, order}) {
      const status = active ? '✅' : '❌'
      const featuredIcon = featured ? '⭐ ' : ''
      
      return {
        title: `${featuredIcon}${status} ${title}`,
        subtitle: `Order: ${order} • ${description || 'No description'}`,
      }
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'active', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})