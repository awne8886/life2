import React from 'react';
import { GraduationCap, BookOpen, Users, Compass, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EducationGuideProps {
  onEnableClassroomMode: () => void;
}

export const EducationGuide: React.FC<EducationGuideProps> = ({ onEnableClassroomMode }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-left animate-fade-in space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-parchment-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-900">
          <GraduationCap className="w-4 h-4 text-indigo-700" />
          <span>Educator & Classroom Guide (/edu)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-2">
          Teaching Global Empathy with 'life'
        </h1>
        <p className="text-base font-serif italic text-ink-light">
          A pedagogical resource for secondary schools, universities, and ethics seminars.
        </p>

        <div className="mt-5">
          <button
            onClick={onEnableClassroomMode}
            className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Launch Classroom Safe Mode (?edu=1)</span>
          </button>
        </div>
      </div>

      {/* Classroom Mode Features */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-700" />
          <span>What Classroom Mode does</span>
        </h3>
        <ul className="space-y-2.5 text-sm text-ink-light">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
            <span>
              <b>Suppresses Heavy Content:</b> Holds back graphic descriptions of severe interpersonal violence, substance dependency, and self-harm while retaining accurate demographic survival rates.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
            <span>
              <b>Zero Data Collection:</b> Operates 100% offline within the student’s browser localStorage. No accounts, student emails, trackers, or cookies.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
            <span>
              <b>Disables External Links:</b> Disables commercial sharing or external forum posting.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
            <span>
              <b>Embedded Milestone Reflection Prompts:</b> Designed specifically for student written journals and classroom discussions.
            </span>
          </li>
        </ul>
      </div>

      {/* Curriculum Integration Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 bg-parchment-50 border border-parchment-300 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-rust font-semibold text-sm">
            <Compass className="w-4 h-4" />
            <span>Global Studies & Human Geography</span>
          </div>
          <h4 className="font-serif text-lg font-bold text-ink">
            The Geography of Opportunity
          </h4>
          <p className="text-xs text-ink-light leading-relaxed">
            Students explore how birthplace acts as the single largest determinant of life expectancy, literacy, and infant survival. Compare why an infant born in Norway has a 1 in 500 mortality risk compared to 1 in 9 in parts of West Africa.
          </p>
        </div>

        <div className="p-6 bg-parchment-50 border border-parchment-300 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-sage-700 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Economics & Public Policy</span>
          </div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Income Distribution & Gini Coefficients
          </h4>
          <p className="text-xs text-ink-light leading-relaxed">
            Students study how national GDP per capita and Gini coefficients shape household purchasing power parity. Understand the difference between relative domestic poverty and absolute global deprivation.
          </p>
        </div>
      </div>

      {/* Suggested Classroom Discussion Questions */}
      <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
          <Users className="w-5 h-5 text-rust" />
          <span>Discussion & Journal Questions</span>
        </h3>

        <div className="space-y-3 text-xs text-ink-light">
          <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
            <span className="font-semibold text-ink block mb-1">1. The Moral Luck of Birth</span>
            <span>
              None of us chose where, when, or to whom we were born. How should this realization influence our moral responsibilities toward people living under different circumstances?
            </span>
          </div>

          <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
            <span className="font-semibold text-ink block mb-1">2. Choices vs Circumstances</span>
            <span>
              In your simulation, how much did your character’s personal decisions alter their eventual outcome, and how much was predetermined by the infrastructure of their country?
            </span>
          </div>

          <div className="p-3 bg-parchment-100 rounded-xl border border-parchment-200">
            <span className="font-semibold text-ink block mb-1">3. The Same-Second Peers</span>
            <span>
              Look back at your four Same-Second Peers. What does it feel like to watch someone born in the exact same minute pass away before age five while another reaches university?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
