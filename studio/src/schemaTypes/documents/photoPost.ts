import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const photoPost = defineType({
  name: 'photoPost',
  title: 'Photo Post',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for accessibility and SEO',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (rule) => rule.required().min(1).max(20),
      description: '1–20 images per post',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc.date ?? doc._createdAt,
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 4,
      description: 'Short caption for this post (max 500 characters)',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Tags are used to auto-create albums (e.g. "Tokyo 2024")',
    }),
    defineField({
      name: 'relatedWork',
      title: 'Related Work',
      type: 'reference',
      to: [{type: 'portfolioProject'}],
      description: 'Optional: link to a longer portfolio project this post is part of',
      options: {disableNew: true},
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'location',
      media: 'images.0',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title ?? '(No caption)',
        subtitle,
        media,
      }
    },
  },
})
