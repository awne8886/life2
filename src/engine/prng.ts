/**
 * Seedable pseudo-random number generator using Mulberry32.
 * Pure and deterministic across all environments.
 */
export class PRNG {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed >>> 0;
    if (this.state === 0) this.state = 0x6d2b79f5;
  }

  /**
   * Generates a floating point number in [0, 1)
   */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates an integer in [min, max] inclusive
   */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a floating point number in [min, max)
   */
  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Boolean with probability p
   */
  bool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Pick random element from non-empty array
   */
  choice<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    return items[Math.floor(this.next() * items.length)];
  }

  /**
   * Weighted random selection from an array of items with positive weights
   */
  weightedChoice<T>(items: { item: T; weight: number }[]): T {
    const totalWeight = items.reduce((sum, el) => sum + Math.max(0, el.weight), 0);
    if (totalWeight <= 0) {
      return items[0].item;
    }
    let threshold = this.next() * totalWeight;
    for (const el of items) {
      const w = Math.max(0, el.weight);
      if (threshold < w) {
        return el.item;
      }
      threshold -= w;
    }
    return items[items.length - 1].item;
  }

  /**
   * Standard Gaussian random variable using Box-Muller transform
   */
  gaussian(mean: number = 0, stdDev: number = 1): number {
    let u1 = this.next();
    let u2 = this.next();
    while (u1 <= 1e-12) u1 = this.next(); // avoid log(0)
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}
