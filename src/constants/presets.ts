import { JSON_EXAMPLE } from './prompt'

export type PresetId =
  | 'balanced'
  | 'brutal'
  | 'dating'
  | 'career'
  | 'mental'
  | 'gamer'

export const PRESET_STORAGE_KEY = 'power-spike-profile-preset'

export interface ProfilePreset {
  id: PresetId
  name: string
  landingLabel: string
  promptTitle: string
  goal: string
  tag: string
  focus: string[]
  accent: string
  prompt: string
  sampleJson: string
}

const SPIKE_SYSTEM = `This profile uses an investment spike system:
- Below 50 means the stat is underbuilt or inconsistent.
- 50–74 means the stat is usable but not a major strength.
- 75–84 means the stat is close to a major power spike and may be the best high-ROI investment.
- 85–89 means the stat has hit its power spike.
- 90–100 means the stat is already spiked and further improvement is mostly marginal gains.

The star represents the moment where the category has spiked.
Before the star, investing in that stat creates big noticeable improvements.
After the star, further investment still helps, but gives smaller marginal returns.`

const JSON_FORMAT = `Return only valid JSON in this exact format:

{
  "profileName": "My name or nickname",
  "archetype": "Short archetype label",
  "summary": "Blunt 1–2 sentence summary of my current strengths and weaknesses.",
  "stats": [
    {
      "name": "Stat name",
      "score": 0,
      "category": "Category",
      "comment": "Blunt but useful comment explaining the score.",
      "tip": "One specific improvement tip.",
      "investmentRead": "Explain whether this stat is underbuilt, stable, near spike, spiked, or already in marginal gains."
    }
  ]
}`

const BASE_RULES = `- Scores should be honest, not motivational fluff.
- Use the spike system when assigning scores.
- Do not give too many 85+ scores unless clearly earned.
- Comment should explain why the score is what it is.
- Tip should be practical.
- investmentRead should explain the ROI of investing in that stat next.
- No therapy diagnosis.
- No long explanations outside JSON.`

function buildPrompt(
  statLines: string[],
  extraRules: string[] = [],
  introExtra = '',
): string {
  const focusBlock = statLines.map((line) => `- ${line}`).join('\n')
  const rulesBlock = [...extraRules, BASE_RULES].join('\n')

  return `Based on what you know about me from our conversations, generate a Power Spike Profile JSON.

Be honest and do not glaze me. Use realistic scores from 0–100.
${introExtra ? `\n${introExtra}\n` : ''}
${SPIKE_SYSTEM}

${JSON_FORMAT}

Create 8–12 stats total.

Include a mix of:
${focusBlock}

Rules:
${rulesBlock}`
}

const DATING_SAMPLE = `{
  "profileName": "Jordan",
  "archetype": "High-Variance Flirt",
  "summary": "Strong one-on-one charm and calibration, but execution drops when attraction feels real. Confidence spikes in practice, dips in high-stakes moments.",
  "stats": [
    {
      "name": "Confidence",
      "score": 78,
      "category": "Mindset",
      "comment": "Comfortable initiating; tightens when the other person is clearly interested.",
      "tip": "Run three low-stakes approaches weekly where rejection has zero consequence.",
      "investmentRead": "Pre-spike high ROI — push to 85 before over-polishing other social stats."
    },
    {
      "name": "Social Calibration",
      "score": 82,
      "category": "Social",
      "comment": "Reads tone well in conversation; misreads texting pacing.",
      "tip": "Match reply energy within one notch of theirs for a full week.",
      "investmentRead": "Near spike — one of the best lanes to invest in next."
    },
    {
      "name": "Charisma",
      "score": 74,
      "category": "Social",
      "comment": "Warm and funny with friends; performs instead of connecting on dates.",
      "tip": "Ask one genuine follow-up question before every self-deprecating joke.",
      "investmentRead": "Stable baseline trending pre-spike — solid secondary investment."
    },
    {
      "name": "Emotional Control",
      "score": 51,
      "category": "Mindset",
      "comment": "Overthinks slow replies and spirals into neediness.",
      "tip": "24-hour rule: no double-texting until the next calendar day.",
      "investmentRead": "Underbuilt — fixing this unlocks every other dating stat."
    },
    {
      "name": "Conversation Skill",
      "score": 80,
      "category": "Social",
      "comment": "Keeps threads alive; struggles to escalate beyond friendly banter.",
      "tip": "Practice one light direct compliment per date, timed mid-conversation.",
      "investmentRead": "Pre-spike — high ROI if you want faster dating results."
    },
    {
      "name": "Dating Execution",
      "score": 44,
      "category": "Performance",
      "comment": "Great at talking, slow at asking out and setting plans.",
      "tip": "End every good conversation with a specific date proposal, not a vague 'we should hang.'",
      "investmentRead": "Underbuilt bottleneck — highest leverage fix below 75."
    },
    {
      "name": "Leadership",
      "score": 63,
      "category": "Social",
      "comment": "Takes charge in groups; deferential one-on-one with strong personalities.",
      "tip": "Pick the venue and time for the next three dates without polling.",
      "investmentRead": "Stable — invest after execution and emotional control climb."
    },
    {
      "name": "Boundaries",
      "score": 69,
      "category": "Mindset",
      "comment": "Clear with strangers; soft with people you like.",
      "tip": "Write one boundary before each date you tend to compromise on.",
      "investmentRead": "Stable baseline — supports long-term dating health, not urgent spike fuel."
    },
    {
      "name": "Relationship Readiness",
      "score": 57,
      "category": "Mindset",
      "comment": "Wants connection but still optimizing for validation hits.",
      "tip": "List three non-negotiables and discard matches who miss two within a month.",
      "investmentRead": "Needs baseline work — score honesty here prevents wasted dating reps."
    }
  ]
}`

