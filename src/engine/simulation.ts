import {
  SimulationState,
  SimulationConfig,
  YearlyFocus,
  LifeRecordEntry,
  LifeMapYear,
  LifeHistory,
  PlayerStats,
  HiddenAttributes
} from './types';
import { PRNG } from './prng';
import { sampleBirthplace, getCountryByCode } from './birthplace';
import { sampleIncome } from './income';
import { evaluateYearlyMortality } from './mortality';
import { getEligibleEvents } from './events';
import { getMilestoneForAge } from './milestones';
import { initializeSameSecondPeers, updatePeersForYear } from './peers';
import { ERA_MODIFIERS } from '../data/historicalEras';

/**
 * Creates the initial state of a new life at age 0
 */
export function createInitialSimulationState(config: SimulationConfig): SimulationState {
  const seed = config.customSeed ?? Math.floor(Math.random() * 2147483647);
  const prng = new PRNG(seed);

  // Sample birthplace (guaranteed target country if selected by user, else weighted random draw)
  const birth = sampleBirthplace(
    prng,
    config.birthWeighting,
    config.worldEra,
    undefined,
    config.targetCountryCode
  );
  const country = birth.country;

  // Draw income distribution
  const incomeDraw = sampleIncome(country, prng);

  // Base stats (0-100)
  const healthBase = Math.max(30, Math.min(95, Math.round(85 - country.infantMortality * 0.4)));
  const happinessBase = Math.max(30, Math.min(90, Math.round(country.lifeSatisfaction * 10 + 10)));
  const knowledgeBase = 10;
  const relationshipsBase = Math.max(40, Math.min(95, Math.round(75 + prng.int(-5, 10))));

  const stats: PlayerStats = {
    health: healthBase,
    happiness: happinessBase,
    knowledge: knowledgeBase,
    relationships: relationshipsBase
  };

  const hidden: HiddenAttributes = {
    wealthPpp: incomeDraw.wealthPpp,
    wealthUsdEquivalent: incomeDraw.wealthUsdEquivalent,
    incomeTier: incomeDraw.incomeTier,
    percentileInCountry: incomeDraw.percentileInCountry,
    isUrban: birth.isUrban,
    occupation: 'Infant',
    educationLevel: 'none',
    maritalStatus: 'single',
    childrenCount: 0,
    habits: {
      smoking: false,
      heavyAlcohol: false,
      regularExercise: false
    },
    chronicConditions: [],
    traumas: []
  };

  const birthEntry: LifeRecordEntry = {
    age: 0,
    year: birth.birthYear,
    headline: `Born in ${country.name}`,
    detail: `You are born as a baby ${birth.sex} named ${birth.name} in ${birth.isUrban ? country.capitalCity : 'a rural village'}, ${country.name}. Your family's household income is ${incomeDraw.wealthPpp.toLocaleString()} intl $ (PPP), placing you in the ${incomeDraw.incomeTier} tier of the nation.`,
    category: 'birth',
    statDeltas: { health: 0, happiness: 0, knowledge: 0, relationships: 0 }
  };

  const lifeMapEntry: LifeMapYear = {
    age: 0,
    year: birth.birthYear,
    tone: 'neutral',
    summary: `Born in ${country.name}`
  };

  // Check age 0 infant mortality immediately
  const infantMort = evaluateYearlyMortality(country, birth.sex, 0, stats, hidden.habits, prng);
  const isAlive = !infantMort.died;
  let causeOfDeath: string | undefined;

  if (infantMort.died) {
    causeOfDeath = infantMort.cause;
    birthEntry.headline = `Did not survive infancy in ${country.name}`;
    birthEntry.detail += ` Unfortunately, you passed away in your first weeks of life due to ${infantMort.cause?.toLowerCase()}.`;
    birthEntry.category = 'death';
    lifeMapEntry.tone = 'crisis';
  }

  const peers = initializeSameSecondPeers(prng, country.code);

  return {
    config,
    seed,
    stepCount: 0,
    currentYear: birth.birthYear,
    age: 0,
    country,
    sex: birth.sex,
    name: birth.name,
    stats,
    hidden,
    isAlive,
    causeOfDeath,
    peers,
    history: [birthEntry],
    lifeMap: [lifeMapEntry],
    milestoneAnswers: [],
    isPaused: false
  };
}

