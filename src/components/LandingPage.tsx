import { useEffect, useRef, useState } from 'react'
import { PROFILE_PRESETS, type PresetId } from '../constants/presets'
import { BuildSelectCard } from './BuildSelectCard'
import { Button } from './Button'
import { HowToModal } from './HowToModal'

interface LandingPageProps {
  jsonInput: string
  onJsonChange: (value: string) => void
  onRender: () => boolean
  onGenerateSample: () => void
  presetId: PresetId
  onPresetChange: (id: PresetId) => void
  error: string | null
}

export function LandingPage({
  jsonInput,
  onJsonChange,
  onRender,
  onGenerateSample,
  presetId,
  onPresetChange,
  error,
}: LandingPageProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [wizardInitialStep, setWizardInitialStep] = useState<1 | 2>(1)
  const [highlightJsonInput, setHighlightJsonInput] = useState(false)
  const [showPasteHint, setShowPasteHint] = useState(false)
  const jsonInputSectionRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!highlightJsonInput) return
    const timer = window.setTimeout(() => setHighlightJsonInput(false), 2500)
    return () => window.clearTimeout(timer)
  }, [highlightJsonInput])

  useEffect(() => {
    if (!showPasteHint) return
    const timer = window.setTimeout(() => setShowPasteHint(false), 4000)
    return () => window.clearTimeout(timer)
  }, [showPasteHint])

  const openHelpModal = () => {
    setWizardInitialStep(1)
    setModalOpen(true)
  }

  const openPresetModal = (id: PresetId) => {
    onPresetChange(id)
    setWizardInitialStep(2)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setWizardInitialStep(1)
  }

  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/60">
            Investment Chart Generator
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-wide text-white sm:text-5xl">
            Power Spike Profile
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Choose a build, generate your stat profile from ChatGPT, and render a Deadlock-style
            upgrade board — spikes, weak lanes, and highest-ROI investments.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="ghost" type="button" onClick={openHelpModal}>
            How Power Spike Profiles Work
          </Button>
          <Button variant="secondary" onClick={onGenerateSample}>
            Use Example Profile
          </Button>
        </div>

        {/* Build selection cards */}
        <div className="mt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Select Your Build
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROFILE_PRESETS.map((preset) => (
              <BuildSelectCard
                key={preset.id}
                title={preset.landingLabel}
                description={preset.goal}
                accent={preset.accent}
                selected={presetId === preset.id}
                onClick={() => openPresetModal(preset.id)}
              />
            ))}
          </div>
        </div>

        <div
          ref={jsonInputSectionRef}
          id="json-input-section"
          className="panel-glow relative mt-10 scroll-mt-24 rounded-lg border border-slate-700/60 bg-slate-900/40 p-4 sm:p-6"
        >
          {showPasteHint && (
            <div
              className="paste-hint pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-500/40 bg-cyan-950/90 px-3 py-1.5 text-xs font-semibold text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
              role="status"
            >
              Paste your ChatGPT profile JSON here
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="json-input" className="text-sm font-semibold text-slate-300">
              Paste Power Spike Profile JSON
            </label>
            <span className="rounded border border-cyan-800/40 bg-cyan-950/30 px-2 py-0.5 text-xs text-cyan-300/80">
              Active build: {PROFILE_PRESETS.find((p) => p.id === presetId)?.landingLabel}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            id="json-input"
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            placeholder='{"profileName": "...", "archetype": "...", ...}'
            rows={14}
            className={`w-full resize-y rounded-md border bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
              highlightJsonInput
                ? 'json-input-highlight border-cyan-400/60'
                : 'border-slate-700/80'
            }`}
          />

          {error && (
            <div
              role="alert"
              className="mt-3 rounded-md border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          <div className="mt-5 flex justify-center">
            <Button onClick={onRender} className="min-w-[180px]">
              Build My Profile
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          This is a reflective tool, not a clinical assessment.
        </p>
      </main>

      <HowToModal
        open={modalOpen}
        onClose={handleCloseModal}
        presetId={presetId}
        onPresetChange={onPresetChange}
        initialStep={wizardInitialStep}
        jsonInput={jsonInput}
        onJsonChange={onJsonChange}
        onRender={onRender}
        onGenerateSample={onGenerateSample}
        error={error}
      />
    </>
  )
}
