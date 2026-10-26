'use client';

import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Plus, 
  X, 
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { 
  DrugMonograph, 
  ALGERIAN_DRUG_DATABASE, 
  DRUG_INTERACTIONS_RULES,
  DrugInteraction 
} from '../lib/pharmacopoeia-data';

interface DrugInteractionMatrixScreenProps {
  prescribedDrugs: DrugMonograph[];
  onAddDrugToPrescription: (drug: DrugMonograph) => void;
  onRemoveDrugFromPrescription: (drugId: string) => void;
}

export const DrugInteractionMatrixScreen: React.FC<DrugInteractionMatrixScreenProps> = ({
  prescribedDrugs,
  onAddDrugToPrescription,
  onRemoveDrugFromPrescription,
}) => {
  // We can let the user view the matrix of either all database drugs or just their current prescription selection
  const [matrixMode, setMatrixMode] = useState<'prescribed' | 'full'>('full');
  const [selectedCellInteraction, setSelectedCellInteraction] = useState<{
    rule: DrugInteraction;
    drugA: DrugMonograph;
    drugB: DrugMonograph;
  } | null>(null);

  const activeDrugs = matrixMode === 'prescribed' && prescribedDrugs.length >= 2 
    ? prescribedDrugs 
    : ALGERIAN_DRUG_DATABASE;

  const findInteraction = (idA: string, idB: string): DrugInteraction | undefined => {
    if (idA === idB) return undefined;
    return DRUG_INTERACTIONS_RULES.find(
      (r) =>
        (r.drugAId === idA && r.drugBId === idB) ||
        (r.drugAId === idB && r.drugBId === idA)
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Clinical Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
            <AlertOctagon className="w-4 h-4 text-[#DC2626]" />
            <span>Sécurité Pharmacologique & Co-prescriptions</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F2942] tracking-tight mt-1">
            Matrice Croisée des Interactions Médicamenteuses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Matrice dense de dépistage instantané des associations létales, déconseillées ou nécessitant des précautions d&apos;emploi.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setMatrixMode('full')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              matrixMode === 'full'
                ? 'bg-white text-[#0F2942] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matrice Complète Pharmacopée
          </button>
          <button
            onClick={() => setMatrixMode('prescribed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              matrixMode === 'prescribed'
                ? 'bg-white text-[#0F2942] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ordonnance Active ({prescribedDrugs.length})
          </button>
        </div>
      </div>

      {/* Legend strip (Anti-slop compliant, clean unboxed metadata with labels) */}
      <div className="flex items-center gap-4 flex-wrap bg-white border border-[#E2E8F0] rounded-lg p-3 text-xs">
        <span className="font-bold text-slate-700">Légende de Gravité :</span>
        <div className="flex items-center gap-1.5 text-[#991B1B]">
          <span className="w-3 h-3 rounded bg-[#DC2626]" />
          <span className="font-semibold">Contre-indication absolue (Létale)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#92400E]">
          <span className="w-3 h-3 rounded bg-[#D97706]" />
          <span className="font-semibold">Association déconseillée</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#334155]">
          <span className="w-3 h-3 rounded bg-[#CBD5E1]" />
          <span className="font-semibold">Prise en compte / Précaution</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-800">
          <span className="w-3 h-3 rounded bg-[#ECFDF5] border border-emerald-300" />
          <span className="font-semibold">Compatible sans interaction majeure</span>
        </div>
      </div>

      {/* Matrix Grid Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F2942]">
            Tableau Croisé ({activeDrugs.length} x {activeDrugs.length} Molécules)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Cliquez sur une case pour ouvrir le mécanisme d&apos;action
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-3 text-left font-bold uppercase tracking-wider text-[11px] sticky left-0 bg-slate-50 z-10 w-44 min-w-[170px] border-r border-slate-200">
                  Molécule / Spécialité
                </th>
                {activeDrugs.map((drug) => (
                  <th
                    key={drug.id}
                    className="p-2.5 text-center font-bold text-slate-800 min-w-[90px] max-w-[120px] truncate border-r border-slate-200 text-[11px]"
                    title={`${drug.brandName} (${drug.dci})`}
                  >
                    <div className="truncate font-semibold">{drug.brandName}</div>
                    <div className="text-[9px] text-slate-400 font-normal truncate">
                      {drug.dci.slice(0, 14)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeDrugs.map((rowDrug) => (
                <tr key={rowDrug.id} className="hover:bg-slate-50/50">
                  {/* Row header */}
                  <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10 whitespace-nowrap">
                    <div className="font-bold text-[#0F2942]">{rowDrug.brandName}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {rowDrug.dci}
                    </div>
                  </td>

                  {/* Intersecting cells */}
                  {activeDrugs.map((colDrug) => {
                    const isSelf = rowDrug.id === colDrug.id;
                    const interaction = findInteraction(rowDrug.id, colDrug.id);

                    if (isSelf) {
                      return (
                        <td
                          key={colDrug.id}
                          className="p-2 text-center bg-slate-100/60 border-r border-slate-200 text-slate-300 font-mono"
                        >
                          —
                        </td>
                      );
                    }

                    if (!interaction) {
                      return (
                        <td
                          key={colDrug.id}
                          className="p-2 text-center border-r border-slate-200 bg-white text-slate-300"
                        >
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-100" />
                        </td>
                      );
                    }

                    const isContraindicated = interaction.severity === 'CONTRAINDICATION_ABSOLUE';
                    const isCaution = interaction.severity === 'ASSOCIATION_DECONSEILLEE';

                    return (
                      <td
                        key={colDrug.id}
                        onClick={() =>
                          setSelectedCellInteraction({
                            rule: interaction,
                            drugA: rowDrug,
                            drugB: colDrug,
                          })
                        }
                        className={`p-2 text-center border-r border-slate-200 cursor-pointer transition-transform hover:scale-105 ${
                          isContraindicated
                            ? 'bg-[#FEF2F2] hover:bg-[#FEE2E2]'
                            : isCaution
                            ? 'bg-[#FFFBEB] hover:bg-[#FEF3C7]'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {isContraindicated ? (
                            <div className="w-6 h-6 rounded bg-[#DC2626] text-white flex items-center justify-center shadow-xs font-bold text-[10px]">
                              CI
                            </div>
                          ) : isCaution ? (
                            <div className="w-6 h-6 rounded bg-[#D97706] text-white flex items-center justify-center shadow-xs font-bold text-[10px]">
                              AD
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              PE
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Interaction Deep-Dive Drawer / Modal */}
      {selectedCellInteraction && (
        <div className="p-6 bg-white border border-[#E2E8F0] rounded-xl shadow-md space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 ${
                  selectedCellInteraction.rule.severity === 'CONTRAINDICATION_ABSOLUE'
                    ? 'bg-[#DC2626]'
                    : selectedCellInteraction.rule.severity === 'ASSOCIATION_DECONSEILLEE'
                    ? 'bg-[#D97706]'
                    : 'bg-slate-600'
                }`}
              >
                {selectedCellInteraction.rule.severity === 'CONTRAINDICATION_ABSOLUE' ? (
                  <AlertOctagon className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Détail de l&apos;Interaction
                </span>
                <h3 className="text-lg font-bold text-[#0F2942]">
                  {selectedCellInteraction.drugA.brandName} ({selectedCellInteraction.drugA.dci}) +{' '}
                  {selectedCellInteraction.drugB.brandName} ({selectedCellInteraction.drugB.dci})
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedCellInteraction(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-[#0F2942] uppercase text-[10px] tracking-wider block mb-1">
                Risque Clinique Immédiat
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {selectedCellInteraction.rule.riskDescription}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-[#0F2942] uppercase text-[10px] tracking-wider block mb-1">
                Mécanisme Pharmacologique
              </span>
              <p className="text-slate-700 leading-relaxed">
                {selectedCellInteraction.rule.clinicalMechanism}
              </p>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <span className="font-bold text-[#006A61] uppercase text-[10px] tracking-wider block mb-1">
                Protocole d&apos;Action Recommandé
              </span>
              <p className="text-teal-900 leading-relaxed font-medium">
                {selectedCellInteraction.rule.actionProtocol}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
