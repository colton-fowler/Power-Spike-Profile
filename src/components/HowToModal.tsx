import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  PROFILE_PRESETS,
  QUICK_START_STEPS,
  SPIKE_TIER_LADDER,
  type PresetId,
  type ProfilePreset,
} from '../constants/presets'
import { copyToClipboard } from '../utils/export'
import { BuildSelectCard } from './BuildSelectCard'
import { Button } from './Button'

interface HowToModalProps {
  open: boolean
  onClose: () => void
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  scrollToPrompt?: boolean
  onGenerateSample: () => void
}

export function HowToModal({
  open,
  onClose,
  presetId,
  onPresetChange,
  scrollToPrompt = false,
  onGenerateSample,
}: HowToModalProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [jsonOpen, setJsonOpen] = useState(false)
  const promptRef = useRef<HTMLDivElement>(null)
  const scrollBodyRef = useRef<HTMLDivElement>(null)
  const preset = PROFILE_PRESETS.find((p) => p.id === presetId) ?? PROFILE_PRESETS[0]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    if (scrollToPrompt) {
      const timer = window.setTimeout(() => {
        promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
      return () => window.clearTimeout(timer)
    }
    scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [open, scrollToPrompt, presetId])

  if (!open) return null

  const handleCopyPrompt = async () => {
    await copyToClipboard(preset.prompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleCopyJson = async () => {
    await copyToClipboard(preset.sampleJson)
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  const handleGenerateSample = () => {
    onGenerateSample()
    onClose()
  }

  return (
    <div className="modal-root fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="codex-title"
        className="codex-modal panel-glow relative z-10 flex max-h-[85vh] w-full max-w-[1200px] min-w-0 flex-col overflow-hidden rounded-xl border border-cyan-700/40 bg-gradient-to-b from-slate-950 via-[#0a1020] to-[#070b14] shadow-[0_0_60px_rgba(34,211,238,0.12)]"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-cyan-900/40 bg-slate-950/80 px-5 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400/60">
                Game Codex
              </p>
              <h2
                id="codex-title"
                className="font-display mt-1 text-xl font-bold tracking-wide text-white sm:text-2xl"
              >
                How Power Spike Profiles Work
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                Power Spike Profile turns ChatGPT knowledge into a Deadlock-style investment chart
                that identifies strengths, weaknesses, power spikes, and the highest ROI
                improvements.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-slate-700/60 p-2 text-slate-400 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div ref={scrollBodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {/* Quick Start */}
          <section>
            <SectionHeading>Quick Start</SectionHeading>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              {QUICK_START_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-2 sm:flex-1 sm:min-w-0">
                  <div className="flex min-w-0 flex-1 flex-col items-center rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-3 text-center">
                    <span className="font-display text-lg font-bold text-cyan-400/80">
                      {index + 1}
                    </span>
                    <span className="mt-1 text-xs font-semibold leading-tight text-slate-200 sm:text-sm">
                      {step}
                    </span>
                  </div>
                  {index < QUICK_START_STEPS.length - 1 && (
                    <span
                      className="hidden shrink-0 text-cyan-500/50 sm:inline"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Investment Spike System */}
          <section className="mt-8">
            <SectionHeading>Investment Spike System</SectionHeading>
            <div className="mt-4 space-y-2">
              {SPIKE_TIER_LADDER.map((tier) => (
                <div
                  key={tier.label}
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${tierToneClass(tier.tone)}`}
                >
                  <span className="font-display text-sm font-semibold text-slate-200">
                    {tier.label}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {tier.range}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SpikePhase
                title="Before the star"
                body="Investing produces large noticeable improvements."
                tone="presike"
              />
              <SpikePhase
                title="At the star"
                body="The stat comes online and reaches its major power spike."
                tone="spike"
              />
              <SpikePhase
                title="After the star"
                body="Improvement still exists but gains become smaller and more incremental."
                tone="marginal"
              />
            </div>

            <div className="mt-4 rounded-lg border border-purple-500/30 bg-purple-950/25 px-4 py-3">
              <p className="text-sm font-semibold text-purple-200">
                Your best investment is usually the highest stat that has NOT reached its spike
                yet.
              </p>
            </div>
          </section>

          {/* Preset Selection */}
          <section className="mt-8">
            <SectionHeading>Profile Generation Presets</SectionHeading>
            <p className="mt-2 text-sm text-slate-400">
              Choose a build archetype. Each preset changes the ChatGPT prompt, sample profile, and
              stat focus.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROFILE_PRESETS.map((p) => (
                <PresetCard
                  key={p.id}
                  preset={p}
                  selected={p.id === presetId}
                  onSelect={() => onPresetChange(p.id)}
                />
              ))}
            </div>
          </section>

          {/* ChatGPT Prompt */}
          <section ref={promptRef} className="mt-8 scroll-mt-4" id="prompt-section">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionHeading>{preset.promptTitle}</SectionHeading>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={handleCopyPrompt}>
                  {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                </Button>
                <Button variant="ghost" onClick={handleGenerateSample}>
                  Generate Sample
                </Button>
              </div>
            </div>
            <pre className="mt-3 max-h-80 overflow-auto rounded-lg border border-slate-700/60 bg-slate-950/90 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-300">
              {preset.prompt}
            </pre>
          </section>

          {/* JSON Example — collapsible */}
          <section className="mt-8">
            <button
              type="button"
              onClick={() => setJsonOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-left transition hover:border-slate-600"
            >
              <SectionHeading>JSON Example</SectionHeading>
              <span className="text-sm text-cyan-400/70">{jsonOpen ? '▲ Hide' : '▼ Show'}</span>
            </button>
            {jsonOpen && (
              <div className="mt-3">
                <div className="mb-3">
                  <Button variant="secondary" onClick={handleCopyJson}>
                    {copiedJson ? 'Copied!' : 'Copy Example'}
                  </Button>
                </div>
                <pre className="max-h-80 overflow-auto rounded-lg border border-slate-700/60 bg-slate-950/90 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-300">
                  {preset.sampleJson}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
      {children}
    </h3>
  )
}

function tierToneClass(tone: string): string {
  switch (tone) {
    case 'unbuilt':
      return 'border-slate-700/40 bg-slate-950/50 opacity-70'
    case 'early':
      return 'border-slate-600/40 bg-slate-900/40'
    case 'stable':
      return 'border-emerald-700/30 bg-emerald-950/20'
    case 'presike':
      return 'border-purple-500/40 bg-purple-950/25 tier-glow-presike'
    case 'spike':
      return 'border-amber-500/40 bg-amber-950/25 tier-glow-spike'
    case 'marginal':
      return 'border-cyan-600/30 bg-cyan-950/20'
    default:
      return 'border-slate-700/40 bg-slate-900/40'
  }
}

function SpikePhase({
  title,
  body,
  tone,
}: {
  title: string
  body: string
  tone: 'presike' | 'spike' | 'marginal'
}) {
  const border =
    tone === 'presike'
      ? 'border-purple-500/30 bg-purple-950/20'
      : tone === 'spike'
        ? 'border-amber-500/30 bg-amber-950/20'
        : 'border-cyan-500/30 bg-cyan-950/20'

  return (
    <div className={`rounded-lg border px-3 py-3 ${border}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </div>
  )
}

function PresetCard({
  preset,
  selected,
  onSelect,
}: {
  preset: ProfilePreset
  selected: boolean
  onSelect: () => void
}) {
  return (
    <BuildSelectCard
      compact
      title={preset.name}
      description={preset.goal}
      accent={preset.accent}
      selected={selected}
      onClick={onSelect}
    />
  )
}