const CAREER_SAMPLE = `{
  "profileName": "Sam",
  "archetype": "Burst DPS Specialist",
  "summary": "Elite execution on visible projects, unreliable on boring maintenance work. Learning speed is high but consistency caps promotion velocity.",
  "stats": [
    {
      "name": "Discipline",
      "score": 52,
      "category": "Habits",
      "comment": "Crushes deadlines when watched; lets admin debt pile up silently.",
      "tip": "Block 30 minutes every Friday for inbox and ticket zero only.",
      "investmentRead": "Stable but underbuilt for senior roles — farm before chasing new skills."
    },
    {
      "name": "Execution",
      "score": 86,
      "category": "Performance",
      "comment": "Delivers under pressure; over-engineers when scope is fuzzy.",
      "tip": "Ship a rough v1 in 48 hours before polishing any solo project.",
      "investmentRead": "Spiked — maintain, redirect ROI to consistency and discipline."
    },
    {
      "name": "Focus",
      "score": 71,
      "category": "Performance",
      "comment": "Deep work blocks work until Slack pings.",
      "tip": "Status message + DND for the first 90 minutes of each workday.",
      "investmentRead": "Stable baseline — secondary target after consistency."
    },
    {
      "name": "Consistency",
      "score": 41,
      "category": "Habits",
      "comment": "Hero weeks followed by invisible weeks.",
      "tip": "One daily non-negotiable work output logged before logging off.",
      "investmentRead": "Underbuilt — biggest career bottleneck right now."
    },
    {
      "name": "Leadership",
      "score": 68,
      "category": "Social",
      "comment": "Leads by example; avoids hard feedback conversations.",
      "tip": "Deliver one piece of direct feedback per week with a specific behavior ask.",
      "investmentRead": "Stable — spike hunting premature until consistency hits 60+."
    },
    {
      "name": "Learning Speed",
      "score": 83,
      "category": "Performance",
      "comment": "Picks up tools fast; rarely documents what you learned.",
      "tip": "Write a 5-bullet teardown after every new tool you ship with.",
      "investmentRead": "Pre-spike high ROI — close to major upgrade."
    },
    {
      "name": "Decision Making",
      "score": 76,
      "category": "Performance",
      "comment": "Decisive in crises; stalls on reversible choices.",
      "tip": "10-minute timer on low-stakes decisions; commit when it rings.",
      "investmentRead": "Pre-spike window — strong investment lane."
    },
    {
      "name": "Ambition",
      "score": 79,
      "category": "Mindset",
      "comment": "High ceiling goals; vague quarterly milestones.",
      "tip": "Rewrite yearly goal into one measurable 90-day target.",
      "investmentRead": "Near spike — pairs well with consistency investment."
    },
    {
      "name": "Reliability",
      "score": 48,
      "category": "Habits",
      "comment": "Trusted on launches; flaky on recurring commitments.",
      "tip": "Under-promise delivery dates by one day and hit them for a month.",
      "investmentRead": "Underbuilt — managers notice this before your spikes."
    },
    {
      "name": "Problem Solving",
      "score": 84,
      "category": "Performance",
      "comment": "Creative fixes; sometimes ignores boring root causes.",
      "tip": "Ask 'what would prevent this permanently?' before any workaround.",
      "investmentRead": "Pre-spike — one push from power spike territory."
    }
  ]
}`

