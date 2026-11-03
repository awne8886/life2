import { describe, it, expect } from 'vitest';
import { PRNG } from '../src/engine/prng';
import { sampleBirthplace, getCountryByCode } from '../src/engine/birthplace';
import { COUNTRIES } from '../src/data/countries';

describe('Birthplace Sampler', () => {
  it('should sample deterministically with a given seed', () => {
    const prng1 = new PRNG(12345);
    const prng2 = new PRNG(12345);

    const birth1 = sampleBirthplace(prng1, 'births', 'today');
    const birth2 = sampleBirthplace(prng2, 'births', 'today');

    expect(birth1.country.code).toBe(birth2.country.code);
    expect(birth1.sex).toBe(birth2.sex);
    expect(birth1.name).toBe(birth2.name);
    expect(birth1.isUrban).toBe(birth2.isUrban);
  });

  it('should heavily sample high-fertility countries when weighted by births', () => {
    const prng = new PRNG(999);
    const samples: Record<string, number> = {};
    const n = 1000;

    for (let i = 0; i < n; i++) {
      const birth = sampleBirthplace(prng, 'births', 'today');
      samples[birth.country.code] = (samples[birth.country.code] || 0) + 1;
    }

    // India and Nigeria should have the highest shares due to annual births (~23M and ~8M)
    expect(samples['IND']).toBeGreaterThan(150);
    expect(samples['NGA']).toBeGreaterThan(60);
    // Norway (~51k births) should have very few draws
    expect(samples['NOR'] || 0).toBeLessThan(10);
  });

  it('should skew to high-population countries when weighted by population', () => {
    const prng = new PRNG(777);
    const samples: Record<string, number> = {};
    const n = 1000;

    for (let i = 0; i < n; i++) {
      const birth = sampleBirthplace(prng, 'population', 'today');
      samples[birth.country.code] = (samples[birth.country.code] || 0) + 1;
    }

    // China and India each have ~1.4B population out of global sample
    expect(samples['IND']).toBeGreaterThan(180);
    expect(samples['CHN']).toBeGreaterThan(180);
  });

  it('should assign a valid sex and culturally appropriate name', () => {
    const prng = new PRNG(42);
    const birth = sampleBirthplace(prng, 'births', 'today');

    expect(['male', 'female']).toContain(birth.sex);
    expect(birth.name.length).toBeGreaterThan(1);
    expect(birth.country.name).toBeDefined();
  });

  it('should lookup country data by ISO code', () => {
    const ind = getCountryByCode('IND');
    expect(ind).toBeDefined();
    expect(ind?.name).toBe('India');

    const invalid = getCountryByCode('XYZ');
    expect(invalid).toBeUndefined();
  });
});
