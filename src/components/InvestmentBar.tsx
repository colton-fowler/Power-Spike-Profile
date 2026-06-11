import { getChartMarkers, getFillClass, getVisualTier } from '../utils/spikeLogic'
import { StarMarker } from './StarMarker'

interface InvestmentBarProps {
  score: number
  showStar?: boolean
  isPeak?: boolean
}

export function InvestmentBar({ score, showStar = false, isPeak = false }: InvestmentBarProps) {
  const tier = getVisualTier(score)
  const fillClass = getFillClass(tier)
  const markers = getChartMarkers()
  const clampedScore = Math.min(100, Math.max(0, score))

  return (
    <div className="relative w-full">
      <div className="relative h-3 overflow-hidden rounded-sm border border-slate-700/80 bg-slate-900/90">
        <div
          className={`absolute inset-y-0 left-0 rounded-sm transition-all duration-500 ${fillClass} ${tier === 'weak' ? 'opacity-60' : 'opacity-100'}`}
          style={{ width: `${clampedScore}%` }}
        />
        {markers.map((marker) => (
          <div
            key={marker}
            className="absolute top-0 bottom-0 w-px bg-slate-600/70"
            style={{ left: `${marker}%` }}
          />
        ))}
        {showStar && (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${clampedScore}%` }}
          >
            <StarMarker isPeak={isPeak} />
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-widest text-slate-500">
        {markers.map((marker) => (
          <span key={marker}>{marker}</span>
        ))}
      </div>
    </div>
  )
}
