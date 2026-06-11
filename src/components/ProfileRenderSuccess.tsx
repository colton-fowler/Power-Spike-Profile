interface ProfileRenderSuccessProps {
  visible: boolean
}

export function ProfileRenderSuccess({ visible }: ProfileRenderSuccessProps) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label="Profile generated"
    >
      <div className="profile-render-success panel-glow mx-4 flex max-w-sm flex-col items-center rounded-xl border border-cyan-500/40 bg-gradient-to-b from-slate-950 via-[#0a1020] to-[#070b14] px-8 py-10 text-center shadow-[0_0_64px_rgba(34,211,238,0.25)] sm:max-w-md sm:px-10 sm:py-12">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/50 bg-gradient-to-br from-cyan-500/25 to-purple-600/25 shadow-[0_0_32px_rgba(34,211,238,0.35)] sm:h-20 sm:w-20"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9 text-cyan-300 sm:h-11 sm:w-11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display mt-6 text-2xl font-bold tracking-wide text-white sm:text-3xl">
          Profile Generated
        </h2>
        <p className="mt-2 text-base text-slate-400 sm:text-lg">
          Rendering your Power Spike Profile...
        </p>
      </div>
    </div>
  )
}
