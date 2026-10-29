'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  FileText,
  Layers,
  Pill,
  Search,
  Stethoscope,
  X,
} from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';
import {
  getDrugClasses,
  getDrugSpecialties,
  MedicalSpecialty,
  normalizeSearchText,
  matchesDrugQuery,
} from '../lib/medical-classification';
import { Pathology } from '../lib/pathology-data';

interface UniversalOmnisearchProps {
  drugs: DrugMonograph[];
  pathologies: Pathology[];
  specialties: MedicalSpecialty[];
  classes: string[];
  onSelectDrug: (drug: DrugMonograph) => void;
  onSelectPathology: (pathology: Pathology) => void;
  onSelectSpecialty: (specialty: MedicalSpecialty) => void;
  onSelectClass: (pharmacologicalClass: string) => void;
}

type SearchResult =
  | {
      kind: 'medication';
      id: string;
      label: string;
      detail: string;
      drug: DrugMonograph;
    }
  | {
      kind: 'pathology';
      id: string;
      label: string;
      detail: string;
      pathology: Pathology;
    }
  | {
      kind: 'specialty';
      id: string;
      label: string;
      detail: string;
      specialty: MedicalSpecialty;
    }
  | {
      kind: 'class';
      id: string;
      label: string;
      detail: string;
      className: string;
    };

