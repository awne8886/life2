import React from 'react';
import { ShieldCheck, Info, FileText, LifeBuoy, Heart, ExternalLink, X } from 'lucide-react';
import { GLOBAL_CRISIS_FALLBACK, CRISIS_RESOURCES_BY_COUNTRY } from '../data/crisisResources';

interface StaticPageViewProps {
  page: 'about' | 'privacy' | 'terms' | 'how-it-works';
  onBack: () => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({ page, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-left animate-fade-in space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-parchment-300">
        <h1 className="font-serif text-3xl font-bold text-ink">
          {page === 'about' && 'About life'}
          {page === 'privacy' && 'Privacy Policy'}
          {page === 'terms' && 'Terms of Use'}
          {page === 'how-it-works' && 'How It Works'}
        </h1>
        <button
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-parchment-200 hover:bg-parchment-300 text-ink"
        >
          Back to Simulator
        </button>
      </div>

      {page === 'about' && (
        <div className="space-y-4 text-sm text-ink-light leading-relaxed">
          <p className="font-serif text-base text-ink">
            <b>life</b> is a realistic, random-birth life simulator designed for perspective, not winning.
          </p>
          <p>
            Every single day, roughly 380,000 babies enter the world. Some are born into high-income social safety nets with access to cutting-edge neonatal intensive care; others are born into arid farming villages where maternal hemorrhage remains a leading cause of death.
          </p>
          <p>
            None of us choose where or to whom we are born. By stepping into a probabilistic life trajectory calibrated directly to real national health, mortality, education, and economic data, 'life' invites quiet reflection on the arbitrary blessings and hardships that define human existence.
          </p>

          <h3 className="font-serif font-bold text-base text-ink pt-3">
            Primary Statistical Sources
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><b>United Nations Population Division:</b> World Population Prospects (2024 Revision). Birth rates, fertility, life tables, sex ratios.</li>
            <li><b>World Bank Open Data & ICP:</b> GDP per capita (PPP international dollars), Gini inequality coefficients, labor market data, urbanization.</li>
            <li><b>World Health Organization (WHO):</b> Global Health Estimates (GHE 2024). Age-sex cause of death distributions, maternal mortality ratios.</li>
            <li><b>Our World in Data (OWID):</b> Historical literacy, schooling, and global development milestones.</li>
          </ul>

          <h3 className="font-serif font-bold text-base text-ink pt-3">
            Important Disclaimer
          </h3>
          <p className="text-xs bg-parchment-100 p-4 rounded-xl border border-parchment-200">
            Simulated lives are probabilistic illustrations grounded in macroscopic national statistics. They are neither deterministic forecasts nor individual fate. Every human being is endowed with inherent dignity and agency beyond statistical averages.
          </p>
        </div>
      )}

      {page === 'how-it-works' && (
        <div className="space-y-4 text-sm text-ink-light leading-relaxed">
          <h3 className="font-serif font-bold text-base text-ink">1. The Birth Lottery</h3>
          <p>
            When you press <i>Be Born</i>, the simulation draws a country either weighted by today’s annual births (which skews to high-fertility nations like Nigeria, India, DRC, and Pakistan) or by current population. Your sex, urban/rural setting, and initial family income are drawn using calibrated log-normal distributions fitted to that nation’s GDP per capita and Gini inequality index.
          </p>

          <h3 className="font-serif font-bold text-base text-ink">2. Actuarial Life Tables & Cause of Death</h3>
          <p>
            In each simulation year, your mortality probability $q_x$ is evaluated using official age-specific life tables. If an actuarial death event occurs, a cause of death is sampled from the WHO Global Health Estimates for your country, age group, and sex. Your personal health choices and habits shift your survival hazard within realistic statistical bounds.
          </p>

          <h3 className="font-serif font-bold text-base text-ink">3. The Same-Second Peers</h3>
          <p>
            Four other babies from different corners of the Earth are born in the exact same second. Their lives unfold alongside yours in the side panel, offering a window into how radically divergent childhood and adulthood look across borders.
          </p>

          <h3 className="font-serif font-bold text-base text-ink">4. Milestone Freezes (Ages 5, 15, 30, 50, 70)</h3>
          <p>
            At key life transition thresholds, time stops completely. You are invited to reflect on one poignant question linking this character’s reality to your own personal story.
          </p>
        </div>
      )}

      {page === 'privacy' && (
        <div className="space-y-4 text-sm text-ink-light leading-relaxed">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium text-xs">
            Guaranteed 100% Client-Side Privacy: No user data ever leaves your device.
          </div>
          <p>
            'life' requires <b>no sign-up, no login, and no backend servers</b>. All simulation states, game progress, and memorial registry entries are saved exclusively in your browser’s local storage (<code>localStorage</code>).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>No analytics trackers, advertising scripts, or fingerprinting.</li>
            <li>No cookies stored or transmitted.</li>
            <li>You can export or erase your stored lives at any time from the Memorials view.</li>
          </ul>
        </div>
      )}

      {page === 'terms' && (
        <div className="space-y-4 text-sm text-ink-light leading-relaxed">
          <p>
            'life' is offered freely for educational, non-commercial, and humanitarian perspective purposes.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><b>Educational License:</b> Free to use in classrooms, universities, seminars, and research.</li>
            <li><b>Non-Commercial:</b> No monetization, paywalls, or virtual currency.</li>
            <li><b>Sensory Consideration:</b> Frightening themes and traumatic descriptions can be suppressed at any time via the setup toggle or Classroom Mode (?edu=1).</li>
          </ul>
        </div>
      )}
    </div>
  );
};

interface CrisisModalProps {
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-ink-deep/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-parchment-50 border border-parchment-300 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl text-left space-y-5 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-parchment-200">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rust" />
            <h2 className="font-serif text-2xl font-bold text-ink">
              Crisis & Support Resources
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-light hover:text-ink hover:bg-parchment-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-ink-light leading-relaxed">
          If you or someone you know is going through emotional distress, grief, or difficult circumstances, free and confidential support is available worldwide 24 hours a day.
        </p>

        {/* Global Directory */}
        <div className="p-4 bg-parchment-100 rounded-2xl border border-parchment-200 space-y-2 text-xs">
          <div className="font-semibold text-ink text-sm flex items-center justify-between">
            <span>Find A Helpline (Worldwide Directory)</span>
            <span className="text-[10px] bg-sage-100 text-sage-700 px-2 py-0.5 rounded font-mono">130+ Countries</span>
          </div>
          <p className="text-ink-light">
            Search free, confidential crisis hotlines, SMS chat, and mental health resources anywhere in the world.
          </p>
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rust hover:underline font-semibold inline-flex items-center gap-1"
          >
            findahelpline.com <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Key Country Helplines */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-ink-light">
            Direct National Helplines
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block">United States & Canada</span>
              <span className="text-ink-light">Dial or Text <b>988</b> (24/7 Free)</span>
            </div>

            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block">United Kingdom</span>
              <span className="text-ink-light">Samaritans: Dial <b>116 123</b></span>
            </div>

            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block">India</span>
              <span className="text-ink-light">KIRAN: <b>1800-599-0019</b></span>
            </div>

            <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
              <span className="font-semibold text-ink block">South Africa</span>
              <span className="text-ink-light">SADAG: <b>0800 567 567</b></span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-parchment-200 hover:bg-parchment-300 text-ink font-medium text-xs rounded-xl"
          >
            Close Support Window
          </button>
        </div>
      </div>
    </div>
  );
};
