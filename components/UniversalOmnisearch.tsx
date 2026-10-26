'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';

interface UniversalOmnisearchProps {
  drugs: DrugMonograph[];
  selectedDrug: DrugMonograph | null;
  onSelectDrug: (drug: DrugMonograph) => void;
  onPrescribeQuick: (drug: DrugMonograph) => void;
  isPrescribed: (drugId: string) => boolean;
}

export const UniversalOmnisearch: React.FC<UniversalOmnisearchProps> = ({
  drugs,
  selectedDrug,
  onSelectDrug,
  onPrescribeQuick,
  isPrescribed,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut: Command/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter drugs based on query: brand name, DCI, ATC code, ATC classification, or specialty
  const filteredDrugs = drugs.filter((drug) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      drug.brandName.toLowerCase().includes(q) ||
      drug.dci.toLowerCase().includes(q) ||
      drug.atcCode.toLowerCase().includes(q) ||
      drug.atcClassification.toLowerCase().includes(q) ||
      drug.specialty.toLowerCase().includes(q)
    );
  });

  const handleSelect = (drug: DrugMonograph) => {
    onSelectDrug(drug);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % Math.max(1, filteredDrugs.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev <= 0 ? Math.max(0, filteredDrugs.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter' && filteredDrugs[highlightIndex]) {
      e.preventDefault();
      handleSelect(filteredDrugs[highlightIndex]);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Flagship Search Input Container: Height 48px, border 1.5px solid #CBD5E1, active 1.5px solid #0D9488 */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 text-slate-500" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Recherche indexée par Nom commercial (ex: Lovenox) ou DCI (ex: Énoxaparine)..."
          className="w-full h-12 pl-11 pr-24 bg-white border-[1.5px] border-[#CBD5E1] rounded-lg text-sm text-[#191C1E] placeholder:text-slate-400 font-medium focus:outline-none focus:border-[#0D9488] focus:ring-0 transition-colors shadow-none"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
              title="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Trailing Keyboard Shortcut Chip ⌘K */}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 border border-slate-200 bg-slate-100 rounded text-[11px] font-mono text-slate-500 font-semibold shadow-xs">
            ⌘K
          </span>
        </div>
      </div>

      {/* Predictive Dropdown Results Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_20px_-2px_rgba(15,41,66,0.12)] z-50 max-h-[380px] overflow-y-auto">
          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>
              {filteredDrugs.length} résultat{filteredDrugs.length > 1 ? 's' : ''} trouvé{filteredDrugs.length > 1 ? 's' : ''} dans la pharmacopée
            </span>
            <span>Utilisez ↑ / ↓ et Entrée pour sélectionner</span>
          </div>

          {filteredDrugs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Aucune molécule trouvée pour &ldquo;{query}&rdquo;. Vérifiez l&apos;orthographe du nom de marque ou de la DCI.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDrugs.map((drug, index) => {
                const isSelected = selectedDrug?.id === drug.id;
                const isItemPrescribed = isPrescribed(drug.id);
                const isHighlighted = index === highlightIndex;

                return (
                  <div
                    key={drug.id}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => handleSelect(drug)}
                    className={`px-3.5 py-2.5 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                      isHighlighted ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                    } ${isSelected ? 'border-l-2 border-[#0D9488]' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#0F2942]">
                          {drug.brandName}
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate">
                          ({drug.dci})
                        </span>
                        <span className="text-[10px] font-mono font-medium text-slate-400">
                          {drug.atcCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{drug.presentationForm}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 font-medium">{drug.holderLaboratory}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-mono tabular-nums">
                          {drug.ppvDzd.toFixed(2)} DZD
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase ${
                          drug.regulatoryStatus === 'Liste I'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : drug.regulatoryStatus === 'Liste II'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : drug.regulatoryStatus === 'Stupéfiant'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {drug.regulatoryStatus}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPrescribeQuick(drug);
                        }}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          isItemPrescribed
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-[#0F2942] hover:bg-[#1E3A8A] text-white'
                        }`}
                        title={isItemPrescribed ? 'Déjà sur le plateau' : 'Ajouter à la prescription'}
                      >
                        {isItemPrescribed ? 'Prescrit ✓' : '+ Plateau'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
