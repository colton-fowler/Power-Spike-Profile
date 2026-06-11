import { useCallback, useEffect, useRef, useState } from 'react'
import { PROFILE_PRESETS, type PresetId, type ProfilePreset } from '../constants/presets'
import { copyToClipboard } from '../utils/export'
import { BuildSelectCard } from './BuildSelectCard'

type WizardStep = 1 | 2 | 3
type StepDirection = 'forward' | 'back'

interface HowToModalProps {
  open: boolean
  onClose: () => void
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  initialStep?: WizardStep
  jsonInput: string
  onJsonChange: (value: string) => void
  onRender: () => boolean
  onGenerateSample: () => void
  error: string | null
}

const CHATGPT_URL = 'https://chatgpt.com/'
const PROMPT_PREVIEW_LINES = 12
const STEP_TRANSITION_MS = 200
const COPIED_PROMPT_POPUP_MS = 6000

const WIZARD_STEPS: { step: WizardStep; label: string }[] = [
  { step: 1, label: 'Pick Build' },
  { step: 2, label: 'Copy Prompt' },
  { step: 3, label: 'Paste JSON' },
]

export function HowToModal({
  open,
  onClose,
  presetId,
  onPresetChange,
  initialStep = 1,
  jsonInput,
  onJsonChange,
  onRender,
  onGenerateSample,
  error,
}: HowToModalProps) {
  const [wizardStep, setWizardStep] = useState<WizardStep>(1)
  const [stepDirection, setStepDirection] = useState<StepDirection>('forward')
  const [buildSelected, setBuildSelected] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [showCopiedPromptPopup, setShowCopiedPromptPopup] = useState(false)
  const stepTimerRef = useRef<number | null>(null)

  const preset = PROFILE_PRESETS.find((p) => p.id === presetId) ?? PROFILE_PRESETS[0]
  const promptPreview = getPromptPreview(preset.prompt, PROMPT_PREVIEW_LINES)

  const goToStep = (step: WizardStep, direction: StepDirection) => {
    setStepDirection(direction)
    setWizardStep(step)
  }

  const handleDismissCopiedPopup = useCallback(() => {
    setShowCopiedPromptPopup(false)
    setStepDirection('forward')
    setWizardStep(3)
  }, [])

  useEffect(() => {
    if (!open) {
      setWizardStep(1)
      setStepDirection('forward')
      setBuildSelected(false)
      setCopiedPrompt(false)
      setShowCopiedPromptPopup(false)
      if (stepTimerRef.current !== null) {
        window.clearTimeout(stepTimerRef.current)
        stepTimerRef.current = null
      }
      return
    }

    setWizardStep(initialStep)
    setStepDirection('forward')
    setBuildSelected(initialStep > 1)
  }, [open, initialStep])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (showCopiedPromptPopup) {
        handleDismissCopiedPopup()
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
  }, [open, onClose, showCopiedPromptPopup, handleDismissCopiedPopup])

  useEffect(() => {
    if (!showCopiedPromptPopup) return
    const timer = window.setTimeout(() => handleDismissCopiedPopup(), COPIED_PROMPT_POPUP_MS)
    return () => window.clearTimeout(timer)
  }, [showCopiedPromptPopup, handleDismissCopiedPopup])

  const handleSelectBuild = (id: PresetId) => {
    onPresetChange(id)
    setBuildSelected(true)

    if (stepTimerRef.current !== null) {
      window.clearTimeout(stepTimerRef.current)
    }

    stepTimerRef.current = window.setTimeout(() => {
      goToStep(2, 'forward')
      stepTimerRef.current = null
    }, STEP_TRANSITION_MS)
  }

  const handleCopyPrompt = async () => {
    try {
      await copyToClipboard(preset.prompt)
      setCopiedPrompt(true)
      setShowCopiedPromptPopup(true)
    } catch {
      // Clipboard unavailable
    }
  }

  const handleOpenChatGPT = () => {
    window.open(CHATGPT_URL, '_blank', 'noopener,noreferrer')
  }

  const handleRenderProfile = () => {
    if (onRender()) onClose()
  }

  const handleUseExample = () => {
    onGenerateSample()
    onClose()
  }

  if (!open) return null

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
        aria-labelledby="wizard-title"
        className="codex-modal panel-glow relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-cyan-700/40 bg-gradient-to-b from-slate-950 via-[#0a1020] to-[#070b14] shadow-[0_0_60px_rgba(34,211,238,0.12)]"
      >
        <div className="shrink-0 border-b border-cyan-900/40 bg-slate-950/80 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400/60">
                Game Codex
              </p>
              <h2
                id="wizard-title"
                className="font-display mt-0.5 text-lg font-bold tracking-wide text-white sm:text-xl"
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

          <WizardStepIndicator currentStep={wizardStep} />
          <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            Step {wizardStep} of 3
          </p>
        </div>

        <div className="overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
          <div
            key={wizardStep}
            className={stepDirection === 'forward' ? 'wizard-step-forward' : 'wizard-step-back'}
          >
            {wizardStep === 1 && (
              <StepPickBuild
                presetId={presetId}
                buildSelected={buildSelected}
                onSelectBuild={handleSelectBuild}
              />
            )}
            {wizardStep === 2 && (
              <StepCopyPrompt
                preset={preset}
                promptPreview={promptPreview}
                copiedPrompt={copiedPrompt}
                onBack={() => goToStep(1, 'back')}
                onCopyPrompt={handleCopyPrompt}
              />
            )}
            {wizardStep === 3 && (
              <StepPasteJson
                jsonInput={jsonInput}
                sampleJson={preset.sampleJson}
                error={error}
                onBack={() => goToStep(2, 'back')}
                onJsonChange={onJsonChange}
                onRender={handleRenderProfile}
                onUseExample={handleUseExample}
              />
            )}
          </div>
        </div>

        {showCopiedPromptPopup && (
          <PromptCopiedPopup
            onOpenChatGPT={handleOpenChatGPT}
            onDismiss={handleDismissCopiedPopup}
          />
        )}
      </div>
    </div>
  )
}

