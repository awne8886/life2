import { GameEvent, SimulationState, PlayerStats } from './types';

export const GAME_EVENTS: GameEvent[] = [
  // ==========================================
  // STAGE 1: INFANCY & EARLY CHILDHOOD (Ages 0 - 4)
  // ==========================================
  {
    id: 'infant_birth_facility',
    minAge: 0,
    maxAge: 0,
    category: 'hardship',
    weight: 10,
    title: 'Place of Birth',
    isDecision: false,
    narrative: (state) => {
      if (state.hidden.wealthPpp > 25000 || state.country.gdpPerCapitaPPP > 35000) {
        return `You are born in a modern obstetrics ward in ${state.country.capitalCity}. A neonatologist checks your APGAR score within minutes.`;
      } else if (state.hidden.isUrban) {
        return `You are born in a crowded public district hospital in ${state.country.capitalCity}. Your mother shares a recuperation room with four other women.`;
      } else {
        return `You are born at home in a rural village, attended by a traditional birth attendant. Warm water is fetched from a hand pump outside.`;
      }
    },
    passiveStatEffects: { health: 5, relationships: 5 }
  },
  {
    id: 'infant_vaccination_campaign',
    minAge: 1,
    maxAge: 2,
    category: 'medical',
    weight: 8,
    title: 'Childhood Immunization',
    isDecision: false,
    narrative: (state) => {
      if (state.country.outOfPocketHealthSpending > 50) {
        return `A community healthcare worker marks your thumb with purple ink after administering pentavalent vaccines under a shade tree.`;
      }
      return `Your parents bring you to the municipal pediatric clinic for scheduled measles, polio, and hepatitis immunizations.`;
    },
    passiveStatEffects: { health: 8 }
  },
  {
    id: 'infant_malnutrition_shock',
    minAge: 1,
    maxAge: 3,
    category: 'hardship',
    weight: 5,
    condition: (state) => state.hidden.incomeTier === 'poor' && state.country.gdpPerCapitaPPP < 10000,
    title: 'Nutritional Insecurity',
    isDecision: false,
    isHeavyTheme: true,
    crisisHelpTopic: 'poverty',
    narrative: () => `A regional drought doubles cereal grain prices. For three months, your daily porridge lacks pulses and animal protein, slowing your physical growth curve.`,
    passiveStatEffects: { health: -14, happiness: -8 }
  },
  {
    id: 'infant_severe_malaria',
    minAge: 1,
    maxAge: 4,
    category: 'medical',
    weight: 6,
    condition: (state) => ['NGA', 'COD', 'ETH'].includes(state.country.code),
    title: 'Severe Febrile Episode',
    isDecision: true,
    isHeavyTheme: true,
    crisisHelpTopic: 'mental_health',
    narrative: () => `You spike a burning 40°C fever during the rainy season. A local clinic tests positive for Plasmodium falciparum malaria.`,
    options: [
      {
        id: 'buy_artemisinin',
        label: 'Pay for artemisinin-combination therapy',
        description: 'Spend substantial family cash reserves for proven anti-malarials.',
        statEffects: { health: 8, happiness: -2 },
        wealthMultiplier: 0.92,
        outcomeText: 'Within 48 hours the fever breaks, though the household budget is drained for the month.'
      },
      {
        id: 'home_herbal_remedy',
        label: 'Rely on boiled neem leaves and antipyretics',
        description: 'Unable to afford private medicine, family uses herbal steam.',
        statEffects: { health: -25, happiness: -12 },
        riskProbability: 0.25,
        riskOutcomeText: 'The infection progresses to severe anemia before an emergency clinic loan saves you.',
        riskStatEffects: { health: -35 },
        outcomeText: 'You survive the crisis after a grueling week of fever and vomiting.'
      }
    ]
  },
  {
    id: 'infant_new_sibling',
    minAge: 2,
    maxAge: 4,
    category: 'personal',
    weight: 7,
    title: 'A Younger Sibling Arrives',
    isDecision: false,
    narrative: (state) => `A younger brother is born into the household. The one-room living space grows noisier, and meals are divided among more mouths.`,
    passiveStatEffects: { relationships: 6, happiness: -2 }
  },
  {
    id: 'infant_first_steps',
    minAge: 1,
    maxAge: 1,
    category: 'personal',
    weight: 9,
    title: 'First Unassisted Steps',
    isDecision: false,
    narrative: () => `You pull yourself up against a wooden stool, take three wobbly strides across the packed earthen floor, and tumble into your mother’s open arms.`,
    passiveStatEffects: { health: 4, happiness: 8, relationships: 6 }
  },
  {
    id: 'infant_clean_water_access',
    minAge: 1,
    maxAge: 3,
    category: 'medical',
    weight: 7,
    title: 'Water Security',
    isDecision: false,
    narrative: (state) => {
      if (state.country.gdpPerCapitaPPP > 20000 || state.hidden.wealthPpp > 15000) {
        return `Your home has continuous chlorinated tap water, ensuring clean formula and safe hygiene from infancy.`;
      }
      return `Daily water must be carried from a borehole 400 meters away. On days when fuel for boiling is scarce, stomach bugs flare up.`;
    },
    passiveStatEffects: { health: 4 }
  },
  {
    id: 'infant_measles_outbreak',
    minAge: 2,
    maxAge: 4,
    category: 'medical',
    weight: 5,
    condition: (state) => state.country.infantMortality > 25,
    title: 'Seasonal Contagion',
    isDecision: false,
    narrative: () => `A measles cluster spreads through the settlement. You spend five days in a darkened room with high fever before the rash recedes.`,
    passiveStatEffects: { health: -10, happiness: -4 }
  },

  // ==========================================
  // STAGE 2: CHILDHOOD (Ages 5 - 11)
  // ==========================================
  {
    id: 'child_primary_school_start',
    minAge: 6,
    maxAge: 6,
    category: 'education',
    weight: 12,
    title: 'First Day of Primary School',
    isDecision: false,
    narrative: (state) => {
      if (state.country.meanYearsSchooling < 6) {
        return `You enroll in the village primary school. Sixty children share four wooden benches; textbooks are shared two-to-one under an open tin roof.`;
      } else if (state.country.meanYearsSchooling > 12) {
        return `You walk to the neighborhood elementary school carrying a structured backpack with colorful notebooks and lunchbox.`;
      }
      return `You start primary school in a worn brick government building. The teacher writes chalk exercises on a blackboard painted directly on the plaster.`;
    },
    passiveStatEffects: { knowledge: 10, happiness: 4 }
  },
  {
    id: 'child_chores_vs_homework',
    minAge: 7,
    maxAge: 10,
    category: 'lifestyle',
    weight: 7,
    condition: (state) => !state.hidden.isUrban && state.hidden.incomeTier !== 'rich',
    title: 'Household Demands',
    isDecision: true,
    narrative: () => `After classes, chores demand attention: hauling water jugs and tending livestock before sunset.`,
    options: [
      {
        id: 'help_family_chores',
        label: 'Dedicate evenings to family chores',
        description: 'Support the family work burden and ease your parents’ exhaustion.',
        statEffects: { relationships: 8, knowledge: -4, happiness: 2 },
        outcomeText: 'Your parents praise your reliability, though your reading homework is left incomplete by candlelight.'
      },
      {
        id: 'study_by_lantern',
        label: 'Stay up late studying under oil lamp',
        description: 'Prioritize reading and math exercises despite physical tiredness.',
        statEffects: { knowledge: 8, health: -4, happiness: -2 },
        outcomeText: 'You top your class in the arithmetic exam, but suffer regular morning fatigue.'
      }
    ]
  },
  {
    id: 'child_schoolyard_bullying',
    minAge: 8,
    maxAge: 11,
    category: 'personal',
    weight: 6,
    title: 'Schoolyard Hostility',
    isDecision: true,
    narrative: () => `Older children single you out near the school gate, mocking your worn clothes and demanding your pocket coins.`,
    options: [
      {
        id: 'confront_bully',
        label: 'Stand your ground and fight back',
        description: 'Refuse to surrender your dignity without resistance.',
        statEffects: { health: -6, happiness: 5, knowledge: 0 },
        outcomeText: 'You end up with a bruised cheek and torn collar, but the ringleader stops targeting you.'
      },
      {
        id: 'seek_teacher_help',
        label: 'Report the harassment to the headmaster',
        description: 'Follow institutional rules to seek adult protection.',
        statEffects: { relationships: 3, happiness: -4 },
        outcomeText: 'The headmaster delivers a cane reprimand to the bullies. They leave you alone, but label you a snitch.'
      },
      {
        id: 'keep_quiet_endure',
        label: 'Keep quiet and take a detour home',
        description: 'Avoid escalation at all costs.',
        statEffects: { happiness: -10, health: -2 },
        outcomeText: 'The knot of anxiety in your chest grows every morning before the first school bell.'
      }
    ]
  },
  {
    id: 'child_first_library_book',
    minAge: 9,
    maxAge: 11,
    category: 'education',
    weight: 6,
    title: 'Discovery of the World',
    isDecision: false,
    narrative: (state) => {
      if (state.hidden.isUrban || state.country.gdpPerCapitaPPP > 15000) {
        return `A school librarian hands you an illustrated atlas. For hours, you trace mountain ranges and distant oceans you had never imagined.`;
      }
      return `A mobile book truck visits your rural schoolyard. You read a dog-eared folktale anthology until the pages begin falling apart.`;
    },
    passiveStatEffects: { knowledge: 9, happiness: 6 }
  },
  {
    id: 'child_family_illness_shock',
    minAge: 7,
    maxAge: 11,
    category: 'hardship',
    weight: 5,
    condition: (state) => state.country.outOfPocketHealthSpending > 40,
    title: 'Parental Medical Crisis',
    isDecision: false,
    isHeavyTheme: true,
    crisisHelpTopic: 'poverty',
    narrative: (state) => `Your father is hospitalized with an acute abdominal infection. Because the clinic requires cash upfront for antibiotics and gauze, the family sells two goats and borrows from a local shopkeeper.`,
    passiveStatEffects: { happiness: -12, health: -4 }
  },
  {
    id: 'child_bicycle_adventure',
    minAge: 8,
    maxAge: 10,
    category: 'lifestyle',
    weight: 7,
    title: 'The Borrowed Bicycle',
    isDecision: false,
    narrative: () => `A neighbor lets you practice on an oversized steel bicycle. After several scraped knees against gravel, you experience the exhilarating rush of independent balance.`,
    passiveStatEffects: { happiness: 10, health: 4 }
  },
  {
    id: 'child_monsoon_flood',
    minAge: 6,
    maxAge: 11,
    category: 'environment',
    weight: 6,
    condition: (state) => ['IND', 'BGD', 'PHL', 'IDN', 'NGA'].includes(state.country.code),
    title: 'Torrential Inundation',
    isDecision: false,
    narrative: () => `Monsoon rains flood the low-lying access roads with knee-deep muddy water. School is canceled for a week while families pile sandbags against front doorways.`,
    passiveStatEffects: { health: -4, happiness: -2 }
  },
  {
    id: 'child_street_games',
    minAge: 7,
    maxAge: 11,
    category: 'personal',
    weight: 8,
    title: 'Dusk Street Games',
    isDecision: false,
    narrative: (state) => {
      const sport = ['IND', 'PAK', 'BGD'].includes(state.country.code) ? 'street cricket with a wooden plank' : 'soccer with a ball rolled from plastic bags and string';
      return `Every evening as the sun dips below the telephone poles, neighborhood children gather to play ${sport} until calls for dinner ring out.`;
    },
    passiveStatEffects: { happiness: 9, relationships: 8, health: 5 }
  },
  {
    id: 'child_chickenpox_contagion',
    minAge: 6,
    maxAge: 9,
    category: 'medical',
    weight: 6,
    title: 'Childhood Chickenpox',
    isDecision: false,
    narrative: () => `You break out in itchy red blisters from forehead to shins. Your parents smear cool calamine lotion on your arms while you drink herbal broths.`,
    passiveStatEffects: { health: -6, happiness: -4 }
  },
  {
    id: 'child_math_competition',
    minAge: 9,
    maxAge: 11,
    category: 'education',
    weight: 5,
    title: 'District Arithmetic Olympiad',
    isDecision: true,
    narrative: () => `Your math instructor selects you to represent the school at the inter-district arithmetic rally held in the town hall.`,
    options: [
      {
        id: 'drill_math_problems',
        label: 'Spend two weeks drilling problem sets after class',
        description: 'Focus intensely on logic and mental speed calculations.',
        statEffects: { knowledge: 12, happiness: 6 },
        outcomeText: 'You score third place in the district, receiving a certificate with a gold foil stamp from the municipal inspector.'
      },
      {
        id: 'modest_participation',
        label: 'Participate casually without agonizing study',
        description: 'Treat the rally simply as a fun excursion away from ordinary lessons.',
        statEffects: { happiness: 4, knowledge: 4 },
        outcomeText: 'You solve half the logic puzzles correctly and enjoy free sweets with peers from other towns.'
      }
    ]
  },

  // ==========================================
  // STAGE 3: ADOLESCENCE (Ages 12 - 17)
  // ==========================================
  {
    id: 'adol_leave_school_decision',
    minAge: 13,
    maxAge: 15,
    category: 'education',
    weight: 9,
    condition: (state) => state.hidden.incomeTier === 'poor' && state.country.meanYearsSchooling < 8,
    title: 'The Crossroads: School vs Breadwinning',
    isDecision: true,
    narrative: (state) => `Your family struggles to cover uniform costs and examination fees. An uncle offers you a daily wage position at an auto repair shed.`,
    options: [
      {
        id: 'drop_out_work',
        label: 'Leave school to earn daily wages',
        description: 'Provide immediate cash relief to your household.',
        statEffects: { knowledge: -8, relationships: 8, happiness: -4 },
        wealthMultiplier: 1.25,
        educationChange: 'primary',
        occupationChange: 'Apprentice Mechanic',
        outcomeText: 'You begin 10-hour shifts amidst motor grease and iron filings. The family has enough flour this month.'
      },
      {
        id: 'stay_in_school_borrow',
        label: 'Pleade to continue schooling and take side jobs',
        description: 'Sell newspapers or wash dishes at dawn to cover exam fees.',
        statEffects: { knowledge: 12, health: -8, happiness: 4 },
        educationChange: 'secondary',
        outcomeText: 'You sleep five hours a night, studying under streetlamps, but secure your secondary school place.'
      }
    ]
  },
  {
    id: 'adol_child_marriage_pressure',
    minAge: 14,
    maxAge: 16,
    category: 'personal',
    weight: 8,
    condition: (state) => state.sex === 'female' && state.country.childMarriageRate > 20 && state.hidden.incomeTier !== 'rich',
    title: 'Early Marriage Arrangement',
    isDecision: true,
    isHeavyTheme: true,
    crisisHelpTopic: 'domestic_violence',
    narrative: (state) => `Relatives propose a match with an older merchant from a neighboring town, promising bride wealth that would alleviate family debts.`,
    options: [
      {
        id: 'refuse_marriage',
        label: 'Refuse firmly and insist on completing secondary school',
        description: 'Risk family alienation to protect your own autonomy.',
        statEffects: { relationships: -18, knowledge: 10, happiness: 4 },
        outcomeText: 'Arguments shake the house for weeks. A sympathetic teacher intervenes to keep you enrolled.'
      },
      {
        id: 'accept_arrangement',
        label: 'Comply with family wishes and enter the union',
        description: 'Fulfill cultural filial obligations at great personal sacrifice.',
        statEffects: { happiness: -24, knowledge: -12, relationships: 8 },
        educationChange: 'primary',
        outcomeText: 'You leave school before graduation. Household responsibilities replace your notebooks.'
      }
    ]
  },
  {
    id: 'adol_tobacco_temptation',
    minAge: 13,
    maxAge: 16,
    category: 'lifestyle',
    weight: 7,
    condition: (state) => state.country.smokingPrevalence > 15,
    title: 'Smoking Behind the Alley',
    isDecision: true,
    narrative: () => `Classmates pass around a pack of cheap unfiltered cigarettes behind a concrete wall, urging you to take a drag.`,
    options: [
      {
        id: 'take_up_smoking',
        label: 'Take a cigarette and join the circle',
        description: 'Gain immediate social camaraderie among peers.',
        statEffects: { relationships: 6, health: -6 },
        habitChanges: { smoking: true },
        outcomeText: 'You cough through the first three puffs, but soon find yourself buying loose singles after class.'
      },
      {
        id: 'decline_smoking',
        label: 'Shake your head and walk away',
        description: 'Keep your lungs clear despite teasing.',
        statEffects: { health: 4, relationships: -2 },
        habitChanges: { smoking: false },
        outcomeText: 'They mock your caution for a few days, but you remain free of tobacco dependence.'
      }
    ]
  },
  {
    id: 'adol_first_romance',
    minAge: 15,
    maxAge: 17,
    category: 'personal',
    weight: 8,
    title: 'First Love',
    isDecision: true,
    narrative: () => `You exchange handwritten notes and shy smiles with someone from a neighboring street during late afternoon strolls.`,
    options: [
      {
        id: 'pursue_relationship',
        label: 'Spend hours talking and courting secret meetings',
        description: 'Open your heart to deep youthful affection.',
        statEffects: { happiness: 14, relationships: 10, knowledge: -3 },
        outcomeText: 'The summer passes in dizzying happiness and whispered conversations beside the railway tracks.'
      },
      {
        id: 'focus_solely_on_exams',
        label: 'Politely maintain distance and focus on examinations',
        description: 'Do not allow romance to distract from high-stakes academic tests.',
        statEffects: { knowledge: 8, happiness: -4 },
        outcomeText: 'You keep your head in your textbooks, though you occasionally look out the window with quiet longing.'
      }
    ]
  },
  {
    id: 'adol_board_exam_pressure',
    minAge: 16,
    maxAge: 17,
    category: 'education',
    weight: 9,
    title: 'National Standardized Exams',
    isDecision: false,
    narrative: (state) => {
      if (['IND', 'CHN', 'KOR', 'JPN'].includes(state.country.code)) {
        return `You sit for grueling national school-leaving examinations alongside millions of students in cavernous halls under whirling ceiling fans.`;
      }
      return `You complete national secondary examinations, waiting anxiously for the posted score lists outside the administration building.`;
    },
    passiveStatEffects: { knowledge: 10, health: -4 }
  },
  {
    id: 'adol_severe_depression',
    minAge: 15,
    maxAge: 17,
    category: 'hardship',
    weight: 5,
    title: 'The Weight of Isolation',
    isDecision: true,
    isHeavyTheme: true,
    crisisHelpTopic: 'mental_health',
    narrative: () => `For three months, an impenetrable fog of exhaustion and self-loathing settles over you. Getting out of bed feels like dragging lead weights.`,
    options: [
      {
        id: 'confide_in_friend',
        label: 'Confide in a close friend or counselor',
        description: 'Break the silence and ask for an empathetic ear.',
        statEffects: { happiness: 12, relationships: 8, health: 4 },
        outcomeText: 'Speaking the darkness aloud loosens its suffocating grip. You gradually begin eating and sleeping again.'
      },
      {
        id: 'suffer_in_isolation',
        label: 'Hide your pain behind silence',
        description: 'Conceal your anguish out of shame or fear of burdening others.',
        statEffects: { happiness: -22, health: -12 },
        outcomeText: 'Weeks pass in hollow silence, draining your vitality and leaving you emotionally numb.'
      }
    ]
  },
  {
    id: 'adol_smartphone_connectivity',
    minAge: 13,
    maxAge: 17,
    category: 'lifestyle',
    weight: 8,
    title: 'The Digital Window',
    isDecision: true,
    narrative: () => `You scrape together small chore earnings to acquire a secondhand smartphone with a cracked casing and prepaid cellular data.`,
    options: [
      {
        id: 'use_for_learning_skills',
        label: 'Use data for tutorials, languages, and open course videos',
        description: 'Leverage the device as an engine for self-directed education.',
        statEffects: { knowledge: 14, happiness: 6 },
        outcomeText: 'Late into the night, you watch free physics and coding lectures, taking notes on the back of receipts.'
      },
      {
        id: 'use_for_social_entertainment',
        label: 'Immerse yourself in social feeds, viral humor, and chat groups',
        description: 'Connect with teenage culture and global trend streams.',
        statEffects: { happiness: 10, relationships: 8, knowledge: -2 },
        outcomeText: 'You become an active voice in group chats, exchanging memes and music links until dawn.'
      }
    ]
  },
  {
    id: 'adol_sports_tournament',
    minAge: 14,
    maxAge: 17,
    category: 'lifestyle',
    weight: 7,
    title: 'Regional Athletic Championship',
    isDecision: false,
    narrative: () => `You sprint on the 4x100m relay squad for your school at the regional athletic meet, cheered on by hundreds of spectators in the bleachers.`,
    passiveStatEffects: { health: 8, happiness: 8, relationships: 6 }
  },
  {
    id: 'adol_dental_emergency',
    minAge: 13,
    maxAge: 17,
    category: 'medical',
    weight: 6,
    title: 'Acute Dental Abscess',
    isDecision: true,
    narrative: () => `A throbbing molar infection swells your jaw, making chewing agony and causing fever chills.`,
    options: [
      {
        id: 'visit_formal_dentist',
        label: 'Pay for private clinical dental extraction and local anesthesia',
        description: 'Resolve the root infection under professional sterile care.',
        statEffects: { health: 6, happiness: 2 },
        wealthMultiplier: 0.95,
        outcomeText: 'The tooth is extracted cleanly with lidocaine; twenty-four hours later the throbbing subsides.'
      },
      {
        id: 'clove_oil_and_wait',
        label: 'Rely on crushed cloves and over-the-counter pain powders',
        description: 'Avoid medical costs by treating only the symptom.',
        statEffects: { health: -8, happiness: -10 },
        outcomeText: 'You endure ten days of excruciating pain before the abscess bursts and slowly scars over.'
      }
    ]
  },

  // ==========================================
  // STAGE 4: EARLY ADULTHOOD (Ages 18 - 29)
  // ==========================================
  {
    id: 'adult_tertiary_education',
    minAge: 18,
    maxAge: 19,
    category: 'education',
    weight: 9,
    condition: (state) => state.stats.knowledge >= 40 && state.hidden.incomeTier !== 'poor',
    title: 'Higher Education Opportunity',
    isDecision: true,
    narrative: (state) => `You receive admission to a university degree program in economics and computer science.`,
    options: [
      {
        id: 'enroll_university',
        label: 'Enroll full-time and pursue higher education',
        description: 'Dedicate years to academic qualification despite tuition loans.',
        statEffects: { knowledge: 20, happiness: 6 },
        wealthMultiplier: 0.85,
        educationChange: 'tertiary',
        outcomeText: 'You enter university lecture halls, debating modern theories and building lifelong professional networks.'
      },
      {
        id: 'enter_workforce_immediately',
        label: 'Decline and take an immediate full-time job',
        description: 'Earn steady wages now rather than accumulating student debt.',
        statEffects: { happiness: 4, relationships: 4 },
        wealthMultiplier: 1.30,
        occupationChange: 'Commercial Clerk',
        outcomeText: 'You step directly onto the career ladder, bringing home an independent paycheck every month.'
      }
    ]
  },
  {
    id: 'adult_rural_urban_migration',
    minAge: 19,
    maxAge: 23,
    category: 'career',
    weight: 8,
    condition: (state) => !state.hidden.isUrban && state.country.urbanPopulationRate > 35,
    title: 'Migrating to the Metropolis',
    isDecision: true,
    narrative: (state) => `Jobs in the countryside remain scarce. A long-distance night bus leaves for the sprawling capital city of ${state.country.capitalCity}.`,
    options: [
      {
        id: 'board_bus_city',
        label: 'Pack a single bag and move to the capital',
        description: 'Seek fortune in the bustling urban informal economy.',
        statEffects: { happiness: 4, relationships: -10, knowledge: 8 },
        wealthMultiplier: 1.35,
        occupationChange: 'Urban Service Worker',
        outcomeText: 'You rent a partitioned bunk in an energetic inner-city neighborhood, intoxicated by the speed and scale of city life.'
      },
      {
        id: 'remain_in_village',
        label: 'Remain rooted in your ancestral community',
        description: 'Preserve deep family kinship and pastoral rhythms.',
        statEffects: { relationships: 12, happiness: 2, knowledge: -3 },
        wealthMultiplier: 0.95,
        occupationChange: 'Agricultural Producer',
        outcomeText: 'You stay close to the earth and your elders, cultivating the family plots through the changing seasons.'
      }
    ]
  },
  {
    id: 'adult_factory_labor_conditions',
    minAge: 20,
    maxAge: 26,
    category: 'career',
    weight: 7,
    condition: (state) => state.hidden.incomeTier !== 'rich' && state.hidden.isUrban,
    title: 'The Assembly Line',
    isDecision: true,
    narrative: () => `An electronics manufacturing plant hires you for night shifts assembling circuit components under fluorescent glare.`,
    options: [
      {
        id: 'work_overtime_double',
        label: 'Sign up for voluntary 70-hour overtime weeks',
        description: 'Sacrifice sleep and physical comfort to maximize monthly income.',
        statEffects: { health: -12, happiness: -8 },
        wealthMultiplier: 1.40,
        outcomeText: 'Your bank balance grows, but repetitive strain stiffens your wrists and fatigue burns your eyes.'
      },
      {
        id: 'demand_safety_regulations',
        label: 'Participate in worker discussions regarding ventilation',
        description: 'Advocate for safer workplace conditions with fellow operators.',
        statEffects: { relationships: 8, knowledge: 4, happiness: 4 },
        outcomeText: 'Management agrees to install new air filters after floor supervisors back the request.'
      }
    ]
  },
  {
    id: 'adult_marriage_decision',
    minAge: 22,
    maxAge: 28,
    category: 'personal',
    weight: 10,
    condition: (state) => state.hidden.maritalStatus === 'single',
    title: 'Foundations of Marriage',
    isDecision: true,
    narrative: () => `You and your partner have built shared trust over three years of courtship. Both families gather to discuss solemnizing a marriage.`,
    options: [
      {
        id: 'solemnize_marriage',
        label: 'Celebrate wedding and commit to marital life',
        description: 'Unite your households in formal partnership.',
        statEffects: { happiness: 16, relationships: 18 },
        outcomeText: 'Music and celebration fill the hall as relatives offer blessings. You move into a home together.'
      },
      {
        id: 'delay_for_financial_stability',
        label: 'Postpone until savings provide a firmer cushion',
        description: 'Avoid financial precariousness before establishing independent stability.',
        statEffects: { happiness: -4, relationships: -2 },
        wealthMultiplier: 1.10,
        outcomeText: 'You agree to wait two more years while accumulating savings for a security deposit.'
      }
    ]
  },
  {
    id: 'adult_first_child_born',
    minAge: 23,
    maxAge: 30,
    category: 'personal',
    weight: 9,
    condition: (state) => state.hidden.childrenCount === 0 && state.hidden.maritalStatus !== 'single',
    title: 'Becoming a Parent',
    isDecision: false,
    narrative: (state) => `A healthy baby daughter is born into your arms. Staring at her tiny fingers, a profound wave of protective purpose overtakes you.`,
    passiveStatEffects: { happiness: 18, relationships: 15, health: -4 }
  },
  {
    id: 'adult_overseas_emigration',
    minAge: 22,
    maxAge: 29,
    category: 'career',
    weight: 6,
    condition: (state) => ['PHL', 'IND', 'BGD', 'EGY', 'MEX', 'COL'].includes(state.country.code),
    title: 'The Foreign Contract Opportunity',
    isDecision: true,
    narrative: () => `A licensed overseas recruitment agency offers a three-year contract working construction and logistics abroad.`,
    options: [
      {
        id: 'accept_overseas_contract',
        label: 'Sign the contract and depart for overseas employment',
        description: 'Endure long separation from family to send home foreign currency remittances.',
        statEffects: { relationships: -14, happiness: -6 },
        wealthMultiplier: 1.80,
        occupationChange: 'Expatriate Logistics Technician',
        outcomeText: 'You live in shared worker barracks overseas, wiring 70% of every paycheck directly to your family at home.'
      },
      {
        id: 'remain_with_loved_ones',
        label: 'Decline the contract and stay beside your family',
        description: 'Prioritize proximity to your spouse and parents over higher foreign wages.',
        statEffects: { relationships: 12, happiness: 6 },
        outcomeText: 'You remain at home. Money is tighter, but you share every evening dinner with the people you love.'
      }
    ]
  },
  {
    id: 'adult_physical_fitness_routine',
    minAge: 21,
    maxAge: 32,
    category: 'lifestyle',
    weight: 7,
    title: 'Habitual Physical Discipline',
    isDecision: true,
    narrative: () => `Recognizing the sedentary toll of daily work, you consider committing to regular morning running and calisthenics.`,
    options: [
      {
        id: 'commit_to_daily_exercise',
        label: 'Commit to five weekly morning training sessions',
        description: 'Prioritize cardiovascular vigor and mental discipline.',
        statEffects: { health: 14, happiness: 8 },
        habitChanges: { regularExercise: true },
        outcomeText: 'Within months, your resting heart rate drops and morning mental clarity sharpens noticeably.'
      },
      {
        id: 'prioritize_extra_sleep',
        label: 'Use early mornings for extra rest and relaxation',
        description: 'Enjoy leisurely morning coffee rather than rigorous physical exertion.',
        statEffects: { happiness: 3, health: -2 },
        habitChanges: { regularExercise: false },
        outcomeText: 'You enjoy easy mornings, though long flights of stairs begin leaving you slightly winded.'
      }
    ]
  },
  {
    id: 'adult_first_bank_account',
    minAge: 18,
    maxAge: 22,
    category: 'career',
    weight: 8,
    title: 'Financial Inclusion',
    isDecision: false,
    narrative: (state) => {
      if (['NGA', 'KEN', 'BGD', 'IND'].includes(state.country.code)) {
        return `You register a biometric national ID and open a verified mobile-money wallet, receiving text confirmation of your first stored deposit.`;
      }
      return `You present identification at a commercial branch and receive your first plastic debit card and checking account ledger.`;
    },
    passiveStatEffects: { knowledge: 6, happiness: 4 }
  },
  {
    id: 'adult_roommate_flatshare',
    minAge: 19,
    maxAge: 25,
    category: 'personal',
    weight: 7,
    condition: (state) => state.hidden.isUrban,
    title: 'Shared City Living',
    isDecision: false,
    narrative: () => `You share a two-room flat with two fellow young workers. Cooking rotations, split utility bills, and shared banter over cheap tea define your evenings.`,
    passiveStatEffects: { relationships: 8, happiness: 6 }
  },
  {
    id: 'adult_microenterprise_launch',
    minAge: 22,
    maxAge: 29,
    category: 'career',
    weight: 7,
    condition: (state) => state.hidden.incomeTier !== 'rich',
    title: 'Launching a Venture',
    isDecision: true,
    narrative: () => `Frustrated by low supervisor wages, you identify an opportunity to sell wholesale snacks and mobile phone accessories from a kiosk.`,
    options: [
      {
        id: 'invest_in_kiosk',
        label: 'Invest your modest personal savings to set up the stall',
        description: 'Take the entrepreneurial risk of independent business ownership.',
        statEffects: { knowledge: 10, happiness: 8 },
        wealthMultiplier: 1.35,
        occupationChange: 'Independent Small Trader',
        outcomeText: 'Foot traffic is brisk. By month three, daily profit exceeds your old corporate salary.'
      },
      {
        id: 'retain_wage_security',
        label: 'Stick with your predictable monthly wage',
        description: 'Avoid risking your hard-won emergency cash buffer.',
        statEffects: { happiness: 2 },
        outcomeText: 'You remain at your steady job, enjoying predictable hours and guaranteed compensation.'
      }
    ]
  },
  {
    id: 'adult_driver_license_scooter',
    minAge: 20,
    maxAge: 26,
    category: 'lifestyle',
    weight: 7,
    title: 'Personal Mobility',
    isDecision: false,
    narrative: () => `You pass your driver road test and purchase a refurbished motor scooter, cutting your daily commute time in half.`,
    passiveStatEffects: { happiness: 8, knowledge: 4 }
  },
  {
    id: 'adult_savings_circle',
    minAge: 23,
    maxAge: 32,
    category: 'career',
    weight: 7,
    title: 'Rotational Savings Circle',
    isDecision: false,
    narrative: () => `You join a trusted peer savings circle (Chit fund / Esusu / Tanda) with twelve neighbors, pooling monthly contributions to fund home repairs.`,
    passiveStatEffects: { relationships: 10, happiness: 4 }
  },

  // ==========================================
  // STAGE 5: MIDDLE ADULTHOOD (Ages 30 - 49)
  // ==========================================
  {
    id: 'mid_buying_a_home',
    minAge: 32,
    maxAge: 42,
    category: 'career',
    weight: 8,
    condition: (state) => state.hidden.incomeTier !== 'poor',
    title: 'Securing Permanent Shelter',
    isDecision: true,
    narrative: () => `After a decade of renting, a plot with a concrete-block foundation becomes available on the edge of the municipality.`,
    options: [
      {
        id: 'take_mortgage_home',
        label: 'Commit your life savings and take on a mortgage',
        description: 'Secure permanent ownership for your children’s inheritance.',
        statEffects: { happiness: 14, relationships: 10 },
        wealthMultiplier: 0.80,
        outcomeText: 'You receive the stamped title deed. No landlord can ever hand you an eviction notice again.'
      },
      {
        id: 'continue_renting_preserve_liquidity',
        label: 'Continue renting and keep liquid emergency cash',
        description: 'Avoid tying up capital in immovable brick and mortar.',
        statEffects: { happiness: 2 },
        wealthMultiplier: 1.15,
        outcomeText: 'You keep your funds liquid in bank deposits, maintaining flexibility in case of macroeconomic shocks.'
      }
    ]
  },
  {
    id: 'mid_marital_crisis',
    minAge: 35,
    maxAge: 44,
    category: 'personal',
    weight: 6,
    condition: (state) => state.hidden.maritalStatus === 'married',
    title: 'Fractures in the Marriage',
    isDecision: true,
    narrative: () => `Years of financial anxiety and silence have eroded emotional closeness. Harsh arguments recur over small domestic grievances.`,
    options: [
      {
        id: 'seek_marriage_reconciliation',
        label: 'Initiate honest, patient conversations and seek mediation',
        description: 'Do the painful emotional work required to rebuild vulnerability and trust.',
        statEffects: { relationships: 14, happiness: 8 },
        outcomeText: 'Long evening walks and tearful acknowledgments slowly rekindle mutual warmth and respect.'
      },
      {
        id: 'emotional_withdrawal',
        label: 'Withdraw into icy, polite coexistence',
        description: 'Avoid conflict by living like roommates under the same roof.',
        statEffects: { relationships: -12, happiness: -10 },
        outcomeText: 'The house remains quiet, but an unspoken chill lingers over every meal.'
      }
    ]
  },
  {
    id: 'mid_chronic_hypertension_diagnosis',
    minAge: 38,
    maxAge: 48,
    category: 'medical',
    weight: 8,
    title: 'The Silent Pressure',
    isDecision: true,
    narrative: () => `A routine health check at a community center reveals your blood pressure is dangerously elevated at 165/105 mmHg.`,
    options: [
      {
        id: 'adhere_to_medication_diet',
        label: 'Cut sodium, cease alcohol, and take daily generic medication',
        description: 'Commit to lifelong behavioral change and blood pressure monitoring.',
        statEffects: { health: 10, happiness: 2 },
        outcomeText: 'Your readings stabilize within safe clinical parameters, substantially lowering future stroke hazard.'
      },
      {
        id: 'ignore_the_numbers',
        label: 'Shrug it off since you feel completely fine right now',
        description: 'Assume the reading was merely a momentary response to stress.',
        statEffects: { health: -18 },
        outcomeText: 'Uncontrolled arterial pressure silently strains your renal vessels and cardiac muscle year after year.'
      }
    ]
  },
  {
    id: 'mid_aging_parents_care',
    minAge: 40,
    maxAge: 49,
    category: 'personal',
    weight: 8,
    title: 'Caring for an Aging Mother',
    isDecision: true,
    narrative: () => `Your mother’s eyesight is fading from cataracts, and she can no longer walk alone safely to the market.`,
    options: [
      {
        id: 'bring_mother_into_home',
        label: 'Bring her into your household and provide daily care',
        description: 'Shoulder the personal and financial duty of elder care.',
        statEffects: { relationships: 16, happiness: 6, health: -4 },
        wealthMultiplier: 0.94,
        outcomeText: 'Her laughter and traditional stories once again fill your evenings, though your spare room is now occupied.'
      },
      {
        id: 'hire_caregiver_remotely',
        label: 'Pool funds with siblings to hire a village neighbor as caregiver',
        description: 'Support her remaining in her own house with financial remittances.',
        statEffects: { relationships: 4 },
        wealthMultiplier: 0.92,
        outcomeText: 'She is looked after daily in her familiar surroundings, though you regret not seeing her more frequently.'
      }
    ]
  },
  {
    id: 'mid_neighborhood_crime_shock',
    minAge: 33,
    maxAge: 47,
    category: 'hardship',
    weight: 6,
    condition: (state) => state.country.homicideRate > 15,
    title: 'Neighborhood Violence',
    isDecision: false,
    isHeavyTheme: true,
    crisisHelpTopic: 'domestic_violence',
    narrative: (state) => `A turf conflict erupts between local youth gangs two blocks away. Stray gunfire damages parked vehicles, forcing families to install iron window grilles.`,
    passiveStatEffects: { happiness: -14, health: -4 }
  },
  {
    id: 'mid_workplace_supervision_promotion',
    minAge: 34,
    maxAge: 46,
    category: 'career',
    weight: 8,
    title: 'Promoted to Operations Supervisor',
    isDecision: false,
    narrative: () => `Management recognizes your reliability and elevates you to lead an eight-person operations crew, with an accompanying pay raise.`,
    passiveStatEffects: { happiness: 10, knowledge: 8 }
  },
  {
    id: 'mid_parent_passing',
    minAge: 38,
    maxAge: 49,
    category: 'hardship',
    weight: 7,
    title: 'Passing of a Parent',
    isDecision: false,
    narrative: () => `Your father passes away quietly at age 74. Extended family gathers for funeral ceremonies, singing ancestral hymns and recounting his life memories.`,
    passiveStatEffects: { happiness: -16, relationships: 8 }
  },
  {
    id: 'mid_reading_glasses_prescription',
    minAge: 43,
    maxAge: 49,
    category: 'medical',
    weight: 6,
    title: 'Reading Glasses',
    isDecision: false,
    narrative: () => `Holding paper documents at arm’s length no longer works. You get fitted for reading spectacles, snapping small text back into crisp focus.`,
    passiveStatEffects: { health: 2, knowledge: 4 }
  },
  {
    id: 'mid_pilgrimage_journey',
    minAge: 42,
    maxAge: 52,
    category: 'personal',
    weight: 6,
    title: 'Sacred Journey',
    isDecision: false,
    narrative: (state) => `You complete a long-planned spiritual pilgrimage with your spouse, joining thousands of travelers in solemn morning chants.`,
    passiveStatEffects: { happiness: 14, relationships: 8 }
  },

  // ==========================================
  // STAGE 6: MATURE ADULTHOOD (Ages 50 - 69)
  // ==========================================
  {
    id: 'mat_children_graduation',
    minAge: 50,
    maxAge: 56,
    category: 'personal',
    weight: 8,
    condition: (state) => state.hidden.childrenCount > 0,
    title: 'A Child’s Graduation',
    isDecision: false,
    narrative: () => `You stand in the audience watching your child walk across the podium to receive their higher diploma. The decades of sacrifices feel fully vindicated.`,
    passiveStatEffects: { happiness: 22, relationships: 12 }
  },
  {
    id: 'mat_retirement_dilemma',
    minAge: 60,
    maxAge: 65,
    category: 'career',
    weight: 9,
    title: 'The Retirement Horizon',
    isDecision: true,
    narrative: (state) => {
      if (state.country.gdpPerCapitaPPP > 40000) {
        return `You reach the statutory pension eligibility age. You have the right to claim full retirement annuities or continue consulting.`;
      }
      return `With no formal state pension scheme, you must decide whether your aging joints can endure continued informal manual labor.`;
    },
    options: [
      {
        id: 'step_back_retire',
        label: 'Step away from full-time labor to rest and cultivate garden',
        description: 'Live modestly on accumulated savings and family support.',
        statEffects: { health: 8, happiness: 12 },
        wealthMultiplier: 0.78,
        occupationChange: 'Retiree',
        outcomeText: 'You wake without an alarm clock, spending quiet hours tending basil and reading under the patio.'
      },
      {
        id: 'keep_working_daily',
        label: 'Continue working reduced daily hours',
        description: 'Keep the mental stimulation and the security of a steady wage.',
        statEffects: { happiness: 4, health: -6 },
        wealthMultiplier: 1.10,
        outcomeText: 'You remain engaged with colleagues and customers, though your back aches by mid-afternoon.'
      }
    ]
  },
  {
    id: 'mat_first_grandchild',
    minAge: 53,
    maxAge: 62,
    category: 'personal',
    weight: 8,
    condition: (state) => state.hidden.childrenCount > 0,
    title: 'The Next Generation',
    isDecision: false,
    narrative: () => `Your first grandchild is born. Holding the warm, sleeping bundle, you realize the family chain stretches forward long into the future.`,
    passiveStatEffects: { happiness: 20, relationships: 14 }
  },
  {
    id: 'mat_spousal_illness',
    minAge: 58,
    maxAge: 68,
    category: 'hardship',
    weight: 6,
    condition: (state) => state.hidden.maritalStatus === 'married',
    title: 'Partner’s Health Scare',
    isDecision: true,
    narrative: () => `Your spouse collapses from an acute cardiac event and is rushed into the emergency ward for catheterization.`,
    options: [
      {
        id: 'devote_months_to_nursing',
        label: 'Drop all personal pursuits to nurse them back to strength',
        description: 'Provide round-the-clock physical support during post-op rehabilitation.',
        statEffects: { relationships: 20, happiness: 6, health: -6 },
        outcomeText: 'Through months of physiotherapy and salt-free meals, your partner’s strength gradually returns.'
      },
      {
        id: 'balance_work_with_hired_aide',
        label: 'Employ a home health aide while maintaining your daily work',
        description: 'Ensure financial continuity while securing professional medical aid.',
        statEffects: { relationships: 6, happiness: 2 },
        wealthMultiplier: 0.90,
        outcomeText: 'Professional nursing accelerates the recovery process without draining all family energy.'
      }
    ]
  },

  // ==========================================
  // STAGE 7: ELDERHOOD (Ages 70+)
  // ==========================================
  {
    id: 'eld_quiet_wisdom',
    minAge: 70,
    maxAge: 78,
    category: 'personal',
    weight: 8,
    title: 'The Perspective of Years',
    isDecision: false,
    narrative: () => `Younger neighbors frequently stop by your porch for advice on land disputes, family feuds, and career dilemmas. Your calm counsel is prized across the quarter.`,
    passiveStatEffects: { relationships: 12, happiness: 10 }
  },
  {
    id: 'eld_sensory_decline',
    minAge: 72,
    maxAge: 85,
    category: 'medical',
    weight: 7,
    title: 'Dimming Senses',
    isDecision: true,
    narrative: () => `Cloudy vision and dulling hearing begin isolating you from room conversations during family gatherings.`,
    options: [
      {
        id: 'pursue_corrective_surgery_aids',
        label: 'Undergo simple cataract extraction and fit hearing aids',
        description: 'Invest in medical corrections to stay connected to your environment.',
        statEffects: { health: 8, happiness: 12 },
        wealthMultiplier: 0.92,
        outcomeText: 'The morning following lens replacement, bright colors and bird songs flood back into your world.'
      },
      {
        id: 'accept_sensory_fade',
        label: 'Accept the fading light and sound as nature’s rhythm',
        description: 'Turn inward toward peaceful contemplation and memory.',
        statEffects: { health: -4, happiness: -2 },
        outcomeText: 'The world grows quieter and softer around the edges as your days flow into calm reflection.'
      }
    ]
  },
  {
    id: 'eld_legacy_and_peace',
    minAge: 78,
    maxAge: 95,
    category: 'personal',
    weight: 8,
    title: 'Tidying the Life Record',
    isDecision: false,
    narrative: () => `Looking through old photographs and stamped letters in a tin box, you feel a deep, quiet gratitude for having walked the earth this long.`,
    passiveStatEffects: { happiness: 15, relationships: 8 }
  },
  {
    id: 'mat_handover_of_trade',
    minAge: 56,
    maxAge: 64,
    category: 'career',
    weight: 7,
    title: 'Passing the Tools',
    isDecision: false,
    narrative: () => `You formally step back from daily shop operations, handing key inventory ledgers and customer relations over to your eldest apprentice.`,
    passiveStatEffects: { relationships: 10, happiness: 8 }
  },
  {
    id: 'mat_joint_osteoarthritis',
    minAge: 57,
    maxAge: 68,
    category: 'medical',
    weight: 7,
    title: 'Aching Knees',
    isDecision: false,
    narrative: () => `Damp weather triggers stiffness in your knees and knuckles. Herbal liniments and a carved walking stick become daily companions.`,
    passiveStatEffects: { health: -8, happiness: -2 }
  },
  {
    id: 'mat_old_friend_reunion',
    minAge: 55,
    maxAge: 68,
    category: 'personal',
    weight: 6,
    title: 'Reunion After Decades',
    isDecision: false,
    narrative: () => `At a municipal festival, you cross paths with a childhood classmate you hadn’t seen in forty years. You spend hours over tea tracing the winding paths of your mutual peers.`,
    passiveStatEffects: { happiness: 14, relationships: 10 }
  },
  {
    id: 'eld_morning_walking_circle',
    minAge: 70,
    maxAge: 84,
    category: 'lifestyle',
    weight: 8,
    title: 'Dawn Walking Circle',
    isDecision: false,
    narrative: () => `At six every morning, you meet four other neighborhood elders at the public square to walk laps, discuss the morning news, and stretch tired limbs.`,
    passiveStatEffects: { health: 6, happiness: 10, relationships: 8 }
  },
  {
    id: 'eld_oral_genealogy',
    minAge: 73,
    maxAge: 88,
    category: 'personal',
    weight: 7,
    title: 'Recounting the Ancestry',
    isDecision: false,
    narrative: () => `A teenage grandchild sits with a voice recorder on their phone, asking you to recite names, dates, and ancestral stories going back four generations.`,
    passiveStatEffects: { relationships: 14, happiness: 12, knowledge: 6 }
  },
  {
    id: 'eld_peaceful_twilight',
    minAge: 80,
    maxAge: 98,
    category: 'personal',
    weight: 8,
    title: 'The Golden Hour of Life',
    isDecision: false,
    narrative: () => `In the quiet warmth of late afternoon, wrapped in a woolen shawl on the veranda, you listen to birds in the courtyard and savor the gift of every sunrise.`,
    passiveStatEffects: { happiness: 16, relationships: 6 }
  }
];

/**
 * Filter events eligible for a given simulation state
 */
export function getEligibleEvents(state: SimulationState): GameEvent[] {
  return GAME_EVENTS.filter((e) => {
    if (state.age < e.minAge || state.age > e.maxAge) return false;
    if (state.config.leaveOutFrighteningScenes && e.isHeavyTheme) return false;
    if (state.config.classroomMode && e.isHeavyTheme) return false;
    if (e.condition && !e.condition(state)) return false;
    return true;
  });
}
