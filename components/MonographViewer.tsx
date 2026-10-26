'use client';

import React, { useState } from 'react';
import { 
  Pill, 
  AlertOctagon, 
  ShieldAlert, 
  Activity, 
  FileCheck, 
  DollarSign, 
  Plus, 
  Check, 
  HelpCircle,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';

interface MonographViewerProps {
  drug: DrugMonograph;
  isPrescribed: boolean;
  onTogglePrescription: (drug: DrugMonograph) => void;
  onOpenRenalCalculator: () => void;
  patientClearance?: number;
}

export const MonographViewer: React.FC<MonographViewerProps> = ({
  drug,
  isPrescribed,
  onTogglePrescription,
  onOpenRenalCalculator,
  patientClearance,
}) => {
  const [activeTab, setActiveTab] = useState<'posology' | 'contraindications' | 'interactions' | 'cnas' | 'pharmacokinetics'>('posology');

  // Evaluate renal status for this specific drug if patient clearance is known
  const currentRenalRule = patientClearance !== undefined
    ? drug.renalAdjustmentRules.find(
        (r) => patientClearance >= r.creatinineClearanceMin && patientClearance <= r.creatinineClearanceMax
      )
    : null;

  return (
    <article className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      {/* Monograph Top Header Slot */}
      <div className="p-6 border-b border-[#F1F5F9] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#0F2942] tracking-tight">
                {drug.brandName}
              </h1>
              {/* Micro-label regulatory status */}
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase ${
                  drug.regulatoryStatus === 'Liste I'
                    ? 'bg-red-50 text-red-800 border border-red-300'
                    : drug.regulatoryStatus === 'Liste II'
                    ? 'bg-amber-50 text-amber-800 border border-amber-300'
                    : drug.regulatoryStatus === 'Stupéfiant'
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}
              >
                {drug.regulatoryStatus}
              </span>

              {drug.cnasReimbursable && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded tracking-wide bg-[#ECFDF5] text-[#065F46] border border-emerald-200">
                  Remboursable CNAS {drug.cnasRatePercent}%
                </span>
              )}
            </div>

            {/* DCI Subtitle & Clean Unboxed Metadata with · separators (Zero-Pill discipline) */}
            <div className="text-sm font-semibold text-[#0D9488] mt-1">
              DCI : {drug.dci}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="font-medium text-slate-700">{drug.atcClassification}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{drug.atcCode}</span>
              <span aria-hidden="true">·</span>
              <span>Laboratoire : {drug.holderLaboratory}</span>
              <span aria-hidden="true">·</span>
              <span>Origine : {drug.originCountry}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTogglePrescription(drug)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shadow-xs ${
                isPrescribed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#0D9488] hover:bg-[#0F766E] text-white'
              }`}
            >
              {isPrescribed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dans la prescription</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Ajouter au plateau</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Presentation & Packaging Banner */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-semibold text-slate-700">Présentation : </span>
            <span className="text-slate-600">{drug.presentationForm}</span>
            <span className="mx-2 text-slate-400">·</span>
            <span className="text-slate-600">{drug.standardPackaging}</span>
          </div>
          <div className="font-mono tabular-nums text-slate-800 font-semibold">
            PPV Officine : <span className="text-[#0F2942] text-sm">{drug.ppvDzd.toFixed(2)} DZD</span>
          </div>
        </div>

        {/* Black Box Warning banner if present (Contraindication Crimson #DC2626) */}
        {drug.blackBoxWarning && (
          <div className="mt-3 p-3 bg-[#FEF2F2] border-[1.5px] border-[#DC2626] rounded-lg text-xs text-[#991B1B] flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="font-medium leading-relaxed">
              {drug.blackBoxWarning}
            </div>
          </div>
        )}
      </div>

      {/* Internal Functional Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-6 gap-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('posology')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'posology'
              ? 'border-[#0D9488] text-[#0F2942] font-bold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Posologie & Administration
        </button>
        <button
          onClick={() => setActiveTab('contraindications')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'contraindications'
              ? 'border-[#DC2626] text-[#DC2626] font-bold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Contre-indications ({drug.absoluteContraindications.length})
        </button>
        <button
          onClick={() => setActiveTab('cnas')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'cnas'
              ? 'border-[#0D9488] text-[#0F2942] font-bold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Remboursement CNAS & Génériques DZ ({drug.genericsAvailable.length})
        </button>
        <button
          onClick={() => setActiveTab('pharmacokinetics')}
          className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'pharmacokinetics'
              ? 'border-[#0D9488] text-[#0F2942] font-bold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Pharmacocinétique & Élimination
        </button>
      </div>

      {/* Content Zones */}
      <div className="p-6">
        {/* Tab 1: Posology & Renal Adjustments */}
        {activeTab === 'posology' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F2942] block mb-1.5">
                  Posologie Adulte
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {drug.adultDosage}
                </p>
                <div className="mt-3 text-[11px] text-slate-500 font-medium">
                  Voie d&apos;administration : <span className="font-semibold text-slate-800">{drug.administrationRoute}</span>
                </div>
              </div>

              {drug.pediatricDosage && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F2942] block mb-1.5">
                    Posologie Pédiatrique (mg/kg)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {drug.pediatricDosage}
                  </p>
                </div>
              )}
            </div>

            {drug.elderlyDosage && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <span className="font-bold text-[#0F2942]">Sujet Âgé (&gt; 75 ans) : </span>
                <span className="text-slate-700">{drug.elderlyDosage}</span>
              </div>
            )}

            {/* Renal Adjustment Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">
                    Adaptation selon la Clairance Rénale (Cockcroft-Gault)
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Ajustements posologiques obligatoires en ml/min
                  </span>
                </div>
                <button
                  onClick={onOpenRenalCalculator}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#0F2942] text-white rounded hover:bg-[#1E3A8A] transition-colors"
                >
                  Calculer clairance patient
                </button>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                {drug.renalAdjustmentRules.map((rule, idx) => {
                  const isCurrentPatientRule =
                    currentRenalRule &&
                    currentRenalRule.creatinineClearanceMin === rule.creatinineClearanceMin &&
                    currentRenalRule.creatinineClearanceMax === rule.creatinineClearanceMax;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isCurrentPatientRule ? 'bg-teal-50 border-l-4 border-l-[#0D9488]' : ''
                      }`}
                    >
                      <div className="w-48 shrink-0">
                        <span className="font-mono font-bold text-[#0F2942] tabular-nums">
                          {rule.creatinineClearanceMin} - {rule.creatinineClearanceMax} ml/min
                        </span>
                        {isCurrentPatientRule && (
                          <span className="ml-2 text-[10px] bg-[#0D9488] text-white font-bold px-1.5 py-0.2 rounded">
                            Clairance du patient ({patientClearance} ml/min)
                          </span>
                        )}
                      </div>

                      <div className="flex-1 text-slate-700">
                        {rule.adjustmentRecommendation}
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            rule.severity === 'SAFE'
                              ? 'bg-emerald-50 text-emerald-800'
                              : rule.severity === 'ADAPT'
                              ? 'bg-blue-50 text-blue-800 font-semibold'
                              : rule.severity === 'CAUTION'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {rule.severity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {drug.hepaticAdjustment && (
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <span className="font-bold">Insuffisance Hépatique : </span>
                <span>{drug.hepaticAdjustment}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contraindications */}
        {activeTab === 'contraindications' && (
          <div className="space-y-5">
            {/* Absolute Contraindications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
                  Contre-indications absolues (Arrêt impératif)
                </h2>
              </div>

              <div className="space-y-2">
                {drug.absoluteContraindications.map((ci, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#FEF2F2] border border-[#F87171] rounded-lg text-xs text-[#991B1B] font-medium flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0 mt-1.5" />
                    <span>{ci}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pregnancy & Lactation Safety */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block mb-1">Sécurité Grossesse :</span>
                <span
                  className={`font-bold ${
                    drug.pregnancySafety.includes('Contre-indiqué')
                      ? 'text-[#DC2626]'
                      : 'text-slate-800'
                  }`}
                >
                  {drug.pregnancySafety}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Sécurité Allaitement :</span>
                <span
                  className={`font-bold ${
                    drug.breastfeedingSafety.includes('Contre-indiqué')
                      ? 'text-[#DC2626]'
                      : 'text-slate-800'
                  }`}
                >
                  {drug.breastfeedingSafety}
                </span>
              </div>
            </div>

            {/* Relative Contraindications */}
            {drug.relativeContraindications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-[#D97706]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                    Contre-indications relatives & Précautions d&apos;emploi
                  </h3>
                </div>

                <div className="space-y-2">
                  {drug.relativeContraindications.map((rci, index) => (
                    <div
                      key={index}
                      className="p-3 bg-[#FFFBEB] border border-[#FCD34D] rounded-lg text-xs text-[#92400E] flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                      <span>{rci}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: CNAS Reimbursement & Algerian Generics */}
        {activeTab === 'cnas' && (
          <div className="space-y-6">
            {/* Tariff overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Prix Public Vente (PPV)
                </span>
                <div className="text-xl font-bold font-mono text-[#0F2942] tabular-nums">
                  {drug.ppvDzd.toFixed(2)} <span className="text-xs font-normal">DZD</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Tarif Référence CNAS
                </span>
                <div className="text-xl font-bold font-mono text-[#0D9488] tabular-nums">
                  {drug.referenceTarifDzd.toFixed(2)} <span className="text-xs font-normal">DZD</span>
                </div>
              </div>

              <div className="p-4 bg-[#ECFDF5] border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-emerald-800 uppercase tracking-wider font-semibold block mb-1">
                  Prise en charge Chifa
                </span>
                <div className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                  {drug.cnasRatePercent}%
                </div>
                <span className="text-[11px] text-emerald-700">Régime général & ALD</span>
              </div>
            </div>

            {/* Algerian Generics List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">
                  Génériques Homologués en Algérie (Substitution Saidal / Biopharm / Hikma)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {drug.genericsAvailable.length} équivalents bio-équivalents
                </span>
              </div>

              {drug.genericsAvailable.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                  Aucun générique homologué enregistré pour ce princeps dans la nomenclature courante.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                  {drug.genericsAvailable.map((gen, idx) => {
                    const diffDzd = drug.ppvDzd - gen.ppvDzd;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F2942] text-sm">
                              {gen.tradeName}
                            </span>
                            <span className="text-[11px] text-slate-500">({gen.laboratory})</span>
                          </div>
                          <span className="text-slate-500 text-[11px]">{gen.dosageForm}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900 tabular-nums text-sm block">
                              {gen.ppvDzd.toFixed(2)} DZD
                            </span>
                            {diffDzd > 0 && (
                              <span className="text-[10px] text-emerald-700 font-medium">
                                Économie : {diffDzd.toFixed(2)} DZD
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Chifa 100%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Pharmacokinetics */}
        {activeTab === 'pharmacokinetics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Biodisponibilité
                </span>
                <span className="font-medium text-slate-800">{drug.pharmacokinetics.bioavailability}</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Demi-vie d&apos;élimination (T 1/2)
                </span>
                <span className="font-mono font-semibold text-[#0F2942]">{drug.pharmacokinetics.halfLifeHours}</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Liaison aux protéines plasmatiques
                </span>
                <span className="font-medium text-slate-800">{drug.pharmacokinetics.plasmaProteinBinding}</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Voie d&apos;élimination principale
                </span>
                <span className="font-medium text-slate-800">{drug.pharmacokinetics.elimination}</span>
              </div>
            </div>

            {drug.pharmacokinetics.therapeuticRange && (
              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
                <span className="font-bold">Zone Thérapeutique Efficace / Fenêtre Thérapeutique : </span>
                <span className="font-mono font-semibold">{drug.pharmacokinetics.therapeuticRange}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
