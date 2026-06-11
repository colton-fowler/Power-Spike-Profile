import type { ReactNode } from 'react'
import type { ChartView } from '../types/profile'

interface ViewToggleProps {
  view: ChartView
  onChange: (view: ChartView) => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700/60 bg-slate-900/60 p-1">
      <ToggleButton
        active={view === 'board'}
        onClick={() => onChange('board')}
      >
        Upgrade Board
      </ToggleButton>
      <ToggleButton
        active={view === 'detailed'}
        onClick={() => onChange('detailed')}
      >
        Detailed Rows
      </ToggleButton>
    </div>
  )
}

interface ToggleButtonProps {
  active: boolean
  onClick: () => void
  children: ReactNode
}

function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all sm:px-4 sm:text-sm ${
        active
          ? 'bg-gradient-to-r from-cyan-700/80 to-purple-700/80 text-white shadow-[0_0_12px_rgba(34,211,238,0.2)]'
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}
