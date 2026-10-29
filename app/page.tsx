'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { 
  ALGERIAN_DRUG_DATABASE, 
  DrugMonograph 
} from '../lib/pharmacopoeia-data';
import { 
  PatientParameters, 
  evaluatePatientRenalState 
} from '../lib/renal-calculator';
import { 
  analyzePrescription 
} from '../lib/prescription-checker';
import {
  getDrugClasses,
  getDrugSpecialties,
  getPharmacologicalClassNames,
  getSpecialtyNames,
  matchesDrugQuery,
} from '../lib/medical-classification';
import { ClinicalHeader } from '../components/ClinicalHeader';
import { UniversalOmnisearch } from '../components/UniversalOmnisearch';
import { SpecialtySidebar } from '../components/SpecialtySidebar';
import { MonographViewer } from '../components/MonographViewer';
import { InteractionScreeningDrawer } from '../components/InteractionScreeningDrawer';
import { EmergencyProtocolsScreen } from '../components/EmergencyProtocolsScreen';
import { RenalModalDrawer } from '../components/RenalModalDrawer';
import { AddMedicationModal } from '../components/AddMedicationModal';
import {
  getCustomPharmacopoeiaServerSnapshot,
  getCustomPharmacopoeiaSnapshot,
  saveCustomPharmacopoeia,
  subscribeCustomPharmacopoeia,
} from '../lib/custom-pharmacopoeia-store';

