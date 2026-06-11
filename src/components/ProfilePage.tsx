import { useRef, useState } from 'react'
import type { PowerSpikeProfile } from '../types/profile'
import { buildShareableSummary, copyToClipboard, downloadChartPng } from '../utils/export'
import { findPeakStatIndex } from '../utils/spikeLogic'
import { Button } from './Button'
import { StatRow } from './StatRow'
import { SummaryPanel } from './SummaryPanel'

interface ProfilePageProps {
  profile: PowerSpikeProfile
  onBack: () => void
}

export function ProfilePage({ profile, onBack }: ProfilePageProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const peakIndex = findPeakStatIndex(profile.stats)

  const handleDownloadPng = async () => {
    if (!chartRef.current) return
    setExporting(true)
    setExportError(null)
    try {
      const safeName = profile.profileName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
      await downloadChartPng(chartRef.current, `power-spike-${safeName}.png`)
    } catch {
      setExportError('PNG export failed. Try again or use copy summary instead.')
    } finally {
      setExporting(false)
    }
  }

  const handleCopySummary = async () => {
    await copyToClipboard(buildShareableSummary(profile))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Input
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleCopySummary}>
            {copied ? 'Copied!' : 'Copy Shareable Summary'}
          </Button>
          <Button onClick={handleDownloadPng} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Download Chart PNG'}
          </Button>
        </div>
      </div>

      {exportError && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {exportError}
        </p>
      )}

      <div
        ref={chartRef}
        className="rounded-xl border border-slate-800/60 bg-[#070b14] p-4 sm:p-6"
      >
        <div className="mb-6 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/60">
            Power Spike Profile
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
            Investment Spike Chart
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500">
              Stat Rows
            </h2>
            {profile.stats.map((stat, index) => (
              <StatRow key={`${stat.name}-${index}`} stat={stat} isPeak={index === peakIndex} />
            ))}
          </section>

          <SummaryPanel profile={profile} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          This is a reflective tool, not a clinical assessment.
        </p>
      </div>
    </main>
  )
}
