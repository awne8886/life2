import { CountryData, Sex, PlayerStats, HiddenAttributes } from './types';
import { PRNG } from './prng';

export interface MortalityEvaluation {
  died: boolean;
  cause?: string;
  category?: string;
  isInfantOrChildMortality: boolean;
}

/**
 * Computes actuarial annual hazard rate q_x for a person of a given age, sex, and country.
 * Uses calibrated Gompertz-Makeham curve combined with country-specific infant/under-5 metrics.
 */
export function getAnnualMortalityRate(country: CountryData, sex: Sex, age: number): number {
  const lifeExpectancy = sex === 'female' ? country.lifeExpectancyFemale : country.lifeExpectancyMale;

  // Age 0: Infant mortality
  if (age === 0) {
    return Math.min(0.20, country.infantMortality / 1000);
  }

  // Ages 1-4: Child mortality
  if (age >= 1 && age <= 4) {
    const q0 = country.infantMortality / 1000;
    const u5 = country.under5Mortality / 1000;
    // Remainder of u5 deaths distributed across ages 1-4
    const remainingU5Prob = Math.max(0.001, (u5 - q0) / Math.max(0.1, 1 - q0));
    return Math.min(0.08, remainingU5Prob / 4);
  }

  // Ages 5-14: Lowest mortality nadir in human life
  if (age >= 5 && age <= 14) {
    const baseline = 0.0004; // 0.4 per 1,000 in low-mortality countries
    const countryFactor = Math.max(0.8, 80 / lifeExpectancy);
    return baseline * countryFactor;
  }

  // Ages 15-39: Early adulthood
  if (age >= 15 && age <= 39) {
    const baseExtrinsic = 0.0008;
    const homicideBonus = (country.homicideRate / 100000) * (sex === 'male' ? 1.8 : 0.4);
    const hivBonus = (country.hivPrevalence / 100) * 0.008;
    const maternalBonus = sex === 'female' && age >= 18 && age <= 35
      ? (country.maternalMortalityRatio / 100000) * (country.fertilityRate / 15)
      : 0;

    const countryFactor = Math.pow(75 / lifeExpectancy, 1.8);
    const ageCurve = Math.pow((age - 14) / 25, 1.5) * 0.0012;

    return Math.min(0.04, baseExtrinsic * countryFactor + homicideBonus + hivBonus + maternalBonus + ageCurve);
  }

  // Ages 40+: Senescence acceleration (Gompertz law: hazard doubles roughly every 7-8 years)
  const modalDeathAge = lifeExpectancy + 4.5;
  const spread = 9.5;
  const z = (age - modalDeathAge) / spread;

  // Gompertz hazard rate approx: h(x) = exp(z) / (1 + exp(z)) with scaling
  const gompertzBase = 0.003 * Math.exp(0.085 * (age - 40));
  const countryAdj = Math.pow(76 / lifeExpectancy, 2.0);

  // Maximum annual probability capped at 0.65 for super-centenarians
  return Math.min(0.65, Math.max(0.002, gompertzBase * countryAdj));
}

/**
 * Shifts the actuarial baseline hazard using player's current health and lifestyle habits.
 * "Health and choices shift the odds only within realistic bounds."
 */
export function calculateEffectiveHazard(
  baseHazard: number,
  health: number,
  habits?: HiddenAttributes['habits']
): number {
  // Health factor: 80 is nominal neutral (1.0x).
  // Health = 100 -> 0.70x (30% reduction). Health = 20 -> 2.5x hazard. Health = 0 -> 5.0x hazard.
  let healthMultiplier = 1.0;
  if (health >= 80) {
    healthMultiplier = 1.0 - ((health - 80) / 20) * 0.30; // 1.0 down to 0.70
  } else if (health >= 40) {
    healthMultiplier = 1.0 + ((80 - health) / 40) * 0.80; // 1.0 up to 1.80
  } else {
    healthMultiplier = 1.80 + ((40 - health) / 40) * 3.20; // 1.8 up to 5.0
  }

  // Habits multiplier
  let habitFactor = 1.0;
  if (habits) {
    if (habits.smoking) habitFactor *= 1.15;
    if (habits.heavyAlcohol) habitFactor *= 1.12;
    if (habits.regularExercise) habitFactor *= 0.90;
  }

  const effective = baseHazard * healthMultiplier * habitFactor;
  return Math.min(0.85, effective);
}

/**
 * Assigns a culturally and demographically authentic cause of death
 * based on age, sex, and country health profile.
 */
