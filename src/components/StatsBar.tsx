import React from 'react';
import { Heart, Smile, BookOpen, Users, DollarSign, Briefcase } from 'lucide-react';
import { PlayerStats, HiddenAttributes } from '../engine/types';

interface StatsBarProps {
  stats: PlayerStats;
  hidden: HiddenAttributes;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, hidden }) => {
  const statConfig = [
    {
      label: 'Health',
      value: stats.health,
      icon: Heart,
      color: 'bg-emerald-600',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-900',
      desc: 'Vitality & disease resilience'
    },
    {
      label: 'Happiness',
      value: stats.happiness,
      icon: Smile,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-900',
      desc: 'Emotional wellbeing & peace'
    },
    {
      label: 'Knowledge',
      value: stats.knowledge,
      icon: BookOpen,
      color: 'bg-sky-600',
      bgColor: 'bg-sky-100',
      textColor: 'text-sky-900',
      desc: 'Schooling, literacy & skills'
    },
    {
      label: 'Relationships',
      value: stats.relationships,
      icon: Users,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-100',
      textColor: 'text-rose-900',
      desc: 'Kinship, love & community'
    }
  ];

  return (
    <div className="bg-parchment-50 border border-parchment-300 rounded-xl p-4 shadow-xs">
      {/* 4 Core Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statConfig.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-parchment-100 border border-parchment-200/80 rounded-lg p-2.5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-rust" />
                  {s.label}
                </span>
                <span className="font-mono font-bold text-ink">{s.value}</span>
              </div>
              <div className="w-full bg-parchment-300 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${s.color}`}
                  style={{ width: `${Math.max(3, Math.min(100, s.value))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Socioeconomic Context */}
      <div className="mt-3 pt-3 border-t border-parchment-200 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-light">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-rust" />
          <span>Occupation:</span>
          <span className="font-medium text-ink">{hidden.occupation}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-rust" />
          <span>Income:</span>
          <span className="font-medium text-ink">
            {hidden.wealthPpp.toLocaleString()} PPP $ ({hidden.incomeTier.toUpperCase()} tier)
          </span>
        </div>

        <div className="text-[11px] text-ink-light/80">
          Environment: {hidden.isUrban ? 'Urban Metro' : 'Rural Village'}
        </div>
      </div>
    </div>
  );
};
