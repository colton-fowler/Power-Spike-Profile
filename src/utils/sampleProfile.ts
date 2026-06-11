import type { PresetId } from '../constants/presets'
import { getPresetById } from '../constants/presets'
import { validateProfileJson } from './validateProfile'
import type { PowerSpikeProfile } from '../types/profile'

export function getSampleJson(presetId: PresetId = 'balanced'): string {
  return getPresetById(presetId).sampleJson
}

export function getSampleProfile(presetId: PresetId = 'balanced'): PowerSpikeProfile {
  const result = validateProfileJson(getSampleJson(presetId))
  if (!result.valid || !result.profile) {
    throw new Error('Sample profile failed validation')
  }
  return result.profile
}
