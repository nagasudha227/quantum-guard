import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, ArrowLeftRight, FlaskConical, ArrowRight } from 'lucide-react';
import { QuantumWave } from '../components/common/QuantumWave';

interface FeatureCard {
  id: string;
  path: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const featureCards: FeatureCard[] = [
  {
    id: 'discovery',
    path: '/inventory',
    title: 'Discovery',
    description: 'Identify cryptographic algorithms and usage',
    icon: Search,
  },
  {
    id: 'risk',
    path: '/assessment',
    title: 'Risk Assessment',
    description: 'Analyze quantum vulnerabilities',
    icon: ShieldCheck,
  },
  {
    id: 'migration',
    path: '/migration',
    title: 'Migration Advisor',
    description: 'Get PQC upgrade recommendations',
    icon: ArrowLeftRight,
  },
  {
    id: 'lab',
    path: '/lab',
    title: 'Crypto Lab',
    description: 'Test classical, PQC, and hybrid operations',
    icon: FlaskConical,
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pt-8 pb-12">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center min-h-[220px]">
        {/* Subtle Waveform graphic placed in the upper right background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none hidden md:block">
          <QuantumWave className="w-full h-full object-cover translate-x-8" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E8EAF0] leading-snug">
            Post-Quantum Security Platform
          </h1>

          <p className="text-sm sm:text-base text-[#969DAB] font-normal leading-relaxed">
            Discover, assess, and migrate your cryptographic infrastructure for a quantum-safe future.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/assessment')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium bg-[#4E65C6] hover:bg-[#4257B2] text-white transition-colors shadow-sm"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Four Feature Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="group p-6 rounded-2xl bg-[#181D28] border border-[#292F3B] hover:border-[#384358] hover:bg-[#1B2230] transition-colors cursor-pointer flex flex-col justify-between min-h-[175px]"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1F2739] border border-[#2B364E] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#8290C9] stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#E8EAF0] group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#969DAB] mt-1.5 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

