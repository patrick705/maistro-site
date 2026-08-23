import { Component, type ReactNode } from 'react'

import { kitchen } from './theme'

/**
 * Without this, a render error in one block's editor or preview (like the
 * aboutSectionBlock crash) takes down the whole Kitchen tool — React unmounts
 * the entire tree above the nearest error boundary, so every other block on
 * the page disappears too, not just the broken one. Scoped per-block so a bug
 * in one section can never blank out the rest of the page.
 */
export class KitchenErrorBoundary extends Component<{ label: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, fontSize: 12, color: kitchen.danger, background: '#FBEEEE' }}>
          {this.props.label} failed to render: {this.state.error.message}
        </div>
      )
    }
    return this.props.children
  }
}
