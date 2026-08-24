import type { PageBlock } from '@/lib/content/types'
import { BookDemoButton } from './BookDemoButton'
import { HeaderOverlayRequest } from './HeaderOverlayRequest'
import { HeroCarousel } from './blocks/HeroCarousel'
import { TextBlock } from './blocks/TextBlock'
import { SideBySide } from './blocks/SideBySide'
import { ImageGallery } from './blocks/ImageGallery'
import { SocialLinksBlock } from './blocks/SocialLinksBlock'
import { LiveVideo } from './blocks/LiveVideo'
import { BackgroundVideo } from './blocks/BackgroundVideo'
import { LogoStrip } from './blocks/LogoStrip'
import { CtaBanner } from './blocks/CtaBanner'
import { RichHero } from './blocks/RichHero'
import { SimpleHeroBlockView } from './blocks/SimpleHeroBlock'
import { AboutSectionBlockView } from './blocks/AboutSectionBlockView'
import { DashboardShowcaseBlockView } from './blocks/DashboardShowcaseBlockView'
import { ServicesGridBlockView } from './blocks/ServicesGridBlockView'
import { StatsBandBlockView } from './blocks/StatsBandBlockView'
import { ContactFormBlockView } from './blocks/ContactFormBlockView'
import { PipelineStripBlockView } from './blocks/PipelineStripBlockView'
import { ModuleDeepDiveListBlockView } from './blocks/ModuleDeepDiveListBlockView'
import { IntegrationsBlockView } from './blocks/IntegrationsBlockView'
import { FeaturedCaseStudyBlockView } from './blocks/FeaturedCaseStudyBlockView'
import { TestimonialGridBlockView } from './blocks/TestimonialGridBlockView'
import { NewsGridBlockView } from './blocks/NewsGridBlockView'

export function PageBuilder({ blocks }: { blocks: PageBlock[] }) {
  const leading = blocks[0]
  const wantsHeaderOverlay = leading?._type === 'backgroundVideoBlock' && leading.menuOverlay !== false

  return (
    <>
      <HeaderOverlayRequest enabled={wantsHeaderOverlay} />
      {blocks.map((block) => {
        switch (block._type) {
          case 'heroCarouselBlock':
            return <HeroCarousel key={block._key} block={block} />
          case 'textBlock':
            return <TextBlock key={block._key} block={block} />
          case 'sideBySideBlock':
            return <SideBySide key={block._key} block={block} />
          case 'imageGalleryBlock':
            return <ImageGallery key={block._key} block={block} />
          case 'socialLinksBlock':
            return <SocialLinksBlock key={block._key} block={block} />
          case 'liveVideoBlock':
            return <LiveVideo key={block._key} block={block} />
          case 'backgroundVideoBlock':
            return (
              <BackgroundVideo
                key={block._key}
                block={block}
                renderPrimaryCta={(label, className) => <BookDemoButton label={label} className={className} />}
                renderSecondaryCta={(label, className) => <BookDemoButton label={label} className={className} />}
              />
            )
          case 'logoStripBlock':
            return <LogoStrip key={block._key} block={block} />
          case 'ctaBannerBlock':
            return (
              <CtaBanner
                key={block._key}
                block={block}
                renderCta={(label, href, className) => <BookDemoButton label={label} href={href} className={className} />}
              />
            )
          case 'richHeroBlock':
            return <RichHero key={block._key} block={block} />
          case 'simpleHeroBlock':
            return <SimpleHeroBlockView key={block._key} block={block} />
          case 'aboutSectionBlock':
            return <AboutSectionBlockView key={block._key} block={block} />
          case 'dashboardShowcaseBlock':
            return <DashboardShowcaseBlockView key={block._key} block={block} />
          case 'servicesGridBlock':
            return <ServicesGridBlockView key={block._key} block={block} />
          case 'statsBandBlock':
            return <StatsBandBlockView key={block._key} block={block} />
          case 'contactFormBlock':
            return <ContactFormBlockView key={block._key} block={block} />
          case 'pipelineStripBlock':
            return <PipelineStripBlockView key={block._key} block={block} />
          case 'moduleDeepDiveListBlock':
            return <ModuleDeepDiveListBlockView key={block._key} block={block} />
          case 'integrationsBlock':
            return <IntegrationsBlockView key={block._key} block={block} />
          case 'featuredCaseStudyBlock':
            return <FeaturedCaseStudyBlockView key={block._key} block={block} />
          case 'testimonialGridBlock':
            return <TestimonialGridBlockView key={block._key} block={block} />
          case 'newsGridBlock':
            return <NewsGridBlockView key={block._key} />
          default:
            return null
        }
      })}
    </>
  )
}
