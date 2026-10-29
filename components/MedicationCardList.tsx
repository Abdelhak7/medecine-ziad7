'use client';

import React from 'react';
import { ArrowRight, Pill } from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';
import {
  getDrugClasses,
  getDrugSpecialties,
} from '../lib/medical-classification';

interface MedicationCardListProps {
  drugs: DrugMonograph[];
  onSelectDrug: (drug: DrugMonograph) => void;
  emptyMessage: string;
}

const regulatoryTone = (status: DrugMonograph['regulatoryStatus']) => {
  if (status === 'Liste I') {
    return 'border-red-200 bg-red-50 text-red-700';
  }
  if (status === 'Liste II') {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  if (status === 'Stupéfiant') {
    return 'border-purple-200 bg-purple-50 text-purple-800';
  }
  return 'border-slate-200 bg-slate-50 text-slate-600';
};

export const MedicationCardList: React.FC<MedicationCardListProps> = ({
  drugs,
  onSelectDrug,
  emptyMessage,
}) => {
  if (drugs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white px-5 py-7 text-center">
        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#F8FAFC]">
          <Pill className="h-4 w-4 text-slate-400" />
        </span>
        <p className="mt-2 text-xs font-semibold text-[#15263D]">{emptyMessage}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          Aucune donnée vérifiée n’est disponible dans la base actuelle.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,41,66,0.03)]">
      <div className="divide-y divide-[#F1F5F9]">
        {drugs.map((drug) => {
          const specialties = getDrugSpecialties(drug);
          const classes = getDrugClasses(drug);

          return (
            <button
              key={drug.id}
              type="button"
              onClick={() => onSelectDrug(drug)}
              className="group w-full px-4 py-3.5 text-left transition-colors hover:bg-[#F8FAFC]"
            >
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[15px] font-bold tracking-tight text-[#15263D]">
                      {drug.brandName}
                    </span>
                    <span className="text-[12px] font-semibold text-[#00A99D]">
                      {drug.dci}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${regulatoryTone(
                        drug.regulatoryStatus
                      )}`}
                    >
                      {drug.regulatoryStatus}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                    <span>{drug.presentationForm}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>{drug.standardPackaging}</span>
                  </div>

                  {(specialties.length > 0 || classes.length > 0) && (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {classes.slice(0, 2).map((pharmacologicalClass) => (
                        <span
                          key={pharmacologicalClass}
                          className="rounded border border-teal-100 bg-[#E8F8F5] px-1.5 py-0.5 text-[9px] font-semibold text-[#007A72]"
                        >
                          {pharmacologicalClass}
                        </span>
                      ))}
                      {specialties.slice(0, 2).map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
                        >
                          {specialty}
                        </span>
                      ))}
                      {specialties.length > 2 && (
                        <span className="text-[9px] font-medium text-slate-400">
                          +{specialties.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#007A72] transition-colors group-hover:text-[#0B1F36]">
                  Voir la monographie
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
