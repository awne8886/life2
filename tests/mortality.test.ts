import { describe, it, expect } from 'vitest';
import { PRNG } from '../src/engine/prng';
import {
  getAnnualMortalityRate,
  calculateEffectiveHazard,
  sampleCauseOfDeath,
  evaluateYearlyMortality
} from '../src/engine/mortality';
import { getCountryByCode } from '../src/engine/birthplace';

describe('Life Table Mortality Engine', () => {
  it('should match country infant mortality at age 0', () => {
    const nga = getCountryByCode('NGA')!; // ~71 per 1000
    const jpn = getCountryByCode('JPN')!; // ~1.8 per 1000

    const rateNga = getAnnualMortalityRate(nga, 'male', 0);
    const rateJpn = getAnnualMortalityRate(jpn, 'male', 0);

    expect(rateNga).toBeCloseTo(nga.infantMortality / 1000, 3);
    expect(rateJpn).toBeCloseTo(jpn.infantMortality / 1000, 3);
    expect(rateNga).toBeGreaterThan(rateJpn * 25);
  });

  it('should exhibit Gompertz acceleration in late adulthood', () => {
    const deu = getCountryByCode('DEU')!;

    const rateAt10 = getAnnualMortalityRate(deu, 'male', 10);
    const rateAt30 = getAnnualMortalityRate(deu, 'male', 30);
    const rateAt60 = getAnnualMortalityRate(deu, 'male', 60);
    const rateAt80 = getAnnualMortalityRate(deu, 'male', 80);

    // Mortality is lowest around childhood/early youth, then rises steeply in older age
    expect(rateAt10).toBeLessThan(rateAt30);
    expect(rateAt30).toBeLessThan(rateAt60);
    expect(rateAt60).toBeLessThan(rateAt80);
    expect(rateAt80).toBeGreaterThan(0.04);
  });

  it('should scale mortality hazard based on health stat within realistic bounds', () => {
    const base = 0.01;

    const healthyHazard = calculateEffectiveHazard(base, 95);
    const nominalHazard = calculateEffectiveHazard(base, 80);
    const sickHazard = calculateEffectiveHazard(base, 20);

    expect(healthyHazard).toBeLessThan(nominalHazard);
    expect(sickHazard).toBeGreaterThan(nominalHazard * 2);
    // Never exceeds 0.85 cap
    expect(calculateEffectiveHazard(base, 0)).toBeLessThanOrEqual(0.85);
  });

  it('should assign authentic cause of death matching age and region', () => {
    const cod = getCountryByCode('COD')!;
    const prng = new PRNG(555);

    // Infant cause
    const infantCause = sampleCauseOfDeath(cod, 'male', 0, prng);
    expect(['neonatal', 'congenital', 'infectious', 'preterm']).toContain(infantCause.category);

    // Elderly cause
    const elderCause = sampleCauseOfDeath(cod, 'male', 75, prng);
    expect(['cardiovascular', 'cancer', 'neurological', 'respiratory', 'endocrine', 'organ_failure']).toContain(elderCause.category);
  });
});
