export interface CrisisResource {
  name: string;
  phone?: string;
  text?: string;
  website: string;
  available: string;
  description: string;
}

export interface RegionCrisisGuide {
  generalMentalHealth: CrisisResource;
  youthOrChildline?: CrisisResource;
  substanceOrAbuse?: CrisisResource;
  domesticViolence?: CrisisResource;
}

export const CRISIS_RESOURCES_BY_COUNTRY: Record<string, RegionCrisisGuide> = {
  USA: {
    generalMentalHealth: {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      text: 'Text HOME to 741741',
      website: 'https://988lifeline.org',
      available: '24/7, Free & Confidential',
      description: 'Immediate counseling and support for emotional distress or crisis.'
    },
    youthOrChildline: {
      name: 'The Trevor Project / Boys Town National Hotline',
      phone: '1-800-448-3000',
      website: 'https://www.boystown.org/hotline',
      available: '24/7',
      description: 'Support for children, teens, and young adults.'
    },
    domesticViolence: {
      name: 'National Domestic Violence Hotline',
      phone: '1-800-799-SAFE (7233)',
      text: 'Text START to 88788',
      website: 'https://www.thehotline.org',
      available: '24/7',
      description: 'Advocacy, safety planning, and resources for survivors.'
    }
  },
  GBR: {
    generalMentalHealth: {
      name: 'Samaritans UK',
      phone: '116 123',
      website: 'https://www.samaritans.org',
      available: '24/7 Free',
      description: 'Confidential emotional support for anyone in crisis or despair.'
    },
    youthOrChildline: {
      name: 'Childline UK',
      phone: '0800 1111',
      website: 'https://www.childline.org.uk',
      available: '24/7 Free for anyone under 19',
      description: 'Comfort, support and advice for young people.'
    }
  },
  IND: {
    generalMentalHealth: {
      name: 'KIRAN National Mental Health Helpline (Govt. of India)',
      phone: '1800-599-0019',
      website: 'https://www.vandrevalafoundation.com',
      available: '24/7 Multilingual',
      description: 'First aid psychological support and crisis management in 13 languages.'
    },
    youthOrChildline: {
      name: 'Childline India',
      phone: '1098',
      website: 'https://www.childlineindia.org',
      available: '24/7 Free',
      description: 'National emergency helpline for children in need of aid and assistance.'
    }
  },
  NGA: {
    generalMentalHealth: {
      name: 'Mentally Aware Nigeria Initiative (MANI)',
      phone: '+234 809 111 6264',
      website: 'https://mentallyaware.org',
      available: 'Daily Support',
      description: 'Crisis intervention and mental health assistance across Nigeria.'
    }
  },
  ZAF: {
    generalMentalHealth: {
      name: 'SADAG (South African Depression & Anxiety Group)',
      phone: '0800 567 567',
      website: 'https://www.sadag.org',
      available: '24/7 Free',
      description: 'Suicide crisis helpline and mental health triage in South Africa.'
    },
    youthOrChildline: {
      name: 'Childline South Africa',
      phone: '116',
      website: 'https://www.childlinesa.org.za',
      available: '24/7 Toll-Free',
      description: 'Protecting children against violence and exploitation.'
    }
  },
  BRA: {
    generalMentalHealth: {
      name: 'CVV (Centro de Valorização da Vida)',
      phone: '188',
      website: 'https://www.cvv.org.br',
      available: '24 horas por dia, ligação gratuita',
      description: 'Apoio emocional e prevenção do suicídio atendendo voluntariamente.'
    }
  },
  DEU: {
    generalMentalHealth: {
      name: 'TelefonSeelsorge Deutschland',
      phone: '0800 111 0 111 / 0800 111 0 222',
      website: 'https://www.telefonseelsorge.de',
      available: '24 Stunden kostenfrei & anonym',
      description: 'Gesprächsangebote bei Sorgen, Krisen und seelischen Nöten.'
    }
  },
  JPN: {
    generalMentalHealth: {
      name: 'TELL Lifeline & Inochi no Denwa (命の電話)',
      phone: '0570-783-556 / 03-5774-0992',
      website: 'https://telljp.com',
      available: 'Daily Support in English & Japanese',
      description: 'Free confidential counseling and crisis intervention.'
    }
  }
};

export const GLOBAL_CRISIS_FALLBACK: RegionCrisisGuide = {
  generalMentalHealth: {
    name: 'Find A Helpline / Befrienders Worldwide',
    website: 'https://findahelpline.com',
    available: 'Worldwide, 130+ Countries Free & Confidential',
    description: 'Find free, confidential support from local crisis centers across the globe.'
  },
  youthOrChildline: {
    name: 'Child Helpline International',
    website: 'https://www.childhelplineinternational.org',
    available: 'Global Network',
    description: 'Connecting children and youth to emergency protective care worldwide.'
  },
  domesticViolence: {
    name: 'UN Women - Ending Violence Against Women Directory',
    website: 'https://www.unwomen.org/en/what-we-do/ending-violence-against-women',
    available: 'Global Directory',
    description: 'International crisis directories and legal support networks.'
  }
};

export function getCrisisResources(countryCode: string): RegionCrisisGuide {
  return CRISIS_RESOURCES_BY_COUNTRY[countryCode] || GLOBAL_CRISIS_FALLBACK;
}