const MENTAL_SAMPLE = `{
  "profileName": "Riley",
  "archetype": "Glass Cannon Mindset",
  "summary": "High self-awareness and recovery speed, but emotional control cracks under sustained stress. Discipline is the load-bearing stat you keep neglecting.",
  "stats": [
    {
      "name": "Emotional Control",
      "score": 49,
      "category": "Mindset",
      "comment": "Composed until sleep debt and pressure stack — then sharp tone leaks.",
      "tip": "Track sleep + mood for 14 days; no hard conversations below 6 hours sleep.",
      "investmentRead": "Underbuilt — fixing this stabilizes every other mental stat."
    },
    {
      "name": "Resilience",
      "score": 77,
      "category": "Mindset",
      "comment": "Bounces back within days; the crash still wrecks a week.",
      "tip": "24-hour post-mortem template after every setback — three lines max.",
      "investmentRead": "Pre-spike high ROI — strong candidate for next investment."
    },
    {
      "name": "Self Awareness",
      "score": 88,
      "category": "Mindset",
      "comment": "Names patterns accurately; behavior change lags insight by months.",
      "tip": "Weekly behavior scoreboard on one pattern — not feelings, actions only.",
      "investmentRead": "Spiked — maintain without overinvesting in more introspection."
    },
    {
      "name": "Patience",
      "score": 54,
      "category": "Mindset",
      "comment": "Patient with others; impatient with your own progress.",
      "tip": "Set 21-day minimum before evaluating any new habit.",
      "investmentRead": "Stable but inconsistent — build toward 75 before expecting spike returns."
    },
    {
      "name": "Stress Management",
      "score": 43,
      "category": "Mindset",
      "comment": "Ignores stress until body forces a shutdown.",
      "tip": "Two 10-minute decompression blocks daily — non-negotiable calendar holds.",
      "investmentRead": "Underbuilt — emergency farm priority alongside emotional control."
    },
    {
      "name": "Discipline",
      "score": 36,
      "category": "Habits",
      "comment": "You know the playbook; you renegotiate with yourself daily.",
      "tip": "One keystone habit with a public accountability partner for 30 days.",
      "investmentRead": "Critical underbuilt stat — highest leverage mental game investment."
    },
    {
      "name": "Confidence",
      "score": 72,
      "category": "Mindset",
      "comment": "Solid in familiar domains; shrinks in ambiguous arenas.",
      "tip": "One weekly reps session in a domain where failure is cheap.",
      "investmentRead": "Stable baseline — invest after discipline and stress management."
    },
    {
      "name": "Adaptability",
      "score": 81,
      "category": "Mindset",
      "comment": "Pivots well externally; internally resists identity updates.",
      "tip": "Write 'old story / new story' when a plan fails instead of spiraling.",
      "investmentRead": "Pre-spike — near major upgrade if you keep pushing."
    },
    {
      "name": "Recovery",
      "score": 65,
      "category": "Habits",
      "comment": "Recovers with distraction; rarely with intentional rest.",
      "tip": "Protect one full rest day weekly with phone-free blocks.",
      "investmentRead": "Stable — supports resilience spike push but not urgent alone."
    }
  ]
}`

