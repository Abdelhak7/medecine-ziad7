'use client';

import React from 'react';
import { Plus, ShieldCheck } from 'lucide-react';

interface ClinicalHeaderProps {
  onOpenAddModal: () => void;
}

export const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1F36] text-white shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex h-14 max-w-[1720px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00A99D] text-[13px] font-extrabold tracking-tight text-white shadow-sm ring-1 ring-white/15">
            DZ
          </div>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-white sm:text-base">
                PharmaDZ Clinical
              </span>
              <ShieldCheck className="hidden h-3.5 w-3.5 text-[#5EEAD4] sm:block" />
            </div>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8BA3BF] sm:block">
              Pharmacopée & sécurité thérapeutique
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          <span className="flex items-center gap-2 rounded-md border border-[#1C3B5C] bg-[#132F4D] px-3 py-1.5 text-[11px] font-semibold text-[#CFFAF5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00A99D]" />
            Monographies & recherche
          </span>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#00A99D] px-3 py-2 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#008F85] focus-visible:outline-white sm:text-xs"
            title="Ajouter un médicament ou une spécialité"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-[#0A1B2F] px-4 py-1.5 md:hidden">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#CFFAF5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00A99D]" />
          Monographies & recherche
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#6F88A6]">
          Pharmacopée
        </span>
      </div>
    </header>
  );
};
