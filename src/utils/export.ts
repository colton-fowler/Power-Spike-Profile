import { toPng } from 'html-to-image'
import type { PowerSpikeProfile } from '../types/profile'
import {
  countPowerSpikesOnline,
  findBestHighRoiInvestment,
  findMarginalGainsStats,
  findStrongestStat,
  findWeakestStat,
  getSpikeStatus,
} from './spikeLogic'

export async function downloadChartPng(element: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#070b14',
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

export function buildShareableSummary(profile: PowerSpikeProfile): string {
  const strongest = findStrongestStat(profile.stats)
  const weakest = findWeakestStat(profile.stats)
  const bestRoi = findBestHighRoiInvestment(profile.stats)
  const marginalStats = findMarginalGainsStats(profile.stats)
  const spikeCount = countPowerSpikesOnline(profile.stats)

  const lines = [
    `⚡ POWER SPIKE PROFILE — ${profile.profileName}`,
    `Archetype: ${profile.archetype}`,
    '',
    profile.summary,
    '',
    `Power spikes online: ${spikeCount}`,
    `Biggest strength: ${strongest?.name ?? '—'} (${strongest?.score ?? '—'})`,
    `Biggest weakness: ${weakest?.name ?? '—'} (${weakest?.score ?? '—'})`,
    `Best high-ROI investment: ${bestRoi?.name ?? '—'}${bestRoi ? ` (${bestRoi.score})` : ''}`,
  ]

  if (marginalStats.length > 0) {
    lines.push(
      `Overinvested / marginal gains: ${marginalStats.map((s) => `${s.name} (${s.score})`).join(', ')}`,
    )
  }

  lines.push('', 'STAT BREAKDOWN:')
  lines.push(
    ...profile.stats.map((stat) => {
      const status = getSpikeStatus(stat.score)
      return `• ${stat.name}: ${stat.score}/100 — ${status}`
    }),
  )

  lines.push('', 'Generated with Power Spike Profile')
  lines.push('This is a reflective tool, not a clinical assessment.')

  return lines.join('\n')
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}