const GAMER_SAMPLE = `{
  "profileName": "Nova",
  "archetype": "Mechanical Midlaner",
  "summary": "Crisp mechanics and learning rate, but tilt resistance and consistency cap ranked climb. Leadership shows in stacks, disappears in solo queue.",
  "stats": [
    {
      "name": "Mechanics",
      "score": 85,
      "category": "Performance",
      "comment": "Clean inputs under pressure; occasional autopilot misclicks in long sessions.",
      "tip": "Stop queue after two gross misplays — reset with 5 minutes of dry practice.",
      "investmentRead": "Spiked — maintain mechanics, farm tilt and consistency instead."
    },
    {
      "name": "Strategy",
      "score": 79,
      "category": "Performance",
      "comment": "Strong mid-game calls; greedy fights when ahead.",
      "tip": "Review one lost lead game weekly — identify the first overforced fight.",
      "investmentRead": "Pre-spike high ROI — close to major upgrade."
    },
    {
      "name": "Adaptability",
      "score": 73,
      "category": "Mindset",
      "comment": "Adjusts builds; slow to change playstyle when countered.",
      "tip": "Play one off-role or off-meta game daily for two weeks.",
      "investmentRead": "Stable trending pre-spike — solid secondary investment."
    },
    {
      "name": "Leadership",
      "score": 62,
      "category": "Social",
      "comment": "Shot-calls with friends; mute-and-farm in solo.",
      "tip": "One concise ping-based call every three minutes in solo — no chatter spam.",
      "investmentRead": "Stable baseline — unlocks after consistency improves."
    },
    {
      "name": "Tilt Resistance",
      "score": 38,
      "category": "Mindset",
      "comment": "Two bad lanes and you queue angry for the rest of the session.",
      "tip": "Hard stop at two losses; walk away for 15 minutes minimum.",
      "investmentRead": "Underbuilt — biggest ranked bottleneck. Farm this first."
    },
    {
      "name": "Learning Rate",
      "score": 87,
      "category": "Performance",
      "comment": "VOD review sticks; you skip reviewing wins where bad habits hide.",
      "tip": "Review one win and one loss per week — wins expose autopilot.",
      "investmentRead": "Spiked — shift study time to execution and consistency."
    },
    {
      "name": "Execution",
      "score": 76,
      "category": "Performance",
      "comment": "Knows the plan; drops combos when chaos spikes.",
      "tip": "Custom game drill: same combo sequence 20 reps before ranked.",
      "investmentRead": "Pre-spike — high ROI if you want immediate LP gains."
    },
    {
      "name": "Consistency",
      "score": 45,
      "category": "Habits",
      "comment": "Pops off one game per session; throws the next on autopilot.",
      "tip": "Same warmup routine every session — never queue cold.",
      "investmentRead": "Underbuilt — caps every other stat until addressed."
    },
    {
      "name": "Creativity",
      "score": 68,
      "category": "Performance",
      "comment": "Innovative in scrims; reverts to safe patterns in ranked.",
      "tip": "One calculated creative play attempt per game with a pre-commit rule.",
      "investmentRead": "Stable — fun to invest in after tilt resistance hits 60+."
    }
  ]
}`

