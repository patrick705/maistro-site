import { SimpleHero } from '../SimpleHero'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { SimpleHeroBlock as SimpleHeroBlockData } from '@/lib/content/types'

export function SimpleHeroBlockView({ block }: { block: SimpleHeroBlockData }) {
  return (
    <SimpleHero
      content={{
        heroEyebrow: block.eyebrow ?? '',
        heroHeadlineBefore: block.headlineBefore ?? '',
        heroHeadlineHighlight: block.headlineHighlight ?? '',
        heroSubhead: block.subhead ?? '',
      }}
      headlineClamp={block.headlineClamp || 'clamp(40px, 10vw, 80px)'}
      style={blockDesignStyle(block.design)}
    />
  )
}
