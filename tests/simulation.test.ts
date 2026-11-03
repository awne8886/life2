import { describe, it, expect } from 'vitest';
import {
  createInitialSimulationState,
  advanceSimulationYear,
  recordMilestoneAnswer,
  finalizeLifeHistory
} from '../src/engine/simulation';

describe('Deterministic Simulation Engine', () => {
  it('should initialize a valid life state with 4 same-second peers', () => {
    const state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: false,
      customSeed: 123456
    });

    expect(state.age).toBe(0);
    expect(state.country).toBeDefined();
    expect(state.peers.length).toBe(4);
    expect(state.history.length).toBeGreaterThanOrEqual(1);
    expect(state.history[0].category).toMatch(/birth|death/);
  });

  it('should deterministically reproduce state across identical runs with same seed', () => {
    const config = {
      worldEra: 'today' as const,
      birthWeighting: 'births' as const,
      lifeSpeed: 'normal' as const,
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: true,
      customSeed: 888123
    };

    const state1 = createInitialSimulationState(config);
    const state2 = createInitialSimulationState(config);

    expect(state1.country.code).toBe(state2.country.code);
    expect(state1.name).toBe(state2.name);
    expect(state1.sex).toBe(state2.sex);
    expect(state1.hidden.wealthPpp).toBe(state2.hidden.wealthPpp);
  });

  it('should advance years and trigger milestone pauses at milestone ages', () => {
    let state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'population',
      lifeSpeed: 'fast',
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: true,
      customSeed: 999456
    });

    // Advance to age 5
    for (let i = 0; i < 5; i++) {
      if (state.isAlive) {
        state = advanceSimulationYear(state, 'health');
      }
    }

    if (state.isAlive) {
      expect(state.age).toBe(5);
      // At age 5, a milestone prompt should be triggered
      expect(state.pendingMilestone?.age).toBe(5);

      // Record answer
      state = recordMilestoneAnswer(state, 5, state.pendingMilestone!.question, 'I remember feeling secure at home.');
      expect(state.milestoneAnswers.length).toBe(1);
      expect(state.pendingMilestone).toBeUndefined();
    }
  });

  it('should update 4 same-second peers as years progress', () => {
    let state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: true,
      customSeed: 777222
    });

    if (state.isAlive) {
      state = advanceSimulationYear(state, 'income');
      expect(state.peers.length).toBe(4);
      for (const peer of state.peers) {
        expect(peer.name).toBeDefined();
        expect(peer.countryName).toBeDefined();
        expect(peer.currentMilestone).toBeDefined();
      }
    }
  });

  it('should finalize life history with valid stats and exportable record', () => {
    const state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: true,
      customSeed: 123
    });

    const finalHistory = finalizeLifeHistory(state, 'Rest in gentle peace.');
    expect(finalHistory.id).toBeDefined();
    expect(finalHistory.countryCode).toBe(state.country.code);
    expect(finalHistory.partingWords).toBe('Rest in gentle peace.');
    expect(finalHistory.entries.length).toBeGreaterThanOrEqual(1);
  });

  it('should guarantee targetCountryCode in initial simulation state', () => {
    const state = createInitialSimulationState({
      worldEra: 'today',
      birthWeighting: 'births',
      targetCountryCode: 'VNM',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: false,
      classroomMode: false,
      calmMusic: false,
      autoMode: false
    });

    expect(state.country.code).toBe('VNM');
    expect(state.country.name).toBe('Vietnam');
  });
});
