import { CountryData, IncomeTier } from './types';
import { PRNG } from './prng';

export interface IncomeDraw {
  wealthPpp: number; // household annual income per capita (PPP intl $)
  wealthUsdEquivalent: number; // equivalent purchasing power
  incomeTier: IncomeTier;
  percentileInCountry: number; // 1 to 99
  monthlyPpp: number;
  dailyPpp: number;
  description: string;
}

/**
 * Standard Normal Cumulative Distribution Function (Phi)
 * Approximation using Abramowitz and Stegun formula 7.1.26
 */
export function normalCdf(x: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return 1.0 - c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * x);
    return c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

/**
 * Inverse Error Function approximation (Winitzki formula)
 */
export function erfInv(x: number): number {
  const a = 0.147;
  const sgn = x < 0 ? -1 : 1;
  const clampedX = Math.max(-0.999999, Math.min(0.999999, x));
  const logTerm = Math.log(1 - clampedX * clampedX);
  const term1 = 2 / (Math.PI * a) + logTerm / 2;
  const innerSqrt = Math.sqrt(term1 * term1 - logTerm / a);
  return sgn * Math.sqrt(Math.max(0, innerSqrt - term1));
}

/**
 * Inverse Normal Cumulative Distribution Function (Probit)
 * z = sqrt(2) * erfInv(2p - 1)
 */
export function normalInvCdf(p: number): number {
  if (p <= 0.00001) return -4.5;
  if (p >= 0.99999) return 4.5;
  const x = 2 * p - 1;
  return Math.SQRT2 * erfInv(x);
}

/**
 * Fits a log-normal distribution from mean GDP/capita (PPP) and Gini,
 * draws a household income per capita, and classifies relative tier.
 */
export function sampleIncome(country: CountryData, prng: PRNG): IncomeDraw {
  const giniFraction = Math.min(0.70, Math.max(0.20, country.gini / 100));

  // Gini = 2 * Phi(sigma / sqrt(2)) - 1 => sigma = sqrt(2) * invPhi((Gini + 1) / 2)
  const pGini = (giniFraction + 1.0) / 2.0;
  const sigma = Math.SQRT2 * normalInvCdf(pGini);

  // Mean of lognormal = exp(mu + sigma^2 / 2) = GDP/capita
  // Note: Household disposable income is roughly 65-75% of national GDP per capita
  const householdMean = country.gdpPerCapitaPPP * 0.70;
  const mu = Math.log(householdMean) - (sigma * sigma) / 2.0;

  // Sample standard normal Z
  const z = prng.gaussian(0, 1);
  // Clamp extreme statistical tails beyond 3.2 standard deviations
  const clampedZ = Math.max(-3.2, Math.min(3.2, z));

  const wealthPpp = Math.max(150, Math.round(Math.exp(mu + sigma * clampedZ)));
  const percentile = Math.max(1, Math.min(99, Math.round(normalCdf(clampedZ) * 100)));

  let incomeTier: IncomeTier;
  let description: string;

  if (percentile <= 35) {
    incomeTier = 'poor';
    description = `Lower income relative to ${country.name} (bottom ${percentile}%)`;
  } else if (percentile <= 80) {
    incomeTier = 'middle';
    description = `Middle income relative to ${country.name} (${percentile}th percentile)`;
  } else {
    incomeTier = 'rich';
    description = `Upper income relative to ${country.name} (top ${100 - percentile}%)`;
  }

  // Monthly and daily income
  const monthlyPpp = Math.round(wealthPpp / 12);
  const dailyPpp = Math.round((wealthPpp / 365) * 10) / 10;

  // US price equivalent: PPP dollars already represent US price equivalent purchasing power
  const wealthUsdEquivalent = wealthPpp;

  return {
    wealthPpp,
    wealthUsdEquivalent,
    incomeTier,
    percentileInCountry: percentile,
    monthlyPpp,
    dailyPpp,
    description
  };
}
