import { ModuleFeature, ModulesHeading } from '../ModuleFeature'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { ModuleDeepDiveListBlock } from '@/lib/content/types'

export function ModuleDeepDiveListBlockView({ block }: { block: ModuleDeepDiveListBlock }) {
  const modules = block.modules ?? []
  return (
    <>
      <ModulesHeading eyebrow={block.eyebrow ?? ''} headline={block.headline ?? ''} style={blockDesignStyle(block.design)} />
      {modules.map((module, i) => (
        <ModuleFeature key={module.headline + i} content={module} reversed={i % 2 === 1} />
      ))}
    </>
  )
}
