'use client';

import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';
import {
  getDrugClasses,
  getDrugSpecialties,
  normalizeSearchText,
} from '../lib/medical-classification';

interface SpecialtySidebarProps {
  specialties: string[];
  classes: string[];
  selectedSpecialty: string;
  selectedClass: string;
  onSelectSpecialty: (specialty: string) => void;
  onSelectClass: (pharmacologicalClass: string) => void;
  drugs: DrugMonograph[];
}

export const SpecialtySidebar: React.FC<SpecialtySidebarProps> = ({
  specialties,
  classes,
  selectedSpecialty,
  selectedClass,
  onSelectSpecialty,
  onSelectClass,
  drugs,
}) => {
  const [specialtyQuery, setSpecialtyQuery] = useState('');
  const [classQuery, setClassQuery] = useState('');

  const getSpecialtyCount = (specialty: string) => {
    return drugs.filter(
      (drug) =>
        (specialty === 'Toutes' || getDrugSpecialties(drug).includes(specialty)) &&
        (selectedClass === 'Toutes' || getDrugClasses(drug).includes(selectedClass))
    ).length;
  };

  const getClassCount = (pharmacologicalClass: string) => {
    return drugs.filter(
      (drug) =>
        (pharmacologicalClass === 'Toutes' ||
          getDrugClasses(drug).includes(pharmacologicalClass)) &&
        (selectedSpecialty === 'Toutes' ||
          getDrugSpecialties(drug).includes(selectedSpecialty))
    ).length;
  };

  const visibleSpecialties = specialties.filter((specialty) =>
    normalizeSearchText(specialty).includes(normalizeSearchText(specialtyQuery))
  );

  const visibleClasses = classes.filter((pharmacologicalClass) =>
    normalizeSearchText(pharmacologicalClass).includes(normalizeSearchText(classQuery))
  );

  const renderFilterButton = (
    label: string,
    count: number,
    isSelected: boolean,
    onClick: () => void
  ) => (
    <button
      key={label}
      onClick={onClick}
      aria-pressed={isSelected}
      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs rounded transition-colors text-left font-medium ${
        isSelected
          ? 'bg-[#0F2942] text-white font-semibold'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {count}
      </span>
    </button>
  );

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5 text-sm">
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#0F2942]">
          <Filter className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Médicaments</span>
        </div>

        <div className="space-y-4">
          <section>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Spécialités
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {specialties.length - 1}
              </span>
            </div>

            <div className="relative mb-1.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={specialtyQuery}
                onChange={(event) => setSpecialtyQuery(event.target.value)}
                placeholder="Rechercher une spécialité"
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-[11px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white"
              />
            </div>

            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {visibleSpecialties.length === 0 ? (
                <p className="px-1 py-2 text-[11px] text-slate-500">
                  Aucune spécialité trouvée.
                </p>
              ) : (
                visibleSpecialties.map((specialty) =>
                  renderFilterButton(
                    specialty,
                    getSpecialtyCount(specialty),
                    selectedSpecialty === specialty,
                    () => onSelectSpecialty(specialty)
                  )
                )
              )}
            </div>
          </section>

          <section className="border-t border-slate-100 pt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Classes pharmacologiques
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {classes.length - 1}
              </span>
            </div>

            <div className="relative mb-1.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={classQuery}
                onChange={(event) => setClassQuery(event.target.value)}
                placeholder="Rechercher une classe"
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-[11px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white"
              />
            </div>

            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {visibleClasses.length === 0 ? (
                <p className="px-1 py-2 text-[11px] text-slate-500">
                  Aucune classe trouvée.
                </p>
              ) : (
                visibleClasses.map((pharmacologicalClass) =>
                  renderFilterButton(
                    pharmacologicalClass,
                    getClassCount(pharmacologicalClass),
                    selectedClass === pharmacologicalClass,
                    () => onSelectClass(pharmacologicalClass)
                  )
                )
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="p-3 bg-[#F1F5F9] border border-slate-200 rounded-xl text-xs text-slate-600">
        <span className="font-bold text-[#0F2942] block mb-1">Avis de Garde Clinique :</span>
        Toute association d&apos;anticoagulants ou d&apos;antiarythmiques nécessite un contrôle ECG préalable et une clairance de Cockcroft-Gault actualisée.
      </div>
    </aside>
  );
};
