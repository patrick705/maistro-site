import { DashboardShowcase } from '../DashboardShowcase'
import type { DashboardShowcaseBlock } from '@/lib/content/types'

export function DashboardShowcaseBlockView({ block }: { block: DashboardShowcaseBlock }) {
  if (!block.showcase) return null
  return <DashboardShowcase content={block.showcase} />
}