/**
 * Pure transition function: advances the simulation by 1 year.
 */
export function advanceSimulationYear(
  state: SimulationState,
  focus: YearlyFocus,
  decisionChoiceId?: string
): SimulationState {
  if (!state.isAlive) {
    return state;
  }

  // Create PRNG state for this step
  const stepSeed = (state.seed + state.age * 997 + state.stepCount * 7919) >>> 0;
  const prng = new PRNG(stepSeed);

  const nextAge = state.age + 1;
  const nextYear = state.currentYear + 1;

  // Copy current stats & hidden
  const nextStats: PlayerStats = { ...state.stats };
  const nextHidden: HiddenAttributes = {
    ...state.hidden,
    habits: { ...state.hidden.habits },
    chronicConditions: [...state.hidden.chronicConditions],
    traumas: [...state.hidden.traumas]
  };

  // 1. Natural aging baseline decay
  if (nextAge > 35) {
    nextStats.health = Math.max(5, nextStats.health - 1);
  }
  if (nextAge > 65) {
    nextStats.health = Math.max(5, nextStats.health - 2);
  }

  // 2. Yearly Focus applied
  switch (focus) {
    case 'health':
      nextStats.health = Math.min(100, nextStats.health + prng.int(3, 6));
      break;
    case 'income':
      nextHidden.wealthPpp = Math.round(nextHidden.wealthPpp * prng.float(1.02, 1.08));
      nextStats.happiness = Math.min(100, nextStats.happiness + prng.int(1, 3));
      break;
    case 'education':
      nextStats.knowledge = Math.min(100, nextStats.knowledge + prng.int(4, 8));
      break;
    case 'relationships':
      nextStats.relationships = Math.min(100, nextStats.relationships + prng.int(3, 7));
      nextStats.happiness = Math.min(100, nextStats.happiness + prng.int(2, 5));
      break;
  }

  // 3. Resolve pending decision if present
  let decisionNarrative: string | null = null;
  if (state.pendingDecision && decisionChoiceId) {
    const chosenOption = state.pendingDecision.options?.find((o) => o.id === decisionChoiceId);
    if (chosenOption) {
      if (chosenOption.statEffects) {
        if (chosenOption.statEffects.health) nextStats.health += chosenOption.statEffects.health;
        if (chosenOption.statEffects.happiness) nextStats.happiness += chosenOption.statEffects.happiness;
        if (chosenOption.statEffects.knowledge) nextStats.knowledge += chosenOption.statEffects.knowledge;
        if (chosenOption.statEffects.relationships) nextStats.relationships += chosenOption.statEffects.relationships;
      }
      if (chosenOption.wealthMultiplier) {
        nextHidden.wealthPpp = Math.round(nextHidden.wealthPpp * chosenOption.wealthMultiplier);
      }
      if (chosenOption.occupationChange) {
        nextHidden.occupation = chosenOption.occupationChange;
      }
      if (chosenOption.educationChange) {
        nextHidden.educationLevel = chosenOption.educationChange;
      }
      if (chosenOption.habitChanges) {
        Object.assign(nextHidden.habits, chosenOption.habitChanges);
      }

      // Check risk
      if (chosenOption.riskProbability && prng.bool(chosenOption.riskProbability)) {
        decisionNarrative = chosenOption.riskOutcomeText || chosenOption.outcomeText;
        if (chosenOption.riskStatEffects) {
          if (chosenOption.riskStatEffects.health) nextStats.health += chosenOption.riskStatEffects.health;
          if (chosenOption.riskStatEffects.happiness) nextStats.happiness += chosenOption.riskStatEffects.happiness;
        }
      } else {
        decisionNarrative = chosenOption.outcomeText;
      }
    }
  }

  // Clamp stats to 0-100
  nextStats.health = Math.max(0, Math.min(100, nextStats.health));
  nextStats.happiness = Math.max(0, Math.min(100, nextStats.happiness));
  nextStats.knowledge = Math.max(0, Math.min(100, nextStats.knowledge));
  nextStats.relationships = Math.max(0, Math.min(100, nextStats.relationships));

  // 4. Actuarial mortality check for this year
  const mortResult = evaluateYearlyMortality(
    state.country,
    state.sex,
    nextAge,
    nextStats,
    nextHidden.habits,
    prng
  );

  let newLifeMapTone: LifeMapYear['tone'] = 'neutral';
  let historyHeadline = `Age ${nextAge}`;
  let historyDetail = '';
  let category: LifeRecordEntry['category'] = 'growth';
  let isHeavyTheme = false;
  let crisisHelpTopic: LifeRecordEntry['crisisHelpTopic'];

  // Check death
  if (mortResult.died) {
    historyHeadline = `Passed away at age ${nextAge}`;
    historyDetail = `At age ${nextAge}, in the year ${nextYear}, you passed away due to ${mortResult.cause?.toLowerCase() || 'illness'}.`;
    category = 'death';
    newLifeMapTone = 'crisis';

    const deathEntry: LifeRecordEntry = {
      age: nextAge,
      year: nextYear,
      headline: historyHeadline,
      detail: historyDetail,
      category,
      statDeltas: { health: -nextStats.health },
      isHeavyTheme: true,
      crisisHelpTopic: 'mental_health'
    };

    const mapEntry: LifeMapYear = {
      age: nextAge,
      year: nextYear,
      tone: newLifeMapTone,
      summary: `Died of ${mortResult.cause}`
    };

    return {
      ...state,
      age: nextAge,
      currentYear: nextYear,
      stepCount: state.stepCount + 1,
      stats: { ...nextStats, health: 0 },
      hidden: nextHidden,
      isAlive: false,
      causeOfDeath: mortResult.cause,
      history: [...state.history, deathEntry],
      lifeMap: [...state.lifeMap, mapEntry],
      pendingDecision: undefined,
      pendingMilestone: undefined
    };
  }

  // 5. Check milestone pause (ages 5, 15, 30, 50, 70)
  const milestonePrompt = getMilestoneForAge(nextAge, prng);

  // 6. Select eligible event for this year
  const eligibleEvents = getEligibleEvents({
    ...state,
    age: nextAge,
    stats: nextStats,
    hidden: nextHidden
  });

  let selectedEvent: (typeof eligibleEvents)[0] | undefined;
  if (eligibleEvents.length > 0) {
    selectedEvent = prng.weightedChoice(eligibleEvents.map((e) => ({ item: e, weight: e.weight })));
  }

  let nextPendingDecision: (typeof eligibleEvents)[0] | undefined;

  if (selectedEvent) {
    historyHeadline = selectedEvent.title;
    historyDetail = selectedEvent.narrative({
      ...state,
      age: nextAge,
      stats: nextStats,
      hidden: nextHidden
    });

    if (decisionNarrative) {
      historyDetail = `${historyDetail} ${decisionNarrative}`;
    }

    if (selectedEvent.isHeavyTheme) {
      isHeavyTheme = true;
      crisisHelpTopic = selectedEvent.crisisHelpTopic;
      newLifeMapTone = 'hardship';
    }

    // Passive stat effects
    if (selectedEvent.passiveStatEffects) {
      if (selectedEvent.passiveStatEffects.health) nextStats.health += selectedEvent.passiveStatEffects.health;
      if (selectedEvent.passiveStatEffects.happiness) nextStats.happiness += selectedEvent.passiveStatEffects.happiness;
      if (selectedEvent.passiveStatEffects.knowledge) nextStats.knowledge += selectedEvent.passiveStatEffects.knowledge;
      if (selectedEvent.passiveStatEffects.relationships) nextStats.relationships += selectedEvent.passiveStatEffects.relationships;
    }

    // If decision required and autoMode is false, pause for decision
    if (selectedEvent.isDecision && !state.config.autoMode) {
      nextPendingDecision = selectedEvent;
    } else if (selectedEvent.isDecision && state.config.autoMode && selectedEvent.options?.length) {
      // Auto mode: choose option aligned with current focus or highest stat
      const autoOption = selectedEvent.options[0];
      if (autoOption.statEffects) {
        if (autoOption.statEffects.health) nextStats.health += autoOption.statEffects.health;
        if (autoOption.statEffects.happiness) nextStats.happiness += autoOption.statEffects.happiness;
      }
      historyDetail += ` [Choice: ${autoOption.label}] ${autoOption.outcomeText}`;
    }
  } else {
    // Routine year default entry
    historyHeadline = `Age ${nextAge} in ${state.country.name}`;
    historyDetail = `You focus on your ${focus}. The year passes steadily amidst the everyday rhythm of ${nextHidden.isUrban ? state.country.capitalCity : 'your hometown'}.`;
  }

  // Re-clamp stats
  nextStats.health = Math.max(1, Math.min(100, nextStats.health));
  nextStats.happiness = Math.max(1, Math.min(100, nextStats.happiness));
  nextStats.knowledge = Math.max(1, Math.min(100, nextStats.knowledge));
  nextStats.relationships = Math.max(1, Math.min(100, nextStats.relationships));

  if (nextStats.happiness > 75) newLifeMapTone = 'positive';
  else if (nextStats.happiness < 30) newLifeMapTone = 'hardship';

  const newRecordEntry: LifeRecordEntry = {
    age: nextAge,
    year: nextYear,
    headline: historyHeadline,
    detail: historyDetail,
    category,
    isHeavyTheme,
    crisisHelpTopic,
    statDeltas: {
      health: nextStats.health - state.stats.health,
      happiness: nextStats.happiness - state.stats.happiness,
      knowledge: nextStats.knowledge - state.stats.knowledge,
      relationships: nextStats.relationships - state.stats.relationships
    }
  };

  const newMapEntry: LifeMapYear = {
    age: nextAge,
    year: nextYear,
    tone: newLifeMapTone,
    summary: historyHeadline
  };

  // 7. Update 4 same-second peers
  const updatedPeers = updatePeersForYear(state.peers, nextAge, getCountryByCode, prng);

  return {
    ...state,
    age: nextAge,
    currentYear: nextYear,
    stepCount: state.stepCount + 1,
    stats: nextStats,
    hidden: nextHidden,
    history: [...state.history, newRecordEntry],
    lifeMap: [...state.lifeMap, newMapEntry],
    peers: updatedPeers,
    pendingDecision: nextPendingDecision,
    pendingMilestone: milestonePrompt || undefined,
    isPaused: Boolean(milestonePrompt || nextPendingDecision)
  };
}

