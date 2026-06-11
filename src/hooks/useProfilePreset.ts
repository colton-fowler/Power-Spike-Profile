import { useCallback, useState } from 'react'
import {
  DEFAULT_PRESET_ID,
  getPresetById,
  isPresetId,
  PRESET_STORAGE_KEY,
  type PresetId,
  type ProfilePreset,
} from '../constants/presets'

export function useProfilePreset() {
  const [presetId, setPresetIdState] = useState<PresetId>(() => {
    const stored = localStorage.getItem(PRESET_STORAGE_KEY)
    if (stored && isPresetId(stored)) return stored
    return DEFAULT_PRESET_ID
  })

  const preset: ProfilePreset = getPresetById(presetId)

  const setPresetId = useCallback((id: PresetId) => {
    setPresetIdState(id)
    localStorage.setItem(PRESET_STORAGE_KEY, id)
  }, [])

  return {
    presetId,
    setPresetId,
    preset,
    prompt: preset.prompt,
    sampleJson: preset.sampleJson,
  }
}
