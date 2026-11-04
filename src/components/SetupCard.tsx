import React, { useState } from 'react';
import { Settings, Volume2, ShieldAlert, GraduationCap, FastForward, Compass, Sparkles } from 'lucide-react';
import { SimulationConfig, WorldEra, BirthWeighting, LifeSpeed } from '../engine/types';
import { COUNTRIES } from '../data/countries';
import { t } from '../locales/i18n';

interface SetupCardProps {
  onStartGame: (config: SimulationConfig) => void;
  defaultClassroom?: boolean;
  initialTargetCountryCode?: string;
}

export const SetupCard: React.FC<SetupCardProps> = ({
  onStartGame,
  defaultClassroom = false,
  initialTargetCountryCode = ''
}) => {
  const [worldEra, setWorldEra] = useState<WorldEra>('today');
  const [birthWeighting, setBirthWeighting] = useState<BirthWeighting>('births');
  const [lifeSpeed, setLifeSpeed] = useState<LifeSpeed>('normal');
  const [targetCountryCode, setTargetCountryCode] = useState<string>(initialTargetCountryCode);
  const [realCountryCode, setRealCountryCode] = useState<string>('');
  const [calmMusic, setCalmMusic] = useState<boolean>(true);
  const [leaveOutFrightening, setLeaveOutFrightening] = useState<boolean>(false);
  const [classroomMode, setClassroomMode] = useState<boolean>(defaultClassroom);
  const [autoMode, setAutoMode] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveCountry = targetCountryCode || realCountryCode || undefined;
    onStartGame({
      worldEra,
      birthWeighting,
      targetCountryCode: effectiveCountry,
      lifeSpeed,
      realCountryCode: realCountryCode || undefined,
      calmMusic,
      leaveOutFrighteningScenes: leaveOutFrightening || classroomMode,
      classroomMode,
      autoMode
    });
  };

  return (
    <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm text-left">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-parchment-200">
        <Settings className="w-5 h-5 text-rust" />
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          {t('setup.title', 'Birth Settings')}
        </h2>
        <span className="text-xs bg-parchment-200 text-ink-light px-2.5 py-0.5 rounded-full ml-auto">
          All options optional
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* World Era */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            1. World Era
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'today', label: 'Today (2024)', desc: 'Real current stats' },
              { id: 'past_1970', label: 'Past (1970)', desc: 'Higher mortality' },
              { id: 'past_1990', label: 'Past (1990)', desc: 'Cold War / HIV' },
              { id: 'future_2050', label: 'Future (2050)', desc: 'UN Projections' },
            ].map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => setWorldEra(era.id as WorldEra)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  worldEra === era.id
                    ? 'border-rust bg-rust/5 ring-1 ring-rust text-rust-dark font-medium shadow-xs'
                    : 'border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink-light'
                }`}
              >
                <div className="text-xs font-semibold">{era.label}</div>
                <div className="text-[11px] opacity-75 mt-0.5">{era.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Birth Country & Draw Mode */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-ink">
            2. Birthplace / Birth Country
          </label>
          <p className="text-xs text-ink-light">
            Leave on random to experience the true birth lottery, or choose a specific country to guarantee birth there.
          </p>

          <div className="space-y-2">
            <select
              value={targetCountryCode}
              onChange={(e) => setTargetCountryCode(e.target.value)}
              className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-rust font-medium"
            >
              <option value="">🎲 Random Country (Global Probability Lottery)</option>
              <optgroup label="Select Country (Guaranteed Birth, Alphabetical A–Z)">
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.region})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {targetCountryCode ? (
            <div className="p-3.5 bg-rust/5 border border-rust/30 rounded-xl text-xs text-ink flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">
                  {COUNTRIES.find((c) => c.code === targetCountryCode)?.flag}
                </span>
                <div>
                  <span className="font-semibold text-rust-dark text-sm block">
                    Guaranteed Birth: {COUNTRIES.find((c) => c.code === targetCountryCode)?.name}
                  </span>
                  <div className="text-[11px] text-ink-light">
                    You will be born in {COUNTRIES.find((c) => c.code === targetCountryCode)?.name}. Mortality rates, healthcare, education, and income distribution will strictly match this country.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTargetCountryCode('')}
                className="text-xs text-rust hover:underline font-semibold ml-2 shrink-0 px-2 py-1 bg-parchment-200/80 rounded"
              >
                Reset to Random
              </button>
            </div>
          ) : (
            <div>
              <div className="text-xs font-medium text-ink-light mb-1.5">
                Random Lottery Distribution:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBirthWeighting('births')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    birthWeighting === 'births'
                      ? 'border-rust bg-rust/5 ring-1 ring-rust text-rust-dark font-medium'
                      : 'border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink-light'
                  }`}
                >
                  <div className="text-sm font-semibold flex items-center justify-between">
                    <span>Weighted by Annual Births</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">Realistic</span>
                  </div>
                  <p className="text-xs text-ink-light mt-1">
                    Reflects where ~4.3 babies per second are born today. Skews heavily to high-fertility nations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBirthWeighting('population')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    birthWeighting === 'population'
                      ? 'border-rust bg-rust/5 ring-1 ring-rust text-rust-dark font-medium'
                      : 'border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink-light'
                  }`}
                >
                  <div className="text-sm font-semibold">Weighted by Population</div>
                  <p className="text-xs text-ink-light mt-1">
                    Reflects current living human headcount (China, India, US, Indonesia receive standard proportional draws).
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Life Progression Speed */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            3. Simulation Pace
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'slow', label: '~1.5 Hours', sub: 'Thoughtful' },
              { id: 'normal', label: '~1 Hour', sub: 'Standard' },
              { id: 'fast', label: '~30 Mins', sub: 'Brisk' }
            ].map((speed) => (
              <button
                key={speed.id}
                type="button"
                onClick={() => setLifeSpeed(speed.id as LifeSpeed)}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  lifeSpeed === speed.id
                    ? 'border-rust bg-rust/5 ring-1 ring-rust text-rust-dark font-semibold'
                    : 'border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink-light'
                }`}
              >
                <div className="text-xs font-semibold">{speed.label}</div>
                <div className="text-[10px] opacity-75">{speed.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Real-World Living Country for End Comparison */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-rust" />
            <span>Real-World Country (Optional comparison at death)</span>
          </label>
          <p className="text-xs text-ink-light/80 mb-2">
            Where you live in real life today. Used only on the final memorial screen to contrast your simulated destiny with your real country.
          </p>
          <select
            value={realCountryCode}
            onChange={(e) => setRealCountryCode(e.target.value)}
            className="w-full bg-parchment-100 border border-parchment-300 rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-rust"
          >
            <option value="">-- Choose your real-world country (Optional) --</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-parchment-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={calmMusic}
              onChange={(e) => setCalmMusic(e.target.checked)}
              className="w-4 h-4 text-rust rounded border-parchment-300 focus:ring-rust"
            />
            <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
              <Volume2 className="w-3.5 h-3.5 text-sage-700" />
              <span>Enable serene ambient synthesizer soundscape</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={leaveOutFrightening}
              onChange={(e) => setLeaveOutFrightening(e.target.checked)}
              className="w-4 h-4 text-rust rounded border-parchment-300 focus:ring-rust"
            />
            <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Leave out frightening scenes (suppresses heavy trauma descriptions while keeping demographic rates)</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={classroomMode}
              onChange={(e) => setClassroomMode(e.target.checked)}
              className="w-4 h-4 text-rust rounded border-parchment-300 focus:ring-rust"
            />
            <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
              <span>Classroom Mode (student safe, removes heavy violence/explicit themes, includes discussion notes)</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
              className="w-4 h-4 text-rust rounded border-parchment-300 focus:ring-rust"
            />
            <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
              <FastForward className="w-3.5 h-3.5 text-rust" />
              <span>Auto mode (engine automatically resolves yearly focus; stops only for milestones & major checkpoints)</span>
            </div>
          </label>
        </div>

        {/* Submit Big Button */}
        <button
          type="submit"
          className="w-full py-4 bg-rust hover:bg-rust-dark text-parchment-50 font-serif text-xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <span>
            {targetCountryCode
              ? `Be born in ${COUNTRIES.find((c) => c.code === targetCountryCode)?.name}`
              : realCountryCode
              ? `Be born in ${COUNTRIES.find((c) => c.code === realCountryCode)?.name}`
              : 'Be born'}
          </span>
        </button>
      </form>
    </div>
  );
};