export default function ClinicalApp() {
  // Navigation tabs: 'monographs' | 'emergency'
  const [currentTab, setCurrentTab] = useState<'monographs' | 'emergency'>('monographs');

  // Currently selected drug for the monograph viewer
  const [selectedDrug, setSelectedDrug] = useState<DrugMonograph>(ALGERIAN_DRUG_DATABASE[0]);

  // Sidebar filters
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Toutes');
  const [selectedClass, setSelectedClass] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const customData = useSyncExternalStore(
    subscribeCustomPharmacopoeia,
    getCustomPharmacopoeiaSnapshot,
    getCustomPharmacopoeiaServerSnapshot
  );
  const customDrugs = customData.drugs;
  const customSpecialties = customData.specialties;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const drugs = useMemo(() => [...ALGERIAN_DRUG_DATABASE, ...customDrugs], [customDrugs]);

  // Active patient prescription basket
  // Initialize with a realistic emergency duo: Lovenox + Kardegic to showcase interaction safety checking immediately
  const [prescribedDrugs, setPrescribedDrugs] = useState<DrugMonograph[]>([
    ALGERIAN_DRUG_DATABASE[0], // Lovenox
    ALGERIAN_DRUG_DATABASE[1], // Kardegic
  ]);

  // Patient parameters for renal clearance
  const [patientParams, setPatientParams] = useState<PatientParameters>({
    gender: 'homme',
    age: 72,
    weightKg: 74,
    creatinineValue: 125,
    creatinineUnit: 'umol_l',
  });

  // Modal drawer for renal calculator
  const [isRenalModalOpen, setIsRenalModalOpen] = useState(false);
  // Mobile drawer for prescription tray
  const [isMobileTrayOpen, setIsMobileTrayOpen] = useState(false);

  // Unique list of specialties: canonical taxonomy plus user-created entries.
  const specialties = useMemo(() => {
    const merged = getSpecialtyNames();
    const additions = [
      ...customSpecialties,
      ...customDrugs.flatMap((drug) => getDrugSpecialties(drug)),
    ];
    for (const specialty of additions) {
      if (specialty && !merged.includes(specialty)) {
        merged.push(specialty);
      }
    }
    return ['Toutes', ...merged];
  }, [customSpecialties, customDrugs]);

  // Canonical pharmacological classes plus user-created classifications.
  const pharmacologicalClasses = useMemo(() => {
    const merged = getPharmacologicalClassNames();
    for (const drug of customDrugs) {
      for (const pharmacologicalClass of getDrugClasses(drug)) {
        if (pharmacologicalClass && !merged.includes(pharmacologicalClass)) {
          merged.push(pharmacologicalClass);
        }
      }
    }
    return ['Toutes', ...merged];
  }, [customDrugs]);

  // Filtered drugs based on specialty, class, and indexed search.
  const filteredDrugs = useMemo(() => {
    return drugs.filter((drug) => {
      const matchSpecialty =
        selectedSpecialty === 'Toutes' ||
        getDrugSpecialties(drug).includes(selectedSpecialty);
      const matchClass =
        selectedClass === 'Toutes' || getDrugClasses(drug).includes(selectedClass);
      return matchSpecialty && matchClass && matchesDrugQuery(drug, searchQuery);
    });
  }, [drugs, searchQuery, selectedClass, selectedSpecialty]);

  // Evaluate renal state
  const renalState = useMemo(() => {
    return evaluatePatientRenalState(patientParams, drugs);
  }, [patientParams, drugs]);

  // Analyze active prescription
  const prescriptionAnalysis = useMemo(() => {
    return analyzePrescription(
      prescribedDrugs.map((drug) => ({ drug })),
      renalState.cockcroftClearanceMlMin
    );
  }, [prescribedDrugs, renalState.cockcroftClearanceMlMin]);

  // Toggle drug in prescription basket
  const handleTogglePrescription = (drug: DrugMonograph) => {
    setPrescribedDrugs((prev) => {
      const exists = prev.some((d) => d.id === drug.id);
      if (exists) {
        return prev.filter((d) => d.id !== drug.id);
      } else {
        return [...prev, drug];
      }
    });
  };

  const handleRemoveDrug = (drugId: string) => {
    setPrescribedDrugs((prev) => prev.filter((d) => d.id !== drugId));
  };

  const handleClearPrescription = () => {
    setPrescribedDrugs([]);
  };

  const handleLoadProtocolDrugs = (drugs: DrugMonograph[]) => {
    setPrescribedDrugs((prev) => {
      const existingIds = new Set(prev.map((d) => d.id));
      const newItems = drugs.filter((d) => !existingIds.has(d.id));
      return [...prev, ...newItems];
    });
    setIsMobileTrayOpen(true);
  };

  const isDrugPrescribed = (drugId: string) => {
    return prescribedDrugs.some((d) => d.id === drugId);
  };

  const handleAddDrug = (drug: DrugMonograph) => {
    const nextDrugs = customDrugs.some((item) => item.id === drug.id)
      ? customDrugs
      : [...customDrugs, drug];
    const nextSpecialties = customSpecialties.includes(drug.specialty)
      ? customSpecialties
      : [...customSpecialties, drug.specialty];
    saveCustomPharmacopoeia({ drugs: nextDrugs, specialties: nextSpecialties });
    setSelectedDrug(drug);
    setSelectedSpecialty(drug.specialty);
    setSelectedClass('Toutes');
    setSearchQuery('');
    setCurrentTab('monographs');
  };

  const handleAddSpecialty = (specialty: string) => {
    if (!customSpecialties.includes(specialty)) {
      saveCustomPharmacopoeia({
        drugs: customDrugs,
        specialties: [...customSpecialties, specialty],
      });
    }
    setSelectedSpecialty(specialty);
    setCurrentTab('monographs');
  };

  const handleSelectSpecialty = (specialty: string) => {
    setSelectedSpecialty(specialty);
    const firstDrug = drugs.find(
      (drug) =>
        (specialty === 'Toutes' || getDrugSpecialties(drug).includes(specialty)) &&
        (selectedClass === 'Toutes' || getDrugClasses(drug).includes(selectedClass)) &&
        matchesDrugQuery(drug, searchQuery)
    );
    if (firstDrug) {
      setSelectedDrug(firstDrug);
    }
  };

  const handleSelectClass = (pharmacologicalClass: string) => {
    setSelectedClass(pharmacologicalClass);
    const firstDrug = drugs.find(
      (drug) =>
        (selectedSpecialty === 'Toutes' ||
          getDrugSpecialties(drug).includes(selectedSpecialty)) &&
        (pharmacologicalClass === 'Toutes' ||
          getDrugClasses(drug).includes(pharmacologicalClass)) &&
        matchesDrugQuery(drug, searchQuery)
    );
    if (firstDrug) {
      setSelectedDrug(firstDrug);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191C1E] flex flex-col font-sans selection:bg-[#86F2E4] selection:text-[#00201D]">
      {/* Clinical Header conforming to Top Bar Contract */}
      <ClinicalHeader
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        prescribedCount={prescribedDrugs.length}
        hasContraindication={prescriptionAnalysis.hasAbsoluteContraindication}
        onOpenPrescriptionTray={() => setIsMobileTrayOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* VIEW 1: MONOGRAPHS & CLINICAL EXPLORER (3-COLUMN ARCHITECTURE AS PER DESIGN SPEC) */}
        {currentTab === 'monographs' && (
          <div className="space-y-6">
            {/* Top Omnisearch Bar */}
            <div className="max-w-4xl mx-auto w-full">
              <UniversalOmnisearch
                drugs={drugs}
                selectedDrug={selectedDrug}
                onSelectDrug={(drug) => setSelectedDrug(drug)}
                onPrescribeQuick={(drug) => handleTogglePrescription(drug)}
                isPrescribed={isDrugPrescribed}
                onQueryChange={setSearchQuery}
              />
            </div>

            {/* 3-Column Layout: Left Specialty Sidebar (w-64) | Center Monograph (flex-1) | Right Persistent Tray (w-80) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Column 1: Persistent Specialty & Pharmacological Class Navigation */}
              <div className="w-full lg:w-auto">
                <SpecialtySidebar
                  specialties={specialties}
                  classes={pharmacologicalClasses}
                  selectedSpecialty={selectedSpecialty}
                  selectedClass={selectedClass}
                  onSelectSpecialty={handleSelectSpecialty}
                  onSelectClass={handleSelectClass}
                  drugs={drugs}
                />
              </div>

              {/* Column 2: High-Speed Indexed Search & Monograph Viewer */}
              <div className="flex-1 min-w-0 w-full space-y-4">
                {filteredDrugs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <p className="text-sm font-semibold text-[#0F2942]">
                      Aucun médicament ne correspond aux filtres sélectionnés.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Modifiez la spécialité, la classe ou la recherche, ou ajoutez une monographie.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-4 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F766E]"
                    >
                      Ajouter un médicament
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Indexed medication rows with DCI, presentation and classification */}
                    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                      <div className="flex flex-col gap-1.5 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <span>Index des médicaments</span>
                          <span className="font-mono text-slate-400">
                            {filteredDrugs.length} résultat{filteredDrugs.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        {selectedClass !== 'Toutes' && (
                          <button
                            onClick={() => setSelectedClass('Toutes')}
                            className="self-start rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold text-teal-800 transition-colors hover:bg-teal-100 sm:self-auto"
                            title="Retirer le filtre de classe"
                          >
                            Classe : {selectedClass} ×
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
                        {filteredDrugs.map((drug) => {
                          const isSelected = selectedDrug.id === drug.id;
                          const inPrescription = isDrugPrescribed(drug.id);
                          const drugClasses = getDrugClasses(drug);

                          return (
                            <button
                              key={drug.id}
                              onClick={() => setSelectedDrug(drug)}
                              className={`w-full px-4 py-3 text-left transition-colors ${
                                isSelected ? 'bg-[#F0FDFA]' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-bold text-[#0F2942]">
                                      {drug.brandName}
                                    </span>
                                    <span className="truncate text-xs font-semibold text-[#0D9488]">
                                      {drug.dci}
                                    </span>
                                    {inPrescription && (
                                      <span
                                        className="h-1.5 w-1.5 rounded-full bg-teal-500"
                                        title="Sur le plateau de prescription"
                                      />
                                    )}
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                                    <span>{drug.presentationForm}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{drug.standardPackaging}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                                  {drugClasses.length === 0 ? (
                                    <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                                      Non classé
                                    </span>
                                  ) : (
                                    drugClasses.map((pharmacologicalClass) => (
                                      <span
                                        key={pharmacologicalClass}
                                        className="rounded border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800"
                                      >
                                        {pharmacologicalClass}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Master Monograph Card Container */}
                    <MonographViewer
                      drug={selectedDrug}
                      isPrescribed={isDrugPrescribed(selectedDrug.id)}
                      onTogglePrescription={handleTogglePrescription}
                      onOpenRenalCalculator={() => setIsRenalModalOpen(true)}
                      patientClearance={renalState.cockcroftClearanceMlMin}
                    />
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: EMERGENCY HOSPITAL PROTOCOLS */}
        {currentTab === 'emergency' && (
          <EmergencyProtocolsScreen
            onLoadProtocolToPrescription={handleLoadProtocolDrugs}
            onSelectDrugForMonograph={(drug) => {
              setSelectedDrug(drug);
              setCurrentTab('monographs');
            }}
          />
        )}
      </main>

      {/* Floating Modal for Renal Calculator */}
      <RenalModalDrawer
        isOpen={isRenalModalOpen}
        onClose={() => setIsRenalModalOpen(false)}
        params={patientParams}
        onUpdateParams={(p) => setPatientParams(p)}
      />

      {isAddModalOpen && (
        <AddMedicationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          specialties={specialties}
          onAddDrug={handleAddDrug}
          onAddSpecialty={handleAddSpecialty}
        />
      )}

      {/* Mobile Slide-Over Drawer for Prescription Validation Tray */}
      {isMobileTrayOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
            <InteractionScreeningDrawer
              prescribedDrugs={prescribedDrugs}
              onRemoveDrug={handleRemoveDrug}
              onClearPrescription={handleClearPrescription}
              analysis={prescriptionAnalysis}
              patientClearance={renalState.cockcroftClearanceMlMin}
              onOpenRenalModal={() => {
                setIsMobileTrayOpen(false);
                setIsRenalModalOpen(true);
              }}
              onClose={() => setIsMobileTrayOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* Clinical Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F2942]">PharmaDZ Clinical</span>
            <span>·</span>
            <span>Nomenclature Pharmaceutique & Règles de Bonnes Pratiques Thérapeutiques</span>
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
