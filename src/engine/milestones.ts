import { MilestoneDefinition, SimulationState } from './types';
import { PRNG } from './prng';

export const MILESTONE_DEFINITIONS: MilestoneDefinition[] = [
  {
    age: 5,
    questions: [
      {
        id: 'm5_q1_safety',
        text: 'At age five, this child has survived the highest-risk statistical window of their life. When you were five, what was your earliest memory of feeling safe—or vulnerable?',
        contextIntro: 'The first five years carry the heaviest childhood mortality risk in human history.'
      },
      {
        id: 'm5_q2_geography',
        text: 'By age five, this child’s mother tongue, nutrition, and safety are already set by the lottery of birth. What advantages or burdens did your own birth geography grant you before you ever made a conscious choice?',
        contextIntro: 'No human selects their country of birth.'
      },
      {
        id: 'm5_q3_afternoon',
        text: 'In many parts of the world, five is the age when chores and sibling care begin replacing play. What did a typical afternoon look like for you when you were five?',
        contextIntro: 'Childhood takes vastly divergent forms across different income tiers.'
      },
      {
        id: 'm5_q4_school_doors',
        text: 'This child is about to enter primary school—or miss out on it entirely due to infrastructure. Do you remember the doors opening on your very first day of school?',
        contextIntro: 'Over 250 million children globally remain out of school.'
      },
      {
        id: 'm5_q5_gratitude',
        text: 'Over five million children worldwide do not reach their fifth birthday each year. What emotions arise when you reflect on how effortlessly many of us take surviving childhood for granted?',
        contextIntro: 'Survival itself is the first great demographic filter.'
      }
    ]
  },
  {
    age: 15,
    questions: [
      {
        id: 'm15_q1_dreams',
        text: 'At fifteen, the gap between what a teenager dreams of and what their economy permits often begins to harden. When you were fifteen, what did you imagine your adulthood would look like?',
        contextIntro: 'Adolescent aspirations meet systemic economic realities.'
      },
      {
        id: 'm15_q2_pressure',
        text: 'At fifteen in this country, choices about continuing school, early labor, or marriage are already urgent. What was the highest-stakes pressure you faced when you were fifteen?',
        contextIntro: 'In many regions, adult obligations descend before childhood ends.'
      },
      {
        id: 'm15_q3_class_awareness',
        text: 'Fifteen is often when we first notice economic disparity among our peers. When did you first realize whether your family was considered rich, middle, or poor?',
        contextIntro: 'Relative economic standing shapes self-image and opportunity.'
      },
      {
        id: 'm15_q4_societal_treatment',
        text: 'In some countries, a fifteen-year-old is an adult worker or bride; in others, still a protected dependent. How did your society treat you at fifteen?',
        contextIntro: 'Youth is socially constructed in profoundly different ways across cultures.'
      },
      {
        id: 'm15_q5_message_across_time',
        text: 'If you could whisper one sentence of comfort or warning to your fifteen-year-old self across time, what words would you choose?',
        contextIntro: 'Looking back from experience transforms our perspective on youthful struggle.'
      }
    ]
  },
  {
    age: 30,
    questions: [
      {
        id: 'm30_q1_trajectory',
        text: 'By age thirty, a person’s trajectory reflects the heavy compounding of early circumstances. How closely does your current life at thirty resemble the plans you had a decade prior?',
        contextIntro: 'A decade of decisions and serendipity compounds into lived reality.'
      },
      {
        id: 'm30_q2_dependents',
        text: 'At thirty, this person shoulders responsibility for children, aging parents, or community survival. Who depends on you today, and how does that responsibility feel?',
        contextIntro: 'Adulthood is defined by who we carry.'
      },
      {
        id: 'm30_q3_urgency',
        text: 'In high-income nations, thirty marks the start of established careers; in low-income settings, it can be the halfway point of life expectancy. How does this difference shift your sense of time?',
        contextIntro: 'Life expectancy alters the perceived horizon of adulthood.'
      },
      {
        id: 'm30_q4_sacrifices',
        text: 'What sacrifices have you made between age twenty and thirty that you are proud of—or that you quietly grieve?',
        contextIntro: 'Every choice requires closing other doors.'
      },
      {
        id: 'm30_q5_core_values',
        text: 'Looking at this character’s balance of health, relationships, and income at thirty, what do you value most in your own day-to-day existence right now?',
        contextIntro: 'Survival and fulfillment are weighed differently in every home.'
      }
    ]
  },
  {
    age: 50,
    questions: [
      {
        id: 'm50_q1_what_mattered',
        text: 'At age fifty, more than half of life has passed for most humans. Looking back, what has mattered most: the goals achieved, or the relationships maintained along the way?',
        contextIntro: 'The mid-century vantage point clarifies what endures.'
      },
      {
        id: 'm50_q2_body_and_labor',
        text: 'At fifty, the physical body begins carrying the cumulative wear of fifty years of labor, diet, and climate. How is your relationship with your own physical health evolving?',
        contextIntro: 'The physical vessel reflects every year lived.'
      },
      {
        id: 'm50_q3_bridge_generation',
        text: 'Many fifty-year-olds find themselves caring for elderly parents while guiding young adult children. How do you navigate the weight of being the bridge between generations?',
        contextIntro: 'The sandwich generation bears the greatest caregiving weight.'
      },
      {
        id: 'm50_q4_discarded_beliefs',
        text: 'What belief about happiness, success, or security did you hold in your twenties that you have completely discarded by age fifty?',
        contextIntro: 'Maturity often means unlearning illusions.'
      },
      {
        id: 'm50_q5_legacy',
        text: 'If this character’s life were to end in the coming decade, what legacy or imprint do you think they would leave on the people around them?',
        contextIntro: 'Legacy is woven from the memories of those who knew us.'
      }
    ]
  },
  {
    age: 70,
    questions: [
      {
        id: 'm70_q1_triumph',
        text: 'Reaching age seventy is an actuarial triumph in many parts of the world, granted to only a fraction of those born in the same year. How do you hope to feel when you look back on seven decades?',
        contextIntro: 'Only a minority of humanity reaches seventy in high vigor.'
      },
      {
        id: 'm70_q2_quiet_peace',
        text: 'At seventy, the noise of ambition fades and the quiet cadence of days takes over. What simple moments in your life right now bring you the deepest peace?',
        contextIntro: 'The grandeur of life often narrows down to quiet moments.'
      },
      {
        id: 'm70_q3_ancestral_thread',
        text: 'What ancestral stories, recipes, or wisdom from your family’s elders do you carry with you—and what will you pass forward?',
        contextIntro: 'Human culture survives because elders pass the torch.'
      },
      {
        id: 'm70_q4_life_map_verdict',
        text: 'Looking at the Life Map of this character at seventy, does their life feel fortunate, resilient, or tragic to you? What does that judgment reveal about your own values?',
        contextIntro: 'We judge lives through the lens of our own worldview.'
      },
      {
        id: 'm70_q5_empathy',
        text: 'If you had been born in this person’s exact shoes, what do you think would have been the greatest obstacle to your dignity—and what would have been your greatest source of joy?',
        contextIntro: 'Perspective is the heart of empathy.'
      }
    ]
  }
];

export function getMilestoneForAge(age: number, prng: PRNG): { age: number; question: string } | null {
  const milestone = MILESTONE_DEFINITIONS.find((m) => m.age === age);
  if (!milestone) return null;

  const picked = prng.choice(milestone.questions);
  return {
    age,
    question: picked.text
  };
}
