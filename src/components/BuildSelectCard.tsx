interface BuildSelectCardProps {
  title: string
  description: string
  selected?: boolean
  accent?: string
  tag?: string
  onClick: () => void
  compact?: boolean
  codex?: boolean
}

const accentStyles: Record<string, string> = {
  cyan: 'border-cyan-500/40 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]',
  red: 'border-red-500/40 hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(248,113,113,0.15)]',
  purple:
    'border-purple-500/40 hover:border-purple-400/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  amber:
    'border-amber-500/40 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]',
  emerald:
    'border-emerald-500/40 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  orange:
    'border-orange-500/40 hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]',
}

const selectedStyles: Record<string, string> = {
  cyan: 'border-cyan-300 bg-cyan-950/50 shadow-[0_0_28px_rgba(34,211,238,0.35)] ring-2 ring-cyan-400/40',
  red: 'border-red-300 bg-red-950/50 shadow-[0_0_28px_rgba(248,113,113,0.35)] ring-2 ring-red-400/40',
  purple:
    'border-purple-300 bg-purple-950/50 shadow-[0_0_28px_rgba(168,85,247,0.35)] ring-2 ring-purple-400/40',
  amber:
    'border-amber-300 bg-amber-950/50 shadow-[0_0_28px_rgba(251,191,36,0.35)] ring-2 ring-amber-400/40',
  emerald:
    'border-emerald-300 bg-emerald-950/50 shadow-[0_0_28px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/40',
  orange:
    'border-orange-300 bg-orange-950/50 shadow-[0_0_28px_rgba(251,146,60,0.35)] ring-2 ring-orange-400/40',
}

export function BuildSelectCard({
  title,
  description,
  selected = false,
  accent = 'cyan',
  tag,
  onClick,
  compact = false,
  codex = false,
}: BuildSelectCardProps) {
  const accentClass = selected
    ? (selectedStyles[accent] ?? selectedStyles.cyan)
    : (accentStyles[accent] ?? accentStyles.cyan)

  const padding = codex ? 'p-2.5' : compact ? 'p-3' : 'p-4 sm:p-5'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-lg border bg-gradient-to-br from-slate-900/90 to-slate-950/90 text-left transition-all duration-200 ${accentClass} ${padding}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`font-display font-semibold tracking-wide text-slate-100 ${codex ? 'text-sm' : compact ? 'text-sm' : 'text-base sm:text-lg'}`}
        >
          {title}
        </p>
        {tag && (
          <span className="shrink-0 rounded border border-slate-600/50 bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-400">
            {tag}
          </span>
        )}
      </div>
      <p
        className={`mt-0.5 leading-snug text-slate-400 ${codex ? 'text-[11px] line-clamp-2' : compact ? 'text-xs' : 'text-sm'}`}
      >
        {description}
      </p>
      {selected && codex && (
        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
          ▶ Active Build
        </p>
      )}
      {selected && !codex && (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-300/80">
          Selected Build
        </p>
      )}
    </button>
  )
}
