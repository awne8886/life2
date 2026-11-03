import { describe, it, expect } from 'vitest';
import { PRNG } from '../src/engine/prng';
import { sampleIncome, normalCdf, normalInvCdf } from '../src/engine/income';
import { getCountryByCode } from '../src/engine/birthplace';

describe('Income Distribution Engine', () => {
  it('should accurately approximate normal CDF and inverse CDF', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 4);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 2);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 2);

    expect(normalInvCdf(0.5)).toBeCloseTo(0, 3);
    expect(normalInvCdf(0.975)).toBeCloseTo(1.96, 2);
    expect(normalInvCdf(0.025)).toBeCloseTo(-1.96, 2);
  });

  it('should draw valid positive income and classify tier correctly', () => {
    const usa = getCountryByCode('USA')!;
    const prng = new PRNG(101);

    const draw = sampleIncome(usa, prng);

    expect(draw.wealthPpp).toBeGreaterThan(0);
    expect(draw.percentileInCountry).toBeGreaterThanOrEqual(1);
    expect(draw.percentileInCountry).toBeLessThanOrEqual(99);
    expect(['poor', 'middle', 'rich']).toContain(draw.incomeTier);
  });

  it('should reflect national income disparity (USA vs DRC)', () => {
    const usa = getCountryByCode('USA')!;
    const cod = getCountryByCode('COD')!;
    const prng = new PRNG(202);

    const usaIncomes: number[] = [];
    const codIncomes: number[] = [];

    for (let i = 0; i < 50; i++) {
      usaIncomes.push(sampleIncome(usa, prng).wealthPpp);
      codIncomes.push(sampleIncome(cod, prng).wealthPpp);
    }

    const avgUsa = usaIncomes.reduce((a, b) => a + b, 0) / usaIncomes.length;
    const avgCod = codIncomes.reduce((a, b) => a + b, 0) / codIncomes.length;

    // USA median household income in PPP is drastically higher than DR Congo
    expect(avgUsa).toBeGreaterThan(avgCod * 10);
  });

  it('should reflect higher inequality in high Gini countries', () => {
    const zaf = getCountryByCode('ZAF')!; // South Africa has Gini ~63
    const nor = getCountryByCode('NOR')!; // Norway has Gini ~27.7
    const prng = new PRNG(303);

    const zafDraws: number[] = [];
    const norDraws: number[] = [];

    for (let i = 0; i < 100; i++) {
      zafDraws.push(sampleIncome(zaf, prng).wealthPpp);
      norDraws.push(sampleIncome(nor, prng).wealthPpp);
    }

    const maxMinRatioZaf = Math.max(...zafDraws) / Math.min(...zafDraws);
    const maxMinRatioNor = Math.max(...norDraws) / Math.min(...norDraws);

    // High Gini implies significantly greater spread between top and bottom
    expect(maxMinRatioZaf).toBeGreaterThan(maxMinRatioNor);
  });
});
