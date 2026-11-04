import React, { useEffect, useState } from 'react';
import { Sparkles, Globe, Heart, Activity, Settings2 } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { t } from '../locales/i18n';

interface LandingHeroProps {
  onStart: () => void;
  onStartWithCountry: (countryCode?: string) => void;
  hasActiveRun: boolean;
  onResume: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStart,
  onStartWithCountry,
  hasActiveRun,
  onResume
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Global rates: ~4.3 births per second, ~1.9 deaths per second (UN WPP)
  const birthsCount = Math.floor(secondsElapsed * 4.3);
  const deathsCount = Math.floor(secondsElapsed * 1.9);

  const chosenCountryObj = COUNTRIES.find((c) => c.code === selectedCountry);

  const handleBeBorn = () => {
    onStartWithCountry(selectedCountry || undefined);
  };

  return (
    <section className="relative pt-12 pb-8 px-4 max-w-4xl mx-auto text-center">
      {/* Editorial badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-parchment-200 border border-parchment-300 text-xs font-medium tracking-wide text-ink-light">
        <Globe className="w-3.5 h-3.5 text-rust" />
        <span>Grounded in UN, World Bank & WHO data</span>
      </div>

      {/* Main Hero Title with stylized "1" */}
      <h1 className="text-5xl sm:text-7xl font-serif font-bold text-ink tracking-tight mb-4 leading-tight">
        <span className="inline-block text-rust font-normal italic scale-110 mr-2 underline decoration-rust-light decoration-4 underline-offset-8">
          1
        </span>
        <span> in 8 billion</span>
      </h1>

      {/* Poignant One-Line Hook */}
      <p className="text-xl sm:text-2xl font-serif italic text-ink-light max-w-2xl mx-auto mb-8 leading-relaxed">
        “About four babies are born every second. You are about to become one of them.”
      </p>

      {/* Two Live Per-Second Counters */}
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
        <div className="bg-parchment-50 border border-parchment-300/80 rounded-xl p-4 shadow-sm text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sage-700 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Global Births</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-ink">
            +{birthsCount.toLocaleString()}
          </div>
          <div className="text-xs text-ink-light/70 mt-1">
            since page open (~4.3 / sec)
          </div>
        </div>

        <div className="bg-parchment-50 border border-parchment-300/80 rounded-xl p-4 shadow-sm text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rust uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Global Deaths</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-ink">
            +{deathsCount.toLocaleString()}
          </div>
          <div className="text-xs text-ink-light/70 mt-1">
            since page open (~1.9 / sec)
          </div>
        </div>
      </div>

      {/* Core Principle Callout */}
      <p className="text-sm text-ink-light max-w-xl mx-auto mb-6 font-sans leading-relaxed">
        You can experience the natural random birth lottery, or select a specific country below to guarantee birth there.
        <span className="font-medium text-ink block mt-1">The goal is perspective, not winning.</span>
      </p>

      {/* Hero Country Selection & Primary CTA */}
      <div className="max-w-xl mx-auto space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="w-full sm:w-72 text-left">
            <label className="block text-[11px] font-semibold text-ink-light uppercase tracking-wider mb-1">
              Select Birth Country:
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl px-3.5 py-3 text-sm text-ink font-medium shadow-xs focus:ring-2 focus:ring-rust focus:outline-none"
            >
              <option value="">🎲 Random (Global Birth Lottery)</option>
              <optgroup label="Alphabetical Countries (Guaranteed Birth)">
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="w-full sm:w-auto self-end">
            <button
              onClick={handleBeBorn}
              className="w-full sm:w-auto px-8 py-3 bg-rust hover:bg-rust-dark text-parchment-50 font-serif text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rust flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>
                {chosenCountryObj ? `Be born in ${chosenCountryObj.name}` : 'Be born'}
              </span>
            </button>
          </div>
        </div>

        {chosenCountryObj && (
          <div className="p-2.5 bg-rust/5 border border-rust/30 rounded-xl text-xs text-ink flex items-center justify-center gap-2 animate-fade-in">
            <span className="text-xl">{chosenCountryObj.flag}</span>
            <span className="font-medium">
              Guaranteed birth in <strong className="text-rust-dark font-semibold">{chosenCountryObj.name}</strong>. Demographic rates and income will strictly match {chosenCountryObj.name}.
            </span>
          </div>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <button
          onClick={onStart}
          className="text-ink-light hover:text-ink flex items-center gap-1.5 underline decoration-dotted underline-offset-4"
        >
          <Settings2 className="w-3.5 h-3.5 text-rust" />
          <span>Advanced Settings (World era, simulation pace, classroom mode)</span>
        </button>

        {hasActiveRun && (
          <button
            onClick={onResume}
            className="px-4 py-2 bg-parchment-200 hover:bg-parchment-300 border border-parchment-300 text-ink font-medium rounded-xl transition-all shadow-xs flex items-center justify-center"
          >
            {t('hero.continueExistingLife', 'Continue life in progress')}
          </button>
        )}
      </div>
    </section>
  );
};
