import { WorldEra, CountryData } from '../engine/types';

export interface HistoricalEvent {
  year: number;
  title: string;
  description: string;
  globalImpactSummary: string;
  affectedRegions?: string[];
}

export interface EraModifier {
  era: WorldEra;
  baseYear: number;
  label: string;
  description: string;
  lifeExpectancyFactor: number; // e.g. 0.85 in 1970
  infantMortalityMultiplier: number; // e.g. 2.2 in 1970
  gdpMultiplier: number; // e.g. 0.45 in 1970
  schoolingMultiplier: number;
  historicalEvents: HistoricalEvent[];
}

export const ERA_MODIFIERS: Record<Exclude<WorldEra, 'any'>, EraModifier> = {
  past_1970: {
    era: 'past_1970',
    baseYear: 1970,
    label: 'Past (1970)',
    description: 'A world of 3.7 billion. Before modern antibiotics were ubiquitous, higher infant mortality, cold war tensions.',
    lifeExpectancyFactor: 0.82,
    infantMortalityMultiplier: 2.4,
    gdpMultiplier: 0.45,
    schoolingMultiplier: 0.7,
    historicalEvents: [
      {
        year: 1973,
        title: 'Global Energy Shock',
        description: 'Global oil embargo and quadrupled petroleum prices induce worldwide inflation and economic contraction.',
        globalImpactSummary: 'Transportation and food costs escalate dramatically.'
      },
      {
        year: 1977,
        title: 'Global Eradication of Smallpox',
        description: 'WHO announces the final recorded endemic case of smallpox following decades of worldwide cooperative immunization.',
        globalImpactSummary: 'A historic triumph of public health eliminates a scourge that took millions of lives.'
      },
      {
        year: 1980,
        title: 'Dawn of Microcomputing',
        description: 'Early semiconductor technology enters business and administrative institutions.',
        globalImpactSummary: 'Automated ledgers and emerging telecom begin replacing manual archives.'
      }
    ]
  },
  past_1990: {
    era: 'past_1990',
    baseYear: 1990,
    label: 'Past (1990)',
    description: 'A world of 5.3 billion. The fall of the Iron Curtain, the emergence of the World Wide Web, and the peak of the HIV epidemic.',
    lifeExpectancyFactor: 0.92,
    infantMortalityMultiplier: 1.5,
    gdpMultiplier: 0.70,
    schoolingMultiplier: 0.85,
    historicalEvents: [
      {
        year: 1991,
        title: 'Dissolution of the Soviet Union',
        description: 'The end of the Cold War transforms international trade, political alliances, and European borders.',
        globalImpactSummary: 'Market reforms and geopolitical realignments ripple across Eurasia and global diplomacy.'
      },
      {
        year: 1995,
        title: 'The World Wide Web Expands',
        description: 'Commercial Internet connectivity opens to public households and digital communication begins.',
        globalImpactSummary: 'Instant messaging and global data networks bridge continents.'
      },
      {
        year: 2000,
        title: 'Millennium Development Framework',
        description: 'Global compacts target extreme poverty, primary schooling access, and malaria reduction.',
        globalImpactSummary: 'International investments accelerate child survival rates across the Global South.'
      }
    ]
  },
  today: {
    era: 'today',
    baseYear: 2024,
    label: 'Today (2024)',
    description: 'A world of 8.1 billion. Interconnected global supply chains, pervasive smartphones, climate volatility, and shifting fertility rates.',
    lifeExpectancyFactor: 1.0,
    infantMortalityMultiplier: 1.0,
    gdpMultiplier: 1.0,
    schoolingMultiplier: 1.0,
    historicalEvents: [
      {
        year: 2024,
        title: 'The 8.1 Billion Milestone',
        description: 'Earth’s human population reaches 8.1 billion, with 134 million babies born this year alone.',
        globalImpactSummary: 'Demographics tilt older in high-income nations while fertility remains high in parts of Africa.'
      },
      {
        year: 2027,
        title: 'Generative Computing Integration',
        description: 'Synthetic intelligence tools integrate into medicine, diagnostics, translation, and daily commerce.',
        globalImpactSummary: 'Access to automated health advice expands even in under-resourced clinics.'
      },
      {
        year: 2030,
        title: 'Global Renewable Shift',
        description: 'Solar and wind infrastructure surpass legacy fossil fuels in new electricity generation capacity globally.',
        globalImpactSummary: 'Decentralized mini-grids bring reliable power to remote rural communities.'
      }
    ]
  },
  future_2050: {
    era: 'future_2050',
    baseYear: 2050,
    label: 'Future (2050 Projections)',
    description: 'A world of 9.7 billion (UN Medium Projection). Peak aging in East Asia and Europe, vast African megacities, and advanced bio-therapeutics.',
    lifeExpectancyFactor: 1.08,
    infantMortalityMultiplier: 0.65,
    gdpMultiplier: 1.35,
    schoolingMultiplier: 1.15,
    historicalEvents: [
      {
        year: 2050,
        title: 'The Demographic Transition Peak',
        description: 'Over half of the world’s births occur in the African continent, reshaping global youth culture and workforce patterns.',
        globalImpactSummary: 'Kinshasa, Lagos, and Cairo become central axes of global commerce.'
      },
      {
        year: 2055,
        title: 'Targeted Gene Therapies Standardized',
        description: 'Monogenic hereditary conditions and several refractory cancers receive single-dose genetic treatments.',
        globalImpactSummary: 'Lifespans in well-funded health systems regularly cross nine decades.'
      },
      {
        year: 2060,
        title: 'Advanced Desalination & Urban Agriculture',
        description: 'Large-scale energy-positive desalination and vertical farming stabilize food and water supplies in arid belts.',
        globalImpactSummary: 'Reduced vulnerability to regional precipitation shocks.'
      }
    ]
  }
};

/**
 * Apply era-specific adjustments to a country's baseline stats
 */
export function applyEraModifier(country: CountryData, era: WorldEra): CountryData {
  if (era === 'any') return country;
  const mod = ERA_MODIFIERS[era];
  if (!mod) return country;

  return {
    ...country,
    lifeExpectancyTotal: Math.round(country.lifeExpectancyTotal * mod.lifeExpectancyFactor * 10) / 10,
    lifeExpectancyMale: Math.round(country.lifeExpectancyMale * mod.lifeExpectancyFactor * 10) / 10,
    lifeExpectancyFemale: Math.round(country.lifeExpectancyFemale * mod.lifeExpectancyFactor * 10) / 10,
    infantMortality: Math.round(country.infantMortality * mod.infantMortalityMultiplier * 10) / 10,
    under5Mortality: Math.round(country.under5Mortality * mod.infantMortalityMultiplier * 10) / 10,
    gdpPerCapitaPPP: Math.round(country.gdpPerCapitaPPP * mod.gdpMultiplier),
    meanYearsSchooling: Math.round(country.meanYearsSchooling * mod.schoolingMultiplier * 10) / 10,
  };
}
