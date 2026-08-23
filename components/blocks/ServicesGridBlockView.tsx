import { ServicesGrid } from '../ServicesGrid'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { ServicesGridBlock } from '@/lib/content/types'

export function ServicesGridBlockView({ block }: { block: ServicesGridBlock }) {
  return (
    <ServicesGrid
      content={{
        servicesEyebrow: block.eyebrow ?? '',
        servicesHeadline: block.headline ?? '',
        services: block.services ?? [],
      }}
      style={blockDesignStyle(block.design)}
    />
  )
}
