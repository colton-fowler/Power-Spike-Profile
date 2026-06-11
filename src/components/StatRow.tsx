import type { Stat } from '../types/profile'
import {
  getInvestmentLevel,
  getNextInvestment,
  getSpikeStatus,
  getStatusColor,
} from '../utils/spikeLogic'
import { InvestmentBar } from './InvestmentBar'

interface StatRowProps {
  stat: Stat
  isPeak: boolean
}

export function StatRow({ stat, isPeak }: StatRowProps) {
  const status = getSpikeStatus(stat.score)
  const statusColor = getStatusColor(status)
  const showStar = stat.score >= 85

  return (
    <article className="panel-glow rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold tracking-wide text-slate-100">
              {stat.name}
            </h3>
            <span className="rounded border border-slate-600/50 bg-slate-800/60 px-2 py-0.5 text-xs uppercase tracking-wider text-slate-400">
              {stat.category}
            </span>
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-cyan-300">
            {stat.score}
            <span className="text-sm font-normal text-slate-500">/100</span>
          </p>
        </div>
        <span
          className={`rounded border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <InvestmentBar score={stat.score} showStar={showStar} isPeak={isPeak && showStar} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded border border-slate-700/50 bg-slate-900/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Investment
          </p>
          <p className="mt-1 text-sm text-slate-300">{getInvestmentLevel(stat.score)}</p>
        </div>
        <div className="rounded border border-purple-800/30 bg-purple-950/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-400/80">
            Next Investment
          </p>
          <p className="mt-1 text-sm text-purple-200/90">{getNextInvestment(stat.score)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-700/50 pt-4">
        <p className="text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-slate-400">Comment: </span>
          {stat.comment}
        </p>
        <p className="text-sm leading-relaxed text-cyan-100/90">
          <span className="font-semibold text-cyan-400/80">Tip: </span>
          {stat.tip}
        </p>
      </div>
    </article>
  )
}
