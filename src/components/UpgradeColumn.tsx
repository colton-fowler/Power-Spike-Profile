import type { Stat } from '../types/profile'
import {
  getActiveTierId,
  getColumnAccentClass,
  getSpikeStatus,
  getStatusColor,
  getTierRowClasses,
  isScoreInTier,
  UPGRADE_TIERS,
} from '../utils/spikeLogic'
import { StarMarker } from './StarMarker'

interface UpgradeColumnProps {
  stat: Stat
  isPeak: boolean
  isBestRoi?: boolean
}

export function UpgradeColumn({ stat, isPeak, isBestRoi = false }: UpgradeColumnProps) {
  const activeTierId = getActiveTierId(stat.score)
  const status = getSpikeStatus(stat.score)
  const statusColor = getStatusColor(status)
  const accentClass = getColumnAccentClass(stat.score)

  return (
    <article
      className={`upgrade-column ${accentClass} flex min-w-[140px] max-w-[180px] flex-1 flex-col rounded-lg border bg-slate-950/80 p-3 sm:min-w-[155px]`}
    >
      {isBestRoi && (
        <span className="mb-2 rounded border border-purple-400/40 bg-purple-950/50 px-1.5 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-purple-300">
          Best ROI
        </span>
      )}

      <h3 className="font-display text-center text-xs font-semibold leading-tight tracking-wide text-slate-100 sm:text-sm">
        {stat.name}
      </h3>
      <p className="mt-1 text-center font-display text-xl font-bold text-cyan-300">
        {stat.score}
        <span className="text-xs font-normal text-slate-500">/100</span>
      </p>
      <span
        className={`mx-auto mt-1.5 rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${statusColor}`}
      >
        {status}
      </span>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        {UPGRADE_TIERS.map((tier) => {
          const isActive = isScoreInTier(stat.score, tier)
          const rowClass = getTierRowClasses(tier.id, isActive)
          const showStar = tier.id === 'power-spike' && stat.score >= 85
          const showMarginal = tier.id === 'marginal-gains' && stat.score >= 90

          return (
            <div
              key={tier.id}
              className={`relative flex items-center justify-between rounded border px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-all ${rowClass} ${isActive ? 'animate-pulse-glow' : ''}`}
            >
              <span className="truncate leading-tight">{tier.label}</span>
              <div className="ml-1 flex shrink-0 items-center gap-0.5">
                {showStar && (
                  <StarMarker isPeak={isPeak && stat.score < 90} className="h-3 w-3" />
                )}
                {showMarginal && (
                  <span className="text-[8px] text-cyan-400/80" title="Marginal gains">
                    ↓ROI
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {activeTierId === 'spike-tier' && (
        <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-wide text-purple-400/90">
          Pre-spike ROI
        </p>
      )}
      {stat.score >= 85 && stat.score < 90 && (
        <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-wide text-amber-400/90">
          Spike online
        </p>
      )}
      {stat.score >= 90 && (
        <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-wide text-cyan-400/70">
          Marginal gains
        </p>
      )}

      <p className="mt-2 line-clamp-3 text-[10px] leading-snug text-slate-500">
        {stat.investmentRead}
      </p>
    </article>
  )
}
