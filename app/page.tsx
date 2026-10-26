'use client';

import React, { useState, useMemo } from 'react';
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
import { ClinicalHeader } from '../components/ClinicalHeader';
import { UniversalOmnisearch } from '../components/UniversalOmnisearch';
import { SpecialtySidebar } from '../components/SpecialtySidebar';
import { MonographViewer } from '../components/MonographViewer';
import { InteractionScreeningDrawer } from '../components/InteractionScreeningDrawer';
import { DrugInteractionMatrixScreen } from '../components/DrugInteractionMatrixScreen';
import { RenalDoseCalculatorScreen } from '../components/RenalDoseCalculatorScreen';
import { CnasFormularyScreen } from '../components/CnasFormularyScreen';
import { EmergencyProtocolsScreen } from '../components/EmergencyProtocolsScreen';
import { RenalModalDrawer } from '../components/RenalModalDrawer';
import { ShieldAlert, AlertOctagon, Heart, Pill, Search } from 'lucide-react';

export default function ClinicalApp() {
  // Navigation tabs: 'monographs' | 'matrix' | 'renal' | 'cnas' | 'emergency'
  const [currentTab, setCurrentTab] = useState<'monographs' | 'matrix' | 'renal' | 'cnas' | 'emergency'>('monographs');

  // Currently selected drug for the monograph viewer
  const [selectedDrug, setSelectedDrug] = useState<DrugMonograph>(ALGERIAN_DRUG_DATABASE[0]);

  // Sidebar filters
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Toutes');
  const [selectedRegulatory, setSelectedRegulatory] = useState<string>('Tous');
  const [cnasOnly, setCnasOnly] = useState<boolean>(false);

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

  // Unique list of specialties
  const specialties = useMemo(() => {
    const list = Array.from(new Set(ALGERIAN_DRUG_DATABASE.map((d) => d.specialty)));
    return ['Toutes', ...list];
  }, []);

  // Filtered drugs based on sidebar selection
  const filteredDrugs = useMemo(() => {
    return ALGERIAN_DRUG_DATABASE.filter((drug) => {
      const matchSpecialty = selectedSpecialty === 'Toutes' || drug.specialty === selectedSpecialty;
      const matchRegulatory = selectedRegulatory === 'Tous' || drug.regulatoryStatus === selectedRegulatory;
      const matchCnas = !cnasOnly || drug.cnasRatePercent === 100;
      return matchSpecialty && matchRegulatory && matchCnas;
    });
  }, [selectedSpecialty, selectedRegulatory, cnasOnly]);

  // Evaluate renal state
  const renalState = useMemo(() => {
    return evaluatePatientRenalState(patientParams, ALGERIAN_DRUG_DATABASE);
  }, [patientParams]);

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
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* VIEW 1: MONOGRAPHS & CLINICAL EXPLORER (3-COLUMN ARCHITECTURE AS PER DESIGN SPEC) */}
        {currentTab === 'monographs' && (
          <div className="space-y-6">
            {/* Top Omnisearch Bar */}
            <div className="max-w-4xl mx-auto w-full">
              <UniversalOmnisearch
                drugs={ALGERIAN_DRUG_DATABASE}
                selectedDrug={selectedDrug}
                onSelectDrug={(drug) => setSelectedDrug(drug)}
                onPrescribeQuick={(drug) => handleTogglePrescription(drug)}
                isPrescribed={isDrugPrescribed}
              />
            </div>

            {/* 3-Column Layout: Left Specialty Sidebar (w-64) | Center Monograph (flex-1) | Right Persistent Tray (w-80) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Column 1: Persistent Category / Specialty Navigation (Desktop & Tablet) */}
              <div className="hidden lg:block">
                <SpecialtySidebar
                  specialties={specialties}
                  selectedSpecialty={selectedSpecialty}
                  onSelectSpecialty={setSelectedSpecialty}
                  selectedRegulatory={selectedRegulatory}
                  onSelectRegulatory={setSelectedRegulatory}
                  drugs={ALGERIAN_DRUG_DATABASE}
                  cnasOnly={cnasOnly}
                  onToggleCnasOnly={() => setCnasOnly(!cnasOnly)}
                />
              </div>

              {/* Column 2: High-Speed Indexed Search & Monograph Viewer */}
              <div className="flex-1 min-w-0 w-full space-y-4">
                {/* Horizontal Quick-Selector Pill Strip for currently filtered specialty */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0 mr-1">
                    Index :
                  </span>
                  {filteredDrugs.map((drug) => {
                    const isSelected = selectedDrug.id === drug.id;
                    const inPrescription = isDrugPrescribed(drug.id);
                    return (
                      <button
                        key={drug.id}
                        onClick={() => setSelectedDrug(drug)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 transition-colors border ${
                          isSelected
                            ? 'bg-[#0F2942] text-white border-[#0F2942]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{drug.brandName}</span>
                        {inPrescription && (
                          <span className="ml-1 text-[10px] text-teal-400 font-bold">●</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Master Monograph Card Container */}
                <MonographViewer
                  drug={selectedDrug}
                  isPrescribed={isDrugPrescribed(selectedDrug.id)}
                  onTogglePrescription={handleTogglePrescription}
                  onOpenRenalCalculator={() => setIsRenalModalOpen(true)}
                  patientClearance={renalState.cockcroftClearanceMlMin}
                />
              </div>

              {/* Column 3: Dedicated Persistent Interaction & Contraindication Drawer (Desktop) */}
              <div className="hidden xl:block">
                <InteractionScreeningDrawer
                  prescribedDrugs={prescribedDrugs}
                  onRemoveDrug={handleRemoveDrug}
                  onClearPrescription={handleClearPrescription}
                  analysis={prescriptionAnalysis}
                  patientClearance={renalState.cockcroftClearanceMlMin}
                  onOpenRenalModal={() => setIsRenalModalOpen(true)}
                  onOpenFullMatrix={() => setCurrentTab('matrix')}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FULL DRUG-DRUG INTERACTION MATRIX SCREEN */}
        {currentTab === 'matrix' && (
          <DrugInteractionMatrixScreen
            prescribedDrugs={prescribedDrugs}
            onAddDrugToPrescription={handleTogglePrescription}
            onRemoveDrugFromPrescription={handleRemoveDrug}
          />
        )}

        {/* VIEW 3: RENAL DOSE & CLEARANCE CALCULATOR (COCKCROFT & CKD-EPI) */}
        {currentTab === 'renal' && (
          <RenalDoseCalculatorScreen
            initialParams={patientParams}
            onUpdateParams={(params) => setPatientParams(params)}
            onSelectDrugForMonograph={(drug) => {
              setSelectedDrug(drug);
              setCurrentTab('monographs');
            }}
          />
        )}

        {/* VIEW 4: ALGERIAN CNAS FORMULARY & GENERICS SUBSTITUTION */}
        {currentTab === 'cnas' && (
          <CnasFormularyScreen
            onSelectDrugForMonograph={(drug) => {
              setSelectedDrug(drug);
              setCurrentTab('monographs');
            }}
          />
        )}

        {/* VIEW 5: EMERGENCY HOSPITAL PROTOCOLS */}
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

      {/* Mobile Slide-Over Drawer for Prescription Validation Tray */}
      {isMobileTrayOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs xl:hidden">
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
              onOpenFullMatrix={() => {
                setIsMobileTrayOpen(false);
                setCurrentTab('matrix');
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
