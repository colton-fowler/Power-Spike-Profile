interface BuildSelectCardProps {
  title: string
  description: string
  selected?: boolean
  accent?: string
  onClick: () => void
  compact?: boolean
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
  cyan: 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_24px_rgba(34,211,238,0.25)]',
  red: 'border-red-400 bg-red-950/40 shadow-[0_0_24px_rgba(248,113,113,0.25)]',
  purple: 'border-purple-400 bg-purple-950/40 shadow-[0_0_24px_rgba(168,85,247,0.25)]',
  amber: 'border-amber-400 bg-amber-950/40 shadow-[0_0_24px_rgba(251,191,36,0.25)]',
  emerald: 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_24px_rgba(52,211,153,0.25)]',
  orange: 'border-orange-400 bg-orange-950/40 shadow-[0_0_24px_rgba(251,146,60,0.25)]',
}

export function BuildSelectCard({
  title,
  description,
  selected = false,
  accent = 'cyan',
  onClick,
  compact = false,
}: BuildSelectCardProps) {
  const accentClass = selected
    ? (selectedStyles[accent] ?? selectedStyles.cyan)
    : (accentStyles[accent] ?? accentStyles.cyan)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-lg border bg-gradient-to-br from-slate-900/90 to-slate-950/90 text-left transition-all duration-200 ${accentClass} ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      <p
        className={`font-display font-semibold tracking-wide text-slate-100 ${compact ? 'text-sm' : 'text-base sm:text-lg'}`}
      >
        {title}
      </p>
      <p className={`mt-1 leading-snug text-slate-400 ${compact ? 'text-xs' : 'text-sm'}`}>
        {description}
      </p>
      {selected && (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-300/80">
          Selected Build
        </p>
      )}
    </button>
  )
}
