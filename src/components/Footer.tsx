import React from 'react';
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setLanguage } from '../locales/i18n';
import { ArrowUp, Globe, LifeBuoy, GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenCrisis: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCrisis }) => {
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-parchment-300 bg-parchment-200/50 py-10 px-4 text-xs text-ink-light">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top footer row: Languages and Crisis Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-rust" />
            <span className="font-semibold text-ink">Language:</span>
            <select
              value={currentLang.code}
              onChange={handleLanguageChange}
              className="bg-parchment-100 border border-parchment-300 rounded-lg px-2.5 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-rust"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name}) {lang.dir === 'rtl' ? '— RTL' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCrisis}
              className="px-3 py-1.5 bg-rust/10 hover:bg-rust/20 text-rust rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Crisis Support</span>
            </button>

            <button
              onClick={() => onNavigate('edu')}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
              <span>Classroom Mode (?edu=1)</span>
            </button>
          </div>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-parchment-300/60">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button onClick={() => onNavigate('home')} className="hover:text-ink hover:underline">
              Simulator
            </button>
            <button onClick={() => onNavigate('how-it-works')} className="hover:text-ink hover:underline">
              How It Works
            </button>
            <button onClick={() => onNavigate('country-stats')} className="hover:text-ink hover:underline">
              Country Data (/c/)
            </button>
            <button onClick={() => onNavigate('memorials')} className="hover:text-ink hover:underline">
              Memorials
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-ink hover:underline">
              About
            </button>
            <button onClick={() => onNavigate('edu')} className="hover:text-ink hover:underline">
              Educator Guide (/edu)
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-ink hover:underline">
              Privacy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-ink hover:underline">
              Terms
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink hover:underline"
            >
              Feedback & Contact
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-ink transition-colors font-medium ml-auto"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        {/* Disclaimer note */}
        <div className="text-[11px] text-ink-light/70 leading-relaxed max-w-3xl">
          <b>Disclaimer:</b> Simulated lives are probabilistic illustrations based on macroscopic national statistics from UN WPP 2024, World Bank, and WHO. They are not deterministic predictions, individual diagnoses, or fate. No user data is collected or transmitted.
        </div>
      </div>
    </footer>
  );
};
