import { AboutSection } from '../AboutSection'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { AboutSectionBlock } from '@/lib/content/types'

const EMPTY_PIPELINE = {
  channelsIcon: '',
  channelsLabel: '',
  channelsTags: [],
  menuManagerIcon: '',
  menuManagerTitle: '',
  menuManagerSub: '',
  maistroIcon: '',
  maistroTitle: '',
  maistroSub: '',
  deliversIcon: '',
  deliversLabel: '',
  outputs: [],
}

export function AboutSectionBlockView({ block }: { block: AboutSectionBlock }) {
  return (
    <AboutSection
      content={{
        aboutEyebrow: block.eyebrow ?? '',
        aboutHeadlineBefore: block.headlineBefore ?? '',
        aboutHeadlineHighlight: block.headlineHighlight ?? '',
        aboutHeadlineAfter: block.headlineAfter ?? '',
        aboutBody: block.body ?? '',
        aboutPipeline: block.pipeline ?? EMPTY_PIPELINE,
      }}
      style={blockDesignStyle(block.design)}
    />
  )
}
