import React from 'react';
import { LifeRecordEntry } from '../engine/types';
import { ShieldAlert, LifeBuoy, ArrowUpRight } from 'lucide-react';
import { getCrisisResources } from '../data/crisisResources';

interface LifeRecordProps {
  entries: LifeRecordEntry[];
  countryCode: string;
  onOpenCrisisHelp?: () => void;
}

export const LifeRecord: React.FC<LifeRecordProps> = ({
  entries,
  countryCode,
  onOpenCrisisHelp
}) => {
  const crisisGuide = getCrisisResources(countryCode);

  return (
    <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-parchment-200">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
          Life Record
        </h3>
        <span className="text-xs text-ink-light font-mono">
          {entries.length} {entries.length === 1 ? 'Year' : 'Years'} Lived
        </span>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
        {entries.slice().reverse().map((entry, idx) => {
          const isDeath = entry.category === 'death';
          const isBirth = entry.category === 'birth';

          return (
            <article
              key={`${entry.year}-${entry.age}-${idx}`}
              className={`p-4 rounded-xl border transition-all text-left ${
                isDeath
                  ? 'border-rust bg-rust/5 ring-1 ring-rust/30'
                  : isBirth
                  ? 'border-sage-500/40 bg-sage-50/50'
                  : 'border-parchment-200 bg-parchment-100/60 hover:bg-parchment-100'
              }`}
            >
              {/* Header: Age & Year */}
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className={`font-semibold ${isDeath ? 'text-rust' : 'text-ink'}`}>
                  Age {entry.age} ({entry.year})
                </span>
                <span className="text-[11px] uppercase tracking-wider text-ink-light/75">
                  {entry.category}
                </span>
              </div>

              {/* Headline */}
              <h4 className="font-serif font-semibold text-base text-ink mb-1">
                {entry.headline}
              </h4>

              {/* Body Text */}
              <p className="text-sm text-ink-light leading-relaxed">
                {entry.detail}
              </p>

              {/* Stat Deltas if present */}
              {entry.statDeltas && (
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-mono">
                  {Object.entries(entry.statDeltas).map(([k, v]) => {
                    if (!v) return null;
                    const isPositive = v > 0;
                    return (
                      <span
                        key={k}
                        className={`px-1.5 py-0.5 rounded ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isPositive ? `+${v}` : v} {k}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Heavy theme crisis help link */}
              {entry.isHeavyTheme && (
                <div className="mt-3 pt-2.5 border-t border-parchment-300/60 flex items-center justify-between text-xs text-rust">
                  <div className="flex items-center gap-1.5 font-medium">
                    <LifeBuoy className="w-3.5 h-3.5" />
                    <span>Free crisis support available: {crisisGuide.generalMentalHealth.name}</span>
                  </div>
                  {onOpenCrisisHelp ? (
                    <button
                      onClick={onOpenCrisisHelp}
                      className="text-xs underline hover:text-rust-dark font-medium flex items-center gap-0.5"
                    >
                      Resources <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <a
                      href={crisisGuide.generalMentalHealth.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline hover:text-rust-dark font-medium flex items-center gap-0.5"
                    >
                      Helpline <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
