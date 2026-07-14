import type { StructureResolver } from 'sanity/structure'

/**
 * Custom desk structure: pins the two singletons (Site Settings, Home Page)
 * at the top instead of letting editors create duplicates of them, and
 * lists Leads below.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Product Page')
        .id('productPage')
        .child(S.document().schemaType('productPage').documentId('productPage')),
      S.listItem()
        .title('Customers Page')
        .id('customersPage')
        .child(S.document().schemaType('customersPage').documentId('customersPage')),
      S.listItem()
        .title('News Page')
        .id('newsPage')
        .child(S.document().schemaType('newsPage').documentId('newsPage')),
      S.divider(),
      S.documentTypeListItem('newsArticle').title('News Articles'),
      S.documentTypeListItem('lead').title('Leads'),
    ])
