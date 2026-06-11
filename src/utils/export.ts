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

const EXPORT_BG = '#0d1524'

function assertExportNodeHasContent(element: HTMLElement): void {
  const { width, height } = element.getBoundingClientRect()
  if (width < 1 || height < 1) {
    throw new Error('Export node has no visible dimensions')
  }

  const columns = element.querySelectorAll('.upgrade-column')
  if (columns.length === 0) {
    throw new Error('Export node is missing upgrade columns')
  }

  const summaryHeading = element.querySelector('aside h2')
  if (!summaryHeading?.textContent?.trim()) {
    throw new Error('Export node is missing summary panel content')
  }

  const hasStatScores = Array.from(element.querySelectorAll('.upgrade-column p')).some((node) =>
    /\d+/.test(node.textContent ?? ''),
  )
  if (!hasStatScores) {
    throw new Error('Export node is missing stat data')
  }
}

function stripBackdropFiltersForExport(element: HTMLElement): () => void {
  const touched: Array<{
    node: HTMLElement
    backdropFilter: string
    webkitBackdropFilter: string
    backgroundColor: string
  }> = []

  const nodes = [element, ...element.querySelectorAll<HTMLElement>('*')]
  for (const node of nodes) {
    const style = getComputedStyle(node)
    const hasBackdrop =
      style.backdropFilter !== 'none' || style.getPropertyValue('-webkit-backdrop-filter') !== 'none'
    if (!hasBackdrop) continue

    touched.push({
      node,
      backdropFilter: node.style.backdropFilter,
      webkitBackdropFilter: node.style.getPropertyValue('-webkit-backdrop-filter'),
      backgroundColor: node.style.backgroundColor,
    })
    node.style.backdropFilter = 'none'
    node.style.setProperty('-webkit-backdrop-filter', 'none')
    if (node === element) {
      node.style.backgroundColor = EXPORT_BG
    }
  }

  return () => {
    for (const { node, backdropFilter, webkitBackdropFilter, backgroundColor } of touched) {
      node.style.backdropFilter = backdropFilter
      if (webkitBackdropFilter) {
        node.style.setProperty('-webkit-backdrop-filter', webkitBackdropFilter)
      } else {
        node.style.removeProperty('-webkit-backdrop-filter')
      }
      node.style.backgroundColor = backgroundColor
    }
  }
}

export async function downloadChartPng(element: HTMLElement, filename: string): Promise<void> {
  assertExportNodeHasContent(element)

  const restoreStyles = stripBackdropFiltersForExport(element)

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: EXPORT_BG,
    })

    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  } finally {
    restoreStyles()
  }
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
