'use client';

import React from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Trash2, 
  X, 
  Calculator, 
  CheckCircle2
} from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';
import { PrescriptionAnalysisResult } from '../lib/prescription-checker';

interface InteractionScreeningDrawerProps {
  prescribedDrugs: DrugMonograph[];
  onRemoveDrug: (drugId: string) => void;
  onClearPrescription: () => void;
  analysis: PrescriptionAnalysisResult;
  patientClearance: number;
  onOpenRenalModal: () => void;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const InteractionScreeningDrawer: React.FC<InteractionScreeningDrawerProps> = ({
  prescribedDrugs,
  onRemoveDrug,
  onClearPrescription,
  analysis,
  patientClearance,
  onOpenRenalModal,
  onClose,
  isMobileDrawer = false,
}) => {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-xs ${
        isMobileDrawer ? 'h-full max-h-[90vh]' : 'w-80 lg:w-88 shrink-0'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#F1F5F9] bg-[#15263D] text-white rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#B8F1EA]" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Plateau de Sécurité Thérapeutique
            </h2>
            <span className="text-[10px] text-slate-300 font-medium">
              Contrôle croisé & interactions en direct
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {prescribedDrugs.length > 0 && (
            <button
              onClick={onClearPrescription}
              className="text-[10px] text-slate-300 hover:text-white transition-colors underline"
              title="Vider la sélection"
            >
              Vider
            </button>
          )}
          {isMobileDrawer && onClose && (
            <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body content with scrolling */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        {/* Prescription basket list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#15263D] uppercase text-[11px] tracking-wider">
              Médiations Actives ({prescribedDrugs.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ClCr : {patientClearance} ml/min
            </span>
          </div>

          {prescribedDrugs.length === 0 ? (
            <div className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-slate-500">
              <p className="text-xs">Aucun médicament dans la prescription en cours.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Cliquez sur &ldquo;+ Plateau&rdquo; dans une monographie pour tester les interactions.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {prescribedDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate">
                      {drug.brandName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {drug.dci}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onRemoveDrug(drug.id)}
                      className="p-1 text-slate-400 hover:text-[#DC2626] transition-colors rounded"
                      title="Retirer de la prescription"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Interaction Screening Results */}
        {prescribedDrugs.length >= 2 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#15263D] uppercase text-[11px] tracking-wider">
                Analyse Croisée des Risques
              </span>
            </div>

            {analysis.activeInteractions.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">
                  Aucune interaction médicamenteuse délétère répertoriée entre ces molécules.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.activeInteractions.map((inter, idx) => {
                  const isAbsolute = inter.rule.severity === 'CONTRAINDICATION_ABSOLUE';
                  const isCaution = inter.rule.severity === 'ASSOCIATION_DECONSEILLEE';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border leading-tight ${
                        isAbsolute
                          ? 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]'
                          : isCaution
                          ? 'bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                        {isAbsolute ? (
                          <AlertOctagon className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                        )}
                        <span>
                          {inter.drugA.brandName} + {inter.drugB.brandName}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium mb-1.5">{inter.rule.riskDescription}</p>
                      <div className="text-[10px] opacity-90 border-t pt-1 border-current/20">
                        <span className="font-semibold">Conduite : </span>
                        {inter.rule.actionProtocol}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Renal Alerts linked to patient clearance */}
        {analysis.renalAlerts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#DC2626] uppercase text-[11px] tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Alertes Rénales ({patientClearance} ml/min)</span>
              </span>
              <button
                onClick={onOpenRenalModal}
                className="text-[11px] text-[#00A99D] font-semibold hover:underline"
              >
                Ajuster ClCr
              </button>
            </div>

            <div className="space-y-1.5">
              {analysis.renalAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-900"
                >
                  <span className="font-bold block">{alert.drug.brandName} :</span>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick action buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={onOpenRenalModal}
            className="w-full py-2 px-3 text-xs font-medium border border-slate-200 hover:bg-slate-100 rounded text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-[#00A99D]" />
            <span>Calculer Clairance (Cockcroft)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
