import type { PowerSpikeProfile, Stat } from '../types/profile'

export interface ValidationResult {
  valid: boolean
  profile?: PowerSpikeProfile
  error?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseStat(value: unknown, index: number): Stat | string {
  if (!isRecord(value)) {
    return `Stat at index ${index} must be an object.`
  }

  const { name, score, category, comment, tip } = value

  if (typeof name !== 'string' || !name.trim()) {
    return `Stat at index ${index}: "name" must be a non-empty string.`
  }
  if (typeof category !== 'string' || !category.trim()) {
    return `Stat at index ${index}: "category" must be a non-empty string.`
  }
  if (typeof comment !== 'string' || !comment.trim()) {
    return `Stat at index ${index}: "comment" must be a non-empty string.`
  }
  if (typeof tip !== 'string' || !tip.trim()) {
    return `Stat at index ${index}: "tip" must be a non-empty string.`
  }
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return `Stat at index ${index}: "score" must be a number.`
  }
  if (score < 0 || score > 100) {
    return `Stat at index ${index}: "score" must be between 0 and 100.`
  }

  return {
    name: name.trim(),
    score,
    category: category.trim(),
    comment: comment.trim(),
    tip: tip.trim(),
  }
}

export function validateProfileJson(raw: string): ValidationResult {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { valid: false, error: 'Paste your Power Spike Profile JSON to continue.' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    return {
      valid: false,
      error: 'Invalid JSON. Check for missing commas, quotes, or trailing commas.',
    }
  }

  if (!isRecord(parsed)) {
    return { valid: false, error: 'Root value must be a JSON object.' }
  }

  const { profileName, archetype, summary, stats } = parsed

  if (typeof profileName !== 'string' || !profileName.trim()) {
    return { valid: false, error: '"profileName" must be a non-empty string.' }
  }
  if (typeof archetype !== 'string' || !archetype.trim()) {
    return { valid: false, error: '"archetype" must be a non-empty string.' }
  }
  if (typeof summary !== 'string' || !summary.trim()) {
    return { valid: false, error: '"summary" must be a non-empty string.' }
  }
  if (!Array.isArray(stats)) {
    return { valid: false, error: '"stats" must be an array.' }
  }
  if (stats.length < 1) {
    return { valid: false, error: '"stats" must contain at least one stat.' }
  }

  const parsedStats: Stat[] = []
  for (let i = 0; i < stats.length; i++) {
    const result = parseStat(stats[i], i)
    if (typeof result === 'string') {
      return { valid: false, error: result }
    }
    parsedStats.push(result)
  }

  return {
    valid: true,
    profile: {
      profileName: profileName.trim(),
      archetype: archetype.trim(),
      summary: summary.trim(),
      stats: parsedStats,
    },
  }
}
