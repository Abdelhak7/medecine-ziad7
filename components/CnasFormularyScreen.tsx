'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  ArrowUpDown, 
  Building2, 
  DollarSign, 
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { ALGERIAN_DRUG_DATABASE, DrugMonograph } from '../lib/pharmacopoeia-data';

interface CnasFormularyScreenProps {
  onSelectDrugForMonograph?: (drug: DrugMonograph) => void;
}

export const CnasFormularyScreen: React.FC<CnasFormularyScreenProps> = ({
  onSelectDrugForMonograph,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLab, setSelectedLab] = useState('Tous');

  // Collect all generics flattened
  const allFormularyRows = ALGERIAN_DRUG_DATABASE.flatMap((drug) => {
    const rows = [
      {
        id: drug.id,
        isPrinceps: true,
        tradeName: drug.brandName,
        dci: drug.dci,
        laboratory: drug.holderLaboratory,
        dosageForm: drug.presentationForm,
        ppvDzd: drug.ppvDzd,
        referenceTarifDzd: drug.referenceTarifDzd,
        reimbursementRate: drug.cnasRatePercent,
        savingsDzd: 0,
        parentDrug: drug,
      },
    ];

    drug.genericsAvailable.forEach((gen, idx) => {
      rows.push({
        id: `${drug.id}-gen-${idx}`,
        isPrinceps: false,
        tradeName: gen.tradeName,
        dci: drug.dci,
        laboratory: gen.laboratory,
        dosageForm: gen.dosageForm,
        ppvDzd: gen.ppvDzd,
        referenceTarifDzd: gen.referenceTarifDzd,
        reimbursementRate: gen.reimbursementRate,
        savingsDzd: Math.max(0, drug.ppvDzd - gen.ppvDzd),
        parentDrug: drug,
      });
    });

    return rows;
  });

  const filteredRows = allFormularyRows.filter((row) => {
    const matchesSearch =
      !search.trim() ||
      row.tradeName.toLowerCase().includes(search.toLowerCase()) ||
      row.dci.toLowerCase().includes(search.toLowerCase()) ||
      row.laboratory.toLowerCase().includes(search.toLowerCase());

    const matchesLab =
      selectedLab === 'Tous' || row.laboratory.toLowerCase().includes(selectedLab.toLowerCase());

    return matchesSearch && matchesLab;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
            <FileText className="w-4 h-4 text-[#0D9488]" />
            <span>Nomenclature Nationale & Sécurité Sociale Algérienne</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F2942] tracking-tight mt-1">
            Répertoire des Génériques & Tarifs de Référence CNAS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Équivalences bio-équivalentes des laboratoires nationaux (Saidal, Biopharm, Hikma) et prise en charge Carte Chifa en Dinars Algériens (DZD).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold block">Conformité CNAS 2026</span>
              <span className="text-[11px] text-emerald-700">Tiers-payant Carte Chifa actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer par princeps, générique ou DCI (ex: Saidal, Lovenox, Metformine)..."
            className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Laboratoire :</span>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0D9488]"
          >
            <option value="Tous">Tous les laboratoires</option>
            <option value="Saidal">Groupe Saidal</option>
            <option value="Biopharm">Biopharm Algérie</option>
            <option value="Hikma">Hikma Pharmaceuticals</option>
            <option value="Sanofi">Sanofi Algérie</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-left">
                <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Type</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Spécialité / Dénomination</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px]">DCI</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Laboratoire Producteur</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Présentation</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-right">PPV Officine (DZD)</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-right">Tarif CNAS (DZD)</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-center">Taux Chifa</th>
                <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-right">Économie Patient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectDrugForMonograph && onSelectDrugForMonograph(row.parentDrug)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="p-3 whitespace-nowrap">
                    {row.isPrinceps ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white uppercase tracking-wider">
                        Princeps
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0D9488] text-white uppercase tracking-wider">
                        Générique
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-[#0F2942] whitespace-nowrap">
                    {row.tradeName}
                  </td>
                  <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                    {row.dci}
                  </td>
                  <td className="p-3 text-slate-700 whitespace-nowrap">
                    {row.laboratory}
                  </td>
                  <td className="p-3 text-slate-500 max-w-[200px] truncate">
                    {row.dosageForm}
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900 text-right tabular-nums whitespace-nowrap">
                    {row.ppvDzd.toFixed(2)} DZD
                  </td>
                  <td className="p-3 font-mono text-emerald-800 font-semibold text-right tabular-nums whitespace-nowrap">
                    {row.referenceTarifDzd.toFixed(2)} DZD
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {row.reimbursementRate}%
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-right tabular-nums whitespace-nowrap">
                    {row.savingsDzd > 0 ? (
                      <span className="text-emerald-700">
                        -{row.savingsDzd.toFixed(2)} DZD
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
