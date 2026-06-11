import { useRef, useState } from 'react'
import type { PowerSpikeProfile } from './types/profile'
import { LandingPage } from './components/LandingPage'
import { ProfilePage } from './components/ProfilePage'
import { ProfileRenderSuccess } from './components/ProfileRenderSuccess'
import { useProfilePreset } from './hooks/useProfilePreset'
import { getSampleJson } from './utils/sampleProfile'
import { validateProfileJson } from './utils/validateProfile'

type View = 'landing' | 'profile'

const RENDER_SUCCESS_MS = 1000

function App() {
  const [view, setView] = useState<View>('landing')
  const [jsonInput, setJsonInput] = useState('')
  const [profile, setProfile] = useState<PowerSpikeProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [renderSuccess, setRenderSuccess] = useState(false)
  const renderTimerRef = useRef<number | null>(null)
  const { presetId, setPresetId } = useProfilePreset()

  const handleJsonChange = (value: string) => {
    setJsonInput(value)
    if (error) setError(null)
  }

  const handleRender = (): boolean => {
    const result = validateProfileJson(jsonInput)
    if (!result.valid || !result.profile) {
      setError(result.error ?? 'Invalid profile JSON.')
      return false
    }

    if (renderTimerRef.current !== null) {
      window.clearTimeout(renderTimerRef.current)
    }

    setProfile(result.profile)
    setError(null)
    setRenderSuccess(true)

    renderTimerRef.current = window.setTimeout(() => {
      setRenderSuccess(false)
      setView('profile')
      renderTimerRef.current = null
    }, RENDER_SUCCESS_MS)

    return true
  }

  const handleGenerateSample = () => {
    setJsonInput(getSampleJson(presetId))
    setError(null)
  }

  const handleBack = () => {
    setView('landing')
  }

  return (
    <div className="game-menu-bg bg-grid relative min-h-screen bg-gradient-to-b from-[#070b14] via-[#0a1020] to-[#070b14]">
      {view === 'landing' && (
        <LandingPage
          jsonInput={jsonInput}
          onJsonChange={handleJsonChange}
          onRender={handleRender}
          onGenerateSample={handleGenerateSample}
          presetId={presetId}
          onPresetChange={setPresetId}
          error={error}
        />
      )}
      {view === 'profile' && profile && (
        <ProfilePage profile={profile} onBack={handleBack} />
      )}
      <ProfileRenderSuccess visible={renderSuccess} />
    </div>
  )
}

export default App
