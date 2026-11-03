import React, { useState } from 'react';
import { PauseCircle, ArrowRight } from 'lucide-react';

interface MilestoneModalProps {
  age: number;
  question: string;
  countryName: string;
  onContinue: (userAnswer?: string) => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  age,
  question,
  countryName,
  onContinue
}) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(answer.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-deep/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-parchment-50 border border-parchment-300 rounded-3xl max-w-xl w-full p-6 sm:p-9 shadow-2xl animate-fade-in text-left">
        {/* Header badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-rust mb-3">
          <PauseCircle className="w-4 h-4 text-rust animate-pulse" />
          <span className="uppercase tracking-widest font-semibold">
            Milestone Pause • Age {age}
          </span>
        </div>

        {/* Milestone Headline */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4 leading-tight">
          A moment of perspective
        </h3>

        {/* Context intro */}
        <p className="text-xs text-ink-light mb-4">
          Time has frozen. Compare this person's trajectory in {countryName} with your own life journey:
        </p>

        {/* Reflective Question */}
        <div className="bg-parchment-200/70 border border-parchment-300 rounded-2xl p-5 mb-5">
          <p className="font-serif italic text-base sm:text-lg text-ink leading-relaxed">
            “{question}”
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-light mb-1.5">
              Your reflection (Optional — saved into your life record summary):
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write a few words linking their reality to your own..."
              rows={3}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl p-3 text-sm text-ink placeholder:text-ink-light/50 focus:outline-none focus:ring-2 focus:ring-rust"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-rust hover:bg-rust-dark text-parchment-50 font-serif text-base font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Reflect & Continue Life</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
