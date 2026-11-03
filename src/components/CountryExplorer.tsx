import React, { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import { CountryData } from '../engine/types';
import { Globe, Search, ArrowUpDown, ExternalLink, ShieldCheck, BarChart3 } from 'lucide-react';

interface CountryExplorerProps {
  onSelectCountryToSimulate?: (code: string) => void;
}

type SortField =
  | 'name'
  | 'population'
  | 'annualBirths'
  | 'lifeExpectancyTotal'
  | 'infantMortality'
  | 'gdpPerCapitaPPP'
  | 'gini'
  | 'meanYearsSchooling'
  | 'outOfPocketHealthSpending';

export const CountryExplorer: React.FC<CountryExplorerProps> = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortField, setSortField] = useState<SortField>('annualBirths');
  const [sortAsc, setSortAsc] = useState(false);
  const [inspectCountry, setInspectCountry] = useState<CountryData | null>(null);

  const regions = ['all', ...Array.from(new Set(COUNTRIES.map((c) => c.region)))];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numbers
    }
  };

  const filtered = COUNTRIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.capitalCity.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  }).sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortAsc
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-left animate-fade-in space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-parchment-300">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-rust" />
          <h1 className="font-serif text-3xl font-bold text-ink">
            Global Country Statistics (/c/)
          </h1>
        </div>
        <p className="text-sm text-ink-light mt-1">
          Real indicators from UN World Population Prospects (2024), World Bank, WHO Global Health Estimates, and Our World In Data.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country or capital..."
            className="w-full bg-parchment-50 border border-parchment-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-rust"
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-parchment-50 border border-parchment-300 rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-rust"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === 'all' ? 'All UN Regions' : r}
            </option>
          ))}
        </select>
      </div>

      {/* Table view */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-parchment-200/70 border-b border-parchment-300 text-ink font-semibold">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Country <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('annualBirths')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Annual Births <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lifeExpectancyTotal')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Life Expectancy <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('infantMortality')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Infant Mort. (/1k) <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gdpPerCapitaPPP')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    GDP / Capita (PPP) <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gini')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Gini <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('meanYearsSchooling')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Schooling <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('outOfPocketHealthSpending')}
                  className="py-3.5 px-3 cursor-pointer hover:text-rust"
                >
                  <div className="flex items-center gap-1">
                    Out-of-Pocket Health % <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-200">
              {filtered.map((c) => (
                <tr
                  key={c.code}
                  className="hover:bg-parchment-100/70 transition-colors cursor-pointer"
                  onClick={() => setInspectCountry(c)}
                >
                  <td className="py-3 px-4 font-medium text-ink flex items-center gap-2">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-[10px] text-ink-light font-mono">{c.region}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {c.annualBirths.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-ink">
                    {c.lifeExpectancyTotal}y
                    <span className="text-[10px] text-ink-light block font-normal">
                      M:{c.lifeExpectancyMale} / F:{c.lifeExpectancyFemale}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {c.infantMortality}
                    <span className="text-[10px] text-ink-light block">
                      U5: {c.under5Mortality}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-ink">
                    ${c.gdpPerCapitaPPP.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {c.gini}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {c.meanYearsSchooling} yrs
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {c.outOfPocketHealthSpending}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-rust hover:underline font-medium">View</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Country Detail Modal */}
      {inspectCountry && (
        <div className="fixed inset-0 z-50 bg-ink-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-parchment-50 border border-parchment-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-left space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-parchment-200">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{inspectCountry.flag}</span>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-ink">
                    {inspectCountry.name}
                  </h2>
                  <p className="text-xs text-ink-light">
                    {inspectCountry.subregion} • Capital: {inspectCountry.capitalCity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectCountry(null)}
                className="text-sm font-semibold text-ink-light hover:text-ink px-3 py-1 rounded-lg bg-parchment-200"
              >
                Close
              </button>
            </div>

            {/* Demographics Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                <span className="text-ink-light block">Population</span>
                <span className="font-mono font-bold text-base text-ink">
                  {inspectCountry.population.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                <span className="text-ink-light block">Annual Births</span>
                <span className="font-mono font-bold text-base text-ink">
                  {inspectCountry.annualBirths.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                <span className="text-ink-light block">Fertility Rate</span>
                <span className="font-mono font-bold text-base text-ink">
                  {inspectCountry.fertilityRate} / woman
                </span>
              </div>
              <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                <span className="text-ink-light block">Urbanization</span>
                <span className="font-mono font-bold text-base text-ink">
                  {inspectCountry.urbanPopulationRate}%
                </span>
              </div>
            </div>

            {/* Top WHO Causes of Death */}
            <div>
              <h4 className="font-serif font-bold text-sm text-ink mb-2">
                Top Causes of Death (WHO Global Health Estimates)
              </h4>
              <div className="space-y-1.5">
                {inspectCountry.causesOfDeathRanked.map((c, idx) => (
                  <div
                    key={c.category}
                    className="flex items-center justify-between p-2 bg-parchment-100 rounded-lg text-xs"
                  >
                    <span className="text-ink font-medium">
                      {idx + 1}. {c.category}
                    </span>
                    <span className="font-mono text-rust font-semibold">
                      {c.sharePercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural & Social Indicators */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                <span className="font-semibold text-ink block mb-1">Common Languages</span>
                <span className="text-ink-light">{inspectCountry.commonLanguages.join(', ')}</span>
              </div>
              <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
                <span className="font-semibold text-ink block mb-1">Primary Religions</span>
                <span className="text-ink-light">{inspectCountry.primaryReligions.join(', ')}</span>
              </div>
            </div>

            {/* Citations & Source Documentation */}
            <div className="p-4 bg-parchment-200/50 rounded-xl text-[11px] text-ink-light space-y-1 border border-parchment-300">
              <div className="font-semibold text-ink mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
                <span>Verified Statistical Sources ({inspectCountry.sources.sourceYear})</span>
              </div>
              <div>Demographics: {inspectCountry.sources.births}</div>
              <div>Economy: {inspectCountry.sources.gdp}</div>
              <div>Mortality: {inspectCountry.sources.mortality}</div>
              <div>Education: {inspectCountry.sources.education}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
