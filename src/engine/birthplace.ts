import { CountryData, Sex, BirthWeighting, WorldEra } from './types';
import { PRNG } from './prng';
import { COUNTRIES, COUNTRY_LOOKUP } from '../data/countries';
import { ERA_MODIFIERS, applyEraModifier } from '../data/historicalEras';

const FIRST_NAMES_BY_COUNTRY_SEX: Record<string, { male: string[]; female: string[] }> = {
  IND: {
    male: ['Aarav', 'Vihaan', 'Mohammed', 'Aditya', 'Sai', 'Reyansh', 'Arjun', 'Kabir', 'Rohan'],
    female: ['Aanya', 'Diya', 'Fatima', 'Pari', 'Ananya', 'Isha', 'Meera', 'Kavya', 'Pooja']
  },
  CHN: {
    male: ['Wei', 'Hao', 'Yuxuan', 'Zichen', 'Haoran', 'Jun', 'Lei', 'Bowen'],
    female: ['Yinuo', 'Xinyi', 'Yihan', 'Jiayi', 'Mei', 'Yuting', 'Xiaoyan', 'Ting']
  },
  NGA: {
    male: ['Chukwuemeka', 'Ibrahim', 'Oluwaseun', 'Babajide', 'Musa', 'Emeka', 'Chinedu', 'Tunde'],
    female: ['Aminat', 'Ngozi', 'Chioma', 'Zainab', 'Adebisi', 'Blessing', 'Fatima', 'Funke']
  },
  USA: {
    male: ['Liam', 'Noah', 'Oliver', 'James', 'Lucas', 'Ethan', 'Mateo', 'Elijah'],
    female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Harper', 'Evelyn']
  },
  COD: {
    male: ['Dieudonné', 'Kasongo', 'Ilunga', 'Mukendi', 'Jean-Luc', 'Gloire', 'Ezekiel'],
    female: ['Dorcas', 'Merveille', 'Bibiche', 'Ruth', 'Grâce', 'Esperance', 'Naomie']
  },
  IDN: {
    male: ['Bambang', 'Agus', 'Budi', 'Rizky', 'Muhammad', 'Dian', 'Surya', 'Fajar'],
    female: ['Siti', 'Dewi', 'Putri', 'Nur', 'Ayu', 'Indah', 'Lestari', 'Tri']
  },
  PAK: {
    male: ['Muhammad', 'Ahmed', 'Bilal', 'Ali', 'Hamza', 'Usman', 'Zayn', 'Hassan'],
    female: ['Fatima', 'Ayesha', 'Zainab', 'Maryam', 'Noor', 'Hafsa', 'Sara', 'Khadija']
  },
  BRA: {
    male: ['Gabriel', 'Lucas', 'Matheus', 'Arthur', 'Bernardo', 'Heitor', 'Pedro', 'Davi'],
    female: ['Helena', 'Alice', 'Laura', 'Manuela', 'Sophia', 'Isabella', 'Julia', 'Lorena']
  },
  BGD: {
    male: ['Tanvir', 'Hasan', 'Rakib', 'Al-Amin', 'Arif', 'Shakib', 'Mahmud'],
    female: ['Sadia', 'Fatema', 'Nusrat', 'Mim', 'Amina', 'Tanjina', 'Ritu']
  },
  ETH: {
    male: ['Abebe', 'Dawit', 'Yohannes', 'Bekele', 'Tadesse', 'Kaleb', 'Tariku'],
    female: ['Almaz', 'Tigist', 'Genet', 'Marta', 'Hanna', 'Hiwot', 'Meseret']
  },
  JPN: {
    male: ['Haruto', 'Sota', 'Riku', 'Minato', 'Yuto', 'Ren', 'Hinata', 'Kaito'],
    female: ['Yui', 'Himari', 'Hina', 'Rin', 'Aoi', 'Mei', 'Sakura', 'Akari']
  },
  DEU: {
    male: ['Noah', 'Matteo', 'Leon', 'Paul', 'Finn', 'Elias', 'Lukas', 'Felix'],
    female: ['Emilia', 'Mia', 'Sophia', 'Emma', 'Hannah', 'Lina', 'Ella', 'Mila']
  },
  EGY: {
    male: ['Mohamed', 'Ahmed', 'Youssef', 'Mahmoud', 'Omar', 'Karim', 'Mostafa'],
    female: ['Maryam', 'Nour', 'Fatma', 'Salma', 'Jana', 'Farida', 'Haya', 'Mariam']
  },
  GBR: {
    male: ['George', 'Harry', 'Arthur', 'Noah', 'Leo', 'Oscar', 'Muhammad', 'Jack'],
    female: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Freya', 'Florence', 'Lily', 'Ivy']
  },
  MEX: {
    male: ['Santiago', 'Mateo', 'Sebastian', 'Leonardo', 'Emiliano', 'Diego', 'Alejandro'],
    female: ['Sofia', 'Valentina', 'Regina', 'Camila', 'Maria Jose', 'Ximena', 'Victoria']
  },
  ZAF: {
    male: ['Lethabo', 'Melokuhle', 'Junior', 'Lubanzi', 'Sipho', 'Bandile', 'Thabo'],
    female: ['Amahle', 'Lesedi', 'Minenhle', 'Naledi', 'Zanokuhle', 'Nomvula', 'Bontle']
  },
  AFG: {
    male: ['Ahmad', 'Mohammad', 'Farhad', 'Ali', 'Bilal', 'Rashid', 'Qais'],
    female: ['Mariam', 'Zahra', 'Fatima', 'Roya', 'Samira', 'Soraya', 'Nadia']
  },
  NOR: {
    male: ['Jakob', 'Lucas', 'Emil', 'Oskar', 'Oliver', 'Filip', 'Noah', 'Magnus'],
    female: ['Nora', 'Emma', 'Sofie', 'Olivia', 'Ella', 'Maja', 'Hedda', 'Ingrid']
  },
  PHL: {
    male: ['Joshua', 'Angelo', 'John Mark', 'Gabriel', 'Daniel', 'Christian', 'Ethan'],
    female: ['Angel', 'Althea', 'Princess', 'Samantha', 'Nicole', 'Jasmine', 'Cheska']
  },
  COL: {
    male: ['Santiago', 'Juan Jose', 'Samuel', 'Jerónimo', 'Emiliano', 'Maximiliano'],
    female: ['Luciana', 'Isabella', 'Salome', 'Antonella', 'Mariana', 'Gabriela']
  },
  VNM: {
    male: ['Minh', 'Duc', 'Long', 'Hung', 'Tuan', 'Nam', 'Quang', 'Hieu', 'Duy', 'Bao'],
    female: ['Linh', 'Trang', 'Mai', 'Huong', 'Anh', 'Ngoc', 'Ha', 'Chau', 'Vy', 'Phuong']
  }
};

