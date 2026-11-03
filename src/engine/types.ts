export type Sex = 'male' | 'female';
export type WorldEra = 'past_1970' | 'past_1990' | 'today' | 'future_2050' | 'any';
export type BirthWeighting = 'births' | 'population';
export type LifeSpeed = 'slow' | 'normal' | 'fast'; // e.g. 1 year per 5s, 3s, 1s
export type YearlyFocus = 'health' | 'income' | 'education' | 'relationships';
export type IncomeTier = 'poor' | 'middle' | 'rich';

export interface CountryData {
  code: string; // ISO 3166-1 alpha-3
  name: string;
  flag: string;
  region: string; // UN region
  subregion: string;
  population: number; // e.g. 1428627663
  annualBirths: number; // e.g. 23000000
  fertilityRate: number; // children per woman
  lifeExpectancyTotal: number;
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
  infantMortality: number; // deaths < 1 yr per 1,000 live births
  under5Mortality: number; // deaths < 5 yr per 1,000 live births
  maternalMortalityRatio: number; // per 100,000 live births
  gdpPerCapitaPPP: number; // international $
  gini: number; // 0-100
  meanYearsSchooling: number;
  tertiaryEnrollmentRate: number; // %
  agriculturalEmploymentRate: number; // %
  urbanPopulationRate: number; // %
  hivPrevalence: number; // %
  homicideRate: number; // per 100k
  smokingPrevalence: number; // %
  outOfPocketHealthSpending: number; // % of total health spend
  childMarriageRate: number; // % of women married before 18
  lifeSatisfaction: number; // 0-10 Cantril Ladder
  commonLanguages: string[];
  capitalCity: string;
  primaryReligions: string[];
  causesOfDeathRanked: {
    category: string;
    sharePercent: number;
  }[];
  sources: {
    births: string;
    gdp: string;
    mortality: string;
    education: string;
    sourceYear: number;
  };
}

export interface PlayerStats {
  health: number; // 0-100
  happiness: number; // 0-100
  knowledge: number; // 0-100
  relationships: number; // 0-100
}

export interface HiddenAttributes {
  wealthPpp: number; // annual household income per capita in intl $
  wealthUsdEquivalent: number; // US price equivalent
  incomeTier: IncomeTier; // poor / middle / rich relative to country
  percentileInCountry: number; // 1-100
  isUrban: boolean;
  occupation: string;
  educationLevel: 'none' | 'primary' | 'secondary' | 'vocational' | 'tertiary' | 'postgraduate';
  maritalStatus: 'single' | 'partnered' | 'married' | 'widowed' | 'divorced';
  childrenCount: number;
  habits: {
    smoking: boolean;
    heavyAlcohol: boolean;
    regularExercise: boolean;
  };
  chronicConditions: string[];
  traumas: string[];
}

export interface LifeRecordEntry {
  age: number;
  year: number;
  headline: string;
  detail: string;
  category: 'birth' | 'growth' | 'education' | 'work' | 'health' | 'family' | 'crisis' | 'milestone' | 'historical' | 'death';
  statDeltas?: Partial<PlayerStats>;
  isHeavyTheme?: boolean;
  crisisHelpTopic?: 'mental_health' | 'substance' | 'domestic_violence' | 'poverty';
}

export interface PeerBaby {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  flag: string;
  sex: Sex;
  isAlive: boolean;
  deathAge?: number;
  deathCause?: string;
  currentMilestone: string;
}

export interface LifeMapYear {
  age: number;
  year: number;
  tone: 'neutral' | 'positive' | 'hardship' | 'crisis' | 'achievement';
  summary: string;
}

export interface LifeHistory {
  id: string;
  birthYear: number;
  seed: number;
  countryCode: string;
  countryName: string;
  flag: string;
  sex: Sex;
  name: string;
  realCountryCode?: string;
  finalAge: number;
  causeOfDeath?: string;
  deathYear?: number;
  entries: LifeRecordEntry[];
  lifeMap: LifeMapYear[];
  finalStats: PlayerStats;
  incomeTier: IncomeTier;
  wealthPpp: number;
  occupation: string;
  educationLevel: string;
  childrenCount: number;
  milestoneAnswers: { age: number; question: string; answer?: string }[];
  partingWords?: string;
  completedAt: string; // ISO date
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  statEffects: Partial<PlayerStats>;
  wealthMultiplier?: number;
  occupationChange?: string;
  educationChange?: HiddenAttributes['educationLevel'];
  habitChanges?: Partial<HiddenAttributes['habits']>;
  outcomeText: string;
  riskProbability?: number; // e.g. 0.2
  riskOutcomeText?: string;
  riskStatEffects?: Partial<PlayerStats>;
}

export interface GameEvent {
  id: string;
  minAge: number;
  maxAge: number;
  category: 'education' | 'career' | 'personal' | 'lifestyle' | 'medical' | 'environment' | 'hardship';
  condition?: (state: SimulationState) => boolean;
  weight: number; // base selection probability
  title: string;
  narrative: (state: SimulationState) => string;
  isDecision: boolean;
  options?: DecisionOption[];
  passiveStatEffects?: Partial<PlayerStats>;
  isHeavyTheme?: boolean;
  crisisHelpTopic?: 'mental_health' | 'substance' | 'domestic_violence' | 'poverty';
}

export interface MilestoneDefinition {
  age: number;
  questions: {
    id: string;
    text: string;
    contextIntro: string;
  }[];
}

export interface SimulationConfig {
  worldEra: WorldEra;
  birthWeighting: BirthWeighting;
  targetCountryCode?: string; // If set, birth is guaranteed in this specific country
  lifeSpeed: LifeSpeed;
  realCountryCode?: string;
  leaveOutFrighteningScenes: boolean;
  classroomMode: boolean;
  calmMusic: boolean;
  autoMode: boolean;
  customSeed?: number;
}

export interface SimulationState {
  config: SimulationConfig;
  seed: number;
  stepCount: number;
  currentYear: number;
  age: number;
  country: CountryData;
  sex: Sex;
  name: string;
  stats: PlayerStats;
  hidden: HiddenAttributes;
  isAlive: boolean;
  causeOfDeath?: string;
  peers: PeerBaby[];
  history: LifeRecordEntry[];
  lifeMap: LifeMapYear[];
  milestoneAnswers: { age: number; question: string; answer?: string }[];
  pendingDecision?: GameEvent;
  pendingMilestone?: { age: number; question: string };
  isPaused: boolean;
}
