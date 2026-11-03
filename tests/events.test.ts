import { describe, it, expect } from 'vitest';
import { GAME_EVENTS, getEligibleEvents } from '../src/engine/events';
import { createInitialSimulationState } from '../src/engine/simulation';

describe('Event Engine & Heavy Themes Filter', () => {
  it('should have 60+ sample events across all stages', () => {
    expect(GAME_EVENTS.length).toBeGreaterThanOrEqual(60);
  });

  it('should filter events strictly within player age range', () => {
    const state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: false
    });

    state.age = 8;
    const eligibleAt8 = getEligibleEvents(state);

    for (const e of eligibleAt8) {
      expect(e.minAge).toBeLessThanOrEqual(8);
      expect(e.maxAge).toBeGreaterThanOrEqual(8);
    }
  });

  it('should suppress heavy theme events when leaveOutFrighteningScenes is true', () => {
    const state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: true,
      classroomMode: false,
      calmMusic: false,
      autoMode: false
    });

    state.age = 15;
    const events = getEligibleEvents(state);

    for (const e of events) {
      expect(e.isHeavyTheme).toBeFalsy();
    }
  });

  it('should suppress heavy theme events in classroom mode', () => {
    const state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: false,
      classroomMode: true,
      calmMusic: false,
      autoMode: false
    });

    state.age = 15;
    const events = getEligibleEvents(state);

    for (const e of events) {
      expect(e.isHeavyTheme).toBeFalsy();
    }
  });
});
