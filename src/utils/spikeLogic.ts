import type { SpikeStatus, Stat, UpgradeTier, UpgradeTierId } from '../types/profile'

const MARKERS = [0, 25, 50, 75, 90] as const

export const UPGRADE_TIERS: UpgradeTier[] = [
  { id: 'marginal-gains', label: '+ Marginal Gains', range: '90–100', min: 90, max: 100 },
  { id: 'power-spike', label: '★ Power Spike', range: '85+', min: 85, max: 89 },
  { id: 'spike-tier', label: '+ Spike Tier', range: '75–84', min: 75, max: 84 },
  { id: 'stable', label: '+ Stable', range: '50–74', min: 50, max: 74 },
  { id: 'baseline', label: '+ Baseline', range: '25–49', min: 25, max: 49 },
  { id: 'small-gain', label: '+ Small Gain', range: '0–24', min: 0, max: 24 },
]

export function getActiveTierId(score: number): UpgradeTierId {
  if (score >= 90) return 'marginal-gains'
  if (score >= 85) return 'power-spike'
  if (score >= 75) return 'spike-tier'
  if (score >= 50) return 'stable'
  if (score >= 25) return 'baseline'
  return 'small-gain'
}

export function getSpikeStatus(score: number): SpikeStatus {
  if (score >= 90) return 'Marginal Gains'
  if (score >= 85) return 'Power Spike Online'
  if (score >= 75) return 'Pre-Spike / High ROI'
  if (score >= 50) return 'Stable Baseline'
  if (score >= 25) return 'Early Investment'
  return 'Unbuilt'
}

export function generateInvestmentRead(score: number): string {
  if (score >= 90) {
    return 'Already spiked — further investment yields marginal gains only.'
  }
  if (score >= 85) {
    return 'Power spike online — maintain without overinvesting.'
  }
  if (score >= 75) {
    return 'Near spike — highest ROI window. Push here next.'
  }
  if (score >= 50) {
    return 'Stable baseline — usable but not a priority spike target.'
  }
  if (score >= 25) {
    return 'Early investment — core habits still under construction.'
  }
  return 'Underbuilt — inconsistent or neglected. Farm fundamentals first.'
}

export function getInvestmentLevel(score: number): string {
  const status = getSpikeStatus(score)
  switch (status) {
    case 'Marginal Gains':
      return 'Spiked — marginal returns only'
    case 'Power Spike Online':
      return 'Spike active — major upgrade online'
    case 'Pre-Spike / High ROI':
      return 'Pre-spike — high ROI window'
    case 'Stable Baseline':
      return 'Stable — holding lane'
    case 'Early Investment':
      return 'Early build — farm needed'
    case 'Unbuilt':
      return 'Unbuilt — critical gap'
  }
}

export function getNextInvestment(score: number): string {
  if (score >= 90) return 'Maintain — do not overinvest'
  if (score >= 85) return 'Hold spike — shift ROI elsewhere'
  if (score >= 75) return 'Push to 85 for power spike'
  if (score >= 50) return 'Grind toward 75 pre-spike tier'
  if (score >= 25) return 'Build to 50+ stable baseline'
  return 'Emergency farm — basics first'
}

export function getStatusColor(status: SpikeStatus): string {
  switch (status) {
    case 'Marginal Gains':
      return 'text-cyan-300 border-cyan-400/40 bg-cyan-400/10'
    case 'Power Spike Online':
      return 'text-amber-300 border-amber-400/50 bg-amber-400/10'
    case 'Pre-Spike / High ROI':
      return 'text-purple-300 border-purple-400/50 bg-purple-400/10'
    case 'Stable Baseline':
      return 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10'
    case 'Early Investment':
      return 'text-slate-300 border-slate-500/50 bg-slate-500/10'
    case 'Unbuilt':
      return 'text-red-300 border-red-400/50 bg-red-400/10'
  }
}

export function getTierRowClasses(tierId: UpgradeTierId, isActive: boolean): string {
  if (!isActive) {
    return 'border-slate-800/60 bg-slate-950/40 text-slate-600 opacity-50'
  }

  switch (tierId) {
    case 'marginal-gains':
      return 'tier-glow-marginal border-cyan-400/50 bg-cyan-950/40 text-cyan-200'
    case 'power-spike':
      return 'tier-glow-spike border-amber-400/60 bg-amber-950/40 text-amber-200'
    case 'spike-tier':
      return 'tier-glow-presike border-purple-400/50 bg-purple-950/40 text-purple-200'
    case 'stable':
      return 'tier-glow-stable border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
    case 'baseline':
      return 'tier-glow-baseline border-slate-500/40 bg-slate-900/50 text-slate-300'
    case 'small-gain':
      return 'tier-glow-unbuilt border-slate-700/30 bg-slate-950/60 text-slate-500'
  }
}

export function getColumnAccentClass(score: number): string {
  if (score >= 90) return 'column-accent-marginal'
  if (score >= 85) return 'column-accent-spike'
  if (score >= 75) return 'column-accent-presike'
  if (score >= 50) return 'column-accent-stable'
  return 'column-accent-unbuilt'
}

export function getChartMarkers(): readonly number[] {
  return MARKERS
}

export function findPeakStatIndex(stats: Stat[]): number {
  if (stats.length === 0) return -1
  let peakIndex = 0
  for (let i = 1; i < stats.length; i++) {
    if (stats[i].score > stats[peakIndex].score) {
      peakIndex = i
    }
  }
  return peakIndex
}

export function findWeakestStat(stats: Stat[]): Stat | null {
  if (stats.length === 0) return null
  return stats.reduce((min, stat) => (stat.score < min.score ? stat : min))
}

export function findStrongestStat(stats: Stat[]): Stat | null {
  if (stats.length === 0) return null
  return stats.reduce((max, stat) => (stat.score > max.score ? stat : max))
}

export function findBestHighRoiInvestment(stats: Stat[]): Stat | null {
  const preSpike = stats
    .filter((s) => s.score >= 75 && s.score < 85)
    .sort((a, b) => b.score - a.score)

  if (preSpike.length > 0) return preSpike[0]

  const below75 = stats.filter((s) => s.score < 75).sort((a, b) => a.score - b.score)
  if (below75.length > 0) return below75[0]

  return null
}

/** @deprecated Use findBestHighRoiInvestment */
export function findBestInvestmentTarget(stats: Stat[]): Stat | null {
  return findBestHighRoiInvestment(stats)
}

export function findMarginalGainsStats(stats: Stat[]): Stat[] {
  return stats.filter((s) => s.score >= 90).sort((a, b) => b.score - a.score)
}

export function countPowerSpikesOnline(stats: Stat[]): number {
  return stats.filter((s) => s.score >= 85).length
}

export function isScoreInTier(score: number, tier: UpgradeTier): boolean {
  return score >= tier.min && score <= tier.max
}
