import type { StructureResolver } from 'sanity/structure'

/**
 * Custom desk structure: pins the Site Settings singleton at the top instead
 * of letting editors create duplicates of it, and lists Pages/News/Leads
 * below. The marketing pages (Home/Product/Customers/News) are `page`
 * documents now, not their own singleton types.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('newsArticle').title('News Articles'),
      S.documentTypeListItem('lead').title('Leads'),
    ])
