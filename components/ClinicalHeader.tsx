'use client';

import React from 'react';
import { ShieldAlert, Stethoscope, ShoppingBag, AlertTriangle } from 'lucide-react';

interface ClinicalHeaderProps {
  currentTab: 'monographs' | 'matrix' | 'renal' | 'cnas' | 'emergency';
  onTabChange: (tab: 'monographs' | 'matrix' | 'renal' | 'cnas' | 'emergency') => void;
  prescribedCount: number;
  hasContraindication: boolean;
  onOpenPrescriptionTray: () => void;
}

export const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({
  currentTab,
  onTabChange,
  prescribedCount,
  hasContraindication,
  onOpenPrescriptionTray,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F2942] text-white border-b border-[#1E3A5F]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark as per Top Bar Contract) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('monographs')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-[#0D9488] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              DZ
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                PharmaDZ Clinical
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-[#7991AF] uppercase tracking-wider">
                Pharmacopée & Sécurité Thérapeutique
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('monographs')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs uppercase tracking-wider ${
              currentTab === 'monographs'
                ? 'text-[#86F2E4] border-[#0D9488] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Monographies & Recherche
          </button>
          <button
            onClick={() => onTabChange('matrix')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs uppercase tracking-wider ${
              currentTab === 'matrix'
                ? 'text-[#86F2E4] border-[#0D9488] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Matrice des Interactions
          </button>
          <button
            onClick={() => onTabChange('renal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs uppercase tracking-wider ${
              currentTab === 'renal'
                ? 'text-[#86F2E4] border-[#0D9488] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Calculateur Rénal
          </button>
          <button
            onClick={() => onTabChange('cnas')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs uppercase tracking-wider ${
              currentTab === 'cnas'
                ? 'text-[#86F2E4] border-[#0D9488] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Formulaire CNAS
          </button>
          <button
            onClick={() => onTabChange('emergency')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs uppercase tracking-wider ${
              currentTab === 'emergency'
                ? 'text-[#86F2E4] border-[#0D9488] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Protocoles d&apos;Urgence
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPrescriptionTray}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded transition-all whitespace-nowrap shrink-0 ${
              hasContraindication
                ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white animate-pulse'
                : prescribedCount > 0
                ? 'bg-[#0D9488] hover:bg-[#0F766E] text-white'
                : 'bg-[#1E3A5F] hover:bg-[#2B4C74] text-slate-200'
            }`}
          >
            {hasContraindication ? (
              <AlertTriangle className="w-4 h-4 text-white" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
            <span>Plateau Prescription ({prescribedCount})</span>
            {hasContraindication && (
              <span className="bg-white text-[#DC2626] font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-0.5">
                Alerte
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-[#0A1D30] border-t border-[#1E3A5F] overflow-x-auto text-xs">
        <button
          onClick={() => onTabChange('monographs')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'monographs' ? 'bg-[#0D9488] text-white font-medium' : 'text-slate-300'
          }`}
        >
          Monographies
        </button>
        <button
          onClick={() => onTabChange('matrix')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'matrix' ? 'bg-[#0D9488] text-white font-medium' : 'text-slate-300'
          }`}
        >
          Interactions
        </button>
        <button
          onClick={() => onTabChange('renal')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'renal' ? 'bg-[#0D9488] text-white font-medium' : 'text-slate-300'
          }`}
        >
          Clairance
        </button>
        <button
          onClick={() => onTabChange('cnas')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'cnas' ? 'bg-[#0D9488] text-white font-medium' : 'text-slate-300'
          }`}
        >
          CNAS (DZD)
        </button>
        <button
          onClick={() => onTabChange('emergency')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'emergency' ? 'bg-[#0D9488] text-white font-medium' : 'text-slate-300'
          }`}
        >
          Urgences
        </button>
      </div>
    </header>
  );
};
