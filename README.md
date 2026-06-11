# Power Spike Profile

A Deadlock-inspired self-analysis tool that converts ChatGPT-generated JSON profiles into visual upgrade boards.

Power Spike Profile helps users identify strengths, weak lanes, power spikes, and the highest-ROI stats to invest in next.

![Power Spike Profile Preview](./screenshots/power-spike-colton.png)

## Features

* Deadlock-style upgrade board
* Investment spike progression system
* Power spike stars at major stat breakpoints
* High-ROI stat recommendations
* Build presets:

  * Analyze Me
  * Brutally Honest
  * Dating & Social
  * Career & Achievement
  * Mental Game
  * Gamer Build
* Game Codex onboarding modal
* Copyable ChatGPT prompts
* JSON validation
* PNG chart export
* Shareable text summary

## How It Works

1. Choose a build preset.
2. Copy the generated ChatGPT prompt.
3. Paste it into ChatGPT.
4. Copy the JSON response.
5. Paste the JSON into Power Spike Profile.
6. Render your upgrade board.
7. Download the chart as a PNG or copy a shareable summary.

## Investment Spike System

|  Score | Tier                  | Meaning                              |
| -----: | --------------------- | ------------------------------------ |
|   0–24 | Unbuilt               | Weak or undeveloped stat             |
|  25–49 | Early Investment      | Inconsistent and needs work          |
|  50–74 | Stable Baseline       | Usable but not a major strength      |
|  75–84 | High ROI / Near Spike | Best zone for noticeable improvement |
|  85–89 | Power Spike Online    | Major upgrade is unlocked            |
| 90–100 | Marginal Gains        | Still useful, but smaller returns    |

The star represents the moment a stat hits its power spike. Before the star, investment creates big noticeable improvements. After the star, improvement still helps, but the gains become smaller.

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* html-to-image

## Run Locally

```bash
npm install
npm run dev
```

Development server:

```bash
http://localhost:5173
```

## Build

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
│   ├── BuildSelectCard.tsx
│   ├── HowToModal.tsx
│   ├── InvestmentBar.tsx
│   ├── LandingPage.tsx
│   ├── ProfilePage.tsx
│   ├── StatRow.tsx
│   ├── SummaryPanel.tsx
│   ├── UpgradeBoard.tsx
│   ├── UpgradeColumn.tsx
│   └── ViewToggle.tsx
├── constants/
│   ├── presets.ts
│   └── prompt.ts
├── hooks/
│   └── useProfilePreset.ts
├── types/
│   └── profile.ts
└── utils/
    ├── export.ts
    ├── sampleData.ts
    ├── spikeLogic.ts
    └── validateProfile.ts
```

## Example JSON Format

```json
{
  "profileName": "Alex",
  "archetype": "Volatile Carry",
  "summary": "High execution when locked in, but consistency and patience crater under pressure.",
  "stats": [
    {
      "name": "Execution",
      "score": 87,
      "category": "Performance",
      "comment": "You deliver when stakes are visible; routine tasks get half effort.",
      "tip": "Batch low-stakes work into timed 25-minute blocks.",
      "investmentRead": "Spiked — maintain without overinvesting. Shift ROI to weaker lanes."
    }
  ]
}
```

## Notes

This is a reflective tool, not a clinical assessment.

The app does not diagnose, evaluate mental health, or claim objective psychological accuracy. It is meant to visualize self-reflection and feedback in a game-inspired format.

## React + TypeScript + Vite

This project was built with React, TypeScript, and Vite.

Vite provides a minimal setup for React with fast HMR and production builds.

Currently, two official React plugins are available:

* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs)

## Expanding the ESLint Configuration

If you are developing this into a larger production application, consider enabling type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
