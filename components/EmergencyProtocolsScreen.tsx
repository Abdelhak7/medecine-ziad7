'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Check, 
  Plus, 
  ArrowRight,
  AlertOctagon
} from 'lucide-react';
import { 
  EMERGENCY_PROTOCOLS_DATABASE, 
  EmergencyProtocol, 
  ALGERIAN_DRUG_DATABASE, 
  DrugMonograph 
} from '../lib/pharmacopoeia-data';

interface EmergencyProtocolsScreenProps {
  onLoadProtocolToPrescription: (drugs: DrugMonograph[]) => void;
  onSelectDrugForMonograph: (drug: DrugMonograph) => void;
}

export const EmergencyProtocolsScreen: React.FC<EmergencyProtocolsScreenProps> = ({
  onLoadProtocolToPrescription,
  onSelectDrugForMonograph,
}) => {
  const handleLoadProtocol = (protocol: EmergencyProtocol) => {
    const drugsToLoad: DrugMonograph[] = [];
    protocol.clinicalSteps.forEach((step) => {
      step.drugsPrescribed.forEach((presc) => {
        const drug = ALGERIAN_DRUG_DATABASE.find((d) => d.id === presc.drugId);
        if (drug && !drugsToLoad.some((d) => d.id === drug.id)) {
          drugsToLoad.push(drug);
        }
      });
    });

    onLoadProtocolToPrescription(drugsToLoad);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DC2626]">
            <Flame className="w-4 h-4 text-[#DC2626]" />
            <span>Déchoquage & Réanimation Hospitalière</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F2942] tracking-tight mt-1">
            Protocoles d&apos;Urgence & Arbres Décisionnels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmes standardisés pour les situations d&apos;urgence vitale avec chargement immédiat des posologies d&apos;attaque dans le plateau de contrôle.
          </p>
        </div>
      </div>

      {/* Protocols list */}
      <div className="space-y-6">
        {EMERGENCY_PROTOCOLS_DATABASE.map((proto) => (
          <div
            key={proto.id}
            className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden"
          >
            {/* Protocol Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DC2626] text-white uppercase tracking-wider">
                    {proto.severityLevel}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {proto.specialty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0F2942]">
                  {proto.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  {proto.summary}
                </p>
              </div>

              <button
                onClick={() => handleLoadProtocol(proto)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#0F2942] hover:bg-[#1E3A8A] text-white rounded transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Charger dans le plateau</span>
              </button>
            </div>

            {/* Protocol Phases & Drug steps */}
            <div className="p-5 space-y-5 text-xs">
              {proto.clinicalSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg space-y-3"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span>{step.phase}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-medium">
                    {step.action}
                  </p>

                  {/* Prescribed drugs inside this step */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Thérapeutiques recommandées & posologies :
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.drugsPrescribed.map((presc, pIdx) => {
                        const drug = ALGERIAN_DRUG_DATABASE.find((d) => d.id === presc.drugId);
                        return (
                          <div
                            key={pIdx}
                            onClick={() => drug && onSelectDrugForMonograph(drug)}
                            className="p-3 bg-white border border-slate-200 rounded-lg flex items-start justify-between gap-2 hover:border-[#0D9488] cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="font-bold text-[#0F2942]">
                                {drug?.brandName || presc.drugId}
                              </div>
                              <div className="text-[11px] font-mono text-[#0D9488] font-semibold mt-0.5">
                                {presc.posology}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {presc.note}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">Voir &rarr;</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monitoring parameters */}
                  <div className="border-t border-slate-200 pt-2 flex items-center gap-2 flex-wrap text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700">Surveillance requise :</span>
                    {step.monitoring.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="bg-white px-2 py-0.5 rounded border border-slate-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
