'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { 
  PatientParameters, 
  Gender, 
  CreatinineUnit,
  evaluatePatientRenalState 
} from '../lib/renal-calculator';
import { ALGERIAN_DRUG_DATABASE, DrugMonograph } from '../lib/pharmacopoeia-data';

interface RenalDoseCalculatorScreenProps {
  initialParams: PatientParameters;
  onUpdateParams: (params: PatientParameters) => void;
  onSelectDrugForMonograph?: (drug: DrugMonograph) => void;
}

export const RenalDoseCalculatorScreen: React.FC<RenalDoseCalculatorScreenProps> = ({
  initialParams,
  onUpdateParams,
  onSelectDrugForMonograph,
}) => {
  const [gender, setGender] = useState<Gender>(initialParams.gender);
  const [age, setAge] = useState<number>(initialParams.age);
  const [weightKg, setWeightKg] = useState<number>(initialParams.weightKg);
  const [creatinineValue, setCreatinineValue] = useState<number>(initialParams.creatinineValue);
  const [creatinineUnit, setCreatinineUnit] = useState<CreatinineUnit>(initialParams.creatinineUnit);

  const currentParams: PatientParameters = {
    gender,
    age,
    weightKg,
    creatinineValue,
    creatinineUnit,
  };

  const results = evaluatePatientRenalState(currentParams, ALGERIAN_DRUG_DATABASE);

  const handleApply = () => {
    onUpdateParams(currentParams);
  };

  const handleReset = () => {
    setGender('homme');
    setAge(68);
    setWeightKg(72);
    setCreatinineValue(130);
    setCreatinineUnit('umol_l');
    onUpdateParams({
      gender: 'homme',
      age: 68,
      weightKg: 72,
      creatinineValue: 130,
      creatinineUnit: 'umol_l',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
            <Calculator className="w-4 h-4 text-[#0D9488]" />
            <span>Néphrologie Clinique & Pharmacocinétique</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F2942] tracking-tight mt-1">
            Calculateur de Clairance Rénale & Adaptation Posologique
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formules de Cockcroft-Gault & CKD-EPI avec recalcul dynamique instantané des posologies et contre-indications.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Numeric inputs & patient parameters */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">
            Paramètres Biologiques du Patient
          </h2>

          {/* Sexe Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sexe Biologique
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setGender('homme');
                  onUpdateParams({ ...currentParams, gender: 'homme' });
                }}
                className={`py-2 px-3 text-xs font-bold rounded transition-colors text-center ${
                  gender === 'homme'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Homme (k = 1.23)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGender('femme');
                  onUpdateParams({ ...currentParams, gender: 'femme' });
                }}
                className={`py-2 px-3 text-xs font-bold rounded transition-colors text-center ${
                  gender === 'femme'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Femme (k = 1.04)
              </button>
            </div>
          </div>

          {/* Age (years) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Âge du Patient</label>
              <span className="font-mono font-bold text-xs text-[#0F2942]">{age} ans</span>
            </div>
            <input
              type="number"
              min="18"
              max="110"
              value={age}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAge(val);
                onUpdateParams({ ...currentParams, age: val });
              }}
              className="w-full h-10 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          {/* Weight (kg) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Poids Corporel Réel</label>
              <span className="font-mono font-bold text-xs text-[#0F2942]">{weightKg} kg</span>
            </div>
            <input
              type="number"
              min="30"
              max="220"
              value={weightKg}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWeightKg(val);
                onUpdateParams({ ...currentParams, weightKg: val });
              }}
              className="w-full h-10 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          {/* Creatinine with unit switch */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Créatininémie Sérique</label>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setCreatinineUnit('umol_l');
                    onUpdateParams({ ...currentParams, creatinineUnit: 'umol_l' });
                  }}
                  className={`px-1.5 py-0.5 rounded ${
                    creatinineUnit === 'umol_l'
                      ? 'bg-[#0D9488] text-white font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  µmol/L
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setCreatinineUnit('mg_l');
                    onUpdateParams({ ...currentParams, creatinineUnit: 'mg_l' });
                  }}
                  className={`px-1.5 py-0.5 rounded ${
                    creatinineUnit === 'mg_l'
                      ? 'bg-[#0D9488] text-white font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  mg/L
                </button>
              </div>
            </div>
            <input
              type="number"
              step="any"
              min="10"
              max="1500"
              value={creatinineValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCreatinineValue(val);
                onUpdateParams({ ...currentParams, creatinineValue: val });
              }}
              className="w-full h-10 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:border-[#0D9488]"
            />
          </div>

          {/* Primary Formula explanation */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed font-mono">
            Cockcroft-Gault : ClCr = [(140 - Âge) x Poids x {gender === 'homme' ? '1.23' : '1.04'}] / Créatinine (µmol/L)
          </div>
        </div>

        {/* Right Column: Calculated Outputs & Drug Adjustment Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diagnostic Clearance Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cockcroft-Gault Output */}
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Clairance Cockcroft-Gault
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-[#0F2942] tabular-nums">
                  {results.cockcroftClearanceMlMin}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                  ml/min
                </span>
              </div>
              <div className="mt-2 text-xs font-medium text-slate-600">
                Référence pour l&apos;adaptation posologique AMM
              </div>
            </div>

            {/* CKD-EPI Output */}
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                DFG Estimé (CKD-EPI)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-[#0D9488] tabular-nums">
                  {results.ckdEpiGfrMlMin}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                  ml/min/1.73m²
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-700">
                Stade KDIGO : <span className="text-[#0F2942]">{results.kdigoStage}</span>
              </div>
            </div>
          </div>

          {/* KDIGO Stage Diagnosis Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              results.isRenalFailureSevere
                ? 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]'
                : results.cockcroftClearanceMlMin < 60
                ? 'bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]'
                : 'bg-[#ECFDF5] border-emerald-300 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {results.isRenalFailureSevere ? (
                <AlertOctagon className="w-5 h-5 text-[#DC2626] shrink-0" />
              ) : results.cockcroftClearanceMlMin < 60 ? (
                <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <div>
                <span className="font-bold block uppercase text-[11px] tracking-wider">
                  Classification Clinique KDIGO : {results.kdigoStage}
                </span>
                <span className="font-medium">{results.kdigoLabel}</span>
              </div>
            </div>

            {results.isRenalFailureSevere && (
              <span className="shrink-0 bg-[#DC2626] text-white font-bold text-[10px] px-2 py-1 rounded">
                Insuffisance Sévère
              </span>
            )}
          </div>

          {/* Dynamic Drug Adaptation Table for this Clearance */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">
                Recommandations Thérapeutiques Spécifiques (ClCr = {results.cockcroftClearanceMlMin} ml/min)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {results.adjustedDoses.length} molécules analysées
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {results.adjustedDoses.map((item) => {
                const isContraindicated = item.status === 'CONTRAINDICATED';
                const isAdapt = item.status === 'ADAPT';
                const isCaution = item.status === 'CAUTION';

                return (
                  <div
                    key={item.drugId}
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isContraindicated
                        ? 'bg-red-50/50'
                        : isAdapt
                        ? 'bg-blue-50/40'
                        : isCaution
                        ? 'bg-amber-50/40'
                        : ''
                    }`}
                  >
                    <div className="w-48 shrink-0">
                      <span className="font-bold text-[#0F2942] text-sm block">
                        {item.brandName}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.dci}</span>
                    </div>

                    <div className="flex-1 text-slate-800 font-medium leading-relaxed">
                      {item.recommendation}
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                          isContraindicated
                            ? 'bg-[#DC2626] text-white'
                            : isAdapt
                            ? 'bg-blue-700 text-white'
                            : isCaution
                            ? 'bg-[#D97706] text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
