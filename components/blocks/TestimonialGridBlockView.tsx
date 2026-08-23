import { TestimonialGrid } from '../TestimonialGrid'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { TestimonialGridBlock } from '@/lib/content/types'

export function TestimonialGridBlockView({ block }: { block: TestimonialGridBlock }) {
  return (
    <TestimonialGrid
      content={{
        testimonialsEyebrow: block.eyebrow ?? '',
        testimonialsHeadline: block.headline ?? '',
        testimonials: block.testimonials ?? [],
      }}
      style={blockDesignStyle(block.design)}
    />
  )
}
