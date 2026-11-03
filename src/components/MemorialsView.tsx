import React, { useState } from 'react';
import { LifeHistory } from '../engine/types';
import {
  getCompletedLives,
  deleteCompletedLife,
  exportLivesAsJson,
  importLivesFromJson,
  clearAllMemorialRecords,
  getRandomCompletedLife
} from '../utils/storage';
import { downloadMemorialCard } from '../engine/cardGenerator';
import {
  BookOpen,
  Sparkles,
  Download,
  Upload,
  Trash2,
  ExternalLink,
  Shuffle,
  Heart,
  Briefcase,
  Search,
  Filter
} from 'lucide-react';

interface MemorialsViewProps {
  onBackToHome: () => void;
}

export const MemorialsView: React.FC<MemorialsViewProps> = ({ onBackToHome }) => {
  const [lives, setLives] = useState<LifeHistory[]>(() => getCompletedLives());
  const [selectedLife, setSelectedLife] = useState<LifeHistory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const refreshLives = () => {
    setLives(getCompletedLives());
  };

  const handleRandomLife = () => {
    const randomOne = getRandomCompletedLife();
    if (randomOne) {
      setSelectedLife(randomOne);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this record from your local memorial?')) {
      deleteCompletedLife(id);
      refreshLives();
      if (selectedLife?.id === id) {
        setSelectedLife(null);
      }
    }
  };

  const handleExport = () => {
    const dataStr = exportLivesAsJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-memorial-registry-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importLivesFromJson(content);
      if (res.error) {
        setImportStatus(`Import failed: ${res.error}`);
      } else {
        setImportStatus(`Successfully imported ${res.importedCount} lives.`);
        refreshLives();
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all recorded lives from your local storage? This cannot be undone.')) {
      clearAllMemorialRecords();
      refreshLives();
      setSelectedLife(null);
    }
  };

  const filteredLives = lives.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.countryName.toLowerCase().includes(q) ||
      (l.causeOfDeath && l.causeOfDeath.toLowerCase().includes(q)) ||
      (l.occupation && l.occupation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 text-left animate-fade-in space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-parchment-300">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rust" />
            <h1 className="font-serif text-3xl font-bold text-ink">
              Memorial Registry
            </h1>
          </div>
          <p className="text-xs text-ink-light mt-1">
            Browse, reflect upon, and preserve lives simulated across human statistics. Stored locally in your browser.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomLife}
            className="px-4 py-2 bg-parchment-200 hover:bg-parchment-300 border border-parchment-300 rounded-xl text-xs font-semibold text-ink flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5 text-rust" />
            <span>Random Life</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 rounded-xl text-xs font-medium text-ink flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <label className="px-3.5 py-2 bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 rounded-xl text-xs font-medium text-ink flex items-center gap-1.5 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-xs font-medium text-amber-900 rounded-xl">
          {importStatus}
        </div>
      )}

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, occupation, cause of death..."
            className="w-full bg-parchment-50 border border-parchment-300 rounded-xl pl-10 pr-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-rust"
          />
        </div>
        <span className="text-xs text-ink-light font-mono">
          {filteredLives.length} {filteredLives.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {/* Main Grid: List of Lives + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: List of Cards */}
        <div className="lg:col-span-1 space-y-3 max-h-[650px] overflow-y-auto pr-1">
          {filteredLives.length === 0 ? (
            <div className="p-8 text-center bg-parchment-50 border border-parchment-300 rounded-2xl text-xs text-ink-light">
              No matching records found.
            </div>
          ) : (
            filteredLives.map((life) => {
              const isSelected = selectedLife?.id === life.id;
              return (
                <div
                  key={life.id}
                  onClick={() => setSelectedLife(life)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rust bg-rust/5 ring-1 ring-rust shadow-xs'
                      : 'border-parchment-200 bg-parchment-50 hover:bg-parchment-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-base text-ink flex items-center gap-1.5">
                      <span>{life.flag}</span>
                      <span>{life.name}</span>
                    </span>
                    <span className="font-mono text-xs font-semibold text-rust">
                      Lived {life.finalAge}y
                    </span>
                  </div>

                  <div className="text-xs text-ink-light flex items-center justify-between">
                    <span>{life.countryName}</span>
                    <span className="text-[11px] font-mono opacity-75">
                      {life.birthYear} — {life.deathYear ?? life.birthYear + life.finalAge}
                    </span>
                  </div>

                  {life.partingWords && (
                    <p className="mt-2 text-xs italic text-ink line-clamp-2 bg-parchment-200/60 p-2 rounded-lg">
                      “{life.partingWords}”
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Life Inspector */}
        <div className="lg:col-span-2">
          {selectedLife ? (
            <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-parchment-200">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-ink">
                    {selectedLife.name} {selectedLife.flag}
                  </h2>
                  <p className="text-sm font-serif italic text-ink-light mt-0.5">
                    {selectedLife.countryName} ({selectedLife.sex}) • {selectedLife.birthYear} — {selectedLife.deathYear ?? selectedLife.birthYear + selectedLife.finalAge}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadMemorialCard(selectedLife)}
                    className="p-2.5 rounded-xl border border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink"
                    title="Download Memorial Card PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedLife.id)}
                    className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cause & Parting Words */}
              <div className="bg-parchment-100 border border-parchment-200 rounded-xl p-4 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-rust uppercase tracking-wider block text-[10px]">
                    Cause of Passing
                  </span>
                  <span className="text-ink font-medium text-sm">
                    {selectedLife.causeOfDeath || 'Senescence and natural decline'}
                  </span>
                </div>

                {selectedLife.partingWords && (
                  <div className="pt-2 border-t border-parchment-200">
                    <span className="font-semibold text-ink-light uppercase tracking-wider block text-[10px]">
                      Parting Words from Player
                    </span>
                    <p className="font-serif italic text-sm text-ink mt-0.5">
                      “{selectedLife.partingWords}”
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                  <span className="text-ink-light block">Health</span>
                  <span className="font-mono font-bold text-lg text-ink">{selectedLife.finalStats.health}/100</span>
                </div>
                <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                  <span className="text-ink-light block">Happiness</span>
                  <span className="font-mono font-bold text-lg text-ink">{selectedLife.finalStats.happiness}/100</span>
                </div>
                <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                  <span className="text-ink-light block">Knowledge</span>
                  <span className="font-mono font-bold text-lg text-ink">{selectedLife.finalStats.knowledge}/100</span>
                </div>
                <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                  <span className="text-ink-light block">Relationships</span>
                  <span className="font-mono font-bold text-lg text-ink">{selectedLife.finalStats.relationships}/100</span>
                </div>
              </div>

              {/* Life Map Preview */}
              <div>
                <h4 className="font-serif font-bold text-sm text-ink mb-2">
                  Life Map ({selectedLife.finalAge + 1} Years)
                </h4>
                <div className="flex flex-wrap gap-1 p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                  {selectedLife.lifeMap.map((ym) => {
                    let bg = '#dfdac8';
                    if (ym.tone === 'positive') bg = '#5c7860';
                    if (ym.tone === 'hardship') bg = '#d97706';
                    if (ym.tone === 'crisis') bg = '#8b3822';
                    return (
                      <div
                        key={ym.age}
                        title={`Age ${ym.age}: ${ym.summary}`}
                        style={{ backgroundColor: bg }}
                        className="w-4 h-4 rounded-2xs text-[9px] font-mono text-white flex items-center justify-center cursor-default"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Milestone Reflections if any */}
              {selectedLife.milestoneAnswers?.length > 0 && (
                <div>
                  <h4 className="font-serif font-bold text-sm text-ink mb-2">
                    Milestone Reflections
                  </h4>
                  <div className="space-y-2">
                    {selectedLife.milestoneAnswers.map((m) => (
                      <div key={m.age} className="p-3 bg-parchment-100 rounded-xl border border-parchment-200 text-xs">
                        <div className="font-semibold text-rust mb-1">Age {m.age} Pause: {m.question}</div>
                        {m.answer ? (
                          <div className="font-serif italic text-ink">“{m.answer}”</div>
                        ) : (
                          <div className="text-ink-light italic">No written reflection recorded.</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-parchment-50 border border-parchment-300 rounded-2xl text-ink-light space-y-3">
              <BookOpen className="w-8 h-8 text-rust/40 mx-auto" />
              <p className="text-sm font-serif">
                Select a life record from the list to view its complete narrative, stats, and milestone reflections.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Clear All */}
      {lives.length > 0 && (
        <div className="pt-6 border-t border-parchment-300 flex justify-between items-center text-xs text-ink-light">
          <span>Records stored strictly in your browser's local cache.</span>
          <button
            onClick={handleClearAll}
            className="text-rose-700 hover:text-rose-900 underline"
          >
            Clear all memorial records
          </button>
        </div>
      )}
    </div>
  );
};
