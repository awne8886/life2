# life — A Realistic Random-Birth Life Simulator

> *"About four babies are born every second. You are about to become one of them."*
> **The goal is perspective, not winning.**

An authentic, quietly serious, and reflective recreation and expansion of [1in8b.life](https://1in8b.life/en/). You are born at random as one of today's babies anywhere in the world and live one whole life, from age 0 to death, inside real country statistics. You cannot choose where, when, or to whom you are born.

---

## Key Features

1. **The Birth Lottery**
   - **Weighted by Annual Births:** True-to-life representation of where newborns arrive today (heavily weighted towards Nigeria, India, DR Congo, Pakistan, Ethiopia, etc.).
   - **Weighted by Current Population:** Alternative view reflecting global headcount (China, India, US, Indonesia, etc.).
   - **Eras:** Explore today's world (2024), the past (1970 Cold War / high child mortality, 1990 HIV epidemic), or UN medium projections for 2050.
   - **Sex & Environment:** Natural 105:100 birth sex ratio and country-specific rural/urban probabilities.

2. **Rigorous Demographic & Economic Simulation Engine (`/src/engine`)**
   - **Income Distribution:** Household income per capita drawn from a log-normal distribution fitted to national GDP per capita (PPP) and national Gini inequality coefficients ($G = 2\Phi(\sigma/\sqrt{2}) - 1$). Classifies socioeconomic standing into Rich, Middle, or Poor relative to the nation.
   - **Actuarial Life Table Mortality:** Annual hazard rate $q_x$ calibrated using country-specific infant mortality, under-5 mortality, and Gompertz-Makeham senescence curves. If an actuarial death event triggers, a cause of death is sampled from official WHO Global Health Estimates (GHE) distributions for that country, sex, and age group.
   - **Four Core Stats (0–100):** Health, Happiness, Knowledge, and Relationships. Choices and health shift survival hazards within realistic statistical bounds.

3. **Same-Second Peers**
   - Four other simulated babies from different countries are born at the exact same second. Watch their brief milestones unfold in a parallel side panel (e.g. survival of infancy, entering school, workplace entry, or early passing).

4. **Milestone Pauses (Ages 5, 15, 30, 50, 70)**
   - Time freezes at key generational thresholds. One reflective prompt invites the player to link this character's lived reality with their own personal life journey, with an optional written reflection saved to the life summary.

5. **Heavy Themes & Humane Ethics Policy**
   - Illness, extreme poverty, domestic violence, and suicide occur at realistic statistical rates without sensationalism.
   - Every heavy theme event includes a locale-aware crisis support link (988 in USA/Canada, 111 in UK, KIRAN in India, SADAG in South Africa, Befrienders Worldwide / Find A Helpline globally).
   - **"Leave out frightening scenes"** toggle suppresses graphic traumatic text while preserving statistical outcomes.
   - **Classroom Mode (`?edu=1`)** holds back heavy themes, disables external links, and provides educator discussion prompts.

6. **End of Life & Memorial Registry**
   - **Life Map Grid:** 1 square = 1 year lived, color-coded by flourishing, neutral, hardship, or crisis years.
   - **Birthplace Contrast:** Direct statistical comparison with the player's real birth country if selected.
   - **Shareable Memorial Card:** Canvas-rendered high-resolution PNG exportable directly from the browser.
   - **Memorial Registry:** Browse saved past lives, view random lives, or export/import records as JSON. 100% stored in local browser `localStorage` with zero trackers or server uploads.

7. **Ambient Generative Soundscape**
   - Built with the Web Audio API to synthesize a meditative, warm harmonic chord generator with gentle low-pass modulation—no external MP3 asset downloads required.

---

## Tech Stack

- **Framework:** React 18 + TypeScript (Strict mode)
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS (Typography: Fraunces serif display + Inter sans body)
- **Icons:** Lucide React
- **Sound:** Web Audio API (ambient generative drone synthesizer)
- **Testing:** Vitest
- **Internationalization:** i18n architecture with English baseline (`en.json`), locale template (`locale.template.json`), and support for 16 languages including RTL (Arabic, Hebrew).
- **PWA:** Web App Manifest (`/public/manifest.json`), touch icons, and standalone display support.

---

## Project Structure

```
swift-hopper/
├── data/
│   ├── countries.json           # 20 fully specified baseline countries with UN/WB/WHO stats
│   └── ingest.js                # Ingestion script for World Bank / UN WPP API feeds
├── public/
│   ├── icon-192.svg             # PWA app icons
│   ├── icon-512.svg
│   └── manifest.json            # PWA manifest
├── src/
│   ├── engine/
│   │   ├── types.ts             # TypeScript schemas (CountryData, LifeState, Event, etc.)
│   │   ├── prng.ts              # Seedable Mulberry32 PRNG (Box-Muller gaussian & weighted sampler)
│   │   ├── birthplace.ts        # Country weighted draw, sex ratio, cultural names
│   │   ├── income.ts            # Log-normal Gini/GDP fitting, probit inverse normal CDF
│   │   ├── mortality.ts         # Actuarial life tables, Gompertz hazard, WHO causes of death
│   │   ├── events.ts            # 60+ context-aware life stage events with dilemmas & stat trade-offs
│   │   ├── milestones.ts        # Ages 5, 15, 30, 50, 70 pause reflections (5 questions per age)
│   │   ├── peers.ts             # 4 same-second global peers parallel simulation
│   │   ├── simulation.ts        # Pure function state transition (advanceSimulationYear)
│   │   ├── audio.ts             # Web Audio API ambient sound generator
│   │   └── cardGenerator.ts     # HTML5 Canvas Birth & Death share card renderer
│   ├── data/
│   │   ├── countries.ts         # 20 fully populated countries (IND, CHN, NGA, USA, COD, etc.)
│   │   ├── historicalEras.ts    # 1970, 1990, 2024, 2050 era modifiers & historical events
│   │   └── crisisResources.ts   # International crisis hotlines & help directories
│   ├── locales/
│   │   ├── en.json              # Full English locale dictionary
│   │   ├── locale.template.json # Template schema for translators
│   │   └── i18n.ts              # Locale switcher with RTL direction detection
│   ├── components/
│   │   ├── LandingHero.tsx      # Hero with stylized "1" & live per-second birth/death counters
│   │   ├── SetupCard.tsx        # World era, birthplace weighting, speed, toggles, "Be born" CTA
│   │   ├── StatsBar.tsx         # Health, Happiness, Knowledge, Relationships, Wealth
│   │   ├── LifeRecord.tsx       # Chronological ledger with heavy theme help links
│   │   ├── PeersPanel.tsx       # 4 same-second peers side card
│   │   ├── DecisionModal.tsx    # High-stakes dilemmas with stat trade-offs
│   │   ├── MilestoneModal.tsx   # Ages 5, 15, 30, 50, 70 pause with personal reflection note
│   │   ├── EndOfLifeView.tsx    # Life Map grid, country comparison, canvas share card, parting words
│   │   ├── MemorialsView.tsx    # Registry browser, random life viewer, JSON import/export
│   │   ├── CountryExplorer.tsx  # /c/ Country statistics browser and indicator tables
│   │   ├── EducationGuide.tsx   # /edu Teacher guide, curriculum tie-ins, classroom mode (?edu=1)
│   │   ├── StaticPages.tsx      # About, Privacy, Terms, and Crisis Modal
│   │   └── Footer.tsx           # Language switcher, nav links, disclaimer, back to top
│   ├── utils/
│   │   └── storage.ts           # localStorage active run and memorial registry manager
│   ├── App.tsx                  # Top-level view router and state coordinator
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind directives, editorial typography, reduced-motion rules
└── tests/
    ├── birthplace.test.ts       # Birthplace weighted sampling and naming tests
    ├── income.test.ts           # Log-normal Gini fitting and percentile tests
    ├── mortality.test.ts        # Actuarial life tables and Gompertz curve tests
    ├── events.test.ts           # Event age gating and heavy theme suppression tests
    └── simulation.test.ts       # Full simulation cycle, seed reproducibility, and peer tests
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 24)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/swift-hopper.git
cd swift-hopper

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Unit Tests
```bash
npm run test
```
Runs the full Vitest suite covering birthplace weighting, log-normal income fitting, Gompertz mortality curves, event filtering, and deterministic seed replayability.

### Production Build
```bash
npm run build
```
Creates an optimized, tree-shaken static production bundle in `dist/`.

---

## Deployment

Since **life** is a 100% static application with zero backend or database requirements, it can be deployed for free to any static hosting provider:

### Vercel
```bash
npx vercel deploy --prod
```
Or connect your GitHub repository directly to Vercel (framework preset: Vite).

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```
Or create a `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"
```

### GitHub Pages
Deploy the `dist/` directory via the standard `gh-pages` branch or GitHub Actions static site workflow.

---

## Data Ingestion Script

To re-validate or update the country indicators dataset:
```bash
# Run local schema validation
node data/ingest.js

# Pull latest live indicators from World Bank Open API (optional)
node data/ingest.js --fetch-online
```

---

## License & Ethics

Distributed under the MIT License for educational, humanitarian, and non-commercial perspective purposes.
Simulated lives are probabilistic illustrations based on macroscopic UN WPP, World Bank, and WHO statistics. They are not predictions or individual fate.
