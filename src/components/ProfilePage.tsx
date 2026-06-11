import { useRef, useState } from 'react'
import type { ChartView, PowerSpikeProfile } from '../types/profile'
import { buildShareableSummary, copyToClipboard, downloadChartPng } from '../utils/export'
import { findPeakStatIndex } from '../utils/spikeLogic'
import { Button } from './Button'
import { StatRow } from './StatRow'
import { SummaryPanel } from './SummaryPanel'
import { UpgradeBoard } from './UpgradeBoard'
import { ViewToggle } from './ViewToggle'

interface ProfilePageProps {
  profile: PowerSpikeProfile
  onBack: () => void
}

export function ProfilePage({ profile, onBack }: ProfilePageProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<ChartView>('board')
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const peakIndex = findPeakStatIndex(profile.stats)

  const handleDownloadPng = async () => {
    if (!exportRef.current) return
    setExporting(true)
    setExportError(null)
    try {
      const safeName = profile.profileName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
      await downloadChartPng(exportRef.current, `power-spike-${safeName}.png`)
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
    <main className="game-menu-bg relative mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Input
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Button variant="secondary" onClick={handleCopySummary}>
            {copied ? 'Copied!' : 'Copy Shareable Summary'}
          </Button>
          <Button onClick={handleDownloadPng} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Download Chart PNG'}
          </Button>
        </div>
      </div>

      {exportError && (
        <p role="alert" className="relative z-10 mb-4 text-sm text-red-300">
          {exportError}
        </p>
      )}

      <div className="relative z-10 rounded-xl border border-slate-700/40 bg-slate-950/70 p-4 backdrop-blur-md sm:p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/60">
              Power Spike Profile
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
              {view === 'board' ? 'Upgrade Board' : 'Detailed Stat Rows'}
            </h1>
          </div>
          <p className="text-sm text-slate-500">{profile.profileName}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section>
            {view === 'board' ? (
              <UpgradeBoard stats={profile.stats} />
            ) : (
              <div className="space-y-4">
                {profile.stats.map((stat, index) => (
                  <StatRow
                    key={`${stat.name}-${index}`}
                    stat={stat}
                    isPeak={index === peakIndex}
                  />
                ))}
              </div>
            )}
          </section>

          <SummaryPanel profile={profile} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          This is a reflective tool, not a clinical assessment.
        </p>
      </div>

      {/* Hidden export target — always renders Upgrade Board */}
      <div
        ref={exportRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 -left-[10000px] w-[1200px] rounded-xl border border-slate-700/40 bg-[#070b14] p-6"
      >
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/60">
            Power Spike Profile
          </p>
          <h2 className="font-display mt-1 text-2xl font-bold text-white">
            {profile.profileName} — Upgrade Board
          </h2>
          <p className="mt-1 text-sm text-amber-300/90">{profile.archetype}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <UpgradeBoard stats={profile.stats} compact />
          <SummaryPanel profile={profile} />
        </div>
        <p className="mt-4 text-center text-xs text-slate-600">
          This is a reflective tool, not a clinical assessment.
        </p>
      </div>
    </main>
  )
}
