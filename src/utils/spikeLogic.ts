import type { SpikeStatus, Stat, VisualTier } from '../types/profile'

const MARKERS = [0, 25, 50, 75, 90] as const

export function getSpikeStatus(score: number): SpikeStatus {
  if (score >= 85) return 'Spike Hit'
  if (score >= 75) return 'Near Major Spike'
  if (score >= 60) return 'Stable Investment'
  if (score >= 40) return 'Needs Investment'
  return 'Underinvested'
}

export function getVisualTier(score: number): VisualTier {
  if (score >= 85) return 'spike'
  if (score >= 70) return 'strong'
  if (score >= 40) return 'playable'
  return 'weak'
}

export function getInvestmentLevel(score: number): string {
  if (score >= 85) return 'Maxed — power spike online'
  if (score >= 75) return 'High — one more push'
  if (score >= 60) return 'Mid — holding lane'
  if (score >= 40) return 'Low — farm needed'
  return 'Critical — bleeding gold'
}

export function getNextInvestment(score: number): string {
  if (score >= 85) return "Maintain — don't overextend"
  if (score >= 75) return 'Push to 85+ for spike'
  if (score >= 60) return 'Stabilize above 75'
  if (score >= 40) return 'Grind to 60+ baseline'
  return 'Emergency farm — basics first'
}

export function getStatusColor(status: SpikeStatus): string {
  switch (status) {
    case 'Spike Hit':
      return 'text-amber-300 border-amber-400/50 bg-amber-400/10'
    case 'Near Major Spike':
      return 'text-purple-300 border-purple-400/50 bg-purple-400/10'
    case 'Stable Investment':
      return 'text-cyan-300 border-cyan-400/50 bg-cyan-400/10'
    case 'Needs Investment':
      return 'text-slate-300 border-slate-400/50 bg-slate-400/10'
    case 'Underinvested':
      return 'text-red-300 border-red-400/50 bg-red-400/10'
  }
}

export function getFillClass(tier: VisualTier): string {
  switch (tier) {
    case 'spike':
      return 'investment-fill-spike'
    case 'strong':
      return 'investment-fill-strong'
    case 'playable':
      return 'investment-fill-playable'
    case 'weak':
      return 'investment-fill-weak'
  }
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

export function findBestInvestmentTarget(stats: Stat[]): Stat | null {
  if (stats.length === 0) return null

  const nearSpike = stats
    .filter((s) => s.score >= 60 && s.score < 85)
    .sort((a, b) => b.score - a.score)

  if (nearSpike.length > 0) return nearSpike[0]

  const needsWork = stats
    .filter((s) => s.score < 60)
    .sort((a, b) => b.score - a.score)

  if (needsWork.length > 0) return needsWork[0]

  return findWeakestStat(stats)
}
