import type { Stat } from '../types/profile'
import { findBestHighRoiInvestment, findPeakStatIndex } from '../utils/spikeLogic'
import { UpgradeColumn } from './UpgradeColumn'

interface UpgradeBoardProps {
  stats: Stat[]
  compact?: boolean
}

export function UpgradeBoard({ stats, compact = false }: UpgradeBoardProps) {
  const peakIndex = findPeakStatIndex(stats)
  const bestRoi = findBestHighRoiInvestment(stats)

  return (
    <div className={compact ? '' : 'space-y-4'}>
      {!compact && (
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Investment Spike System
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <RoiLegend
              color="text-purple-300 border-purple-500/40 bg-purple-950/30"
              title="Pre-spike: high ROI investment"
              detail="75–84 — biggest gains per point"
            />
            <RoiLegend
              color="text-amber-300 border-amber-500/40 bg-amber-950/30"
              title="Spike hit: major upgrade online"
              detail="85–89 — star moment unlocked"
            />
            <RoiLegend
              color="text-cyan-300 border-cyan-500/40 bg-cyan-950/30"
              title="Post-spike: marginal gains only"
              detail="90+ — still helps, smaller returns"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {stats.map((stat, index) => (
          <UpgradeColumn
            key={`${stat.name}-${index}`}
            stat={stat}
            isPeak={index === peakIndex}
            isBestRoi={bestRoi?.name === stat.name}
          />
        ))}
      </div>
    </div>
  )
}

interface RoiLegendProps {
  color: string
  title: string
  detail: string
}

function RoiLegend({ color, title, detail }: RoiLegendProps) {
  return (
    <div className={`rounded border px-3 py-2 ${color}`}>
      <p className="text-[11px] font-semibold leading-tight">{title}</p>
      <p className="mt-0.5 text-[10px] opacity-80">{detail}</p>
    </div>
  )
}
