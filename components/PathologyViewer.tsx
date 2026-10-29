'use client';

import React from 'react';
import { AlertTriangle, ArrowLeft, Layers, ShieldAlert } from 'lucide-react';
import { DrugMonograph, DRUG_INTERACTIONS_RULES } from '../lib/pharmacopoeia-data';
import {
  getPathologyMedications,
  getPathologySpecialtyNames,
  Pathology,
} from '../lib/pathology-data';
import { getDrugClasses } from '../lib/medical-classification';
import { MedicationCardList } from './MedicationCardList';

interface PathologyViewerProps {
  pathology: Pathology;
  drugs: DrugMonograph[];
  specialties: { id: string; name: string }[];
  onSelectDrug: (drug: DrugMonograph) => void;
  onBack: () => void;
}

const severityLabels: Record<string, string> = {
  CONTRAINDICATION_ABSOLUE: 'Contre-indication absolue',
  ASSOCIATION_DECONSEILLEE: 'Association déconseillée',
  PRECAUTION_EMPLOI: 'Précaution d’emploi',
  PRISE_EN_COMPTE: 'Prise en compte',
};

export const PathologyViewer: React.FC<PathologyViewerProps> = ({
  pathology,
  drugs,
  specialties,
  onSelectDrug,
  onBack,
}) => {
  const medications = getPathologyMedications(pathology, drugs);
  const specialtyNames = getPathologySpecialtyNames(pathology, specialties);
  const classes = Array.from(
    new Set(medications.flatMap((drug) => getDrugClasses(drug)))
  );
  const medicationIds = new Set(medications.map((drug) => drug.id));
  const interactions = DRUG_INTERACTIONS_RULES.filter(
    (rule) => medicationIds.has(rule.drugAId) && medicationIds.has(rule.drugBId)
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-[#0D9488]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour
      </button>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
              Pathologie
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0F2942]">
              {pathology.name}
            </h1>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-600">
              {pathology.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {medications.length} médicament{medications.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {specialtyNames.map((specialty) => (
            <span
              key={specialty}
              className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {specialty}
            </span>
          ))}
          {classes.map((pharmacologicalClass) => (
            <span
              key={pharmacologicalClass}
              className="rounded border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800"
            >
              {pharmacologicalClass}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#0D9488]" />
          <h2 className="text-sm font-bold text-[#0F2942]">Médicaments associés</h2>
        </div>
        <MedicationCardList
          drugs={medications}
          onSelectDrug={onSelectDrug}
          emptyMessage="Aucun médicament associé à cette pathologie."
        />
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#DC2626]" />
          <h2 className="text-sm font-bold text-[#0F2942]">
            Contre-indications et interactions vérifiées
          </h2>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="space-y-2">
            {medications.map((drug) => (
              <details
                key={drug.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2"
              >
                <summary className="cursor-pointer text-xs font-semibold text-[#0F2942]">
                  {drug.brandName} — contre-indications absolues (
                  {drug.absoluteContraindications.length})
                </summary>
                {drug.blackBoxWarning && (
                  <p className="mt-2 rounded border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] font-medium text-red-800">
                    {drug.blackBoxWarning}
                  </p>
                )}
                {drug.absoluteContraindications.length === 0 ? (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Aucune contre-indication absolue renseignée dans la base.
                  </p>
                ) : (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-600">
                    {drug.absoluteContraindications.map((contraindication) => (
                      <li key={contraindication}>{contraindication}</li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            {interactions.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                Aucune interaction n’est référencée dans la base pour cette association.
              </p>
            ) : (
              <div className="space-y-2">
                {interactions.map((interaction) => (
                  <div
                    key={interaction.id ?? `${interaction.drugAId}-${interaction.drugBId}`}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                      <div>
                        <p className="text-[11px] font-bold text-amber-900">
                          {severityLabels[interaction.severity]}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900">
                          {interaction.riskDescription}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-amber-800">
                          {interaction.actionProtocol}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
