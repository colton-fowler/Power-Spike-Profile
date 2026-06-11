import { toPng } from 'html-to-image'
import type { PowerSpikeProfile } from '../types/profile'
import {
  findBestInvestmentTarget,
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
  const nextInvest = findBestInvestmentTarget(profile.stats)
  const spikeHits = profile.stats.filter((s) => s.score >= 85)

  const lines = [
    `⚡ POWER SPIKE PROFILE — ${profile.profileName}`,
    `Archetype: ${profile.archetype}`,
    '',
    profile.summary,
    '',
    `Biggest strength: ${strongest?.name ?? '—'} (${strongest?.score ?? '—'})`,
    `Biggest weakness: ${weakest?.name ?? '—'} (${weakest?.score ?? '—'})`,
    `Best next investment: ${nextInvest?.name ?? '—'}`,
    '',
    'STAT BREAKDOWN:',
    ...profile.stats.map((stat) => {
      const status = getSpikeStatus(stat.score)
      return `• ${stat.name}: ${stat.score}/100 — ${status}`
    }),
  ]

  if (spikeHits.length > 0) {
    lines.push('', `Power spikes hit: ${spikeHits.map((s) => s.name).join(', ')}`)
  }

  lines.push('', 'Generated with Power Spike Profile')
  lines.push('This is a reflective tool, not a clinical assessment.')

  return lines.join('\n')
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}
