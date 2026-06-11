import { useEffect, useState } from 'react'
import { CHATGPT_PROMPT, HOW_TO_INSTRUCTIONS, JSON_EXAMPLE } from '../constants/prompt'
import { copyToClipboard } from '../utils/export'
import { Button } from './Button'

interface HowToPanelProps {
  open: boolean
  onClose: () => void
}

export function HowToPanel({ open, onClose }: HowToPanelProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)

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

  if (!open) return null

  const handleCopyPrompt = async () => {
    await copyToClipboard(CHATGPT_PROMPT)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleCopyJson = async () => {
    await copyToClipboard(JSON_EXAMPLE)
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-title"
        className="panel-glow relative z-10 flex h-full w-full max-w-xl flex-col border-l border-cyan-800/40 bg-gradient-to-b from-slate-950 to-[#070b14] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 id="how-to-title" className="font-display text-lg font-semibold text-cyan-100">
            How do I use this?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-relaxed text-slate-300">{HOW_TO_INSTRUCTIONS}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopyPrompt}>
              {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
            </Button>
            <Button variant="secondary" onClick={handleCopyJson}>
              {copiedJson ? 'Copied!' : 'Copy JSON Example'}
            </Button>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
              ChatGPT Prompt
            </p>
            <pre className="max-h-64 overflow-auto rounded-lg border border-slate-700/60 bg-slate-900/80 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-300">
              {CHATGPT_PROMPT}
            </pre>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
              JSON Example
            </p>
            <pre className="max-h-64 overflow-auto rounded-lg border border-slate-700/60 bg-slate-900/80 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-300">
              {JSON_EXAMPLE}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
