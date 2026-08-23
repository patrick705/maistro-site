'use client'

import { ContactSection } from '../ContactSection'
import { submitLead } from '@/lib/submitLead'
import { blockDesignStyle } from '@/lib/content/blockDesignStyle'
import type { ContactFormBlock } from '@/lib/content/types'

export function ContactFormBlockView({ block }: { block: ContactFormBlock }) {
  return (
    <ContactSection
      content={{
        contactHeadline: block.headline,
        contactSubhead: block.subhead ?? '',
      }}
      onSubmit={(fields) => submitLead({ ...fields, source: 'contact-form' })}
      style={blockDesignStyle(block.design)}
    />
  )
}
