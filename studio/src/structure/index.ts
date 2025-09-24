import {CogIcon, CaseIcon, TagIcon, DocumentIcon, UserIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'assist.instruction.context', 'portfolioProject', 'technology', 'projectCategory']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Portfolio Section
      S.listItem()
        .title('Portfolio')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Portfolio Management')
            .items([
              S.listItem()
                .title('Portfolio Projects')
                .icon(CaseIcon)
                .child(
                  S.documentTypeList('portfolioProject')
                    .title('Portfolio Projects')
                    .defaultOrdering([
                      {field: 'featured', direction: 'desc'},
                      {field: 'completionDate', direction: 'desc'},
                      {field: '_createdAt', direction: 'desc'}
                    ])
                ),
              S.listItem()
                .title('Technologies')
                .icon(CogIcon)
                .child(
                  S.documentTypeList('technology')
                    .title('Technologies')
                    .defaultOrdering([
                      {field: 'featured', direction: 'desc'},
                      {field: 'category', direction: 'asc'},
                      {field: 'name', direction: 'asc'}
                    ])
                ),
              S.listItem()
                .title('Project Categories')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('projectCategory')
                    .title('Project Categories')
                    .defaultOrdering([
                      {field: 'order', direction: 'asc'},
                      {field: 'name', direction: 'asc'}
                    ])
                ),
            ])
        ),

      // Content Section
      S.listItem()
        .title('Content')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Website Content')
            .items([
              S.listItem()
                .title('Pages')
                .child(S.documentTypeList('page').title('Pages')),
              S.listItem()
                .title('Blog Posts')
                .child(S.documentTypeList('post').title('Blog Posts')),
              S.listItem()
                .title('People')
                .child(S.documentTypeList('person').title('People')),
            ])
        ),

      S.divider(),

      // Settings Singleton
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
