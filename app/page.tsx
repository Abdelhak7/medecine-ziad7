'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Layers,
  Menu,
  Pill,
  Stethoscope,
  X,
} from 'lucide-react';
import {
  ALGERIAN_DRUG_DATABASE,
  DrugMonograph,
} from '../lib/pharmacopoeia-data';
import {
  PatientParameters,
  evaluatePatientRenalState,
} from '../lib/renal-calculator';
import {
  getDrugClasses,
  getDrugSpecialties,
  getPharmacologicalClassNames,
  MEDICAL_SPECIALTIES,
  MedicalSpecialty,
  normalizeSearchText,
} from '../lib/medical-classification';
import {
  getPathologiesForSpecialty,
  getPathologyMedications,
  PATHOLOGY_DATABASE,
  Pathology,
} from '../lib/pathology-data';
import { ClinicalHeader } from '../components/ClinicalHeader';
import { UniversalOmnisearch } from '../components/UniversalOmnisearch';
import { SpecialtySidebar } from '../components/SpecialtySidebar';
import { MonographViewer } from '../components/MonographViewer';
import { PathologyViewer } from '../components/PathologyViewer';
import { MedicationCardList } from '../components/MedicationCardList';
import { RenalModalDrawer } from '../components/RenalModalDrawer';
import { AddMedicationModal } from '../components/AddMedicationModal';
import {
  getCustomPharmacopoeiaServerSnapshot,
  getCustomPharmacopoeiaSnapshot,
  saveCustomPharmacopoeia,
  subscribeCustomPharmacopoeia,
} from '../lib/custom-pharmacopoeia-store';

type BrowseMode = 'dashboard' | 'pathologies' | 'medications';

