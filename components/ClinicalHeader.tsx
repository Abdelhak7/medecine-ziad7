'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface ClinicalHeaderProps {
  onOpenAddModal: () => void;
}

export const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({ onOpenAddModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F2942] text-white border-b border-[#1E3A5F]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded bg-[#0D9488] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              DZ
            </div>
            <div className="leading-tight min-w-0">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                PharmaDZ Clinical
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-[#7991AF] uppercase tracking-wider">
                Pharmacopée & Sécurité Thérapeutique
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Single active navigation item */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <span className="whitespace-nowrap shrink-0 py-1 border-b-2 border-[#0D9488] text-xs uppercase tracking-wider text-[#86F2E4] font-semibold">
            Monographies & Recherche
          </span>
        </nav>

        {/* Zone 3: primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border border-[#2B4C74] bg-[#1E3A5F] hover:bg-[#2B4C74] text-slate-200 transition-colors whitespace-nowrap shrink-0"
            title="Ajouter un médicament ou une spécialité"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar: single active section */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-[#0A1D30] border-t border-[#1E3A5F] overflow-x-auto text-xs">
        <span className="px-2.5 py-1 whitespace-nowrap rounded bg-[#0D9488] text-white font-medium">
          Monographies
        </span>
      </div>
    </header>
  );
};
