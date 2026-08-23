import { DashboardShowcase } from '../DashboardShowcase'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { DashboardShowcaseBlock } from '@/lib/content/types'

export function DashboardShowcaseBlockView({ block }: { block: DashboardShowcaseBlock }) {
  if (!block.showcase) return null
  return <DashboardShowcase content={block.showcase} style={blockDesignStyle(block.design)} />
}
