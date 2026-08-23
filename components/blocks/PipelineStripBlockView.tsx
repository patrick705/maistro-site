import { PipelineStrip } from '../PipelineStrip'
import type { PipelineStripBlock } from '@/lib/content/types'

export function PipelineStripBlockView({ block }: { block: PipelineStripBlock }) {
  return (
    <PipelineStrip
      content={{
        channelsLabel: block.channelsLabel ?? '',
        channelsItems: block.channelsItems ?? [],
        menuManagerIcon: block.menuManagerIcon ?? '',
        menuManagerTitle: block.menuManagerTitle ?? '',
        menuManagerSub: block.menuManagerSub ?? '',
        maistroIcon: block.maistroIcon ?? '',
        maistroTitle: block.maistroTitle ?? '',
        maistroSub: block.maistroSub ?? '',
        outcomesLabel: block.outcomesLabel ?? '',
        outcomesItems: block.outcomesItems ?? [],
      }}
    />
  )
}