export default function ClinicalApp() {
  const [browseMode, setBrowseMode] = useState<BrowseMode>('dashboard');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(
    null
  );
  const [selectedPathologyId, setSelectedPathologyId] = useState<string | null>(
    null
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<DrugMonograph | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const customData = useSyncExternalStore(
    subscribeCustomPharmacopoeia,
    getCustomPharmacopoeiaSnapshot,
    getCustomPharmacopoeiaServerSnapshot
  );
  const customDrugs = customData.drugs;
  const customSpecialties = customData.specialties;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const drugs = useMemo(
    () => [...ALGERIAN_DRUG_DATABASE, ...customDrugs],
    [customDrugs]
  );

  const [patientParams, setPatientParams] = useState<PatientParameters>({
    gender: 'homme',
    age: 72,
    weightKg: 74,
    creatinineValue: 125,
    creatinineUnit: 'umol_l',
  });
  const [isRenalModalOpen, setIsRenalModalOpen] = useState(false);

  const specialties = useMemo<MedicalSpecialty[]>(() => {
    const merged = [...MEDICAL_SPECIALTIES];
    const knownNames = new Set(
      merged.map((specialty) => normalizeSearchText(specialty.name))
    );
    const additions = [
      ...customSpecialties,
      ...customDrugs.flatMap((drug) => getDrugSpecialties(drug)),
      ...customDrugs.map((drug) => drug.specialty),
    ];

    for (const name of additions) {
      const normalizedName = normalizeSearchText(name);
      if (name && !knownNames.has(normalizedName)) {
        knownNames.add(normalizedName);
        merged.push({
          id: `custom-${normalizedName.replace(/[^a-z0-9]+/g, '-')}`,
          name,
        });
      }
    }

    return merged;
  }, [customSpecialties, customDrugs]);

  const pharmacologicalClasses = useMemo(() => {
    const merged = getPharmacologicalClassNames();
    for (const drug of customDrugs) {
      for (const pharmacologicalClass of getDrugClasses(drug)) {
        if (pharmacologicalClass && !merged.includes(pharmacologicalClass)) {
          merged.push(pharmacologicalClass);
        }
      }
    }
    return merged;
  }, [customDrugs]);

  const selectedSpecialty = useMemo(
    () => specialties.find((specialty) => specialty.id === selectedSpecialtyId) ?? null,
    [selectedSpecialtyId, specialties]
  );
  const selectedPathology = useMemo(
    () =>
      PATHOLOGY_DATABASE.find(
        (pathology) => pathology.id === selectedPathologyId
      ) ?? null,
    [selectedPathologyId]
  );
  const specialtyPathologies = useMemo(
    () =>
      selectedSpecialtyId
        ? getPathologiesForSpecialty(selectedSpecialtyId)
        : [],
    [selectedSpecialtyId]
  );
  const classMedications = useMemo(
    () =>
      selectedClass
        ? drugs.filter((drug) =>
            getDrugClasses(drug).includes(selectedClass)
          )
        : [],
    [drugs, selectedClass]
  );

  const pathologyCountBySpecialty = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pathology of PATHOLOGY_DATABASE) {
      for (const specialtyId of pathology.specialtyIds) {
        counts.set(specialtyId, (counts.get(specialtyId) ?? 0) + 1);
      }
    }
    return counts;
  }, []);

  const classCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pharmacologicalClass of pharmacologicalClasses) {
      counts.set(
        pharmacologicalClass,
        drugs.filter((drug) =>
          getDrugClasses(drug).includes(pharmacologicalClass)
        ).length
      );
    }
    return counts;
  }, [drugs, pharmacologicalClasses]);

  const renalState = useMemo(
    () => evaluatePatientRenalState(patientParams, drugs),
    [patientParams, drugs]
  );

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSelectSpecialty = (specialtyId: string) => {
    setBrowseMode('pathologies');
    setSelectedSpecialtyId(specialtyId);
    setSelectedPathologyId(null);
    setSelectedClass(null);
    setSelectedDrug(null);
    closeSidebar();
  };

  const handleSelectPathology = (pathology: Pathology) => {
    setBrowseMode('pathologies');
    setSelectedSpecialtyId(pathology.specialtyIds[0] ?? null);
    setSelectedPathologyId(pathology.id);
    setSelectedClass(null);
    setSelectedDrug(null);
    closeSidebar();
  };

  const handleSelectClass = (pharmacologicalClass: string) => {
    setBrowseMode('medications');
    setSelectedClass(pharmacologicalClass);
    setSelectedSpecialtyId(null);
    setSelectedPathologyId(null);
    setSelectedDrug(null);
    closeSidebar();
  };

  const handleSelectDrug = (drug: DrugMonograph) => {
    setSelectedDrug(drug);
    closeSidebar();
  };

  const openPathologyBrowser = () => {
    setBrowseMode('pathologies');
    setSelectedSpecialtyId(null);
    setSelectedPathologyId(null);
    setSelectedClass(null);
    setSelectedDrug(null);
  };

  const openMedicationBrowser = () => {
    setBrowseMode('medications');
    setSelectedSpecialtyId(null);
    setSelectedPathologyId(null);
    setSelectedClass(null);
    setSelectedDrug(null);
  };

  const handleAddDrug = (drug: DrugMonograph) => {
    const nextDrugs = customDrugs.some((item) => item.id === drug.id)
      ? customDrugs
      : [...customDrugs, drug];
    const nextSpecialties = customSpecialties.includes(drug.specialty)
      ? customSpecialties
      : [...customSpecialties, drug.specialty];
    saveCustomPharmacopoeia({ drugs: nextDrugs, specialties: nextSpecialties });
    setBrowseMode('dashboard');
    setSelectedSpecialtyId(null);
    setSelectedPathologyId(null);
    setSelectedClass(null);
    setSelectedDrug(drug);
  };

  const handleAddSpecialty = (specialty: string) => {
    if (!customSpecialties.includes(specialty)) {
      saveCustomPharmacopoeia({
        drugs: customDrugs,
        specialties: [...customSpecialties, specialty],
      });
    }
    setBrowseMode('pathologies');
    setSelectedSpecialtyId(null);
    setSelectedPathologyId(null);
    setSelectedClass(null);
    setSelectedDrug(null);
  };

  const backLabel = selectedPathology
    ? `Retour à ${selectedPathology.name}`
    : selectedClass
    ? `Retour à ${selectedClass}`
    : selectedSpecialty
    ? `Retour à ${selectedSpecialty.name}`
    : 'Retour au tableau de bord';

  const renderContent = () => {
    if (selectedDrug) {
      return (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSelectedDrug(null)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-[#00A99D]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
          <MonographViewer
            drug={selectedDrug}
            onOpenRenalCalculator={() => setIsRenalModalOpen(true)}
            patientClearance={renalState.cockcroftClearanceMlMin}
          />
        </div>
      );
    }

    if (selectedPathology) {
      return (
        <PathologyViewer
          pathology={selectedPathology}
          drugs={drugs}
          specialties={specialties}
          onSelectDrug={handleSelectDrug}
          onBack={() => setSelectedPathologyId(null)}
        />
      );
    }

    if (selectedSpecialty) {
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedSpecialtyId(null)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-[#00A99D]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Toutes les spécialités
          </button>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D]">
                  Spécialité médicale
                </p>
                <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#15263D]">
                  {selectedSpecialty.name}
                </h1>
                <p className="mt-2 text-xs text-slate-500">
                  Pathologies disposant de données vérifiées dans la base actuelle.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {specialtyPathologies.length} pathologie
                {specialtyPathologies.length > 1 ? 's' : ''}
              </span>
            </div>
          </section>

          {specialtyPathologies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FileText className="mx-auto mb-2 h-5 w-5 text-slate-400" />
              <p className="text-sm font-semibold text-[#15263D]">
                Aucune pathologie vérifiée disponible pour cette spécialité.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Les pathologies ne sont affichées que lorsqu’elles sont appuyées par
                les données existantes de la pharmacopée.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {specialtyPathologies.map((pathology) => {
                const medications = getPathologyMedications(pathology, drugs);
                const classes = Array.from(
                  new Set(medications.flatMap((drug) => getDrugClasses(drug)))
                );

                return (
                  <button
                    key={pathology.id}
                    type="button"
                    onClick={() => handleSelectPathology(pathology)}
                    className="group rounded-xl border border-[#E2E8F0] bg-white p-4 text-left shadow-xs transition-colors hover:border-teal-300 hover:bg-teal-50/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded border border-slate-200 bg-slate-50 p-1.5 text-[#00A99D]">
                        <FileText className="h-3.5 w-3.5" />
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500">
                        {medications.length} médicament
                        {medications.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <h2 className="mt-2 text-sm font-bold text-[#15263D]">
                      {pathology.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                      {pathology.description}
                    </p>
                    {classes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {classes.map((pharmacologicalClass) => (
                          <span
                            key={pharmacologicalClass}
                            className="rounded border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[9px] font-semibold text-teal-800"
                          >
                            {pharmacologicalClass}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#00A99D]">
                      Consulter
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (selectedClass) {
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-[#00A99D]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Toutes les classes pharmacologiques
          </button>

          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D]">
                  Classe pharmacologique
                </p>
                <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#15263D]">
                  {selectedClass}
                </h1>
                <p className="mt-2 text-xs text-slate-500">
                  Médicaments associés à cette classe dans la base de données.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {classMedications.length} médicament
                {classMedications.length > 1 ? 's' : ''}
              </span>
            </div>
          </section>

          <MedicationCardList
            drugs={classMedications}
            onSelectDrug={handleSelectDrug}
            emptyMessage={`Aucun médicament référencé pour la classe « ${selectedClass} ».`}
          />
        </div>
      );
    }

    if (browseMode === 'pathologies') {
      return (
        <div className="space-y-4">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D]">
              Navigation clinique
            </p>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#15263D]">
              Pathologies par spécialité
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Sélectionnez une spécialité pour afficher les pathologies vérifiées et
              leurs médicaments associés.
            </p>
          </section>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {specialties.map((specialty) => {
              const count = pathologyCountBySpecialty.get(specialty.id) ?? 0;
              return (
                <button
                  key={specialty.id}
                  type="button"
                  onClick={() => handleSelectSpecialty(specialty.id)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-left shadow-xs transition-colors hover:border-teal-300 hover:bg-teal-50/30"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[#00A99D]" />
                    <span className="truncate text-xs font-semibold text-[#15263D]">
                      {specialty.name}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                      count > 0
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (browseMode === 'medications') {
      return (
        <div className="space-y-4">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D]">
              Navigation médicamenteuse
            </p>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#15263D]">
              Médicaments par classe pharmacologique
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Sélectionnez une classe pour afficher les médicaments qui y sont
              rattachés sans duplication.
            </p>
          </section>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {pharmacologicalClasses.map((pharmacologicalClass) => {
              const count = classCounts.get(pharmacologicalClass) ?? 0;
              return (
                <button
                  key={pharmacologicalClass}
                  type="button"
                  onClick={() => handleSelectClass(pharmacologicalClass)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-left shadow-xs transition-colors hover:border-teal-300 hover:bg-teal-50/30"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Pill className="h-3.5 w-3.5 shrink-0 text-[#00A99D]" />
                    <span className="truncate text-xs font-semibold text-[#15263D]">
                      {pharmacologicalClass}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                      count > 0
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D]">
            Exploration clinique
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#15263D]">
            Rechercher et consulter la pharmacopée
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
            Deux parcours complémentaires : partir d’une pathologie et de sa
            spécialité, ou partir d’une classe pharmacologique pour retrouver les
            médicaments associés.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={openPathologyBrowser}
              className="group rounded-xl border border-[#E2E8F0] bg-white p-4 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/30"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg border border-teal-100 bg-teal-50 p-2 text-[#00A99D]">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00A99D]" />
              </div>
              <h2 className="mt-3 text-sm font-bold text-[#15263D]">
                Pathologies par spécialité
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                {PATHOLOGY_DATABASE.length} pathologies vérifiées ·{' '}
                {specialties.length} spécialités
              </p>
            </button>

            <button
              type="button"
              onClick={openMedicationBrowser}
              className="group rounded-xl border border-[#E2E8F0] bg-white p-4 text-left transition-colors hover:border-teal-300 hover:bg-teal-50/30"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg border border-teal-100 bg-teal-50 p-2 text-[#00A99D]">
                  <Pill className="h-4 w-4" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00A99D]" />
              </div>
              <h2 className="mt-3 text-sm font-bold text-[#15263D]">
                Médicaments par classe pharmacologique
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                {pharmacologicalClasses.length} classes · {drugs.length} médicaments
              </p>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            <div>
              <p className="font-mono text-lg font-bold text-[#15263D]">
                {drugs.length}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Médicaments
              </p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-[#15263D]">
                {PATHOLOGY_DATABASE.length}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Pathologies
              </p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-[#15263D]">
                {pharmacologicalClasses.length}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Classes
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F1F5F9] px-4 py-3 text-[11px] text-slate-600">
          <Layers className="h-3.5 w-3.5 shrink-0 text-[#00A99D]" />
          Les pathologies et associations affichées proviennent uniquement des
          données vérifiées déjà présentes dans la pharmacopée.
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FB] font-sans text-[#15263D] selection:bg-[#B8F1EA] selection:text-[#0B1F36]">
      <ClinicalHeader onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="mx-auto w-full max-w-[1720px] flex-1 px-4 py-6 sm:px-6">
        <div className="space-y-5">
          <div className="mx-auto w-full max-w-3xl">
            <UniversalOmnisearch
              drugs={drugs}
              pathologies={PATHOLOGY_DATABASE}
              specialties={specialties}
              classes={pharmacologicalClasses}
              onSelectDrug={handleSelectDrug}
              onSelectPathology={handleSelectPathology}
              onSelectSpecialty={(specialty) =>
                handleSelectSpecialty(specialty.id)
              }
              onSelectClass={handleSelectClass}
            />
          </div>

          <div className="flex flex-col items-start gap-6 lg:flex-row">
            <div className="hidden w-[272px] shrink-0 lg:sticky lg:top-[5.25rem] lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
              <SpecialtySidebar
                specialties={specialties}
                pathologies={PATHOLOGY_DATABASE}
                classes={pharmacologicalClasses}
                drugs={drugs}
                selectedSpecialtyId={selectedSpecialtyId}
                selectedPathologyId={selectedPathologyId}
                selectedClass={selectedClass}
                onSelectSpecialty={handleSelectSpecialty}
                onSelectPathology={handleSelectPathology}
                onSelectClass={handleSelectClass}
                onSelectDrug={handleSelectDrug}
              />
            </div>

            <div className="min-w-0 w-full flex-1 space-y-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-left shadow-xs lg:hidden"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-[#15263D]">
                  <Menu className="h-4 w-4 text-[#00A99D]" />
                  Parcourir les pathologies et les classes
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {PATHOLOGY_DATABASE.length} · {pharmacologicalClasses.length}
                </span>
              </button>

              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-[#F4F7FB] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D]">
                  Navigation
                </p>
                <p className="text-sm font-bold text-[#15263D]">
                  Pathologies & Médicaments
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SpecialtySidebar
              specialties={specialties}
              pathologies={PATHOLOGY_DATABASE}
              classes={pharmacologicalClasses}
              drugs={drugs}
              selectedSpecialtyId={selectedSpecialtyId}
              selectedPathologyId={selectedPathologyId}
              selectedClass={selectedClass}
              onSelectSpecialty={handleSelectSpecialty}
              onSelectPathology={handleSelectPathology}
              onSelectClass={handleSelectClass}
              onSelectDrug={handleSelectDrug}
            />
          </div>
        </div>
      )}

      <RenalModalDrawer
        isOpen={isRenalModalOpen}
        onClose={() => setIsRenalModalOpen(false)}
        params={patientParams}
        onUpdateParams={(params) => setPatientParams(params)}
      />

      {isAddModalOpen && (
        <AddMedicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          specialties={specialties.map((specialty) => specialty.name)}
          onAddDrug={handleAddDrug}
          onAddSpecialty={handleAddSpecialty}
        />
      )}

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#15263D]">PharmaDZ Clinical</span>
            <span>·</span>
            <span>
              Nomenclature Pharmaceutique & Règles de Bonnes Pratiques
              Thérapeutiques
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Dernière mise à jour formulaire : Octobre 2026</span>
            <span>·</span>
            <span>Conformité Ministère de la Santé & CNAS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