function WizardStepIndicator({ currentStep }: { currentStep: WizardStep }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-3 sm:gap-5">
      {WIZARD_STEPS.map(({ step, label }, index) => {
        const completed = step < currentStep
        const active = step === currentStep

        return (
          <div key={step} className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3 ${
                  completed
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : active
                      ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                      : 'bg-slate-600'
                }`}
                aria-hidden="true"
              />
              <span
                className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider sm:text-xs ${
                  completed
                    ? 'text-emerald-400'
                    : active
                      ? 'text-cyan-300'
                      : 'text-slate-500'
                }`}
              >
                Step {step}
              </span>
              <span
                className={`hidden text-[11px] sm:inline ${
                  active ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {label}
              </span>
            </div>
            {index < WIZARD_STEPS.length - 1 && (
              <span className="text-slate-700" aria-hidden="true">
                ·
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepPickBuild({
  presetId,
  buildSelected,
  onSelectBuild,
}: {
  presetId: PresetId
  buildSelected: boolean
  onSelectBuild: (id: PresetId) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">Pick Your Build</h3>
        <p className="mt-1 text-sm text-slate-400">
          Tap a build to continue — you&apos;ll get a custom ChatGPT prompt next.
        </p>
      </div>

      <div className="grid max-h-[42vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 sm:max-h-none sm:overflow-visible">
        {PROFILE_PRESETS.map((p) => (
          <BuildSelectCard
            key={p.id}
            codex
            title={p.name}
            description={p.goal}
            tag={p.tag}
            accent={p.accent}
            selected={p.id === presetId && buildSelected}
            onClick={() => onSelectBuild(p.id)}
          />
        ))}
      </div>
    </div>
  )
}

function StepCopyPrompt({
  preset,
  promptPreview,
  copiedPrompt,
  onBack,
  onCopyPrompt,
}: {
  preset: ProfilePreset
  promptPreview: string
  copiedPrompt: boolean
  onBack: () => void
  onCopyPrompt: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 shrink-0 cursor-pointer rounded-md border border-slate-700/60 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
        >
          ← Back
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Selected: {preset.name}
          </p>
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
            Copy This Prompt Into ChatGPT
          </h3>
        </div>
      </div>

      <pre className="max-h-48 overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-950/80 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-400 sm:max-h-56 sm:p-4 sm:text-xs">
        {promptPreview}
      </pre>

      <button
        type="button"
        onClick={onCopyPrompt}
        className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-4 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_32px_rgba(34,211,238,0.35)] transition hover:from-cyan-400 hover:to-purple-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.45)]"
      >
        {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
      </button>
    </div>
  )
}

function StepPasteJson({
  jsonInput,
  sampleJson,
  error,
  onBack,
  onJsonChange,
  onRender,
  onUseExample,
}: {
  jsonInput: string
  sampleJson: string
  error: string | null
  onBack: () => void
  onJsonChange: (value: string) => void
  onRender: () => void
  onUseExample: () => void
}) {
  const [exampleOpen, setExampleOpen] = useState(false)
  const examplePreview = getJsonExamplePreview(sampleJson)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 shrink-0 cursor-pointer rounded-md border border-slate-700/60 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
        >
          ← Back
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
            Paste ChatGPT&apos;s JSON Response
          </h3>
        </div>
      </div>

      <div className="rounded-lg border border-cyan-700/30 bg-cyan-950/20 px-3 py-2.5 sm:px-4 sm:py-3">
        <p className="text-sm font-medium text-cyan-200/90">
          Paste the entire JSON response from ChatGPT.
        </p>
      </div>

      <textarea
        id="wizard-json-input"
        value={jsonInput}
        onChange={(e) => onJsonChange(e.target.value)}
        placeholder='{"profileName": "...", "archetype": "...", "stats": [...]}'
        rows={8}
        className="w-full resize-none rounded-lg border border-slate-700/80 bg-slate-950/80 p-3 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 sm:p-4"
      />

      <div>
        <button
          type="button"
          onClick={() => setExampleOpen((open) => !open)}
          className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-cyan-400/80"
        >
          <span>Need help finding it?</span>
          <span className="text-cyan-400/70">{exampleOpen ? '▲ Example JSON' : '▼ Example JSON'}</span>
        </button>
        {exampleOpen && (
          <pre className="mt-2 max-h-32 overflow-y-auto rounded-md border border-slate-700/50 bg-slate-950/80 p-2.5 font-mono text-[10px] leading-relaxed whitespace-pre-wrap text-slate-500">
            {examplePreview}
          </pre>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-800/50 bg-red-950/30 px-3 py-2.5 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onRender}
        className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-cyan-400/40 bg-gradient-to-r from-cyan-600 to-purple-600 px-5 py-3.5 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:from-cyan-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(34,211,238,0.35)]"
      >
        Build My Profile
      </button>

      <button
        type="button"
        onClick={onUseExample}
        className="w-full cursor-pointer text-center text-xs font-semibold text-slate-500 underline-offset-2 transition hover:text-cyan-400/80 hover:underline"
      >
        Use Example Profile
      </button>
    </div>
  )
}

function PromptCopiedPopup({
  onOpenChatGPT,
  onDismiss,
}: {
  onOpenChatGPT: () => void
  onDismiss: () => void
}) {
  const steps = [
    'Open ChatGPT',
    'Paste the prompt',
    "Copy ChatGPT's JSON reply",
    'Return here',
  ]

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
        onClick={onDismiss}
        aria-label="Dismiss prompt copied confirmation"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="prompt-copied-title"
        className="codex-modal panel-glow relative z-10 w-full max-w-md rounded-xl border border-cyan-500/40 bg-gradient-to-b from-slate-950 via-[#0a1020] to-[#070b14] p-6 shadow-[0_0_48px_rgba(34,211,238,0.2)] sm:p-8"
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 shadow-[0_0_24px_rgba(34,211,238,0.25)] sm:h-16 sm:w-16"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-cyan-300 sm:h-9 sm:w-9"
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
          className="font-display mt-4 text-center text-2xl font-bold tracking-wide text-white sm:text-3xl"
        >
          Prompt Copied
        </h3>

        <ol className="mt-5 space-y-2.5">
          {steps.map((text, index) => (
            <li key={text} className="flex items-start gap-3">
              <span className="font-display flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-950/60 text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/30">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm font-medium text-slate-200 sm:text-base">{text}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onOpenChatGPT}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-4 font-display text-base font-semibold uppercase tracking-wider text-white shadow-[0_0_32px_rgba(34,211,238,0.4)] transition hover:from-cyan-400 hover:to-purple-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
        >
          Open ChatGPT
          <span aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full cursor-pointer py-2 text-center text-sm font-semibold text-slate-500 transition hover:text-slate-300"
        >
          I&apos;ll Do It Later
        </button>
      </div>
    </div>
  )
}

function getPromptPreview(prompt: string, lines: number): string {
  const split = prompt.split('\n')
  if (split.length <= lines) return prompt
  return `${split.slice(0, lines).join('\n')}\n…`
}

function getJsonExamplePreview(json: string): string {
  const lines = json.split('\n')
  if (lines.length <= 14) return json
  return `${lines.slice(0, 14).join('\n')}\n…`
}
