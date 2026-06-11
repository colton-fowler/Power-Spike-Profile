export interface Stat {
  name: string
  score: number
  category: string
  comment: string
  tip: string
}

export interface PowerSpikeProfile {
  profileName: string
  archetype: string
  summary: string
  stats: Stat[]
}

export type SpikeStatus =
  | 'Spike Hit'
  | 'Near Major Spike'
  | 'Stable Investment'
  | 'Needs Investment'
  | 'Underinvested'

export type VisualTier = 'weak' | 'playable' | 'strong' | 'spike'
