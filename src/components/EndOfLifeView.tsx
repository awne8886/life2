import React, { useState } from 'react';
import { LifeHistory, CountryData } from '../engine/types';
import { getCountryByCode } from '../engine/birthplace';
import { downloadMemorialCard } from '../engine/cardGenerator';
import { Heart, Compass, Download, BookmarkPlus, RotateCcw, Share2, Sparkles } from 'lucide-react';

interface EndOfLifeViewProps {
  life: LifeHistory;
  onSaveToMemorial: (partingWords?: string) => void;
  onRestart: () => void;
}

export const EndOfLifeView: React.FC<EndOfLifeViewProps> = ({
  life,
  onSaveToMemorial,
  onRestart
}) => {
  const [partingWords, setPartingWords] = useState(life.partingWords || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const realCountry: CountryData | undefined = life.realCountryCode
    ? getCountryByCode(life.realCountryCode)
    : undefined;

  const currentCountry = getCountryByCode(life.countryCode);

  const handleSave = () => {
    onSaveToMemorial(partingWords.trim() || undefined);
    setIsSaved(true);
  };

  const handleDownloadCard = async () => {
    setIsDownloading(true);
    try {
      await downloadMemorialCard({
        ...life,
        partingWords: partingWords.trim() || life.partingWords
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-left animate-fade-in space-y-8">
      {/* Editorial Header */}
      <div className="text-center pb-6 border-b border-parchment-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-parchment-200 border border-parchment-300 text-xs font-medium tracking-wide text-ink-light">
          <Heart className="w-3.5 h-3.5 text-rust" />
          <span>Life Journey Concluded</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink mb-2">
          {life.name} {life.flag}
        </h1>

        <p className="text-lg font-serif italic text-ink-light">
          {life.countryName} • {life.birthYear} — {life.deathYear} (Lived {life.finalAge} years)
        </p>

        <div className="mt-4 inline-block bg-parchment-200/80 border border-parchment-300 px-4 py-2 rounded-xl text-sm font-medium text-ink">
          Cause of passing: <span className="font-semibold text-rust">{life.causeOfDeath || 'Senescence & natural decline'}</span>
        </div>
      </div>

      {/* Life Map Grid: 1 square = 1 year lived */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">
              Life Map
            </h3>
            <p className="text-xs text-ink-light">
              One square equals one year lived ({life.finalAge + 1} years total)
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-ink-light">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#dfdac8]" /> Neutral
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#5c7860]" /> Flourishing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#d97706]" /> Hardship
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#8b3822]" /> Crisis
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 bg-parchment-100 rounded-xl border border-parchment-200">
          {life.lifeMap.map((ym) => {
            let bgClass = 'bg-[#dfdac8]';
            if (ym.tone === 'positive') bgClass = 'bg-[#5c7860]';
            if (ym.tone === 'hardship') bgClass = 'bg-[#d97706]';
            if (ym.tone === 'crisis') bgClass = 'bg-[#8b3822]';

            return (
              <div
                key={ym.age}
                title={`Age ${ym.age} (${ym.year}): ${ym.summary}`}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xs ${bgClass} flex items-center justify-center text-[10px] font-mono text-white/90 cursor-default hover:scale-110 transition-transform shadow-2xs`}
              >
                {ym.age}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Life Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-parchment-50 border border-parchment-300 rounded-xl p-3.5">
          <div className="text-xs text-ink-light font-medium">Final Health</div>
          <div className="text-2xl font-mono font-bold text-ink mt-0.5">{life.finalStats.health}/100</div>
        </div>
        <div className="bg-parchment-50 border border-parchment-300 rounded-xl p-3.5">
          <div className="text-xs text-ink-light font-medium">Happiness</div>
          <div className="text-2xl font-mono font-bold text-ink mt-0.5">{life.finalStats.happiness}/100</div>
        </div>
        <div className="bg-parchment-50 border border-parchment-300 rounded-xl p-3.5">
          <div className="text-xs text-ink-light font-medium">Knowledge</div>
          <div className="text-2xl font-mono font-bold text-ink mt-0.5">{life.finalStats.knowledge}/100</div>
        </div>
        <div className="bg-parchment-50 border border-parchment-300 rounded-xl p-3.5">
          <div className="text-xs text-ink-light font-medium">Relationships</div>
          <div className="text-2xl font-mono font-bold text-ink mt-0.5">{life.finalStats.relationships}/100</div>
        </div>
      </div>

      {/* Real Country Comparison (if provided) */}
      {realCountry && currentCountry && (
        <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-rust" />
            <h3 className="font-serif text-lg font-bold text-ink">
              Contrast with your real birthplace: {realCountry.name} {realCountry.flag}
            </h3>
          </div>
          <p className="text-xs text-ink-light mb-4">
            If you had lived this lifetime in your actual country of birth rather than {currentCountry.name}:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block mb-1">Life Expectancy</span>
              <span className="text-ink-light">
                {currentCountry.name}: <b>{currentCountry.lifeExpectancyTotal} yrs</b>
                <br />
                {realCountry.name}: <b>{realCountry.lifeExpectancyTotal} yrs</b>
              </span>
            </div>

            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block mb-1">GDP / Capita (PPP)</span>
              <span className="text-ink-light">
                {currentCountry.name}: <b>${currentCountry.gdpPerCapitaPPP.toLocaleString()}</b>
                <br />
                {realCountry.name}: <b>${realCountry.gdpPerCapitaPPP.toLocaleString()}</b>
              </span>
            </div>

            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block mb-1">Infant Mortality</span>
              <span className="text-ink-light">
                {currentCountry.name}: <b>{currentCountry.infantMortality} per 1k</b>
                <br />
                {realCountry.name}: <b>{realCountry.infantMortality} per 1k</b>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Parting Words & Memorial Registry */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-bold text-ink">
          Parting Words & Memorial
        </h3>
        <p className="text-xs text-ink-light">
          Take a quiet moment to write a few parting words to this simulated person before resting their record in the Memorial Registry:
        </p>

        <textarea
          value={partingWords}
          onChange={(e) => setPartingWords(e.target.value)}
          placeholder="What would you say to this person whose life you just walked through?"
          rows={3}
          className="w-full bg-parchment-100 border border-parchment-300 rounded-xl p-3 text-sm text-ink placeholder:text-ink-light/50 focus:outline-none focus:ring-2 focus:ring-rust"
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex-1 py-3 px-5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rust hover:bg-rust-dark text-parchment-50 shadow-sm'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isSaved ? 'Saved to Memorial Registry' : 'Save to Memorial Registry'}</span>
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="py-3 px-5 bg-parchment-200 hover:bg-parchment-300 border border-parchment-400 text-ink rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Rendering Card...' : 'Download Memorial Card (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Restart CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-rust hover:bg-rust-dark text-parchment-50 font-serif text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <span>Be born again</span>
        </button>
      </div>
    </div>
  );
};