/**
 * Saves personal reflective response to milestone question
 */
export function recordMilestoneAnswer(
  state: SimulationState,
  age: number,
  question: string,
  answer?: string
): SimulationState {
  return {
    ...state,
    milestoneAnswers: [
      ...state.milestoneAnswers.filter((m) => m.age !== age),
      { age, question, answer }
    ],
    pendingMilestone: undefined,
    isPaused: false
  };
}

/**
 * Converts finished simulation state to archivable LifeHistory
 */
export function finalizeLifeHistory(state: SimulationState, partingWords?: string): LifeHistory {
  return {
    id: `life_${state.seed}_${Date.now()}`,
    birthYear: state.history[0]?.year || 2024,
    seed: state.seed,
    countryCode: state.country.code,
    countryName: state.country.name,
    flag: state.country.flag,
    sex: state.sex,
    name: state.name,
    realCountryCode: state.config.realCountryCode,
    finalAge: state.age,
    causeOfDeath: state.causeOfDeath,
    deathYear: state.currentYear,
    entries: state.history,
    lifeMap: state.lifeMap,
    finalStats: state.stats,
    incomeTier: state.hidden.incomeTier,
    wealthPpp: state.hidden.wealthPpp,
    occupation: state.hidden.occupation,
    educationLevel: state.hidden.educationLevel,
    childrenCount: state.hidden.childrenCount,
    milestoneAnswers: state.milestoneAnswers,
    partingWords,
    completedAt: new Date().toISOString()
  };
}
