import React from 'react';
import { GameEvent, DecisionOption } from '../engine/types';
import { HelpCircle, AlertCircle } from 'lucide-react';

interface DecisionModalProps {
  event: GameEvent;
  age: number;
  year: number;
  onChoose: (optionId: string) => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  event,
  age,
  year,
  onChoose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-ink-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-left">
        {/* Category & Age */}
        <div className="flex items-center justify-between text-xs font-mono text-rust mb-2">
          <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Decision Checkpoint
          </span>
          <span>Age {age} • Year {year}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl font-bold text-ink mb-3">
          {event.title}
        </h3>

        {/* Options */}
        <div className="space-y-3 mt-5">
          {event.options?.map((opt: DecisionOption) => (
            <button
              key={opt.id}
              onClick={() => onChoose(opt.id)}
              className="w-full text-left p-4 rounded-xl border border-parchment-300 bg-parchment-100 hover:bg-parchment-200/90 hover:border-rust/60 transition-all group focus:outline-none focus:ring-2 focus:ring-rust"
            >
              <div className="font-semibold text-sm text-ink group-hover:text-rust transition-colors mb-1">
                {opt.label}
              </div>
              <p className="text-xs text-ink-light mb-2 leading-relaxed">
                {opt.description}
              </p>

              {/* Trade-off summary */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-ink-light/80">
                {opt.statEffects && Object.entries(opt.statEffects).map(([k, v]) => {
                  if (!v) return null;
                  const isPos = v > 0;
                  return (
                    <span
                      key={k}
                      className={`px-1.5 py-0.5 rounded ${
                        isPos ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isPos ? `+${v}` : v} {k}
                    </span>
                  );
                })}
                {opt.wealthMultiplier && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    {opt.wealthMultiplier > 1 ? `+${Math.round((opt.wealthMultiplier - 1) * 100)}%` : `-${Math.round((1 - opt.wealthMultiplier) * 100)}%`} wealth
                  </span>
                )}
                {opt.riskProbability && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {Math.round(opt.riskProbability * 100)}% complication risk
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
