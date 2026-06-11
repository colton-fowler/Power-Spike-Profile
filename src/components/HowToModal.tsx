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

type CodexTab = 'overview' | 'presets' | 'prompt'

interface HowToModalProps {
  open: boolean
  onClose: () => void
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  scrollToPrompt?: boolean
  onGenerateSample: () => void
}

const TABS: { id: CodexTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'presets', label: 'Build Presets' },
  { id: 'prompt', label: 'Prompt' },
]

const PROMPT_PREVIEW_LINES = 5

export function HowToModal({
  open,
  onClose,
  presetId,
  onPresetChange,
  scrollToPrompt = false,
  onGenerateSample,
}: HowToModalProps) {
  const [activeTab, setActiveTab] = useState<CodexTab>('overview')
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [promptExpanded, setPromptExpanded] = useState(false)
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
    if (!open) {
      setPromptExpanded(false)
      setJsonOpen(false)
      return
    }

    if (scrollToPrompt) {
      setActiveTab('prompt')
      const timer = window.setTimeout(() => {
        promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
      return () => window.clearTimeout(timer)
    }

    setActiveTab('overview')
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

  const promptPreview = getPromptPreview(preset.prompt, PROMPT_PREVIEW_LINES)

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
        <div className="shrink-0 border-b border-cyan-900/40 bg-slate-950/80 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400/60">
                Game Codex
              </p>
              <h2
                id="codex-title"
                className="font-display mt-0.5 text-lg font-bold tracking-wide text-white sm:text-xl"
              >
                How Power Spike Profiles Work
              </h2>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                ChatGPT knowledge → investment spike chart → highest-ROI upgrades.
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

          {/* Tabs */}
          <div className="mt-4 flex gap-1 rounded-lg border border-slate-700/50 bg-slate-900/60 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition sm:text-xs ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-800/80 to-purple-800/80 text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div ref={scrollBodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'presets' && (
            <PresetsTab presetId={presetId} onPresetChange={onPresetChange} />
          )}
          {activeTab === 'prompt' && (
            <PromptTab
              preset={preset}
              promptRef={promptRef}
              promptPreview={promptPreview}
              promptExpanded={promptExpanded}
              onTogglePrompt={() => setPromptExpanded((v) => !v)}
              jsonOpen={jsonOpen}
              onToggleJson={() => setJsonOpen((v) => !v)}
              copiedPrompt={copiedPrompt}
              copiedJson={copiedJson}
              onCopyPrompt={handleCopyPrompt}
              onCopyJson={handleCopyJson}
              onGenerateSample={handleGenerateSample}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Quick Start — compact horizontal flow */}
      <section>
        <SectionHeading>Quick Start</SectionHeading>
        <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
          {QUICK_START_STEPS.map((step, index) => (
            <div key={step.label} className="flex shrink-0 items-center gap-1">
              <div className="flex items-center gap-2 rounded-md border border-slate-700/50 bg-slate-900/70 px-2.5 py-2">
                <StepIcon index={index} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {step.short}
                  </p>
                  <p className="whitespace-nowrap text-xs font-semibold text-slate-200">
                    {step.label}
                  </p>
                </div>
              </div>
              {index < QUICK_START_STEPS.length - 1 && (
                <span className="text-cyan-500/40" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Investment Spike — compact timeline */}
      <section>
        <SectionHeading>Investment Spike System</SectionHeading>
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="flex min-w-max items-stretch gap-0">
            {SPIKE_TIER_LADDER.map((tier, index) => (
              <div key={tier.label} className="flex items-center">
                <div
                  className={`w-[108px] rounded-md border px-2 py-2 text-center ${tierToneCompact(tier.tone)}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-300">
                    {tier.label}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">{tier.range}</p>
                </div>
                {index < SPIKE_TIER_LADDER.length - 1 && (
                  <span className="px-0.5 text-[10px] text-slate-600" aria-hidden="true">
                    ↓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-purple-300/80">
          Best investment: highest stat that has not spiked yet.
        </p>
      </section>

      {/* Star comparison — single row */}
      <section>
        <SectionHeading>Why The Star Matters</SectionHeading>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <StarPhase label="Before ★" detail="Big gains" tone="presike" />
          <StarPhase label="At ★" detail="Major upgrade online" tone="spike" />
          <StarPhase label="After ★" detail="Smaller gains" tone="marginal" />
        </div>
      </section>
    </div>
  )
}

function PresetsTab({
  presetId,
  onPresetChange,
}: {
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
}) {
  return (
    <section>
      <SectionHeading>Choose Your Build</SectionHeading>
      <p className="mt-1 text-xs text-slate-500">
        Each archetype changes stat focus, prompt, and sample profile.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PROFILE_PRESETS.map((p) => (
          <BuildSelectCard
            key={p.id}
            codex
            title={p.name}
            description={p.goal}
            tag={p.tag}
            accent={p.accent}
            selected={p.id === presetId}
            onClick={() => onPresetChange(p.id)}
          />
        ))}
      </div>
    </section>
  )
}

function PromptTab({
  preset,
  promptRef,
  promptPreview,
  promptExpanded,
  onTogglePrompt,
  jsonOpen,
  onToggleJson,
  copiedPrompt,
  copiedJson,
  onCopyPrompt,
  onCopyJson,
  onGenerateSample,
}: {
  preset: ProfilePreset
  promptRef: React.RefObject<HTMLDivElement | null>
  promptPreview: string
  promptExpanded: boolean
  onTogglePrompt: () => void
  jsonOpen: boolean
  onToggleJson: () => void
  copiedPrompt: boolean
  copiedJson: boolean
  onCopyPrompt: () => void
  onCopyJson: () => void
  onGenerateSample: () => void
}) {
  return (
    <div className="space-y-6">
      <section ref={promptRef} id="prompt-section" className="scroll-mt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionHeading>{preset.promptTitle}</SectionHeading>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onCopyPrompt}>
              {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
            </Button>
            <Button variant="ghost" onClick={onGenerateSample}>
              Generate Sample
            </Button>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-700/50 bg-slate-950/80">
          <pre className="overflow-hidden p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-400">
            {promptExpanded ? preset.prompt : promptPreview}
          </pre>
          <div className="border-t border-slate-800/60 px-3 py-2">
            <button
              type="button"
              onClick={onTogglePrompt}
              className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80 hover:text-cyan-300"
            >
              {promptExpanded ? '▲ Collapse Prompt' : '▼ Expand Prompt'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={onToggleJson}
          className="flex w-full items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2.5 text-left transition hover:border-slate-600"
        >
          <SectionHeading>JSON Example</SectionHeading>
          <span className="text-xs text-cyan-400/70">{jsonOpen ? '▲ Hide' : '▼ Show'}</span>
        </button>
        {jsonOpen && (
          <div className="mt-2">
            <Button variant="secondary" onClick={onCopyJson}>
              {copiedJson ? 'Copied!' : 'Copy Example'}
            </Button>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-700/60 bg-slate-950/90 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-400">
              {preset.sampleJson}
            </pre>
          </div>
        )}
      </section>
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
      {children}
    </h3>
  )
}

function StepIcon({ index }: { index: number }) {
  const icons = [
    /* ChatGPT */ 'M8 10h8M8 14h5M12 3a9 9 0 100 18 9 9 0 000-18z',
    /* Generate */ 'M13 3L5 14h6l-1 7 8-11h-6l1-7z',
    /* Copy */ 'M8 8h8v8H8V8zm2-4h8a2 2 0 012 2v8',
    /* Paste */ 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    /* Render */ 'M4 16l4-4 3 3 5-6 4 4',
  ]
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-cyan-400/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={icons[index] ?? icons[0]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarPhase({
  label,
  detail,
  tone,
}: {
  label: string
  detail: string
  tone: 'presike' | 'spike' | 'marginal'
}) {
  const styles = {
    presike: 'border-purple-500/30 bg-purple-950/20',
    spike: 'border-amber-500/30 bg-amber-950/20',
    marginal: 'border-cyan-500/30 bg-cyan-950/20',
  }
  return (
    <div className={`rounded-md border px-2 py-2 text-center ${styles[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-300">{label}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{detail}</p>
    </div>
  )
}

function tierToneCompact(tone: string): string {
  switch (tone) {
    case 'unbuilt':
      return 'border-slate-700/40 bg-slate-950/60 opacity-75'
    case 'early':
      return 'border-slate-600/40 bg-slate-900/50'
    case 'stable':
      return 'border-emerald-700/30 bg-emerald-950/15'
    case 'presike':
      return 'border-purple-500/35 bg-purple-950/20'
    case 'spike':
      return 'border-amber-500/40 bg-amber-950/20'
    case 'marginal':
      return 'border-cyan-600/30 bg-cyan-950/15'
    default:
      return 'border-slate-700/40 bg-slate-900/40'
  }
}

function getPromptPreview(prompt: string, lines: number): string {
  const split = prompt.split('\n')
  if (split.length <= lines) return prompt
  return `${split.slice(0, lines).join('\n')}\n…`
}
