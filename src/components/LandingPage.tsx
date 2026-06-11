import { useState } from 'react'
import { Button } from './Button'
import { HowToPanel } from './HowToPanel'

interface LandingPageProps {
  jsonInput: string
  onJsonChange: (value: string) => void
  onRender: () => void
  onGenerateSample: () => void
  error: string | null
}

export function LandingPage({
  jsonInput,
  onJsonChange,
  onRender,
  onGenerateSample,
  error,
}: LandingPageProps) {
  const [howToOpen, setHowToOpen] = useState(false)

  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/60">
            Investment Chart Generator
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-wide text-white sm:text-5xl">
            Power Spike Profile
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            Paste a structured JSON profile from ChatGPT and convert it into a game-style
            investment spike chart — stats, power spikes, weak lanes, and blunt improvement tips.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="ghost" onClick={() => setHowToOpen(true)}>
            How do I use this?
          </Button>
          <Button variant="secondary" onClick={onGenerateSample}>
            Generate Sample
          </Button>
        </div>

        <div className="panel-glow mt-8 rounded-lg border border-slate-700/60 bg-slate-900/40 p-4 sm:p-6">
          <label htmlFor="json-input" className="mb-2 block text-sm font-semibold text-slate-300">
            Paste Power Spike Profile JSON
          </label>
          <textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            placeholder='{"profileName": "...", "archetype": "...", ...}'
            rows={14}
            className="w-full resize-y rounded-md border border-slate-700/80 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
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
              Render Profile
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          This is a reflective tool, not a clinical assessment.
        </p>
      </main>

      <HowToPanel open={howToOpen} onClose={() => setHowToOpen(false)} />
    </>
  )
}