export const UniversalOmnisearch: React.FC<UniversalOmnisearchProps> = ({
  drugs,
  pathologies,
  specialties,
  classes,
  onSelectDrug,
  onSelectPathology,
  onSelectSpecialty,
  onSelectClass,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groups = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [];

    const specialtyNameById = new Map(
      specialties.map((specialty) => [specialty.id, specialty.name])
    );

    const medicationResults: SearchResult[] = drugs
      .filter((drug) => matchesDrugQuery(drug, query))
      .map((drug) => ({
        kind: 'medication',
        id: `medication-${drug.id}`,
        label: `${drug.brandName} — ${drug.dci}`,
        detail:
          getDrugClasses(drug).slice(0, 2).join(', ') ||
          getDrugSpecialties(drug).slice(0, 2).join(', ') ||
          'Classification non renseignée',
        drug,
      }));

    const pathologyResults: SearchResult[] = pathologies
      .filter((pathology) => {
        const specialtyNames = pathology.specialtyIds
          .map((specialtyId) => specialtyNameById.get(specialtyId) ?? '')
          .join(' ');
        return normalizeSearchText(
          `${pathology.name} ${pathology.description} ${specialtyNames}`
        ).includes(normalizedQuery);
      })
      .map((pathology) => ({
        kind: 'pathology',
        id: `pathology-${pathology.id}`,
        label: pathology.name,
        detail: pathology.specialtyIds
          .map((specialtyId) => specialtyNameById.get(specialtyId))
          .filter((name): name is string => Boolean(name))
          .slice(0, 3)
          .join(' · '),
        pathology,
      }));

    const specialtyResults: SearchResult[] = specialties
      .filter((specialty) =>
        normalizeSearchText(specialty.name).includes(normalizedQuery)
      )
      .map((specialty) => ({
        kind: 'specialty',
        id: `specialty-${specialty.id}`,
        label: specialty.name,
        detail: `${
          pathologies.filter((pathology) =>
            pathology.specialtyIds.includes(specialty.id)
          ).length
        } pathologie(s) vérifiée(s)`,
        specialty,
      }));

    const classResults: SearchResult[] = classes
      .filter((pharmacologicalClass) =>
        normalizeSearchText(pharmacologicalClass).includes(normalizedQuery)
      )
      .map((pharmacologicalClass) => ({
        kind: 'class',
        id: `class-${pharmacologicalClass}`,
        label: pharmacologicalClass,
        detail: `${
          drugs.filter((drug) =>
            getDrugClasses(drug).includes(pharmacologicalClass)
          ).length
        } médicament(s)`,
        className: pharmacologicalClass,
      }));

    return [
      { label: 'Médicaments', results: medicationResults },
      { label: 'Pathologies', results: pathologyResults },
      { label: 'Spécialités', results: specialtyResults },
      { label: 'Classes pharmacologiques', results: classResults },
    ].filter((group) => group.results.length > 0);
  }, [classes, drugs, pathologies, query, specialties]);

  const flatResults = useMemo(
    () => groups.flatMap((group) => group.results),
    [groups]
  );

  const handleSelect = (result: SearchResult) => {
    if (result.kind === 'medication') {
      onSelectDrug(result.drug);
    } else if (result.kind === 'pathology') {
      onSelectPathology(result.pathology);
    } else if (result.kind === 'specialty') {
      onSelectSpecialty(result.specialty);
    } else {
      onSelectClass(result.className);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((current) =>
        flatResults.length === 0 ? 0 : (current + 1) % flatResults.length
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((current) =>
        flatResults.length === 0
          ? 0
          : current <= 0
          ? flatResults.length - 1
          : current - 1
      );
    } else if (event.key === 'Enter' && flatResults[highlightIndex]) {
      event.preventDefault();
      handleSelect(flatResults[highlightIndex]);
    }
  };

  const hasQuery = query.trim().length > 0;

  const renderResultIcon = (result: SearchResult) => {
    if (result.kind === 'medication') {
      return <Pill className="h-3.5 w-3.5" />;
    }
    if (result.kind === 'pathology') {
      return <FileText className="h-3.5 w-3.5" />;
    }
    if (result.kind === 'specialty') {
      return <Stethoscope className="h-3.5 w-3.5" />;
    }
    return <Layers className="h-3.5 w-3.5" />;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 text-slate-400">
          <Search className="h-4 w-4 text-slate-500" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setHighlightIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un médicament, une pathologie, une classe thérapeutique…"
          className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-24 text-[13px] font-medium text-[#15263D] shadow-[0_1px_2px_rgba(15,41,66,0.04)] placeholder:text-slate-400 transition-all focus:border-[#00A99D] focus:outline-none focus:ring-2 focus:ring-[#00A99D]/15"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setHighlightIndex(0);
                inputRef.current?.focus();
              }}
              className="rounded p-1 text-slate-400 transition-colors hover:text-slate-600"
              title="Effacer"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <span className="hidden items-center rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 sm:inline-flex">
            ⌘K
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[440px] overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-[0_16px_40px_-12px_rgba(15,41,66,0.22)]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-[10px] font-medium text-slate-500">
            <span>
              {hasQuery
                ? `${flatResults.length} résultat${
                    flatResults.length > 1 ? 's' : ''
                  }`
                : 'Recherche globale dans la pharmacopée et les pathologies'}
            </span>
            {hasQuery && (
              <span className="hidden sm:inline">
                ↑ / ↓ et Entrée pour sélectionner
              </span>
            )}
          </div>

          {!hasQuery ? (
            <div className="px-4 py-5 text-center text-[11px] text-slate-500">
              Saisissez une DCI, un nom commercial, une pathologie, une spécialité
              ou une classe pharmacologique.
            </div>
          ) : flatResults.length === 0 ? (
            <div className="px-6 py-6 text-center text-xs text-slate-500">
              Aucun résultat pour «&nbsp;{query}&nbsp;».
            </div>
          ) : (
            <div>
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] bg-[#F8FAFC] px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <span>{group.label}</span>
                    <span className="font-mono text-slate-400">
                      {group.results.length}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {group.results.map((result) => {
                      const resultIndex = flatResults.indexOf(result);
                      const highlighted = resultIndex === highlightIndex;

                      return (
                        <button
                          key={result.id}
                          type="button"
                          onMouseEnter={() => setHighlightIndex(resultIndex)}
                          onClick={() => handleSelect(result)}
                          className={`flex w-full items-center justify-between gap-3 border-l-2 px-3.5 py-2.5 text-left transition-colors ${
                            highlighted
                              ? 'border-[#00A99D] bg-[#E8F8F5]'
                              : 'border-transparent hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <span className="flex min-w-0 items-start gap-2.5">
                            <span className="mt-0.5 shrink-0 rounded-md border border-[#E2E8F0] bg-white p-1 text-[#00A99D]">
                              {renderResultIcon(result)}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-[#15263D]">
                                {result.label}
                              </span>
                              <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                                {result.detail}
                              </span>
                            </span>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
