export const HOW_TO_INSTRUCTIONS =
  'Open your own ChatGPT conversation, paste the prompt below, then copy the JSON response back into this app. The better your ChatGPT knows you, the more accurate the profile will be.'

export const CHATGPT_PROMPT = `Based on what you know about me from our conversations, generate a Power Spike Profile JSON.

Be honest and do not glaze me. Use realistic scores from 0–100.

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
      "comment": "Blunt but useful comment.",
      "tip": "One specific improvement tip."
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
- Comment should explain why the score is what it is.
- Tip should be practical.
- No therapy diagnosis.
- No long explanations outside JSON.`

export const JSON_EXAMPLE = `{
  "profileName": "Alex",
  "archetype": "Volatile Carry",
  "summary": "High execution when locked in, but consistency and patience crater under pressure. Strong social reads, weak follow-through on boring routines.",
  "stats": [
    {
      "name": "Execution",
      "score": 82,
      "category": "Performance",
      "comment": "You deliver when stakes are visible; routine tasks get half effort.",
      "tip": "Batch low-stakes work into timed 25-minute blocks with a hard stop."
    },
    {
      "name": "Consistency",
      "score": 48,
      "category": "Habits",
      "comment": "Momentum swings wildly week to week.",
      "tip": "Track one daily non-negotiable for 14 days before adding another."
    },
    {
      "name": "Confidence",
      "score": 71,
      "category": "Mindset",
      "comment": "Solid in familiar arenas; shrinks when judged by strangers.",
      "tip": "Record yourself presenting once a week and review only structure, not appearance."
    },
    {
      "name": "Emotional Control",
      "score": 55,
      "category": "Mindset",
      "comment": "Frustration leaks into tone faster than you notice.",
      "tip": "Use a 10-second pause rule before replying when your heart rate spikes."
    },
    {
      "name": "Focus",
      "score": 64,
      "category": "Performance",
      "comment": "Deep work is possible but easily hijacked by notifications.",
      "tip": "Phone in another room for the first 90 minutes of work."
    },
    {
      "name": "Social Skills",
      "score": 78,
      "category": "Social",
      "comment": "Warm and witty one-on-one; group dynamics sometimes lose you.",
      "tip": "Prepare one open question before group hangouts to stay engaged."
    },
    {
      "name": "Discipline",
      "score": 42,
      "category": "Habits",
      "comment": "You know what to do; you negotiate with yourself until you don't.",
      "tip": "Pre-commit consequences with a friend for missed morning routines."
    },
    {
      "name": "Resilience",
      "score": 67,
      "category": "Mindset",
      "comment": "Bounce back within days, but the crash still costs you.",
      "tip": "Write a 3-line post-mortem within 24 hours of any setback."
    },
    {
      "name": "Self-Awareness",
      "score": 74,
      "category": "Mindset",
      "comment": "You name your patterns; changing them lags behind.",
      "tip": "Pick one pattern and run a weekly scoreboard on behavior, not feelings."
    },
    {
      "name": "Decision Making",
      "score": 58,
      "category": "Performance",
      "comment": "Fast calls under pressure; slow paralysis on reversible choices.",
      "tip": "Set a 10-minute timer for low-stakes decisions and commit when it rings."
    }
  ]
}`
