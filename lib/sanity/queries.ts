import { groq } from 'next-sanity'

const seoProjection = groq`
  seo{
    metaTitle,
    metaDescription,
    "ogImage": ogImage{"url": asset->url, alt},
    noIndex
  }
`

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0]{
    siteName,
    navItems[]{label, href},
    ctaLabel,
    footerText,
    gtmContainerId,
    theme{palette, playful, showResults}
  }
`

export const homePageQuery = groq`
  *[_id == "homePage"][0]{
    heroEyebrow,
    heroHeadlineBefore,
    heroHeadlineHighlight,
    heroSubhead,
    heroPrimaryCta,
    heroSecondaryCta,
    heroStats[]{value, label, variant},

    aboutEyebrow,
    aboutHeadlineBefore,
    aboutHeadlineHighlight,
    aboutHeadlineAfter,
    aboutBody,
    aboutPipeline{
      channelsIcon, channelsLabel, channelsTags,
      menuManagerIcon, menuManagerTitle, menuManagerSub,
      maistroIcon, maistroTitle, maistroSub,
      deliversIcon, deliversLabel,
      outputs[]{icon, label}
    },

    servicesEyebrow,
    servicesHeadline,
    services[]{icon, title, description, bullets, variant},

    resultsEyebrow,
    resultsHeadline,
    resultStats[]{eyebrow, prefix, value, label, variant},

    contactHeadline,
    contactSubhead,

    demoModal{eyebrow, headline, subhead, successHeadline, successBody},

    ${seoProjection}
  }
`

export const productPageQuery = groq`
  *[_id == "productPage"][0]{
    heroEyebrow,
    heroHeadlineBefore,
    heroHeadlineHighlight,
    heroSubhead,
    heroPrimaryCta,
    heroSecondaryCta,
    heroStats[]{value, label, variant},

    channelsLabel,
    channelsItems[]{icon, label},
    menuManagerIcon, menuManagerTitle, menuManagerSub,
    maistroIcon, maistroTitle, maistroSub,
    outcomesLabel,
    outcomesItems[]{icon, label},

    modulesEyebrow,
    modulesHeadline,
    modules[]{icon, eyebrow, headline, body, bullets, widget},

    integrationsEyebrow,
    integrationsHeadline,
    integrations,

    ctaHeadline,
    ctaSubhead,
    ctaButtonLabel,

    ${seoProjection}
  }
`

export const customersPageQuery = groq`
  *[_id == "customersPage"][0]{
    heroEyebrow,
    heroHeadlineBefore,
    heroHeadlineHighlight,
    heroSubhead,

    logos[]{
      name,
      "logo": logo{"url": asset->url, alt},
      description,
      website
    },

    caseStudyEyebrow,
    caseStudyHeadline,
    caseStudyBody,
    caseStudyQuote,
    caseStudyAuthor,
    caseStudyHeroStat{value, label},
    caseStudyStats[]{value, label},

    testimonialsEyebrow,
    testimonialsHeadline,
    testimonials[]{quote, author, role, venue},

    ctaHeadline,
    ctaSubhead,
    ctaButtonLabel,

    ${seoProjection}
  }
`

export const newsPageQuery = groq`
  *[_id == "newsPage"][0]{
    heroEyebrow,
    heroHeadlineBefore,
    heroHeadlineHighlight,
    heroSubhead,

    ${seoProjection}
  }
`

export const newsArticlesQuery = groq`
  *[_type == "newsArticle"] | order(publishedAt desc){
    title, excerpt, category, icon, variant, publishedAt,
    "slug": slug.current
  }
`

export const newsArticleBySlugQuery = groq`
  *[_type == "newsArticle" && slug.current == $slug][0]{
    title, excerpt, category, icon, variant, publishedAt,
    "slug": slug.current,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->,
        alt
      }
    },

    ${seoProjection}
  }
`
