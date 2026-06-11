import { JSON_EXAMPLE } from '../constants/prompt'
import { validateProfileJson } from './validateProfile'
import type { PowerSpikeProfile } from '../types/profile'

export function getSampleProfile(): PowerSpikeProfile {
  const result = validateProfileJson(JSON_EXAMPLE)
  if (!result.valid || !result.profile) {
    throw new Error('Sample profile failed validation')
  }
  return result.profile
}

export function getSampleJson(): string {
  return JSON_EXAMPLE
}
