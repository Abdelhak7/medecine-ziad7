'use client';

import React from 'react';
import { ArrowRight, Pill } from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';
import { getDrugClasses, getDrugSpecialties } from '../lib/medical-classification';

interface MedicationCardListProps {
  drugs: DrugMonograph[];
  onSelectDrug: (drug: DrugMonograph) => void;
  emptyMessage: string;
}

export const MedicationCardList: React.FC<MedicationCardListProps> = ({
  drugs,
  onSelectDrug,
  emptyMessage,
}) => {
  if (drugs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <Pill className="mx-auto mb-2 h-5 w-5 text-slate-400" />
        <p className="text-sm font-semibold text-[#0F2942]">{emptyMessage}</p>
        <p className="mt-1 text-xs text-slate-500">
          Aucune donnée vérifiée n’est disponible dans la base actuelle.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
      <div className="divide-y divide-slate-100">
        {drugs.map((drug) => {
          const specialties = getDrugSpecialties(drug);
          const classes = getDrugClasses(drug);

          return (
            <button
              key={drug.id}
              type="button"
              onClick={() => onSelectDrug(drug)}
              className="group w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#0F2942]">
                      {drug.brandName}
                    </span>
                    <span className="text-xs font-semibold text-[#0D9488]">
                      {drug.dci}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        drug.regulatoryStatus === 'Liste I'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : drug.regulatoryStatus === 'Liste II'
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : drug.regulatoryStatus === 'Stupéfiant'
                          ? 'border-purple-200 bg-purple-50 text-purple-800'
                          : 'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      {drug.regulatoryStatus}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                    <span>{drug.presentationForm}</span>
                    <span aria-hidden="true">·</span>
                    <span>{drug.standardPackaging}</span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {specialty}
                      </span>
                    ))}
                    {specialties.length > 3 && (
                      <span className="text-[10px] font-medium text-slate-400">
                        +{specialties.length - 3}
                      </span>
                    )}
                    {classes.map((pharmacologicalClass) => (
                      <span
                        key={pharmacologicalClass}
                        className="rounded border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800"
                      >
                        {pharmacologicalClass}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#0D9488] group-hover:text-[#0F766E]">
                  Monographie
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
