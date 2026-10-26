'use client';

import React from 'react';
import { X, Calculator, Check } from 'lucide-react';
import { PatientParameters, Gender, CreatinineUnit, evaluatePatientRenalState } from '../lib/renal-calculator';

interface RenalModalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  params: PatientParameters;
  onUpdateParams: (params: PatientParameters) => void;
}

export const RenalModalDrawer: React.FC<RenalModalDrawerProps> = ({
  isOpen,
  onClose,
  params,
  onUpdateParams,
}) => {
  if (!isOpen) return null;

  const results = evaluatePatientRenalState(params);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_25px_-2px_rgba(15,41,66,0.18)] max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#0F2942] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#86F2E4]" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Clairance de la Créatinine (Cockcroft-Gault)
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-5 space-y-4 text-xs">
          {/* Gender */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Sexe Biologique</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateParams({ ...params, gender: 'homme' })}
                className={`py-2 px-3 font-semibold rounded text-center transition-colors ${
                  params.gender === 'homme'
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Homme
              </button>
              <button
                type="button"
                onClick={() => onUpdateParams({ ...params, gender: 'femme' })}
                className={`py-2 px-3 font-semibold rounded text-center transition-colors ${
                  params.gender === 'femme'
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Femme
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Âge (ans)</label>
              <input
                type="number"
                min="18"
                max="110"
                value={params.age}
                onChange={(e) => onUpdateParams({ ...params, age: Number(e.target.value) })}
                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Poids (kg)</label>
              <input
                type="number"
                min="30"
                max="220"
                value={params.weightKg}
                onChange={(e) => onUpdateParams({ ...params, weightKg: Number(e.target.value) })}
                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Creatinine */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">Créatininémie Sérique</label>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => onUpdateParams({ ...params, creatinineUnit: 'umol_l' })}
                  className={`px-1.5 py-0.5 rounded ${
                    params.creatinineUnit === 'umol_l'
                      ? 'bg-[#0D9488] text-white font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  µmol/L
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => onUpdateParams({ ...params, creatinineUnit: 'mg_l' })}
                  className={`px-1.5 py-0.5 rounded ${
                    params.creatinineUnit === 'mg_l'
                      ? 'bg-[#0D9488] text-white font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  mg/L
                </button>
              </div>
            </div>
            <input
              type="number"
              step="any"
              value={params.creatinineValue}
              onChange={(e) => onUpdateParams({ ...params, creatinineValue: Number(e.target.value) })}
              className="w-full h-9 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
            />
          </div>

          {/* Real-time Calculation Result */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                Clairance Estimée
              </span>
              <div className="text-2xl font-extrabold font-mono text-[#006A61] tabular-nums">
                {results.cockcroftClearanceMlMin}{' '}
                <span className="text-xs font-normal">ml/min</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Stade KDIGO
              </span>
              <span className="font-bold text-[#0F2942] text-sm">
                {results.kdigoStage}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded transition-colors"
          >
            Appliquer & Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
