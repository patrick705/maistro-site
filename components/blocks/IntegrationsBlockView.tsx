import { IntegrationsBand } from '../IntegrationsBand'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { IntegrationsBlock } from '@/lib/content/types'

export function IntegrationsBlockView({ block }: { block: IntegrationsBlock }) {
  return (
    <IntegrationsBand
      content={{
        integrationsEyebrow: block.eyebrow ?? '',
        integrationsHeadline: block.headline ?? '',
        integrations: block.integrations ?? [],
      }}
      style={blockDesignStyle(block.design)}
    />
  )
}
