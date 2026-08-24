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
    "logo": logo{"url": asset->url, alt},
    "logoDark": logoDark{"url": asset->url, alt},
    navItems[]{label, href},
    stickyNav,
    primaryCta{label, href},
    socialLinks[]{platform, url},
    footerText,
    gtmContainerId,
    theme{
      "palette": palette->{
        name, brandHex, accentHex, warmHex, posHex,
        surfaceHex, brandTintHex, brandSoftHex, brandInkHex, accentInkHex, warmDeepHex, posTintHex, bodyHex
      },
      playful,
      showResults,
      pairing,
      typeScale,
      chromeFont
    },
    seoDefaults{
      metaTitleSuffix,
      defaultMetaDescription,
      "defaultOgImage": defaultOgImage{"url": asset->url, alt},
      twitterHandle
    },
    demoModal{eyebrow, headline, subhead, successHeadline, successBody}
  }
`

export const newsArticlesQuery = groq`
  *[_type == "newsArticle" && archived != true] | order(publishedAt desc){
    title, excerpt, category, icon, variant, publishedAt,
    "slug": slug.current
  }
`

export const pagesForNavQuery = groq`
  *[_type == "page" && showInMenu == true && archived != true] | order(menuOrder asc){
    title,
    navLabel,
    "slug": slug.current,
    menuOrder
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug && archived != true][0]{
    title,
    "slug": slug.current,
    navLabel,
    showInMenu,
    menuOrder,
    blocks[]{
      _key,
      _type,
      _type == "heroCarouselBlock" => {
        eyebrow,
        overlayHeading,
        overlaySubhead,
        slides[]{"image": image{"url": asset->url, alt}, caption},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "textBlock" => {
        heading,
        body,
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "sideBySideBlock" => {
        "image": image{"url": asset->url, alt},
        imagePosition,
        heading,
        body,
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "imageGalleryBlock" => {
        heading,
        layout,
        images[]{"image": image{"url": asset->url, alt}, caption}
      },
      _type == "socialLinksBlock" => {
        heading,
        links[]{platform, url}
      },
      _type == "liveVideoBlock" => {
        title,
        embedUrl,
        "posterImage": posterImage{"url": asset->url, alt},
        offlineMessage
      },
      _type == "backgroundVideoBlock" => {
        eyebrow, heading, subhead, primaryCta, secondaryCta,
        "video": video.asset->url,
        "posterImage": posterImage{"url": asset->url, alt},
        loop, muted, videoHeight, overlayCopy, scrim, menuOverlay
      },
      _type == "logoStripBlock" => {
        heading,
        logos[]{name, "logo": logo{"url": asset->url, alt}, description, website}
      },
      _type == "ctaBannerBlock" => {
        heading,
        subhead,
        buttonLabel,
        buttonHref,
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "richHeroBlock" => {
        eyebrow, headlineBefore, headlineHighlight, subhead,
        primaryCta, secondaryCta, secondaryHref,
        heroStats[]{value, label, variant},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "simpleHeroBlock" => {
        eyebrow, headlineBefore, headlineHighlight, subhead, headlineClamp,
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "aboutSectionBlock" => {
        eyebrow, headlineBefore, headlineHighlight, headlineAfter, body,
        pipeline{
          channelsIcon, channelsLabel, channelsTags,
          menuManagerIcon, menuManagerTitle, menuManagerSub,
          maistroIcon, maistroTitle, maistroSub,
          deliversIcon, deliversLabel,
          outputs[]{icon, label}
        },
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "dashboardShowcaseBlock" => {
        design{headingFont, headingScale, padding, paletteRole, fullBleed},
        showcase{
          overviewKpis[]{label, value, valueVariant, small, delta, tone},
          overviewChart[]{day, forecast, actual, actualHighlight},
          onShift[]{name, role, color},
          stockAlerts[]{name, status, percent, color},

          forecastKpis[]{label, value, valueVariant, small, delta, tone},
          forecastChart[]{day, height, variant},

          staffKpis[]{label, value, valueVariant, small, delta, tone},
          rota[]{name, left, width, color},

          stockKpis[]{label, value, valueVariant, small, delta, tone},
          stockLevels[]{name, status, percent, color},

          reportsKpis[]{label, value, valueVariant, small, delta, tone},
          reportBand{title, subtitle, pill}
        }
      },
      _type == "servicesGridBlock" => {
        eyebrow, headline,
        services[]{icon, title, description, bullets, variant},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "statsBandBlock" => {
        eyebrow, headline,
        stats[]{eyebrow, prefix, value, label, variant},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "contactFormBlock" => {
        headline, subhead,
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "pipelineStripBlock" => {
        channelsLabel, channelsItems[]{icon, label},
        menuManagerIcon, menuManagerTitle, menuManagerSub,
        maistroIcon, maistroTitle, maistroSub,
        outcomesLabel, outcomesItems[]{icon, label},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "moduleDeepDiveListBlock" => {
        eyebrow, headline,
        modules[]{icon, eyebrow, headline, body, bullets, widget},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "integrationsBlock" => {
        eyebrow, headline, integrations,
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "featuredCaseStudyBlock" => {
        eyebrow, headline, body, quote, author,
        heroStat{value, label},
        stats[]{value, label},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "testimonialGridBlock" => {
        eyebrow, headline,
        testimonials[]{quote, author, role, venue},
        design{headingFont, headingScale, padding, paletteRole, fullBleed}
      },
      _type == "newsGridBlock" => {
        _key
      }
    },

    ${seoProjection}
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