export function sampleCauseOfDeath(
  country: CountryData,
  sex: Sex,
  age: number,
  prng: PRNG,
  isSuicideCandidate: boolean = false
): { cause: string; category: string } {
  // Infant mortality (age 0)
  if (age === 0) {
    const causes = [
      { cause: 'Neonatal respiratory distress and birth asphyxia', category: 'neonatal', weight: 35 },
      { cause: 'Congenital heart anomaly and birth defects', category: 'congenital', weight: 25 },
      { cause: 'Neonatal sepsis and severe bacterial infection', category: 'infectious', weight: 25 },
      { cause: 'Extreme preterm birth complications', category: 'preterm', weight: 15 }
    ];
    const picked = prng.weightedChoice(causes.map(c => ({ item: c, weight: c.weight })));
    return picked;
  }

  // Ages 1-4
  if (age >= 1 && age <= 4) {
    const isMalariaEndemic = country.region.includes('Africa') || country.code === 'NGA' || country.code === 'COD';
    const causes = [
      { cause: 'Acute lower respiratory infection (Pneumonia)', category: 'respiratory', weight: 35 },
      { cause: 'Severe dehydration from diarrheal disease', category: 'infectious', weight: 25 },
      { cause: 'Accidental drowning in nearby water reservoir', category: 'accident', weight: 15 },
      { cause: isMalariaEndemic ? 'Severe cerebral malaria' : 'Accidental household poison ingestion', category: isMalariaEndemic ? 'infectious' : 'accident', weight: 25 }
    ];
    return prng.weightedChoice(causes.map(c => ({ item: c, weight: c.weight })));
  }

  // Ages 5-14
  if (age >= 5 && age <= 14) {
    const causes = [
      { cause: 'Pedestrian motor vehicle collision', category: 'accident', weight: 35 },
      { cause: 'Acute childhood leukemia', category: 'cancer', weight: 25 },
      { cause: 'Severe viral encephalitis / Meningitis', category: 'infectious', weight: 20 },
      { cause: 'Accidental drowning during open-water recreation', category: 'accident', weight: 20 }
    ];
    return prng.weightedChoice(causes.map(c => ({ item: c, weight: c.weight })));
  }

  // Ages 15-29
  if (age >= 15 && age <= 29) {
    const causes = [
      { cause: 'Fatal road traffic collision on highway', category: 'accident', weight: 30 }
    ];

    if (sex === 'male' && country.homicideRate > 10) {
      causes.push({ cause: 'Fatal firearm injury from local neighborhood violence', category: 'violence', weight: 35 });
    } else {
      causes.push({ cause: 'Accidental injury / workplace fall', category: 'accident', weight: 15 });
    }

    if (isSuicideCandidate) {
      causes.push({ cause: 'Suicide following prolonged untreated severe depression', category: 'mental_health', weight: 40 });
    } else {
      causes.push({ cause: 'Suicide / despair after severe psychological crisis', category: 'mental_health', weight: 12 });
    }

    if (sex === 'female' && country.maternalMortalityRatio > 100) {
      causes.push({ cause: 'Severe postpartum hemorrhage during childbirth', category: 'maternal', weight: 20 });
    }

    causes.push({ cause: 'Advanced undiagnosed Hodgkin lymphoma', category: 'cancer', weight: 10 });
    return prng.weightedChoice(causes.map(c => ({ item: c, weight: c.weight })));
  }

  // Ages 30-59
  if (age >= 30 && age <= 59) {
    const causes = [
      { cause: 'Sudden massive myocardial infarction (heart attack)', category: 'cardiovascular', weight: 30 },
      { cause: 'Hemorrhagic stroke from undiagnosed hypertension', category: 'cardiovascular', weight: 22 },
      { cause: 'Malignant neoplasm (Metastatic cancer)', category: 'cancer', weight: 25 },
      { cause: 'End-stage liver disease and hepatic failure', category: 'digestive', weight: 10 },
      { cause: 'Fatal vehicular collision', category: 'accident', weight: 8 }
    ];

    if (country.hivPrevalence > 5.0) {
      causes.push({ cause: 'Complications of advanced immunosuppression (HIV/TB coinfection)', category: 'infectious', weight: 25 });
    }

    return prng.weightedChoice(causes.map(c => ({ item: c, weight: c.weight })));
  }

  // Ages 60-79
  if (age >= 60 && age <= 79) {
    const causes = [
      { cause: 'Ischemic heart disease with chronic congestive failure', category: 'cardiovascular', weight: 34 },
      { cause: 'Metastatic carcinoma (Lung/Colorectal/Breast)', category: 'cancer', weight: 28 },
      { cause: 'Acute ischemic cerebrovascular stroke', category: 'cardiovascular', weight: 18 },
      { cause: 'Chronic obstructive pulmonary disease (COPD)', category: 'respiratory', weight: 12 },
      { cause: 'End-stage type 2 diabetes with renal failure', category: 'endocrine', weight: 8 }
    ];
    return prng.weightedChoice(causes.map(c => ({ item: c, weight: c.weight })));
  }

  // Ages 80+
  const elderCauses = [
    { cause: 'Cardiovascular arrest secondary to senile cardiomyopathy', category: 'cardiovascular', weight: 35 },
    { cause: 'Advanced Alzheimer’s dementia and progressive aspiration pneumonia', category: 'neurological', weight: 25 },
    { cause: 'Severe bacterial pneumonia following seasonal influenza', category: 'respiratory', weight: 20 },
    { cause: 'Chronic renal failure with multiple organ senescence', category: 'organ_failure', weight: 20 }
  ];
  return prng.weightedChoice(elderCauses.map(c => ({ item: c, weight: c.weight })));
}

/**
 * Evaluates whether death occurs in the current simulation year.
 */
export function evaluateYearlyMortality(
  country: CountryData,
  sex: Sex,
  age: number,
  stats: PlayerStats,
  habits: HiddenAttributes['habits'],
  prng: PRNG
): MortalityEvaluation {
  const baseRate = getAnnualMortalityRate(country, sex, age);
  const effectiveHazard = calculateEffectiveHazard(baseRate, stats.health, habits);

  const roll = prng.next();
  if (roll < effectiveHazard) {
    const isInfantOrChild = age < 5;
    const isDespairCandidate = stats.happiness < 15;
    const { cause, category } = sampleCauseOfDeath(country, sex, age, prng, isDespairCandidate);

    return {
      died: true,
      cause,
      category,
      isInfantOrChildMortality: isInfantOrChild
    };
  }

  return {
    died: false,
    isInfantOrChildMortality: false
  };
}
