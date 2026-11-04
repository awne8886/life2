import React, { useState, useEffect } from 'react';
import { SimulationState, SimulationConfig, LifeHistory } from './engine/types';
import { createInitialSimulationState, finalizeLifeHistory } from './engine/simulation';
import { loadActiveSimulation, saveCompletedLife, clearActiveSimulation } from './utils/storage';
import { LandingHero } from './components/LandingHero';
import { SetupCard } from './components/SetupCard';
import { GameView } from './components/GameView';
import { MemorialsView } from './components/MemorialsView';
import { CountryExplorer } from './components/CountryExplorer';
import { EducationGuide } from './components/EducationGuide';
import { StaticPageView, CrisisModal } from './components/StaticPages';
import { Footer } from './components/Footer';
import { Sparkles, BookOpen, Globe2, HelpCircle, GraduationCap, Sun, Moon } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeSimulation, setActiveSimulation] = useState<SimulationState | null>(() => loadActiveSimulation());
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isClassroomFromUrl, setIsClassroomFromUrl] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem('life_theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('life_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check URL parameters like ?edu=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edu') === '1') {
      setIsClassroomFromUrl(true);
    }
  }, []);

  const handleStartGame = (config: SimulationConfig) => {
    clearActiveSimulation();
    const newState = createInitialSimulationState(config);
    setActiveSimulation(newState);
    setShowSetupModal(false);
    setCurrentView('game');
  };

  const handleResumeGame = () => {
    if (activeSimulation) {
      setCurrentView('game');
    }
  };

  const handleFinishLife = (finalHistory: LifeHistory) => {
    saveCompletedLife(finalHistory);
    setActiveSimulation(null);
  };

  const handleRestartNewLife = () => {
    setActiveSimulation(null);
    setCurrentView('home');
    setShowSetupModal(true);
  };

  const handleClassroomLaunch = () => {
    handleStartGame({
      worldEra: 'today',
      birthWeighting: 'births',
      lifeSpeed: 'normal',
      leaveOutFrighteningScenes: true,
      classroomMode: true,
      calmMusic: true,
      autoMode: false
    });
  };

  return (
    <div className="min-h-screen bg-parchment-100 text-ink flex flex-col font-sans selection:bg-rust-light selection:text-white">
      {/* Editorial Navigation Header */}
      <header className="border-b border-parchment-300/80 bg-parchment-100/90 backdrop-blur-xs sticky top-0 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 group text-left"
          >
            <span className="font-serif font-black text-2xl text-rust group-hover:scale-105 transition-transform">
              1
            </span>
            <span className="font-serif font-bold text-xl tracking-tight text-ink">
              life
            </span>
          </button>

          {/* Nav Items */}
          <nav className="flex items-center gap-1 sm:gap-3 text-xs font-medium">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'home' || currentView === 'game'
                  ? 'bg-parchment-200 text-ink font-semibold'
                  : 'text-ink-light hover:text-ink hover:bg-parchment-200/60'
              }`}
            >
              Simulator
            </button>

            <button
              onClick={() => setCurrentView('memorials')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                currentView === 'memorials'
                  ? 'bg-parchment-200 text-ink font-semibold'
                  : 'text-ink-light hover:text-ink hover:bg-parchment-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Memorials</span>
            </button>

            <button
              onClick={() => setCurrentView('country-stats')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                currentView === 'country-stats'
                  ? 'bg-parchment-200 text-ink font-semibold'
                  : 'text-ink-light hover:text-ink hover:bg-parchment-200/60'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Country Data</span>
            </button>

            <button
              onClick={() => setCurrentView('edu')}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg transition-colors items-center gap-1 ${
                currentView === 'edu'
                  ? 'bg-indigo-100 text-indigo-900 font-semibold dark:bg-indigo-950 dark:text-indigo-200'
                  : 'text-ink-light hover:text-ink hover:bg-parchment-200/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
              <span>Education</span>
            </button>

            {/* Theme Toggle (Dark Mode default) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light parchment theme' : 'Switch to dark theme'}
              aria-label="Toggle dark mode theme"
              className="p-1.5 rounded-lg text-ink-light hover:text-ink hover:bg-parchment-200/80 transition-colors ml-1"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-ink-light" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-12">
            <LandingHero
              onStart={() => setShowSetupModal(true)}
              onStartWithCountry={(countryCode) => {
                handleStartGame({
                  worldEra: 'today',
                  birthWeighting: 'births',
                  targetCountryCode: countryCode,
                  lifeSpeed: 'normal',
                  calmMusic: true,
                  leaveOutFrighteningScenes: false,
                  classroomMode: isClassroomFromUrl,
                  autoMode: false
                });
              }}
              hasActiveRun={Boolean(activeSimulation?.isAlive)}
              onResume={handleResumeGame}
            />

            {/* In-page Setup Card */}
            <section className="px-4 pb-12">
              <SetupCard
                onStartGame={handleStartGame}
                defaultClassroom={isClassroomFromUrl}
              />
            </section>
          </div>
        )}

        {currentView === 'game' && activeSimulation && (
          <GameView
            initialState={activeSimulation}
            onFinishLife={handleFinishLife}
            onRestartNewLife={handleRestartNewLife}
            onOpenCrisisHelp={() => setIsCrisisOpen(true)}
          />
        )}

        {currentView === 'memorials' && (
          <MemorialsView onBackToHome={() => setCurrentView('home')} />
        )}

        {currentView === 'country-stats' && (
          <CountryExplorer
            onSelectCountryToSimulate={(code) => {
              handleStartGame({
                worldEra: 'today',
                birthWeighting: 'births',
                targetCountryCode: code,
                lifeSpeed: 'normal',
                calmMusic: true,
                leaveOutFrighteningScenes: false,
                classroomMode: false,
                autoMode: false
              });
            }}
          />
        )}

        {currentView === 'edu' && (
          <EducationGuide onEnableClassroomMode={handleClassroomLaunch} />
        )}

        {['about', 'privacy', 'terms', 'how-it-works'].includes(currentView) && (
          <StaticPageView
            page={currentView as 'about' | 'privacy' | 'terms' | 'how-it-works'}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Quick Setup Modal if triggered from Hero CTA */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-ink-deep/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowSetupModal(false)}
              className="absolute top-4 right-4 z-10 text-ink-light hover:text-ink bg-parchment-200/90 hover:bg-parchment-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-xs"
              aria-label="Close setup modal"
            >
              ✕
            </button>
            <SetupCard
              onStartGame={handleStartGame}
              defaultClassroom={isClassroomFromUrl}
            />
          </div>
        </div>
      )}

      {/* Crisis Modal */}
      {isCrisisOpen && <CrisisModal onClose={() => setIsCrisisOpen(false)} />}

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCrisis={() => setIsCrisisOpen(true)}
      />
    </div>
  );
}

export default App;
