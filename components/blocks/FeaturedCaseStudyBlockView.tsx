import { FeaturedCaseStudy } from '../FeaturedCaseStudy'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { FeaturedCaseStudyBlock } from '@/lib/content/types'

export function FeaturedCaseStudyBlockView({ block }: { block: FeaturedCaseStudyBlock }) {
  return (
    <FeaturedCaseStudy
      content={{
        caseStudyEyebrow: block.eyebrow ?? '',
        caseStudyHeadline: block.headline ?? '',
        caseStudyBody: block.body ?? '',
        caseStudyQuote: block.quote ?? '',
        caseStudyAuthor: block.author ?? '',
        caseStudyHeroStat: block.heroStat ?? { value: '', label: '' },
        caseStudyStats: block.stats ?? [],
      }}
      style={blockDesignStyle(block.design)}
    />
  )
}
