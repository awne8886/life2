import { SimulationState, LifeHistory } from '../engine/types';

const ACTIVE_LIFE_KEY = 'life_sim_active_run_v1';
const MEMORIAL_REGISTRY_KEY = 'life_sim_memorial_registry_v1';

// Seeded sample lives so that first-time users can immediately explore the memorial viewer
const SAMPLE_PRELOADED_LIVES: LifeHistory[] = [
  {
    id: 'sample_life_1',
    birthYear: 1988,
    seed: 489218,
    countryCode: 'IND',
    countryName: 'India',
    flag: '🇮🇳',
    sex: 'male',
    name: 'Aarav',
    finalAge: 73,
    causeOfDeath: 'Ischemic heart disease and chronic cardiac failure',
    deathYear: 2061,
    entries: [
      {
        age: 0,
        year: 1988,
        headline: 'Born in India',
        detail: 'Born in a district hospital in Mumbai. Raised in a vibrant middle-income household.',
        category: 'birth'
      },
      {
        age: 6,
        year: 1994,
        headline: 'First Day of Primary School',
        detail: 'Enrolled in a local state-aided municipal academy.',
        category: 'education'
      },
      {
        age: 23,
        year: 2011,
        headline: 'University Completion',
        detail: 'Graduated with a certificate in civil engineering.',
        category: 'education'
      },
      {
        age: 73,
        year: 2061,
        headline: 'Passed Away',
        detail: 'Surrounded by children and grandchildren in his family residence.',
        category: 'death'
      }
    ],
    lifeMap: [
      { age: 0, year: 1988, tone: 'neutral', summary: 'Born in India' },
      { age: 23, year: 2011, tone: 'positive', summary: 'Graduation' },
      { age: 73, year: 2061, tone: 'crisis', summary: 'Passed away' }
    ],
    finalStats: { health: 22, happiness: 78, knowledge: 65, relationships: 82 },
    incomeTier: 'middle',
    wealthPpp: 14200,
    occupation: 'Civil Construction Inspector',
    educationLevel: 'tertiary',
    childrenCount: 2,
    milestoneAnswers: [
      { age: 5, question: 'Earliest memory of safety?', answer: 'Grandmother singing lullabies during afternoon rains.' }
    ],
    partingWords: 'A builder who took deep pride in seeing bridges stand steady.',
    completedAt: '2024-03-12T14:20:00.000Z'
  },
  {
    id: 'sample_life_2',
    birthYear: 2002,
    seed: 712903,
    countryCode: 'NGA',
    countryName: 'Nigeria',
    flag: '🇳🇬',
    sex: 'female',
    name: 'Aminat',
    finalAge: 64,
    causeOfDeath: 'Severe lower respiratory infection and complications',
    deathYear: 2066,
    entries: [
      {
        age: 0,
        year: 2002,
        headline: 'Born in Nigeria',
        detail: 'Born in Ibadan, Oyo State, to a family of textile and produce traders.',
        category: 'birth'
      },
      {
        age: 18,
        year: 2020,
        headline: 'Independent Wholesale Stall',
        detail: 'Opened a cooperative dry-goods market venture.',
        category: 'work'
      },
      {
        age: 64,
        year: 2066,
        headline: 'Passed Away',
        detail: 'Remembered as a matriarch and anchor of the community market union.',
        category: 'death'
      }
    ],
    lifeMap: [
      { age: 0, year: 2002, tone: 'neutral', summary: 'Born in Nigeria' },
      { age: 18, year: 2020, tone: 'positive', summary: 'Market venture' },
      { age: 64, year: 2066, tone: 'crisis', summary: 'Passed away' }
    ],
    finalStats: { health: 18, happiness: 70, knowledge: 52, relationships: 88 },
    incomeTier: 'middle',
    wealthPpp: 8200,
    occupation: 'Wholesale Fabric Merchant',
    educationLevel: 'secondary',
    childrenCount: 4,
    milestoneAnswers: [
      { age: 30, question: 'Who depends on you today?', answer: 'My four children and younger siblings.' }
    ],
    partingWords: 'Lived with courage, warmth, and an open door for everyone in need.',
    completedAt: '2024-05-18T09:15:00.000Z'
  }
];

export function saveActiveSimulation(state: SimulationState): void {
  try {
    localStorage.setItem(ACTIVE_LIFE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save active simulation state to localStorage', e);
  }
}

export function loadActiveSimulation(): SimulationState | null {
  try {
    const raw = localStorage.getItem(ACTIVE_LIFE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load active simulation state', e);
    return null;
  }
}

export function clearActiveSimulation(): void {
  try {
    localStorage.removeItem(ACTIVE_LIFE_KEY);
  } catch {}
}

export function getCompletedLives(): LifeHistory[] {
  try {
    const raw = localStorage.getItem(MEMORIAL_REGISTRY_KEY);
    if (!raw) {
      // Initialize with preloaded sample lives
      localStorage.setItem(MEMORIAL_REGISTRY_KEY, JSON.stringify(SAMPLE_PRELOADED_LIVES));
      return SAMPLE_PRELOADED_LIVES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SAMPLE_PRELOADED_LIVES;
  } catch {
    return SAMPLE_PRELOADED_LIVES;
  }
}

export function saveCompletedLife(history: LifeHistory): void {
  try {
    const lives = getCompletedLives();
    const updated = [history, ...lives.filter((l) => l.id !== history.id)];
    localStorage.setItem(MEMORIAL_REGISTRY_KEY, JSON.stringify(updated));
    clearActiveSimulation();
  } catch (e) {
    console.error('Failed to save completed life to memorial registry', e);
  }
}

export function getRandomCompletedLife(): LifeHistory | null {
  const lives = getCompletedLives();
  if (lives.length === 0) return null;
  const idx = Math.floor(Math.random() * lives.length);
  return lives[idx];
}

export function deleteCompletedLife(id: string): void {
  try {
    const lives = getCompletedLives();
    const filtered = lives.filter((l) => l.id !== id);
    localStorage.setItem(MEMORIAL_REGISTRY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete completed life', e);
  }
}

export function exportLivesAsJson(): string {
  const lives = getCompletedLives();
  return JSON.stringify(lives, null, 2);
}

export function importLivesFromJson(jsonString: string): { importedCount: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { importedCount: 0, error: 'JSON content must be an array of life records.' };
    }

    const existing = getCompletedLives();
    const existingIds = new Set(existing.map((l) => l.id));
    const toAdd: LifeHistory[] = [];

    for (const item of parsed) {
      if (item.name && item.countryCode && typeof item.finalAge === 'number') {
        const id = item.id || `imported_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        if (!existingIds.has(id)) {
          toAdd.push({ ...item, id });
          existingIds.add(id);
        }
      }
    }

    const merged = [...toAdd, ...existing];
    localStorage.setItem(MEMORIAL_REGISTRY_KEY, JSON.stringify(merged));
    return { importedCount: toAdd.length };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON file';
    return { importedCount: 0, error: msg };
  }
}

export function clearAllMemorialRecords(): void {
  try {
    localStorage.setItem(MEMORIAL_REGISTRY_KEY, JSON.stringify([]));
  } catch {}
}
