import React, { useState, useEffect, useRef } from 'react';
import {
  SimulationState,
  YearlyFocus,
  SimulationConfig
} from '../engine/types';
import { advanceSimulationYear, recordMilestoneAnswer, finalizeLifeHistory } from '../engine/simulation';
import { saveActiveSimulation, clearActiveSimulation } from '../utils/storage';
import { StatsBar } from './StatsBar';
import { LifeRecord } from './LifeRecord';
import { PeersPanel } from './PeersPanel';
import { DecisionModal } from './DecisionModal';
import { MilestoneModal } from './MilestoneModal';
import { EndOfLifeView } from './EndOfLifeView';
import { ambientSound } from '../engine/audio';
import {
  Play,
  Pause,
  FastForward,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface GameViewProps {
  initialState: SimulationState;
  onFinishLife: (finalHistory: ReturnType<typeof finalizeLifeHistory>) => void;
  onRestartNewLife: () => void;
  onOpenCrisisHelp?: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  initialState,
  onFinishLife,
  onRestartNewLife,
  onOpenCrisisHelp
}) => {
  const [state, setState] = useState<SimulationState>(initialState);
  const [selectedFocus, setSelectedFocus] = useState<YearlyFocus>('health');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(!initialState.config.calmMusic);
  const autoStepTimer = useRef<number | null>(null);

  // Sync audio with state setting
  useEffect(() => {
    if (initialState.config.calmMusic && !isAudioMuted) {
      ambientSound.start();
    }
    return () => {
      ambientSound.stop();
    };
  }, []);

  const toggleAudio = () => {
    if (isAudioMuted) {
      ambientSound.start();
      setIsAudioMuted(false);
    } else {
      ambientSound.stop();
      setIsAudioMuted(true);
    }
  };

  // Determine interval duration from lifeSpeed:
  // fast: 1200ms per year (~30 min full life)
  // normal: 2500ms per year (~1 hour full life)
  // slow: 4500ms per year (~1.5 hours full life)
  const getIntervalMs = () => {
    switch (state.config.lifeSpeed) {
      case 'fast':
        return 1200;
      case 'slow':
        return 4500;
      case 'normal':
      default:
        return 2400;
    }
  };

  // Automatic yearly loop timer
  useEffect(() => {
    if (isPlaying && state.isAlive && !state.pendingDecision && !state.pendingMilestone) {
      autoStepTimer.current = window.setTimeout(() => {
        handleStepYear();
      }, getIntervalMs());
    } else {
      if (autoStepTimer.current) {
        clearTimeout(autoStepTimer.current);
        autoStepTimer.current = null;
      }
    }
    return () => {
      if (autoStepTimer.current) {
        clearTimeout(autoStepTimer.current);
      }
    };
  }, [isPlaying, state]);

  // Save progress in localStorage automatically
  useEffect(() => {
    if (state.isAlive) {
      saveActiveSimulation(state);
    }
  }, [state]);

  const handleStepYear = (chosenOptionId?: string) => {
    if (!state.isAlive) return;

    // Determine focus: in auto mode, intelligently pick lowest stat or rotating focus
    let effectiveFocus = selectedFocus;
    if (state.config.autoMode) {
      if (state.stats.health < 40) effectiveFocus = 'health';
      else if (state.stats.happiness < 40) effectiveFocus = 'relationships';
      else if (state.stats.knowledge < 30) effectiveFocus = 'education';
      else effectiveFocus = 'income';
    }

    const nextState = advanceSimulationYear(state, effectiveFocus, chosenOptionId);
    setState(nextState);

    // If life ended
    if (!nextState.isAlive) {
      setIsPlaying(false);
    }
  };

  const handleDecisionChoice = (optionId: string) => {
    handleStepYear(optionId);
  };

  const handleMilestoneContinue = (answer?: string) => {
    if (!state.pendingMilestone) return;
    const resolved = recordMilestoneAnswer(state, state.pendingMilestone.age, state.pendingMilestone.question, answer);
    setState(resolved);
  };

  const handleFinishAndSave = (partingWords?: string) => {
    const finalized = finalizeLifeHistory(state, partingWords);
    onFinishLife(finalized);
  };

  // If life has concluded and is dead
  if (!state.isAlive) {
    const finalizedPreview = finalizeLifeHistory(state);
    return (
      <EndOfLifeView
        life={finalizedPreview}
        onSaveToMemorial={handleFinishAndSave}
        onRestart={onRestartNewLife}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 animate-fade-in text-left">
      {/* Top Identity & Vital Header */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{state.country.flag}</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {state.name}
            </h1>
            <span className="text-xs font-mono uppercase bg-parchment-200 text-ink-light px-2.5 py-0.5 rounded-full ml-1">
              {state.sex}
            </span>
          </div>
          <p className="text-xs text-ink-light mt-1">
            Born {state.history[0]?.year} in {state.country.name} • Current Year: <span className="font-semibold text-ink">{state.currentYear}</span>
          </p>
        </div>

        {/* Big Age Counter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-ink-light font-medium uppercase tracking-wider">Age</div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-rust">
              {state.age}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core State Progress Bars */}
      <StatsBar stats={state.stats} hidden={state.hidden} />

      {/* Control Console: Yearly Focus & Play/Pause/Speed */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Focus Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-light uppercase tracking-wider mr-1">
            Focus:
          </span>
          {[
            { id: 'health', label: 'Health' },
            { id: 'income', label: 'Income' },
            { id: 'education', label: 'Education' },
            { id: 'relationships', label: 'Relationships' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFocus(f.id as YearlyFocus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFocus === f.id
                  ? 'bg-rust text-parchment-50 shadow-xs'
                  : 'bg-parchment-200 text-ink hover:bg-parchment-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Progression buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            title={isAudioMuted ? 'Unmute ambient music' : 'Mute ambient music'}
            className="p-2.5 rounded-xl border border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-ink-light" /> : <Volume2 className="w-4 h-4 text-sage-700" />}
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-parchment-200 hover:bg-parchment-300 text-ink border border-parchment-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          {/* Manual Step One Year */}
          <button
            onClick={() => handleStepYear()}
            disabled={isPlaying}
            className="px-5 py-2.5 bg-rust hover:bg-rust-dark disabled:opacity-50 text-parchment-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Live Year {state.age + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Layout: Life Record Ledger (Left) + Same-Second Peers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <LifeRecord
            entries={state.history}
            countryCode={state.country.code}
            onOpenCrisisHelp={onOpenCrisisHelp}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <PeersPanel peers={state.peers} playerAge={state.age} />

          {/* Country Overview Card */}
          <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-5 text-xs text-ink-light space-y-2">
            <div className="font-serif font-bold text-ink text-sm flex items-center gap-1.5 border-b border-parchment-200 pb-2">
              <Compass className="w-4 h-4 text-rust" />
              <span>{state.country.name} Indicators</span>
            </div>
            <div className="flex justify-between">
              <span>National Life Expectancy:</span>
              <span className="font-semibold text-ink">{state.country.lifeExpectancyTotal} yrs</span>
            </div>
            <div className="flex justify-between">
              <span>GDP per capita (PPP):</span>
              <span className="font-semibold text-ink">${state.country.gdpPerCapitaPPP.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Infant Mortality Rate:</span>
              <span className="font-semibold text-ink">{state.country.infantMortality} per 1k</span>
            </div>
            <div className="flex justify-between">
              <span>Mean Years of Schooling:</span>
              <span className="font-semibold text-ink">{state.country.meanYearsSchooling} yrs</span>
            </div>
            <div className="flex justify-between">
              <span>Out-of-pocket health spend:</span>
              <span className="font-semibold text-ink">{state.country.outOfPocketHealthSpending}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Checkpoint Modal */}
      {state.pendingDecision && (
        <DecisionModal
          event={state.pendingDecision}
          age={state.age}
          year={state.currentYear}
          onChoose={handleDecisionChoice}
        />
      )}

      {/* Milestone Reflection Modal */}
      {state.pendingMilestone && (
        <MilestoneModal
          age={state.pendingMilestone.age}
          question={state.pendingMilestone.question}
          countryName={state.country.name}
          onContinue={handleMilestoneContinue}
        />
      )}
    </div>
  );
};
