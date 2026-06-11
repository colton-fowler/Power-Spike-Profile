export const HOW_TO_INSTRUCTIONS =
  'Open your own ChatGPT conversation, paste the prompt below, then copy the JSON response back into this app. Your ChatGPT should rate you based on what it has learned from your conversations. The chart works like an investment spike system: some stats are underbuilt, some are close to a major spike, and some have already hit their spike. Once a stat hits the star, more investment still helps, but the gains become smaller. The goal is to find the highest-ROI stat to invest in next.'

export const SPIKE_CONCEPT_LABELS = [
  { label: 'Pre-spike: high ROI investment', description: 'Stats at 75–84 — biggest noticeable gains per point invested.' },
  { label: 'Spike hit: major upgrade online', description: 'Stats at 85–89 — the star moment. Major strength unlocked.' },
  { label: 'Post-spike: marginal gains only', description: 'Stats at 90+ — still useful, but diminishing returns.' },
] as const

export const CHATGPT_PROMPT = `Based on what you know about me from our conversations, generate a Power Spike Profile JSON.

Be honest and do not glaze me. Use realistic scores from 0–100.

This profile uses an investment spike system:
- Below 50 means the stat is underbuilt or inconsistent.
- 50–74 means the stat is usable but not a major strength.
- 75–84 means the stat is close to a major power spike and may be the best high-ROI investment.
- 85–89 means the stat has hit its power spike.
- 90–100 means the stat is already spiked and further improvement is mostly marginal gains.

The star represents the moment where the category has spiked.
Before the star, investing in that stat creates big noticeable improvements.
After the star, further investment still helps, but gives smaller marginal returns.

Return only valid JSON in this exact format:

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
}

Create 8–12 stats total.

Include a mix of:
- discipline
- confidence
- emotional control
- social skills
- focus
- patience
- resilience
- self-awareness
- execution
- consistency
- decision making
- communication

Rules:
- Scores should be honest, not motivational fluff.
- Use the spike system when assigning scores.
- Do not give too many 85+ scores unless clearly earned.
- Comment should explain why the score is what it is.
- Tip should be practical.
- investmentRead should explain the ROI of investing in that stat next.
- No therapy diagnosis.
- No long explanations outside JSON.`

export const JSON_EXAMPLE = `{
  "profileName": "Alex",
  "archetype": "Volatile Carry",
  "summary": "High execution when locked in, but consistency and patience crater under pressure. Strong social reads, weak follow-through on boring routines.",
  "stats": [
    {
      "name": "Execution",
      "score": 87,
      "category": "Performance",
      "comment": "You deliver when stakes are visible; routine tasks get half effort.",
      "tip": "Batch low-stakes work into timed 25-minute blocks with a hard stop.",
      "investmentRead": "Spiked — maintain without overinvesting. Shift ROI to weaker lanes."
    },
    {
      "name": "Consistency",
      "score": 38,
      "category": "Habits",
      "comment": "Momentum swings wildly week to week.",
      "tip": "Track one daily non-negotiable for 14 days before adding another.",
      "investmentRead": "Underbuilt — farm fundamentals before chasing spike tiers elsewhere."
    },
    {
      "name": "Confidence",
      "score": 71,
      "category": "Mindset",
      "comment": "Solid in familiar arenas; shrinks when judged by strangers.",
      "tip": "Record yourself presenting once a week and review only structure, not appearance.",
      "investmentRead": "Stable baseline — usable but not the highest ROI target right now."
    },
    {
      "name": "Emotional Control",
      "score": 55,
      "category": "Mindset",
      "comment": "Frustration leaks into tone faster than you notice.",
      "tip": "Use a 10-second pause rule before replying when your heart rate spikes.",
      "investmentRead": "Stable but inconsistent — build toward 75 before expecting spike returns."
    },
    {
      "name": "Focus",
      "score": 64,
      "category": "Performance",
      "comment": "Deep work is possible but easily hijacked by notifications.",
      "tip": "Phone in another room for the first 90 minutes of work.",
      "investmentRead": "Usable lane — not spiked, not urgent unless everything else is higher."
    },
    {
      "name": "Social Skills",
      "score": 81,
      "category": "Social",
      "comment": "Warm and witty one-on-one; group dynamics sometimes lose you.",
      "tip": "Prepare one open question before group hangouts to stay engaged.",
      "investmentRead": "Pre-spike high ROI — four points from a major upgrade. Best investment target."
    },
    {
      "name": "Discipline",
      "score": 42,
      "category": "Habits",
      "comment": "You know what to do; you negotiate with yourself until you don't.",
      "tip": "Pre-commit consequences with a friend for missed morning routines.",
      "investmentRead": "Underbuilt — critical gap dragging other stats down."
    },
    {
      "name": "Resilience",
      "score": 67,
      "category": "Mindset",
      "comment": "Bounce back within days, but the crash still costs you.",
      "tip": "Write a 3-line post-mortem within 24 hours of any setback.",
      "investmentRead": "Stable baseline — hold lane, don't over-prioritize over pre-spike targets."
    },
    {
      "name": "Self-Awareness",
      "score": 92,
      "category": "Mindset",
      "comment": "You name your patterns; changing them lags behind.",
      "tip": "Pick one pattern and run a weekly scoreboard on behavior, not feelings.",
      "investmentRead": "Marginal gains only — already spiked. Invest elsewhere."
    },
    {
      "name": "Decision Making",
      "score": 58,
      "category": "Performance",
      "comment": "Fast calls under pressure; slow paralysis on reversible choices.",
      "tip": "Set a 10-minute timer for low-stakes decisions and commit when it rings.",
      "investmentRead": "Early-to-stable — needs baseline work before spike hunting."
    }
  ]
}`
