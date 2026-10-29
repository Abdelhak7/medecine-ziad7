'use client';

import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import {
  DRUG_INTERACTIONS_RULES,
  DrugMonograph,
} from '../lib/pharmacopoeia-data';
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

const severityTone: Record<string, string> = {
  CONTRAINDICATION_ABSOLUE: 'border-red-200 bg-red-50 text-red-700',
  ASSOCIATION_DECONSEILLEE: 'border-red-200 bg-red-50 text-red-700',
  PRECAUTION_EMPLOI: 'border-amber-200 bg-amber-50 text-amber-700',
  PRISE_EN_COMPTE: 'border-slate-200 bg-slate-50 text-slate-600',
};

interface SafetyAccordionProps {
  title: string;
  count: number;
  tone: 'danger' | 'warning' | 'neutral';
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const SafetyAccordion: React.FC<SafetyAccordionProps> = ({
  title,
  count,
  tone,
  defaultOpen = false,
  children,
}) => {
  const toneClasses =
    tone === 'danger'
      ? {
          header: 'border-red-100 bg-red-50/50',
          icon: 'bg-white text-red-600 ring-red-100',
          count: 'border-red-200 bg-white text-red-700',
        }
      : tone === 'warning'
      ? {
          header: 'border-amber-100 bg-amber-50/50',
          icon: 'bg-white text-amber-600 ring-amber-100',
          count: 'border-amber-200 bg-white text-amber-700',
        }
      : {
          header: 'border-[#E2E8F0] bg-[#F8FAFC]',
          icon: 'bg-white text-slate-500 ring-[#E2E8F0]',
          count: 'border-[#E2E8F0] bg-white text-slate-600',
        };

  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-lg border border-[#E2E8F0] bg-white"
    >
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 border-b px-3.5 py-2.5 transition-colors hover:bg-white ${toneClasses.header}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1 ${toneClasses.icon}`}
          >
            {tone === 'danger' ? (
              <AlertOctagon className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
          </span>
          <span className="truncate text-[11px] font-bold text-[#15263D]">
            {title}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span
            className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold ${toneClasses.count}`}
          >
            {count}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="p-3">{children}</div>
    </details>
  );
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
  const drugNameById = new Map(
    drugs.map((drug) => [drug.id, drug.brandName])
  );
  const absoluteContraindications = medications.flatMap((drug) =>
    drug.absoluteContraindications.map((text) => ({ drug, text }))
  );
  const relativeContraindications = medications.flatMap((drug) =>
    drug.relativeContraindications.map((text) => ({ drug, text }))
  );
  const blackBoxWarnings = medications.filter((drug) => drug.blackBoxWarning);
  const safetyItemCount =
    absoluteContraindications.length +
    relativeContraindications.length +
    interactions.length +
    blackBoxWarnings.length;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 transition-colors hover:text-[#00A99D]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour
      </button>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,41,66,0.03)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#00A99D]">
              Pathologie
            </p>
            <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-[#15263D] sm:text-[24px]">
              {pathology.name}
            </h1>
            <p className="mt-1.5 max-w-3xl text-[12px] leading-relaxed text-slate-600">
              {pathology.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5">
            <Layers className="h-3.5 w-3.5 text-[#00A99D]" />
            <span className="text-[10px] font-semibold text-[#15263D]">
              {medications.length} médicament
              {medications.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {(specialtyNames.length > 0 || classes.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#F1F5F9] pt-3">
            {specialtyNames.map((specialty) => (
              <span
                key={specialty}
                className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
              >
                {specialty}
              </span>
            ))}
            {classes.map((pharmacologicalClass) => (
              <span
                key={pharmacologicalClass}
                className="rounded border border-teal-100 bg-[#E8F8F5] px-1.5 py-0.5 text-[9px] font-semibold text-[#007A72]"
              >
                {pharmacologicalClass}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#00A99D]" />
            <h2 className="text-[16px] font-bold text-[#15263D]">
              Médicaments associés
            </h2>
          </div>
          <span className="font-mono text-[9px] font-semibold text-slate-400">
            {medications.length} référencé{medications.length > 1 ? 's' : ''}
          </span>
        </div>
        <MedicationCardList
          drugs={medications}
          onSelectDrug={onSelectDrug}
          emptyMessage="Aucun médicament associé à cette pathologie."
        />
      </section>

      <section className="space-y-2">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-[#15263D]">
                Contre-indications et interactions vérifiées
              </h2>
              <p className="text-[10px] text-slate-500">
                Données issues de la base clinique actuelle
              </p>
            </div>
          </div>
          <span className="self-start rounded-md border border-[#E2E8F0] bg-white px-2 py-1 font-mono text-[9px] font-semibold text-slate-500 sm:self-auto">
            {safetyItemCount} élément{safetyItemCount > 1 ? 's' : ''} de sécurité
          </span>
        </div>

        <div className="space-y-2">
          {blackBoxWarnings.length > 0 && (
            <SafetyAccordion
              title="Avertissements majeurs"
              count={blackBoxWarnings.length}
              tone="danger"
              defaultOpen
            >
              <div className="space-y-2">
                {blackBoxWarnings.map((drug) => (
                  <div
                    key={drug.id}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2"
                  >
                    <p className="text-[10px] font-bold text-red-800">
                      {drug.brandName}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-red-700">
                      {drug.blackBoxWarning}
                    </p>
                  </div>
                ))}
              </div>
            </SafetyAccordion>
          )}

          <SafetyAccordion
            title="Contre-indications absolues"
            count={absoluteContraindications.length}
            tone="danger"
            defaultOpen
          >
            {absoluteContraindications.length === 0 ? (
              <p className="px-1 py-2 text-[11px] text-slate-500">
                Aucune contre-indication absolue renseignée dans la base.
              </p>
            ) : (
              <div className="space-y-1.5">
                {absoluteContraindications.map(({ drug, text }, index) => (
                  <div
                    key={`${drug.id}-absolute-${index}`}
                    className="flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50/50 px-2.5 py-2"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-red-700">
                        {drug.brandName}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-red-800">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SafetyAccordion>

          <SafetyAccordion
            title="Contre-indications relatives"
            count={relativeContraindications.length}
            tone="warning"
          >
            {relativeContraindications.length === 0 ? (
              <p className="px-1 py-2 text-[11px] text-slate-500">
                Aucune contre-indication relative renseignée dans la base.
              </p>
            ) : (
              <div className="space-y-1.5">
                {relativeContraindications.map(({ drug, text }, index) => (
                  <div
                    key={`${drug.id}-relative-${index}`}
                    className="flex items-start gap-2.5 rounded-md border border-amber-100 bg-amber-50/50 px-2.5 py-2"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-amber-700">
                        {drug.brandName}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SafetyAccordion>

          <SafetyAccordion
            title="Interactions médicamenteuses"
            count={interactions.length}
            tone="warning"
            defaultOpen
          >
            {interactions.length === 0 ? (
              <p className="px-1 py-2 text-[11px] leading-relaxed text-slate-500">
                Aucune interaction référencée dans la base pour cette association.
              </p>
            ) : (
              <div className="space-y-2">
                {interactions.map((interaction) => {
                  const tone =
                    severityTone[interaction.severity] ??
                    severityTone.PRISE_EN_COMPTE;
                  return (
                    <div
                      key={
                        interaction.id ??
                        `${interaction.drugAId}-${interaction.drugBId}`
                      }
                      className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${tone}`}
                        >
                          {severityLabels[interaction.severity]}
                        </span>
                        <span className="text-[10px] font-semibold text-[#15263D]">
                          {drugNameById.get(interaction.drugAId) ??
                            interaction.drugAId}
                          <span className="mx-1 text-slate-400">+</span>
                          {drugNameById.get(interaction.drugBId) ??
                            interaction.drugBId}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700">
                        {interaction.riskDescription}
                      </p>
                      <p className="mt-1.5 border-t border-[#E2E8F0] pt-1.5 text-[10px] leading-relaxed text-slate-500">
                        <span className="font-semibold text-slate-600">
                          Conduite à tenir :
                        </span>{' '}
                        {interaction.actionProtocol}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </SafetyAccordion>
        </div>
      </section>
    </div>
  );
};
