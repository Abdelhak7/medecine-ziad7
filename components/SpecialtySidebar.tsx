'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Pill,
  Search,
  Stethoscope,
} from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';
import {
  getDrugClasses,
  MedicalSpecialty,
  normalizeSearchText,
} from '../lib/medical-classification';
import {
  getPathologyMedications,
  Pathology,
} from '../lib/pathology-data';

interface SpecialtySidebarProps {
  specialties: MedicalSpecialty[];
  pathologies: Pathology[];
  classes: string[];
  drugs: DrugMonograph[];
  selectedSpecialtyId: string | null;
  selectedPathologyId: string | null;
  selectedClass: string | null;
  onSelectSpecialty: (specialtyId: string) => void;
  onSelectPathology: (pathology: Pathology) => void;
  onSelectClass: (pharmacologicalClass: string) => void;
  onSelectDrug: (drug: DrugMonograph) => void;
}

export const SpecialtySidebar: React.FC<SpecialtySidebarProps> = ({
  specialties,
  pathologies,
  classes,
  drugs,
  selectedSpecialtyId,
  selectedPathologyId,
  selectedClass,
  onSelectSpecialty,
  onSelectPathology,
  onSelectClass,
  onSelectDrug,
}) => {
  const [pathologyQuery, setPathologyQuery] = useState('');
  const [classQuery, setClassQuery] = useState('');
  const [pathologiesOpen, setPathologiesOpen] = useState(true);
  const [classesOpen, setClassesOpen] = useState(true);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<string>>(
    new Set()
  );
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  const pathologiesBySpecialty = useMemo(() => {
    const map = new Map<string, Pathology[]>();
    for (const specialty of specialties) {
      map.set(
        specialty.id,
        pathologies.filter((pathology) =>
          pathology.specialtyIds.includes(specialty.id)
        )
      );
    }
    return map;
  }, [pathologies, specialties]);

  const medicationsByClass = useMemo(() => {
    const map = new Map<string, DrugMonograph[]>();
    for (const pharmacologicalClass of classes) {
      map.set(
        pharmacologicalClass,
        drugs.filter((drug) =>
          getDrugClasses(drug).includes(pharmacologicalClass)
        )
      );
    }
    return map;
  }, [classes, drugs]);

  const visibleSpecialties = specialties.filter((specialty) =>
    normalizeSearchText(specialty.name).includes(
      normalizeSearchText(pathologyQuery)
    )
  );

  const visibleClasses = classes.filter((pharmacologicalClass) =>
    normalizeSearchText(pharmacologicalClass).includes(
      normalizeSearchText(classQuery)
    )
  );

  const toggleSetValue = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const isSpecialtyExpanded = (specialtyId: string) =>
    pathologyQuery.trim().length > 0 || expandedSpecialties.has(specialtyId);

  const isClassExpanded = (pharmacologicalClass: string) =>
    classQuery.trim().length > 0 || expandedClasses.has(pharmacologicalClass);

  return (
    <aside className="flex w-full flex-col gap-3 text-sm">
      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <button
          type="button"
          onClick={() => setPathologiesOpen((current) => !current)}
          aria-expanded={pathologiesOpen}
          className="flex w-full items-center justify-between gap-2 border-b border-[#F1F5F9] bg-white px-3.5 py-3 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Stethoscope className="h-4 w-4 shrink-0 text-[#0D9488]" />
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0F2942]">
                Pathologies
              </span>
              <span className="block text-[10px] font-medium text-slate-500">
                Par spécialité médicale
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
              {pathologies.length}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                pathologiesOpen ? '' : '-rotate-90'
              }`}
            />
          </span>
        </button>

        {pathologiesOpen && (
          <div className="space-y-2 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={pathologyQuery}
                onChange={(event) => setPathologyQuery(event.target.value)}
                placeholder="Rechercher une spécialité"
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-[11px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white"
              />
            </div>

            <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
              {visibleSpecialties.length === 0 ? (
                <p className="px-1 py-2 text-[11px] text-slate-500">
                  Aucune spécialité trouvée.
                </p>
              ) : (
                visibleSpecialties.map((specialty) => {
                  const specialtyPathologies =
                    pathologiesBySpecialty.get(specialty.id) ?? [];
                  const expanded = isSpecialtyExpanded(specialty.id);
                  const selected = selectedSpecialtyId === specialty.id;

                  return (
                    <div key={specialty.id}>
                      <div
                        className={`flex items-center rounded-md ${
                          selected ? 'bg-[#0F2942] text-white' : 'hover:bg-slate-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSpecialty(specialty.id);
                            if (!expanded) {
                              toggleSetValue(setExpandedSpecialties, specialty.id);
                            }
                          }}
                          className="flex min-w-0 flex-1 items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs font-medium"
                        >
                          <span className="truncate">{specialty.name}</span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {specialtyPathologies.length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleSetValue(setExpandedSpecialties, specialty.id)
                          }
                          aria-label={`Afficher les pathologies de ${specialty.name}`}
                          aria-expanded={expanded}
                          className={`mr-1 rounded p-1 ${
                            selected
                              ? 'hover:bg-white/15'
                              : 'text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {expanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {expanded && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
                          {specialtyPathologies.length === 0 ? (
                            <p className="px-1 py-1 text-[10px] text-slate-400">
                              Aucune pathologie vérifiée
                            </p>
                          ) : (
                            specialtyPathologies.map((pathology) => {
                              const pathologySelected =
                                selectedPathologyId === pathology.id;
                              const medicationCount = getPathologyMedications(
                                pathology,
                                drugs
                              ).length;

                              return (
                                <button
                                  key={pathology.id}
                                  type="button"
                                  onClick={() => onSelectPathology(pathology)}
                                  className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] transition-colors ${
                                    pathologySelected
                                      ? 'bg-teal-50 font-semibold text-[#0F2942]'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <FileText className="h-3 w-3 shrink-0 text-slate-400" />
                                  <span className="min-w-0 flex-1 truncate">
                                    {pathology.name}
                                  </span>
                                  <span className="font-mono text-[9px] text-slate-400">
                                    {medicationCount}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
        <button
          type="button"
          onClick={() => setClassesOpen((current) => !current)}
          aria-expanded={classesOpen}
          className="flex w-full items-center justify-between gap-2 border-b border-[#F1F5F9] bg-white px-3.5 py-3 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Pill className="h-4 w-4 shrink-0 text-[#0D9488]" />
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0F2942]">
                Médicaments
              </span>
              <span className="block text-[10px] font-medium text-slate-500">
                Par classe pharmacologique
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
              {classes.length}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                classesOpen ? '' : '-rotate-90'
              }`}
            />
          </span>
        </button>

        {classesOpen && (
          <div className="space-y-2 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={classQuery}
                onChange={(event) => setClassQuery(event.target.value)}
                placeholder="Rechercher une classe"
                className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-[11px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white"
              />
            </div>

            <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
              {visibleClasses.length === 0 ? (
                <p className="px-1 py-2 text-[11px] text-slate-500">
                  Aucune classe trouvée.
                </p>
              ) : (
                visibleClasses.map((pharmacologicalClass) => {
                  const classMedications =
                    medicationsByClass.get(pharmacologicalClass) ?? [];
                  const expanded = isClassExpanded(pharmacologicalClass);
                  const selected = selectedClass === pharmacologicalClass;

                  return (
                    <div key={pharmacologicalClass}>
                      <div
                        className={`flex items-center rounded-md ${
                          selected ? 'bg-[#0F2942] text-white' : 'hover:bg-slate-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectClass(pharmacologicalClass);
                            if (!expanded) {
                              toggleSetValue(
                                setExpandedClasses,
                                pharmacologicalClass
                              );
                            }
                          }}
                          className="flex min-w-0 flex-1 items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs font-medium"
                        >
                          <span className="truncate">{pharmacologicalClass}</span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                              selected
                                ? 'bg-white/20 text-white'
                                : classMedications.length > 0
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            {classMedications.length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleSetValue(
                              setExpandedClasses,
                              pharmacologicalClass
                            )
                          }
                          aria-label={`Afficher les médicaments de ${pharmacologicalClass}`}
                          aria-expanded={expanded}
                          className={`mr-1 rounded p-1 ${
                            selected
                              ? 'hover:bg-white/15'
                              : 'text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {expanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {expanded && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
                          {classMedications.length === 0 ? (
                            <p className="px-1 py-1 text-[10px] text-slate-400">
                              Aucun médicament référencé
                            </p>
                          ) : (
                            classMedications.map((drug) => (
                              <button
                                key={drug.id}
                                type="button"
                                onClick={() => onSelectDrug(drug)}
                                className="flex w-full items-center justify-between gap-2 rounded px-1.5 py-1 text-left text-[11px] text-slate-600 transition-colors hover:bg-slate-100"
                              >
                                <span className="min-w-0 truncate">
                                  {drug.brandName}
                                </span>
                                <span className="shrink-0 font-mono text-[9px] text-slate-400">
                                  {drug.dci}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>
    </aside>
  );
};
