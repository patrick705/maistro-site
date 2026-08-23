import { BookDemoButton } from '../BookDemoButton'
import { Hero } from '../Hero'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { RichHeroBlock } from '@/lib/content/types'

export function RichHero({ block }: { block: RichHeroBlock }) {
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
      renderPrimaryCta={(label, className) => <BookDemoButton label={label} className={className} />}
      style={blockDesignStyle(block.design)}
    />
  )
}
