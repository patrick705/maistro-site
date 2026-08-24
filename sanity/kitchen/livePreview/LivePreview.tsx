import { Hero } from '../../../components/Hero'
import { ContactSection } from '../../../components/ContactSection'
import { CtaBanner } from '../../../components/blocks/CtaBanner'
import { TextBlock } from '../../../components/blocks/TextBlock'
import { SocialLinksBlock } from '../../../components/blocks/SocialLinksBlock'
import { SimpleHeroBlockView } from '../../../components/blocks/SimpleHeroBlock'
import { AboutSectionBlockView } from '../../../components/blocks/AboutSectionBlockView'
import { DashboardShowcaseBlockView } from '../../../components/blocks/DashboardShowcaseBlockView'
import { ServicesGridBlockView } from '../../../components/blocks/ServicesGridBlockView'
import { StatsBandBlockView } from '../../../components/blocks/StatsBandBlockView'
import { PipelineStripBlockView } from '../../../components/blocks/PipelineStripBlockView'
import { ModuleDeepDiveListBlockView } from '../../../components/blocks/ModuleDeepDiveListBlockView'
import { IntegrationsBlockView } from '../../../components/blocks/IntegrationsBlockView'
import { FeaturedCaseStudyBlockView } from '../../../components/blocks/FeaturedCaseStudyBlockView'
import { TestimonialGridBlockView } from '../../../components/blocks/TestimonialGridBlockView'

import { PreviewTheme } from './PreviewTheme'
import { PreviewInertCta } from './PreviewInertCta'
import { PreviewHeroCarousel } from './PreviewHeroCarousel'
import { PreviewImageGallery } from './PreviewImageGallery'
import { PreviewLiveVideo } from './PreviewLiveVideo'
import { PreviewBackgroundVideo } from './PreviewBackgroundVideo'
import { PreviewSideBySide } from './PreviewSideBySide'
import { PreviewLogoStrip } from './PreviewLogoStrip'
import { PreviewNewsGrid } from './PreviewNewsGrid'
import { blockDesignStyle } from '../../../lib/content/blockDesignStyle'
import type { PageBlock } from '../../../lib/content/types'

/**
 * Renders a block exactly as it appears on the live site, reusing the real
 * presentational components and their real CSS — not a hand-drawn summary.
 * The handful of components that hardcode a live dependency (the demo modal,
 * the leads API, `next/image`) get a Studio-safe stand-in instead; everything
 * else is the untouched component. See `docs/` conversation / commit history
 * for why (no next/image server here, and a preview must never be able to
 * open the real demo modal or submit a real lead).
 */
export function LivePreview({ block, isFirst }: { block: Record<string, any>; isFirst?: boolean }) {
  // Kitchen's in-memory blocks come straight off a Sanity document fetch, not
  // validated against `PageBlock` — this is the one boundary cast, after which
  // switching on `_type` narrows correctly for every case below.
  return <PreviewTheme>{renderBlock(block as PageBlock, isFirst)}</PreviewTheme>
}

function renderBlock(block: PageBlock, isFirst?: boolean) {
  switch (block._type) {
    case 'heroCarouselBlock':
      return <PreviewHeroCarousel block={block} />
    case 'textBlock':
      return <TextBlock block={block} />
    case 'sideBySideBlock':
      return <PreviewSideBySide block={block} />
    case 'imageGalleryBlock':
      return <PreviewImageGallery block={block} />
    case 'socialLinksBlock':
      return <SocialLinksBlock block={block} />
    case 'liveVideoBlock':
      return <PreviewLiveVideo block={block} />
    case 'backgroundVideoBlock':
      return <PreviewBackgroundVideo block={block} isFirst={isFirst} />
    case 'logoStripBlock':
      return <PreviewLogoStrip block={block} />
    case 'ctaBannerBlock':
      return (
        <CtaBanner
          block={block}
          renderCta={(label, _href, className) => <PreviewInertCta label={label} className={className} />}
        />
      )
    case 'richHeroBlock':
      return (
        <Hero
          content={{
            heroEyebrow: block.eyebrow ?? '',
            heroHeadlineBefore: block.headlineBefore ?? '',
            heroHeadlineHighlight: block.headlineHighlight ?? '',
            heroSubhead: block.subhead ?? '',
            heroPrimaryCta: block.primaryCta ?? '',
            heroSecondaryCta: block.secondaryCta ?? '',
            heroStats: block.heroStats ?? [],
          }}
          secondaryHref={block.secondaryHref || '#'}
          renderPrimaryCta={(label, className) => <PreviewInertCta label={label} className={className} />}
          style={blockDesignStyle(block.design)}
        />
      )
    case 'simpleHeroBlock':
      return <SimpleHeroBlockView block={block} />
    case 'aboutSectionBlock':
      return <AboutSectionBlockView block={block} />
    case 'dashboardShowcaseBlock':
      return <DashboardShowcaseBlockView block={block} />
    case 'servicesGridBlock':
      return <ServicesGridBlockView block={block} />
    case 'statsBandBlock':
      return <StatsBandBlockView block={block} />
    case 'contactFormBlock':
      return (
        <ContactSection
          content={{ contactHeadline: block.headline, contactSubhead: block.subhead ?? '' }}
          onSubmit={async () => {}}
          style={blockDesignStyle(block.design)}
        />
      )
    case 'pipelineStripBlock':
      return <PipelineStripBlockView block={block} />
    case 'moduleDeepDiveListBlock':
      return <ModuleDeepDiveListBlockView block={block} />
    case 'integrationsBlock':
      return <IntegrationsBlockView block={block} />
    case 'featuredCaseStudyBlock':
      return <FeaturedCaseStudyBlockView block={block} />
    case 'testimonialGridBlock':
      return <TestimonialGridBlockView block={block} />
    case 'newsGridBlock':
      return <PreviewNewsGrid />
    default:
      return null
  }
}
