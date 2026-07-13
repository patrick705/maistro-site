import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0]{
    siteName,
    navItems[]{label, href},
    ctaLabel,
    footerText,
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

    demoModal{eyebrow, headline, subhead, successHeadline, successBody}
  }
`
