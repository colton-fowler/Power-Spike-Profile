import { useState } from 'react'
import type { PowerSpikeProfile } from './types/profile'
import { LandingPage } from './components/LandingPage'
import { ProfilePage } from './components/ProfilePage'
import { getSampleJson } from './utils/sampleProfile'
import { validateProfileJson } from './utils/validateProfile'

type View = 'landing' | 'profile'

function App() {
  const [view, setView] = useState<View>('landing')
  const [jsonInput, setJsonInput] = useState('')
  const [profile, setProfile] = useState<PowerSpikeProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleJsonChange = (value: string) => {
    setJsonInput(value)
    if (error) setError(null)
  }

  const handleRender = () => {
    const result = validateProfileJson(jsonInput)
    if (!result.valid || !result.profile) {
      setError(result.error ?? 'Invalid profile JSON.')
      return
    }
    setProfile(result.profile)
    setError(null)
    setView('profile')
  }

  const handleGenerateSample = () => {
    setJsonInput(getSampleJson())
    setError(null)
  }

  const handleBack = () => {
    setView('landing')
  }

  return (
    <div className="bg-grid min-h-screen bg-gradient-to-b from-[#070b14] via-[#0a1020] to-[#070b14]">
      {view === 'landing' && (
        <LandingPage
          jsonInput={jsonInput}
          onJsonChange={handleJsonChange}
          onRender={handleRender}
          onGenerateSample={handleGenerateSample}
          error={error}
        />
      )}
      {view === 'profile' && profile && (
        <ProfilePage profile={profile} onBack={handleBack} />
      )}
    </div>
  )
}

export default App
