export interface Stat {
  name: string
  score: number
  category: string
  comment: string
  tip: string
  investmentRead: string
}

export interface PowerSpikeProfile {
  profileName: string
  archetype: string
  summary: string
  stats: Stat[]
}

export type SpikeStatus =
  | 'Marginal Gains'
  | 'Power Spike Online'
  | 'Pre-Spike / High ROI'
  | 'Stable Baseline'
  | 'Early Investment'
  | 'Unbuilt'

export type UpgradeTierId =
  | 'small-gain'
  | 'baseline'
  | 'stable'
  | 'spike-tier'
  | 'power-spike'
  | 'marginal-gains'

export interface UpgradeTier {
  id: UpgradeTierId
  label: string
  range: string
  min: number
  max: number
}

export type ChartView = 'board' | 'detailed'
