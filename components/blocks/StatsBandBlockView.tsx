import { ResultsBand } from '../ResultsBand'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { StatsBandBlock } from '@/lib/content/types'

export function StatsBandBlockView({ block }: { block: StatsBandBlock }) {
  return (
    <ResultsBand
      content={{
        resultsEyebrow: block.eyebrow ?? '',
        resultsHeadline: block.headline ?? '',
        resultStats: block.stats ?? [],
      }}
      style={blockDesignStyle(block.design)}
    />
  )
}