export interface BirthplaceSelection {
  country: CountryData;
  sex: Sex;
  name: string;
  isUrban: boolean;
  birthYear: number;
}

/**
 * Samples birthplace weighted by births or population
 */
export function sampleBirthplace(
  prng: PRNG,
  weighting: BirthWeighting = 'births',
  era: WorldEra = 'today',
  countries: CountryData[] = COUNTRIES,
  targetCountryCode?: string
): BirthplaceSelection {
  // Determine effective era
  let effectiveEra = era;
  if (era === 'any') {
    const candidateEras: Exclude<WorldEra, 'any'>[] = ['past_1970', 'past_1990', 'today', 'future_2050'];
    effectiveEra = prng.choice(candidateEras);
  }

  let baseCountry: CountryData;
  if (targetCountryCode) {
    const matched = countries.find((c) => c.code === targetCountryCode);
    if (matched) {
      baseCountry = matched;
    } else {
      const weightedList = countries.map((c) => ({
        item: c,
        weight: weighting === 'births' ? c.annualBirths : c.population
      }));
      baseCountry = prng.weightedChoice(weightedList);
    }
  } else {
    // Weight countries
    const weightedList = countries.map((c) => ({
      item: c,
      weight: weighting === 'births' ? c.annualBirths : c.population
    }));
    baseCountry = prng.weightedChoice(weightedList);
  }

  const adjustedCountry = applyEraModifier(baseCountry, effectiveEra);

  // Sex ratio: ~105 males per 100 females natural ratio (51.2% male)
  const sex: Sex = prng.bool(0.512) ? 'male' : 'female';

  // Urban vs Rural based on country urbanization rate
  const isUrban = prng.bool(adjustedCountry.urbanPopulationRate / 100);

  // Cultural name
  const namePool = FIRST_NAMES_BY_COUNTRY_SEX[adjustedCountry.code]?.[sex] || ['Child', 'Alex', 'Noor', 'Sam'];
  const name = prng.choice(namePool);

  const birthYear = effectiveEra !== 'any' ? ERA_MODIFIERS[effectiveEra].baseYear : 2024;

  return {
    country: adjustedCountry,
    sex,
    name,
    isUrban,
    birthYear
  };
}

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRY_LOOKUP.get(code);
}
