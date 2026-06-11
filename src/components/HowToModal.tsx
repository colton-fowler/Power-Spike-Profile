import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ONBOARDING_STEPS,
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
type OnboardingStep = 1 | 2 | 3

interface HowToModalProps {
  open: boolean
  onClose: () => void
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  scrollToPrompt?: boolean
  onGenerateSample: () => void
  onGeneratedProfile: () => void
}

const TABS: { id: CodexTab; label: string; step: OnboardingStep | null }[] = [
  { id: 'overview', label: 'Overview', step: null },
  { id: 'presets', label: 'Build Presets', step: 1 },
  { id: 'prompt', label: 'Prompt', step: 2 },
]

const PROMPT_PREVIEW_LINES = 5
const CHATGPT_URL = 'https://chatgpt.com/'
const COPIED_PROMPT_POPUP_MS = 6000

export function HowToModal({
  open,
  onClose,
  presetId,
  onPresetChange,
  scrollToPrompt = false,
  onGenerateSample,
  onGeneratedProfile,
}: HowToModalProps) {
  const [activeTab, setActiveTab] = useState<CodexTab>('overview')
  const [buildConfirmed, setBuildConfirmed] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [showCopiedPromptPopup, setShowCopiedPromptPopup] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)
  const [promptExpanded, setPromptExpanded] = useState(false)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const promptRef = useRef<HTMLDivElement>(null)
  const scrollBodyRef = useRef<HTMLDivElement>(null)
  const preset = PROFILE_PRESETS.find((p) => p.id === presetId) ?? PROFILE_PRESETS[0]

  const currentStep: OnboardingStep = !buildConfirmed ? 1 : copiedPrompt ? 3 : 2

  useEffect(() => {
    if (!open) {
      setPromptExpanded(false)
      setJsonOpen(false)
      setAdvancedOpen(false)
      setBuildConfirmed(false)
      setCopiedPrompt(false)
      setShowCopiedPromptPopup(false)
      return
    }

    if (scrollToPrompt) {
      setBuildConfirmed(true)
      setActiveTab('prompt')
      return
    }

    setActiveTab('overview')
    scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [open, scrollToPrompt])

  useEffect(() => {
    if (!open || activeTab !== 'prompt') return
    const timer = window.setTimeout(() => {
      scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [open, activeTab, presetId])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (showCopiedPromptPopup) {
        setShowCopiedPromptPopup(false)
        return
      }
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, showCopiedPromptPopup])

  useEffect(() => {
    if (!showCopiedPromptPopup) return
    const timer = window.setTimeout(() => setShowCopiedPromptPopup(false), COPIED_PROMPT_POPUP_MS)
    return () => window.clearTimeout(timer)
  }, [showCopiedPromptPopup])

  const handleSelectPreset = (id: PresetId) => {
    onPresetChange(id)
    setBuildConfirmed(true)
    setActiveTab('prompt')
    setPromptExpanded(false)
  }

  const handleGoToPresets = () => {
    setActiveTab('presets')
    scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyPrompt = async () => {
    try {
      await copyToClipboard(preset.prompt)
      setCopiedPrompt(true)
      setShowCopiedPromptPopup(true)
      setTimeout(() => setCopiedPrompt(false), 5000)
    } catch {
      // Clipboard unavailable — keep existing button state only
    }
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

  const handleStickyAction = () => {
    if (currentStep === 1) {
      handleGoToPresets()
      return
    }
    if (currentStep === 2) {
      if (activeTab !== 'prompt') {
        setActiveTab('prompt')
        return
      }
      handleCopyPrompt()
      return
    }
    onGeneratedProfile()
  }

  if (!open) return null

  const promptPreview = getPromptPreview(preset.prompt, PROMPT_PREVIEW_LINES)
  const stickyButtonLabel =
    currentStep === 1
      ? '1. Pick My Build'
      : currentStep === 2
        ? copiedPrompt
          ? 'Copied — Now Paste Into ChatGPT'
          : '2. Copy ChatGPT Prompt'
        : '3. Paste My JSON'

  const stickyHint =
    currentStep === 1
      ? 'Start here'
      : currentStep === 2
        ? 'Paste it into ChatGPT'
        : 'Come back here after ChatGPT replies'

  const stickyStepLabel = ONBOARDING_STEPS[currentStep - 1].label

  return (
    <div className="modal-root fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="codex-title"
        className="codex-modal panel-glow relative z-10 flex max-h-[90vh] w-full max-w-[1200px] min-w-0 flex-col overflow-hidden rounded-xl border border-cyan-700/40 bg-gradient-to-b from-slate-950 via-[#0a1020] to-[#070b14] shadow-[0_0_60px_rgba(34,211,238,0.12)]"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-cyan-900/40 bg-slate-950/80 px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400/60">
                Game Codex
              </p>
              <h2
                id="codex-title"
                className="font-display mt-0.5 text-xl font-bold tracking-wide text-white sm:text-2xl"
              >
                Build Your Power Spike Profile
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer rounded-lg border border-slate-700/60 p-2 text-slate-400 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <StepFlowCards currentStep={currentStep} buildConfirmed={buildConfirmed} />

          {/* Tabs */}
          <div className="mt-4 flex gap-1 rounded-lg border border-slate-700/50 bg-slate-900/60 p-1">
            {TABS.map((tab) => {
              const isPromptTab = tab.id === 'prompt'
              const isDisabled = isPromptTab && !buildConfirmed
              const isHighlighted =
                (tab.id === 'presets' && currentStep === 1) ||
                (isPromptTab && buildConfirmed && currentStep >= 2)

              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer rounded-md px-2 py-2 text-[11px] font-semibold uppercase tracking-wider transition sm:px-3 sm:text-xs ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-800/80 to-purple-800/80 text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                      : isDisabled
                        ? 'cursor-not-allowed opacity-35 text-slate-600'
                        : isHighlighted
                          ? 'text-cyan-300 ring-1 ring-cyan-500/30 hover:bg-cyan-950/40'
                          : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div
          ref={scrollBodyRef}
          className="min-h-0 flex-1 overflow-y-auto px-3 py-4 pb-6 sm:px-6 sm:py-5"
        >
          {activeTab === 'overview' && (
            <OverviewTab
              advancedOpen={advancedOpen}
              onToggleAdvanced={() => setAdvancedOpen((v) => !v)}
              onSelectBuild={handleGoToPresets}
            />
          )}
          {activeTab === 'presets' && (
            <PresetsTab presetId={presetId} onSelectPreset={handleSelectPreset} />
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
              onChangeBuild={() => setActiveTab('presets')}
              onGeneratedProfile={onGeneratedProfile}
            />
          )}
        </div>

        {/* Sticky bottom action bar */}
        <div className="shrink-0 border-t border-cyan-900/50 bg-slate-950/95 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step {currentStep}: {stickyStepLabel}
          </p>
          <button
            type="button"
            onClick={handleStickyAction}
            className={`mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-3.5 font-display text-sm font-semibold uppercase tracking-wider transition sm:py-4 sm:text-base ${
              currentStep === 2 && activeTab === 'prompt'
                ? 'border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_32px_rgba(34,211,238,0.4)] hover:from-cyan-400 hover:to-purple-400'
                : 'border-cyan-400/40 bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:from-cyan-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(34,211,238,0.35)]'
            }`}
          >
            {stickyButtonLabel}
            {currentStep === 3 && <span aria-hidden="true">→</span>}
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500 sm:text-xs">{stickyHint}</p>
        </div>

        {showCopiedPromptPopup && (
          <PromptCopiedPopup onClose={() => setShowCopiedPromptPopup(false)} />
        )}
      </div>
    </div>
  )
}

function StepFlowCards({
  currentStep,
  buildConfirmed,
}: {
  currentStep: OnboardingStep
  buildConfirmed: boolean
}) {
  return (
    <>
      {/* Desktop: horizontal with arrows */}
      <div className="mt-4 hidden items-stretch gap-2 md:flex">
        {ONBOARDING_STEPS.map((step, index) => (
          <div key={step.number} className="flex min-w-0 flex-1 items-stretch gap-2">
            <StepCard
              step={step}
              active={currentStep === step.number}
              completed={currentStep > step.number || (step.number === 1 && buildConfirmed && currentStep > 1)}
            />
            {index < ONBOARDING_STEPS.length - 1 && (
              <span
                className="flex shrink-0 items-center text-2xl font-light text-cyan-400/70"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: stacked */}
      <div className="mt-3 flex flex-col gap-2 md:hidden">
        {ONBOARDING_STEPS.map((step) => (
          <StepCard
            key={step.number}
            step={step}
            active={currentStep === step.number}
            completed={currentStep > step.number}
            compact
          />
        ))}
      </div>
    </>
  )
}

function StepCard({
  step,
  active,
  completed,
  compact = false,
}: {
  step: (typeof ONBOARDING_STEPS)[number]
  active: boolean
  completed: boolean
  compact?: boolean
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-start gap-3 rounded-lg border px-3 py-3 transition-all sm:px-4 sm:py-3.5 ${
        active
          ? 'border-cyan-400/50 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
          : completed
            ? 'border-emerald-700/30 bg-emerald-950/20 opacity-90'
            : 'border-slate-700/50 bg-slate-900/50 opacity-70'
      } ${compact ? 'py-2.5' : ''}`}
    >
      <span
        className={`font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg font-bold sm:h-10 sm:w-10 sm:text-xl ${
          active
            ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_16px_rgba(34,211,238,0.3)]'
            : completed
              ? 'bg-emerald-900/60 text-emerald-300'
              : 'bg-slate-800 text-slate-400'
        }`}
      >
        {step.number}
      </span>
      <div className="min-w-0">
        <p
          className={`font-display font-semibold tracking-wide ${
            active ? 'text-base text-white sm:text-lg' : 'text-sm text-slate-300'
          }`}
        >
          {step.label}
        </p>
        <p className={`mt-0.5 leading-snug text-slate-400 ${compact ? 'text-xs' : 'text-xs sm:text-sm'}`}>
          {step.description}
        </p>
      </div>
    </div>
  )
}

function OverviewTab({
  onSelectBuild,
  advancedOpen,
  onToggleAdvanced,
}: {
  onSelectBuild: () => void
  advancedOpen: boolean
  onToggleAdvanced: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <section>
        <SectionHeading>Quick Start</SectionHeading>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {QUICK_START_STEPS.map((step, index) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/70 px-3 py-3 sm:px-4 sm:py-3.5">
                <StepIcon index={index} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/60">
                    Step {step.short}
                  </p>
                  <p className="font-display text-sm font-semibold text-slate-100 sm:text-base">
                    {step.label}
                  </p>
                </div>
              </div>
              {index < QUICK_START_STEPS.length - 1 && (
                <span className="text-lg text-cyan-500/50 sm:text-xl" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Primary CTA */}
      <section className="codex-objective panel-glow rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-purple-950/40 px-4 py-5 sm:px-6 sm:py-6">
        <h4 className="font-display text-lg font-bold tracking-wide text-white sm:text-xl">
          Ready? Start with Step 1
        </h4>
        <p className="mt-1 text-sm text-slate-400">Pick a build archetype to get your custom prompt.</p>
        <button
          type="button"
          onClick={onSelectBuild}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-gradient-to-r from-cyan-600 to-purple-600 px-5 py-4 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:from-cyan-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(34,211,238,0.35)]"
        >
          1. Pick My Build
        </button>
        <p className="mt-2 text-center text-xs text-slate-500">Start here</p>
        <p className="mt-3 text-center text-[11px] text-slate-600">
          New here? Try{' '}
          <span className="font-semibold text-cyan-400/80">Balanced Profile</span> first.
        </p>
      </section>

      {/* Advanced — technical reference */}
      <section>
        <button
          type="button"
          onClick={onToggleAdvanced}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-3 text-left transition hover:border-slate-600"
        >
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Advanced: How Spikes Work
          </span>
          <span className="text-xs text-cyan-400/70">{advancedOpen ? '▲ Hide' : '▼ Show'}</span>
        </button>
        {advancedOpen && (
          <div className="mt-3 space-y-6">
            <section>
              <SectionHeading muted>Investment Spike System</SectionHeading>
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

            <section>
              <SectionHeading muted>Why The Star Matters</SectionHeading>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <StarPhase label="Before ★" detail="Big gains" tone="presike" />
                <StarPhase label="At ★" detail="Major upgrade online" tone="spike" />
                <StarPhase label="After ★" detail="Smaller gains" tone="marginal" />
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  )
}

function PresetsTab({
  presetId,
  onSelectPreset,
}: {
  presetId: PresetId
  onSelectPreset: (id: PresetId) => void
}) {
  return (
    <section>
      <SectionHeading>Step 1 — Pick a Build</SectionHeading>
      <p className="mt-1 text-sm text-slate-400">
        Tap a build below. You&apos;ll get a custom ChatGPT prompt for that playstyle.
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
            onClick={() => onSelectPreset(p.id)}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">Start here — pick one to continue</p>
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
  onChangeBuild,
  onGeneratedProfile,
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
  onChangeBuild: () => void
  onGeneratedProfile: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Selected Build
          </p>
          <p className="font-display text-sm font-semibold text-white sm:text-base">[{preset.name}]</p>
        </div>
        <Button variant="ghost" onClick={onChangeBuild} className="cursor-pointer px-3 py-1.5 text-xs">
          Change Build
        </Button>
      </div>

      <section ref={promptRef} id="prompt-section" className="scroll-mt-2">
        <h3 className="font-display text-xl font-bold tracking-wide text-white sm:text-2xl">
          Copy this prompt into ChatGPT
        </h3>
        <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
          ChatGPT will reply with JSON. Copy that JSON back here.
        </p>

        <button
          type="button"
          onClick={onCopyPrompt}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-4 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_32px_rgba(34,211,238,0.35)] transition hover:from-cyan-400 hover:to-purple-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] sm:py-5 sm:text-lg"
        >
          {copiedPrompt ? 'Copied — Now Paste Into ChatGPT' : '2. Copy ChatGPT Prompt'}
        </button>
        {copiedPrompt ? (
          <p className="mt-2 text-center text-sm font-medium leading-relaxed text-cyan-300/90">
            Prompt copied. Paste it into ChatGPT, then return with the JSON answer.
          </p>
        ) : (
          <p className="mt-2 text-center text-xs text-slate-500">Paste it into ChatGPT</p>
        )}

        <div className="mt-4 rounded-lg border border-amber-600/30 bg-amber-950/25 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-xs font-semibold text-amber-200/90 sm:text-sm">
            Do not paste normal text here. Paste the JSON response only.
          </p>
        </div>

        <details className="mt-4 group">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-400">
            Advanced: View full prompt
          </summary>
          <div className="mt-2 rounded-lg border border-slate-700/50 bg-slate-950/80">
            <p className="border-b border-slate-800/60 px-3 py-2 text-[10px] uppercase tracking-wider text-slate-600">
              {preset.promptTitle}
            </p>
            <pre className="overflow-hidden p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-400">
              {promptExpanded ? preset.prompt : promptPreview}
            </pre>
            <div className="border-t border-slate-800/60 px-3 py-2">
              <button
                type="button"
                onClick={onTogglePrompt}
                className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-cyan-400/80 hover:text-cyan-300"
              >
                {promptExpanded ? '▲ Collapse Prompt' : '▼ Expand Prompt'}
              </button>
            </div>
          </div>
        </details>
      </section>

      <section>
        <button
          type="button"
          onClick={onToggleJson}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-3 text-left transition hover:border-slate-600"
        >
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Advanced: JSON Example
          </span>
          <span className="text-xs text-cyan-400/70">{jsonOpen ? '▲ Hide' : '▼ Show'}</span>
        </button>
        {jsonOpen && (
          <div className="mt-2">
            <Button variant="secondary" onClick={onCopyJson} className="w-full sm:w-auto">
              {copiedJson ? 'Copied!' : 'Copy Example'}
            </Button>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-700/60 bg-slate-950/90 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-400">
              {preset.sampleJson}
            </pre>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <Button variant="ghost" onClick={onGenerateSample} className="w-full cursor-pointer sm:w-auto">
          Use Example Profile
        </Button>
        <p className="text-center text-[11px] text-slate-600">
          Skip ChatGPT and load a sample profile instead.
        </p>
      </section>

      <section className="codex-objective panel-glow rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-purple-950/40 px-4 py-5 sm:px-6 sm:py-6">
        <h4 className="font-display text-lg font-bold tracking-wide text-white sm:text-xl">
          Step 3 — Paste Your JSON
        </h4>
        <p className="mt-1 text-sm text-slate-400">
          After ChatGPT replies, copy its JSON and paste it on the main page.
        </p>
        <button
          type="button"
          onClick={onGeneratedProfile}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-gradient-to-r from-cyan-600 to-purple-600 px-5 py-4 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:from-cyan-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(34,211,238,0.35)]"
        >
          3. Paste My JSON
          <span aria-hidden="true">→</span>
        </button>
        <p className="mt-2 text-center text-xs text-slate-500">
          Come back here after ChatGPT replies
        </p>
      </section>
    </div>
  )
}

function PromptCopiedPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Dismiss prompt copied confirmation"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="prompt-copied-title"
        aria-describedby="prompt-copied-body"
        className="codex-modal panel-glow relative z-10 w-full max-w-md rounded-xl border border-cyan-500/40 bg-gradient-to-b from-slate-950 via-[#0a1020] to-[#070b14] p-6 shadow-[0_0_48px_rgba(34,211,238,0.2)] sm:p-8"
      >
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 shadow-[0_0_24px_rgba(34,211,238,0.25)] sm:h-20 sm:w-20"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9 text-cyan-300 sm:h-11 sm:w-11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3
          id="prompt-copied-title"
          className="font-display mt-5 text-center text-2xl font-bold tracking-wide text-white sm:text-3xl"
        >
          Prompt Copied
        </h3>

        <div id="prompt-copied-body" className="mt-4 space-y-2 text-center">
          <p className="text-base font-semibold text-slate-100 sm:text-lg">
            Now paste it into ChatGPT.
          </p>
          <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
            When ChatGPT replies, copy its JSON answer and come back here.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg border border-cyan-400/40 bg-gradient-to-r from-cyan-600 to-purple-600 px-5 py-3.5 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:from-cyan-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(34,211,238,0.35)]"
        >
          Got it
        </button>

        <a
          href={CHATGPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block cursor-pointer text-center text-sm font-semibold text-cyan-400/80 underline-offset-2 transition hover:text-cyan-300 hover:underline"
        >
          Open ChatGPT
        </a>
      </div>
    </div>
  )
}

function SectionHeading({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <h3
      className={`font-display text-xs font-semibold uppercase tracking-[0.2em] ${
        muted ? 'text-slate-500' : 'text-cyan-400/80'
      }`}
    >
      {children}
    </h3>
  )
}

function StepIcon({ index }: { index: number }) {
  const icons = [
    'M8 10h8M8 14h5M12 3a9 9 0 100 18 9 9 0 000-18z',
    'M8 8h8v8H8V8zm2-4h8a2 2 0 012 2v8',
    'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'M4 16l4-4 3 3 5-6 4 4',
  ]
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 text-cyan-400/80 sm:h-7 sm:w-7"
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
