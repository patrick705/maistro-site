import { useRef, useState } from 'react'

import { SimpleBlockEditor, isReadOnlyBlockType, type SimpleBlockEditorHandle } from './SimpleBlockEditor'
import { KitchenErrorBoundary } from './KitchenErrorBoundary'
import { DesignTab } from './DesignTab'
import { DESIGN_TAB_BLOCK_TYPES } from './blockTypes'
import { kitchen } from './theme'

type Tab = 'content' | 'design'

export function EditSectionDrawer({
  block,
  typeTag,
  onSave,
  onClose,
  onOpenThemeSettings,
}: {
  block: Record<string, any>
  typeTag: string
  onSave: (fields: Record<string, unknown>) => void
  onClose: () => void
  onOpenThemeSettings: () => void
}) {
  const [tab, setTab] = useState<Tab>('content')
  const editorRef = useRef<SimpleBlockEditorHandle>(null)
  const readOnly = isReadOnlyBlockType(block._type)
  const hasDesignTab = DESIGN_TAB_BLOCK_TYPES.has(block._type)

  return (
    <div
      style={{
        position: 'fixed',
        top: 47,
        right: 0,
        bottom: 0,
        width: 440,
        maxWidth: '100%',
        background: '#fff',
        borderLeft: `1px solid ${kitchen.borderSoft}`,
        boxShadow: '-8px 0 24px rgba(58,42,102,0.12)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${kitchen.border}` }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: kitchen.textMuted }}>
          Edit section
        </span>
        <span
          style={{
            fontSize: 10.5,
            fontFamily: kitchen.fontMono,
            padding: '2px 8px',
            borderRadius: 999,
            background: kitchen.surface,
            color: kitchen.textSubtle,
          }}
        >
          {typeTag}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 15,
            color: kitchen.textFaint,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0' }}>
        <TabButton label="Content" active={tab === 'content'} onClick={() => setTab('content')} />
        <TabButton
          label="Design"
          active={tab === 'design'}
          disabled={!hasDesignTab}
          onClick={hasDesignTab ? () => setTab('design') : undefined}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', borderTop: `1px solid ${kitchen.border}`, marginTop: 10 }}>
        {tab === 'content' ? (
          <KitchenErrorBoundary label="Editor">
            <SimpleBlockEditor ref={editorRef} block={block} onSave={onSave} />
          </KitchenErrorBoundary>
        ) : hasDesignTab ? (
          <KitchenErrorBoundary label="Design">
            <DesignTab block={block} onPatchDesign={onSave} onOpenThemeSettings={onOpenThemeSettings} />
          </KitchenErrorBoundary>
        ) : (
          <div style={{ padding: 20, fontSize: 12, color: kitchen.textFaint }}>
            No design controls exist for this section yet.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px', borderTop: `1px solid ${kitchen.border}` }}>
        <button type="button" onClick={onClose} style={cancelBtnStyle()}>
          {tab === 'design' ? 'Close' : 'Cancel'}
        </button>
        {tab === 'content' && !readOnly && (
          <button type="button" onClick={() => editorRef.current?.save()} style={saveBtnStyle()}>
            Save section
          </button>
        )}
      </div>
    </div>
  )
}

function TabButton({ label, active, disabled, onClick }: { label: string; active: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={disabled ? 'No design controls exist for this section yet' : undefined}
      style={{
        padding: '7px 14px',
        border: `1px solid ${active ? kitchen.accent : kitchen.borderInput}`,
        borderRadius: 8,
        background: active ? kitchen.accent : '#fff',
        color: active ? '#fff' : disabled ? kitchen.textFaint : kitchen.textBody,
        fontWeight: 600,
        fontSize: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  )
}

function cancelBtnStyle(): React.CSSProperties {
  return {
    padding: '7px 14px',
    border: `1px solid ${kitchen.borderInput}`,
    borderRadius: 8,
    background: '#fff',
    color: kitchen.textBody,
    fontWeight: 600,
    fontSize: 12.5,
    cursor: 'pointer',
  }
}

function saveBtnStyle(): React.CSSProperties {
  return {
    padding: '7px 16px',
    border: `1px solid ${kitchen.accent}`,
    borderRadius: 8,
    background: kitchen.accent,
    color: '#fff',
    fontWeight: 600,
    fontSize: 12.5,
    cursor: 'pointer',
  }
}