const BRUTAL_SAMPLE = `{
  "profileName": "Alex",
  "archetype": "Overrated Generalist",
  "summary": "You talk like a high performer and score like a mid laner who got boosted. Self-awareness is fine; discipline and consistency are actively sabotaging everything else.",
  "stats": [
    {
      "name": "Discipline",
      "score": 34,
      "category": "Habits",
      "comment": "You do not have a discipline problem — you have a honesty problem about how often you quit.",
      "tip": "Track one habit publicly for 30 days. No private streaks.",
      "investmentRead": "Critical underbuilt stat. Everything else is fake progress until this moves."
    },
    {
      "name": "Consistency",
      "score": 29,
      "category": "Habits",
      "comment": "Two good weeks do not erase six months of drift. Your pattern is burst then abandon.",
      "tip": "Same wake time 5 days/week for 21 days before adding any new goal.",
      "investmentRead": "Lowest stat on the board — emergency farm priority."
    },
    {
      "name": "Execution",
      "score": 68,
      "category": "Performance",
      "comment": "You finish what is fun or urgent. You stall on anything that builds long-term value.",
      "tip": "Ship one boring task daily before any creative work.",
      "investmentRead": "Stable but overrated relative to your self-image — not a spike target yet."
    },
    {
      "name": "Confidence",
      "score": 61,
      "category": "Mindset",
      "comment": "Confident in theory; folds when feedback gets specific.",
      "tip": "Ask for one brutal piece of feedback weekly and do not defend yourself.",
      "investmentRead": "Usable but inflated in your head — invest after discipline."
    },
    {
      "name": "Self-Awareness",
      "score": 74,
      "category": "Mindset",
      "comment": "You can narrate your flaws eloquently. That is not the same as fixing them.",
      "tip": "Replace one journal entry per week with a behavior tally sheet.",
      "investmentRead": "Near pre-spike but overvalued — stop introspecting, start executing."
    },
    {
      "name": "Focus",
      "score": 47,
      "category": "Performance",
      "comment": "Phone within reach means you do not actually want to focus.",
      "tip": "Phone in another room for first 90 minutes of work. No exceptions.",
      "investmentRead": "Underbuilt — cheap wins available if you stop lying to yourself."
    },
    {
      "name": "Emotional Control",
      "score": 53,
      "category": "Mindset",
      "comment": "Irritation shows in tone before you notice. Others notice first.",
      "tip": "10-second pause rule before every reply when annoyed.",
      "investmentRead": "Stable on paper, weak in practice — build baseline before spike hunting."
    },
    {
      "name": "Social Skills",
      "score": 72,
      "category": "Social",
      "comment": "Likable enough; you avoid hard conversations and call it being easy-going.",
      "tip": "Initiate one uncomfortable conversation you have been postponing.",
      "investmentRead": "Not your bottleneck — stop hiding behind social charm."
    },
    {
      "name": "Decision Making",
      "score": 56,
      "category": "Performance",
      "comment": "Fast on irreversible panic; slow on reversible choices because you fear being wrong.",
      "tip": "10-minute timer on low-stakes decisions. Commit when it rings.",
      "investmentRead": "Needs baseline work — indecision is costing you more than bad decisions."
    },
    {
      "name": "Resilience",
      "score": 65,
      "category": "Mindset",
      "comment": "You recover, but you also treat recovery as proof the crash was fine.",
      "tip": "Post-mortem within 24 hours of every setback — what behavior caused it?",
      "investmentRead": "Stable — do not invest here until discipline is above 50."
    }
  ]
}`

