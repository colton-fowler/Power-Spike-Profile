import type { PowerSpikeProfile } from '../types/profile'
import {
  findBestInvestmentTarget,
  findStrongestStat,
  findWeakestStat,
} from '../utils/spikeLogic'

interface SummaryPanelProps {
  profile: PowerSpikeProfile
}

export function SummaryPanel({ profile }: SummaryPanelProps) {
  const strongest = findStrongestStat(profile.stats)
  const weakest = findWeakestStat(profile.stats)
  const nextInvest = findBestInvestmentTarget(profile.stats)
  const spikeCount = profile.stats.filter((s) => s.score >= 85).length

  return (
    <aside className="panel-glow rounded-lg border border-cyan-800/30 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-purple-950/30 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/70">
        Profile Intel
      </p>
      <h2 className="font-display mt-2 text-2xl font-bold tracking-wide text-white sm:text-3xl">
        {profile.profileName}
      </h2>
      <p className="mt-1 font-display text-lg font-medium text-amber-300/90">
        {profile.archetype}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">{profile.summary}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <SummaryCard
          label="Biggest Strength"
          value={strongest?.name ?? '—'}
          detail={strongest ? `${strongest.score}/100` : ''}
          tone="positive"
        />
        <SummaryCard
          label="Biggest Weakness"
          value={weakest?.name ?? '—'}
          detail={weakest ? `${weakest.score}/100` : ''}
          tone="negative"
        />
      </div>

      <div className="mt-3 rounded-lg border border-purple-500/30 bg-purple-950/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-300/80">
          Best Stat to Invest In Next
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-purple-100">
          {nextInvest?.name ?? '—'}
        </p>
        {nextInvest && (
          <p className="mt-1 text-sm text-slate-400">
            Currently at {nextInvest.score}/100 — highest ROI upgrade path.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {spikeCount > 0
          ? `${spikeCount} power spike${spikeCount > 1 ? 's' : ''} online. Do not get cocky on the rest.`
          : 'No power spikes yet. Farm the fundamentals.'}
      </p>
    </aside>
  )
}

interface SummaryCardProps {
  label: string
  value: string
  detail: string
  tone: 'positive' | 'negative'
}

function SummaryCard({ label, value, detail, tone }: SummaryCardProps) {
  const border =
    tone === 'positive' ? 'border-emerald-700/40 bg-emerald-950/20' : 'border-red-800/40 bg-red-950/20'
  const labelColor = tone === 'positive' ? 'text-emerald-400/80' : 'text-red-400/80'
  const valueColor = tone === 'positive' ? 'text-emerald-100' : 'text-red-100'

  return (
    <div className={`rounded-lg border p-3 ${border}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider ${labelColor}`}>{label}</p>
      <p className={`mt-1 font-display text-base font-semibold ${valueColor}`}>{value}</p>
      {detail && <p className="text-xs text-slate-500">{detail}</p>}
    </div>
  )
}
