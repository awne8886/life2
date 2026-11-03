import { PeerBaby, CountryData, Sex } from './types';
import { PRNG } from './prng';
import { sampleBirthplace } from './birthplace';
import { evaluateYearlyMortality } from './mortality';

export function initializeSameSecondPeers(prng: PRNG, playerCountryCode: string): PeerBaby[] {
  const peers: PeerBaby[] = [];
  const candidateCountries = ['NGA', 'IND', 'CHN', 'USA', 'BRA', 'COD', 'DEU', 'JPN', 'ETH', 'AFG', 'NOR'];

  let attempts = 0;
  while (peers.length < 4 && attempts < 30) {
    attempts++;
    const birth = sampleBirthplace(prng, 'births', 'today');
    // Ensure distinct countries and distinct from player if possible
    if (birth.country.code !== playerCountryCode && !peers.some((p) => p.countryCode === birth.country.code)) {
      peers.push({
        id: `peer_${peers.length + 1}_${birth.country.code}`,
        name: birth.name,
        countryCode: birth.country.code,
        countryName: birth.country.name,
        flag: birth.country.flag,
        sex: birth.sex,
        isAlive: true,
        currentMilestone: `Born in ${birth.country.name} at the exact same second.`
      });
    }
  }

  // Fallback if needed
  while (peers.length < 4) {
    const birth = sampleBirthplace(prng, 'births', 'today');
    peers.push({
      id: `peer_${peers.length + 1}_${birth.country.code}`,
      name: birth.name,
      countryCode: birth.country.code,
      countryName: birth.country.name,
      flag: birth.country.flag,
      sex: birth.sex,
      isAlive: true,
      currentMilestone: `Born in ${birth.country.name} at the exact same second.`
    });
  }

  return peers;
}

export function updatePeersForYear(
  peers: PeerBaby[],
  age: number,
  countriesByCode: (code: string) => CountryData | undefined,
  prng: PRNG
): PeerBaby[] {
  return peers.map((peer) => {
    if (!peer.isAlive) {
      return peer;
    }

    const country = countriesByCode(peer.countryCode);
    if (!country) return peer;

    // Check mortality for peer
    const dummyStats = { health: 75, happiness: 70, knowledge: 50, relationships: 70 };
    const dummyHabits = { smoking: false, heavyAlcohol: false, regularExercise: true };
    const mort = evaluateYearlyMortality(country, peer.sex, age, dummyStats, dummyHabits, prng);

    if (mort.died) {
      return {
        ...peer,
        isAlive: false,
        deathAge: age,
        deathCause: mort.cause,
        currentMilestone: `Passed away at age ${age} (${mort.cause?.toLowerCase() || 'illness'}).`
      };
    }

    // Milestones at key ages
    let milestoneText = peer.currentMilestone;
    if (age === 1) {
      milestoneText = `Survived infancy; learned to walk in ${country.name}.`;
    } else if (age === 6) {
      milestoneText = country.meanYearsSchooling > 8
        ? `Began primary school classes in ${country.name}.`
        : `Helping family with household duties and livestock.`;
    } else if (age === 12) {
      milestoneText = `Entered secondary education; studying local curriculum.`;
    } else if (age === 16) {
      milestoneText = country.tertiaryEnrollmentRate > 50
        ? `Preparing for competitive college entrance examinations.`
        : `Working informal trade jobs to support family income.`;
    } else if (age === 23) {
      milestoneText = `Started first full-time livelihood in ${country.name}.`;
    } else if (age === 30) {
      milestoneText = `Now married with young children, managing daily household budget.`;
    } else if (age === 45) {
      milestoneText = `Mid-career in ${country.name}; supporting aging relatives.`;
    } else if (age === 60) {
      milestoneText = `Welcomed grandchildren into the family home.`;
    } else if (age === 75) {
      milestoneText = `Living peacefully as a respected community elder.`;
    }

    return {
      ...peer,
      currentMilestone: milestoneText
    };
  });
}