export const PROFILE_PRESETS: ProfilePreset[] = [
  {
    id: 'balanced',
    name: 'Balanced Profile',
    landingLabel: 'Analyze Me',
    promptTitle: 'Balanced Profile Prompt',
    goal: 'General assessment across all life areas.',
    tag: 'GENERAL',
    focus: [
      'discipline',
      'confidence',
      'emotional control',
      'social skills',
      'focus',
      'patience',
      'resilience',
      'self-awareness',
      'execution',
      'consistency',
      'decision making',
      'communication',
    ],
    accent: 'cyan',
    prompt: buildPrompt([
      'discipline',
      'confidence',
      'emotional control',
      'social skills',
      'focus',
      'patience',
      'resilience',
      'self-awareness',
      'execution',
      'consistency',
      'decision making',
      'communication',
    ]),
    sampleJson: JSON_EXAMPLE,
  },
  {
    id: 'brutal',
    name: 'Brutally Honest',
    landingLabel: 'Brutally Honest',
    promptTitle: 'Brutally Honest Prompt',
    goal: 'Prioritize weaknesses and bottlenecks.',
    tag: 'AUDIT',
    focus: [
      'Be harsher than normal',
      'Avoid inflated scores',
      'Highlight blind spots',
      'Recommend highest ROI improvements',
      'Do not protect feelings',
    ],
    accent: 'red',
    prompt: buildPrompt(
      [
        'discipline',
        'confidence',
        'emotional control',
        'social skills',
        'focus',
        'patience',
        'resilience',
        'self-awareness',
        'execution',
        'consistency',
        'decision making',
        'communication',
      ],
      [
        'Be harsher than normal.',
        'Avoid inflated scores.',
        'Highlight blind spots explicitly.',
        'Call out where the user is overrating themselves.',
        'Do not protect feelings.',
        'Prioritize bottleneck stats in investmentRead.',
      ],
      'This is a brutally honest build audit. Do not soften scores to be nice.',
    ),
    sampleJson: BRUTAL_SAMPLE,
  },
  {
    id: 'dating',
    name: 'Dating & Social',
    landingLabel: 'Dating & Social',
    promptTitle: 'Dating & Social Prompt',
    goal: 'Evaluate dating and social performance.',
    tag: 'SOCIAL',
    focus: [
      'Confidence',
      'Social Calibration',
      'Charisma',
      'Emotional Control',
      'Conversation Skill',
      'Dating Execution',
      'Leadership',
      'Boundaries',
      'Relationship Readiness',
    ],
    accent: 'purple',
    prompt: buildPrompt(
      [
        'Confidence',
        'Social Calibration',
        'Charisma',
        'Emotional Control',
        'Conversation Skill',
        'Dating Execution',
        'Leadership',
        'Boundaries',
        'Relationship Readiness',
      ],
      [],
      'Focus this profile on dating, attraction, and social dynamics based on what you know about me.',
    ),
    sampleJson: DATING_SAMPLE,
  },
  {
    id: 'career',
    name: 'Career & Achievement',
    landingLabel: 'Career & Achievement',
    promptTitle: 'Career & Achievement Prompt',
    goal: 'Evaluate work performance and achievement potential.',
    tag: 'CAREER',
    focus: [
      'Discipline',
      'Execution',
      'Focus',
      'Consistency',
      'Leadership',
      'Learning Speed',
      'Decision Making',
      'Ambition',
      'Reliability',
      'Problem Solving',
    ],
    accent: 'amber',
    prompt: buildPrompt(
      [
        'Discipline',
        'Execution',
        'Focus',
        'Consistency',
        'Leadership',
        'Learning Speed',
        'Decision Making',
        'Ambition',
        'Reliability',
        'Problem Solving',
      ],
      [],
      'Focus this profile on career performance, professional growth, and achievement potential.',
    ),
    sampleJson: CAREER_SAMPLE,
  },
  {
    id: 'mental',
    name: 'Mental Game',
    landingLabel: 'Mental Game',
    promptTitle: 'Mental Game Prompt',
    goal: 'Evaluate internal strength.',
    tag: 'MENTAL',
    focus: [
      'Emotional Control',
      'Resilience',
      'Self Awareness',
      'Patience',
      'Stress Management',
      'Discipline',
      'Confidence',
      'Adaptability',
      'Recovery',
    ],
    accent: 'emerald',
    prompt: buildPrompt(
      [
        'Emotional Control',
        'Resilience',
        'Self Awareness',
        'Patience',
        'Stress Management',
        'Discipline',
        'Confidence',
        'Adaptability',
        'Recovery',
      ],
      [],
      'Focus this profile on mental strength, emotional regulation, and internal resilience.',
    ),
    sampleJson: MENTAL_SAMPLE,
  },
  {
    id: 'gamer',
    name: 'Gamer Build',
    landingLabel: 'Gamer Build',
    promptTitle: 'Gamer Build Prompt',
    goal: 'Treat the person like an RPG character.',
    tag: 'RPG',
    focus: [
      'Mechanics',
      'Strategy',
      'Adaptability',
      'Leadership',
      'Tilt Resistance',
      'Learning Rate',
      'Execution',
      'Consistency',
      'Creativity',
    ],
    accent: 'orange',
    prompt: buildPrompt(
      [
        'Mechanics',
        'Strategy',
        'Adaptability',
        'Leadership',
        'Tilt Resistance',
        'Learning Rate',
        'Execution',
        'Consistency',
        'Creativity',
      ],
      [],
      'Frame this profile like an RPG/gamer character build. Use gaming metaphors lightly in comments but keep JSON structure identical.',
    ),
    sampleJson: GAMER_SAMPLE,
  },
]

export const DEFAULT_PRESET_ID: PresetId = 'balanced'

export function isPresetId(value: string): value is PresetId {
  return PROFILE_PRESETS.some((preset) => preset.id === value)
}

export function getPresetById(id: PresetId): ProfilePreset {
  return PROFILE_PRESETS.find((preset) => preset.id === id) ?? PROFILE_PRESETS[0]
}

export const SPIKE_TIER_LADDER = [
  { range: '0–24', label: 'Unbuilt', tone: 'unbuilt' },
  { range: '25–49', label: 'Early Investment', tone: 'early' },
  { range: '50–74', label: 'Stable', tone: 'stable' },
  { range: '75–84', label: 'High ROI', tone: 'presike' },
  { range: '85–89', label: '★ Spike Hit', tone: 'spike' },
  { range: '90–100', label: 'Marginal Gains', tone: 'marginal' },
] as const
