'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Stethoscope, Trash2, X } from 'lucide-react';
import { DrugMonograph, RenalRule } from '../lib/pharmacopoeia-data';
import { getPharmacologicalClassNames } from '../lib/medical-classification';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialties: string[];
  onAddDrug: (drug: DrugMonograph) => void;
  onAddSpecialty: (specialty: string) => void;
}

interface RenalRuleForm {
  min: string;
  max: string;
  severity: RenalRule['severity'];
  recommendation: string;
}

interface MedicationForm {
  brandName: string;
  dci: string;
  atcCode: string;
  atcClassification: string;
  specialty: string;
  specialties: string[];
  pharmacologicalClasses: string[];
  regulatoryStatus: DrugMonograph['regulatoryStatus'];
  holderLaboratory: string;
  originCountry: string;
  presentationForm: string;
  standardPackaging: string;
  adultDosage: string;
  pediatricDosage: string;
  elderlyDosage: string;
  administrationRoute: DrugMonograph['administrationRoute'];
  hepaticAdjustment: string;
  absoluteContraindications: string;
  relativeContraindications: string;
  blackBoxWarning: string;
  pregnancySafety: DrugMonograph['pregnancySafety'];
  breastfeedingSafety: DrugMonograph['breastfeedingSafety'];
  cnasReimbursable: boolean;
  cnasRatePercent: string;
  renalRules: RenalRuleForm[];
  bioavailability: string;
  halfLifeHours: string;
  plasmaProteinBinding: string;
  elimination: string;
  therapeuticRange: string;
}

const regulatoryStatuses: DrugMonograph['regulatoryStatus'][] = [
  'Liste I',
  'Liste II',
  'Stupéfiant',
  'Non listé (Sans ordonnance)',
];

const administrationRoutes: DrugMonograph['administrationRoute'][] = [
  'Voie Orale',
  'Sous-cutanée',
  'Intraveineuse lente / Perfusion',
  'Intramusculaire',
  'Inhalation',
];

const pregnancyOptions: DrugMonograph['pregnancySafety'][] = [
  'Contre-indiqué (T3)',
  'Contre-indiqué absolu',
  'Déconseillé',
  'Utilisable avec précaution',
  'Sans risque avéré',
];

const breastfeedingOptions: DrugMonograph['breastfeedingSafety'][] = [
  'Contre-indiqué',
  'Déconseillé',
  'Possible',
];

const severityOptions: RenalRule['severity'][] = [
  'SAFE',
  'ADAPT',
  'CAUTION',
  'CONTRAINDICATED',
];

const pharmacologicalClassOptions = getPharmacologicalClassNames();

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-colors focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20';
const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1';
const sectionClass = 'rounded-xl border border-slate-200 overflow-hidden';
const sectionTitleClass =
  'flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#0F2942]';

const createRenalRule = (): RenalRuleForm => ({
  min: '0',
  max: '150',
  severity: 'SAFE',
  recommendation: 'Posologie usuelle sans adaptation',
});

const createInitialForm = (): MedicationForm => ({
  brandName: '',
  dci: '',
  atcCode: '',
  atcClassification: '',
  specialty: '',
  specialties: [],
  pharmacologicalClasses: [],
  regulatoryStatus: 'Liste I',
  holderLaboratory: '',
  originCountry: 'Algérie',
  presentationForm: '',
  standardPackaging: '',
  adultDosage: '',
  pediatricDosage: '',
  elderlyDosage: '',
  administrationRoute: 'Voie Orale',
  hepaticAdjustment: '',
  absoluteContraindications: '',
  relativeContraindications: '',
  blackBoxWarning: '',
  pregnancySafety: 'Utilisable avec précaution',
  breastfeedingSafety: 'Possible',
  cnasReimbursable: false,
  cnasRatePercent: '0',
  renalRules: [createRenalRule()],
  bioavailability: '',
  halfLifeHours: '',
  plasmaProteinBinding: '',
  elimination: '',
  therapeuticRange: '',
});

const splitLines = (value: string) =>
  value
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  specialties,
  onAddDrug,
  onAddSpecialty,
}) => {
  const [mode, setMode] = useState<'drug' | 'specialty'>('drug');
  const [form, setForm] = useState<MedicationForm>(createInitialForm);
  const [specialtyName, setSpecialtyName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = <K extends keyof MedicationForm>(key: K, value: MedicationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateRenalRule = (index: number, patch: Partial<RenalRuleForm>) => {
    setForm((current) => ({
      ...current,
      renalRules: current.renalRules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...patch } : rule
      ),
    }));
  };

  const addRenalRule = () => {
    setForm((current) => ({
      ...current,
      renalRules: [...current.renalRules, createRenalRule()],
    }));
  };

  const removeRenalRule = (index: number) => {
    setForm((current) => ({
      ...current,
      renalRules:
        current.renalRules.length === 1
          ? current.renalRules
          : current.renalRules.filter((_, ruleIndex) => ruleIndex !== index),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (mode === 'specialty') {
      const name = specialtyName.trim();
      if (!name) {
        setError('Le nom de la spécialité est obligatoire.');
        return;
      }
      if (name === 'Toutes') {
        setError('Ce nom de spécialité est réservé.');
        return;
      }
      onAddSpecialty(name);
      onClose();
      return;
    }

    const brandName = form.brandName.trim();
    const dci = form.dci.trim();
    const specialty = form.specialty.trim();

    if (!brandName || !dci || !specialty) {
      setError('Le nom commercial, la DCI et la spécialité sont obligatoires.');
      return;
    }

    if (specialty === 'Toutes') {
      setError('Ce nom de spécialité est réservé.');
      return;
    }

    const renalRules = form.renalRules.map((rule) => ({
      creatinineClearanceMin: Number.isFinite(Number(rule.min)) ? Number(rule.min) : 0,
      creatinineClearanceMax: Number.isFinite(Number(rule.max)) ? Number(rule.max) : 150,
      severity: rule.severity,
      adjustmentRecommendation: rule.recommendation.trim() || 'Posologie usuelle sans adaptation',
    }));

    const parsedRate = Number.parseInt(form.cnasRatePercent, 10);
    const associatedSpecialties = Array.from(
      new Set([specialty, ...form.specialties].map((item) => item.trim()).filter(Boolean))
    );

    const newDrug: DrugMonograph = {
      id: `${slugify(brandName) || 'medicament'}-${Date.now().toString(36)}`,
      brandName,
      dci,
      atcCode: form.atcCode.trim() || 'Non renseigné',
      atcClassification: form.atcClassification.trim() || 'Non classé',
      specialty,
      specialties: associatedSpecialties,
      pharmacologicalClasses: form.pharmacologicalClasses,
      regulatoryStatus: form.regulatoryStatus,
      holderLaboratory: form.holderLaboratory.trim() || 'Non renseigné',
      originCountry: form.originCountry.trim() || 'Non renseigné',
      presentationForm: form.presentationForm.trim() || 'Non renseigné',
      standardPackaging: form.standardPackaging.trim() || 'Non renseigné',
      adultDosage: form.adultDosage.trim() || 'À définir',
      pediatricDosage: form.pediatricDosage.trim() || undefined,
      elderlyDosage: form.elderlyDosage.trim() || undefined,
      administrationRoute: form.administrationRoute,
      renalAdjustmentRules: renalRules,
      hepaticAdjustment: form.hepaticAdjustment.trim() || undefined,
      absoluteContraindications: splitLines(form.absoluteContraindications),
      relativeContraindications: splitLines(form.relativeContraindications),
      blackBoxWarning: form.blackBoxWarning.trim() || undefined,
      pregnancySafety: form.pregnancySafety,
      breastfeedingSafety: form.breastfeedingSafety,
      cnasReimbursable: form.cnasReimbursable,
      cnasRatePercent: Number.isFinite(parsedRate)
        ? Math.min(100, Math.max(0, parsedRate))
        : 0,
      ppvDzd: 0,
      referenceTarifDzd: 0,
      genericsAvailable: [],
      pharmacokinetics: {
        bioavailability: form.bioavailability.trim() || 'Non renseigné',
        halfLifeHours: form.halfLifeHours.trim() || 'Non renseigné',
        plasmaProteinBinding: form.plasmaProteinBinding.trim() || 'Non renseigné',
        elimination: form.elimination.trim() || 'Non renseigné',
        therapeuticRange: form.therapeuticRange.trim() || undefined,
      },
    };

    onAddDrug(newDrug);
    onClose();
  };

  const availableSpecialties = specialties.filter((specialty) => specialty !== 'Toutes');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-medication-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="add-medication-title" className="text-sm font-bold text-[#0F2942]">
              Ajouter à la pharmacopée
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Créez une spécialité clinique ou une nouvelle monographie.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-200 px-5 pt-3">
          <button
            type="button"
            onClick={() => {
              setMode('drug');
              setError('');
            }}
            className={`flex items-center gap-1.5 border-b-2 px-2 py-2 text-xs font-semibold transition-colors ${
              mode === 'drug'
                ? 'border-[#0D9488] text-[#0F2942]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Médicament
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('specialty');
              setError('');
            }}
            className={`flex items-center gap-1.5 border-b-2 px-2 py-2 text-xs font-semibold transition-colors ${
              mode === 'specialty'
                ? 'border-[#0D9488] text-[#0F2942]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Spécialité clinique
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
                {error}
              </div>
            )}

            {mode === 'specialty' ? (
              <div className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="new-specialty">
                    Nom de la spécialité
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="new-specialty"
                      value={specialtyName}
                      onChange={(event) => setSpecialtyName(event.target.value)}
                      className={inputClass}
                      placeholder="Ex. Rhumatologie"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F766E]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Spécialités existantes ({availableSpecialties.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3">
                    {availableSpecialties.length === 0 ? (
                      <span className="text-xs text-slate-500">Aucune spécialité disponible.</span>
                    ) : (
                      availableSpecialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                        >
                          {specialty}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={sectionClass}>
                  <div className={sectionTitleClass}>Identification</div>
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="brandName">
                        Nom commercial *
                      </label>
                      <input
                        id="brandName"
                        value={form.brandName}
                        onChange={(event) => updateField('brandName', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Doliprane"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="dci">
                        DCI *
                      </label>
                      <input
                        id="dci"
                        value={form.dci}
                        onChange={(event) => updateField('dci', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Paracétamol"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="atcCode">
                        Code ATC
                      </label>
                      <input
                        id="atcCode"
                        value={form.atcCode}
                        onChange={(event) => updateField('atcCode', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. N02BE01"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="atcClassification">
                        Classification ATC
                      </label>
                      <input
                        id="atcClassification"
                        value={form.atcClassification}
                        onChange={(event) => updateField('atcClassification', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Analgésiques et antipyrétiques"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="specialty">
                        Spécialité *
                      </label>
                      <input
                        id="specialty"
                        list="specialty-options"
                        value={form.specialty}
                        onChange={(event) => updateField('specialty', event.target.value)}
                        className={inputClass}
                        placeholder="Sélectionner ou saisir une spécialité"
                      />
                      <datalist id="specialty-options">
                        {availableSpecialties.map((specialty) => (
                          <option key={specialty} value={specialty} />
                        ))}
                      </datalist>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="associatedSpecialties">
                        Spécialités associées
                      </label>
                      <select
                        id="associatedSpecialties"
                        multiple
                        size={5}
                        value={form.specialties}
                        onChange={(event) =>
                          updateField(
                            'specialties',
                            Array.from(event.target.selectedOptions, (option) => option.value)
                          )
                        }
                        className={`${inputClass} min-h-28`}
                      >
                        {availableSpecialties.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[10px] text-slate-500">
                        La spécialité principale est toujours conservée. Utilisez Ctrl/Cmd pour
                        sélectionner plusieurs spécialités.
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="pharmacologicalClasses">
                        Classes pharmacologiques
                      </label>
                      <select
                        id="pharmacologicalClasses"
                        multiple
                        size={6}
                        value={form.pharmacologicalClasses}
                        onChange={(event) =>
                          updateField(
                            'pharmacologicalClasses',
                            Array.from(event.target.selectedOptions, (option) => option.value)
                          )
                        }
                        className={`${inputClass} min-h-32`}
                      >
                        {pharmacologicalClassOptions.map((pharmacologicalClass) => (
                          <option key={pharmacologicalClass} value={pharmacologicalClass}>
                            {pharmacologicalClass}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Un médicament peut appartenir à plusieurs classes thérapeutiques.
                      </p>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="regulatoryStatus">
                        Statut réglementaire
                      </label>
                      <select
                        id="regulatoryStatus"
                        value={form.regulatoryStatus}
                        onChange={(event) =>
                          updateField(
                            'regulatoryStatus',
                            event.target.value as DrugMonograph['regulatoryStatus']
                          )
                        }
                        className={inputClass}
                      >
                        {regulatoryStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="holderLaboratory">
                        Laboratoire
                      </label>
                      <input
                        id="holderLaboratory"
                        value={form.holderLaboratory}
                        onChange={(event) => updateField('holderLaboratory', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Saidal"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="originCountry">
                        Pays d&apos;origine
                      </label>
                      <input
                        id="originCountry"
                        value={form.originCountry}
                        onChange={(event) => updateField('originCountry', event.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="presentationForm">
                        Forme galénique
                      </label>
                      <input
                        id="presentationForm"
                        value={form.presentationForm}
                        onChange={(event) => updateField('presentationForm', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Comprimé sécable"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="standardPackaging">
                        Conditionnement
                      </label>
                      <input
                        id="standardPackaging"
                        value={form.standardPackaging}
                        onChange={(event) => updateField('standardPackaging', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Boîte de 20 comprimés"
                      />
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className={sectionTitleClass}>Posologie & administration</div>
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="adultDosage">
                        Posologie adulte
                      </label>
                      <textarea
                        id="adultDosage"
                        value={form.adultDosage}
                        onChange={(event) => updateField('adultDosage', event.target.value)}
                        className={`${inputClass} min-h-20 resize-y`}
                        placeholder="Ex. 1 g toutes les 8 heures, sans dépasser 4 g/jour"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="pediatricDosage">
                        Posologie pédiatrique
                      </label>
                      <textarea
                        id="pediatricDosage"
                        value={form.pediatricDosage}
                        onChange={(event) => updateField('pediatricDosage', event.target.value)}
                        className={`${inputClass} min-h-20 resize-y`}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="elderlyDosage">
                        Posologie sujet âgé
                      </label>
                      <textarea
                        id="elderlyDosage"
                        value={form.elderlyDosage}
                        onChange={(event) => updateField('elderlyDosage', event.target.value)}
                        className={`${inputClass} min-h-20 resize-y`}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="administrationRoute">
                        Voie d&apos;administration
                      </label>
                      <select
                        id="administrationRoute"
                        value={form.administrationRoute}
                        onChange={(event) =>
                          updateField(
                            'administrationRoute',
                            event.target.value as DrugMonograph['administrationRoute']
                          )
                        }
                        className={inputClass}
                      >
                        {administrationRoutes.map((route) => (
                          <option key={route} value={route}>
                            {route}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="hepaticAdjustment">
                        Adaptation hépatique
                      </label>
                      <input
                        id="hepaticAdjustment"
                        value={form.hepaticAdjustment}
                        onChange={(event) => updateField('hepaticAdjustment', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Réduire la dose en cas d&apos;insuffisance sévère"
                      />
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className={sectionTitleClass}>Sécurité thérapeutique</div>
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="absoluteContraindications">
                        Contre-indications absolues
                      </label>
                      <textarea
                        id="absoluteContraindications"
                        value={form.absoluteContraindications}
                        onChange={(event) =>
                          updateField('absoluteContraindications', event.target.value)
                        }
                        className={`${inputClass} min-h-24 resize-y`}
                        placeholder="Une contre-indication par ligne"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="relativeContraindications">
                        Contre-indications relatives
                      </label>
                      <textarea
                        id="relativeContraindications"
                        value={form.relativeContraindications}
                        onChange={(event) =>
                          updateField('relativeContraindications', event.target.value)
                        }
                        className={`${inputClass} min-h-24 resize-y`}
                        placeholder="Une contre-indication par ligne"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="blackBoxWarning">
                        Alerte noire
                      </label>
                      <textarea
                        id="blackBoxWarning"
                        value={form.blackBoxWarning}
                        onChange={(event) => updateField('blackBoxWarning', event.target.value)}
                        className={`${inputClass} min-h-20 resize-y`}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="pregnancySafety">
                        Grossesse
                      </label>
                      <select
                        id="pregnancySafety"
                        value={form.pregnancySafety}
                        onChange={(event) =>
                          updateField(
                            'pregnancySafety',
                            event.target.value as DrugMonograph['pregnancySafety']
                          )
                        }
                        className={inputClass}
                      >
                        {pregnancyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="breastfeedingSafety">
                        Allaitement
                      </label>
                      <select
                        id="breastfeedingSafety"
                        value={form.breastfeedingSafety}
                        onChange={(event) =>
                          updateField(
                            'breastfeedingSafety',
                            event.target.value as DrugMonograph['breastfeedingSafety']
                          )
                        }
                        className={inputClass}
                      >
                        {breastfeedingOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className={sectionTitleClass}>Fonction rénale</div>
                  <div className="space-y-3 p-4">
                    {form.renalRules.map((rule, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-12"
                      >
                        <div className="sm:col-span-2">
                          <label className={labelClass}>ClCr min</label>
                          <input
                            type="number"
                            value={rule.min}
                            onChange={(event) =>
                              updateRenalRule(index, { min: event.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>ClCr max</label>
                          <input
                            type="number"
                            value={rule.max}
                            onChange={(event) =>
                              updateRenalRule(index, { max: event.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Niveau</label>
                          <select
                            value={rule.severity}
                            onChange={(event) =>
                              updateRenalRule(index, {
                                severity: event.target.value as RenalRule['severity'],
                              })
                            }
                            className={inputClass}
                          >
                            {severityOptions.map((severity) => (
                              <option key={severity} value={severity}>
                                {severity}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-5">
                          <label className={labelClass}>Recommandation</label>
                          <input
                            value={rule.recommendation}
                            onChange={(event) =>
                              updateRenalRule(index, { recommendation: event.target.value })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div className="col-span-2 flex items-end sm:col-span-1">
                          <button
                            type="button"
                            onClick={() => removeRenalRule(index)}
                            disabled={form.renalRules.length === 1}
                            className="w-full rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Supprimer la règle rénale"
                          >
                            <Trash2 className="mx-auto h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRenalRule}
                      className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#0D9488] hover:text-[#0D9488]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter une règle rénale
                    </button>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className={sectionTitleClass}>Remboursement</div>
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.cnasReimbursable}
                        onChange={(event) =>
                          updateField('cnasReimbursable', event.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-[#0F2942]"
                      />
                      Remboursable CNAS
                    </label>
                    <div>
                      <label className={labelClass} htmlFor="cnasRatePercent">
                        Taux de prise en charge (%)
                      </label>
                      <input
                        id="cnasRatePercent"
                        type="number"
                        min={0}
                        max={100}
                        value={form.cnasRatePercent}
                        onChange={(event) => updateField('cnasRatePercent', event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className={sectionClass}>
                  <div className={sectionTitleClass}>Pharmacocinétique</div>
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="bioavailability">
                        Biodisponibilité
                      </label>
                      <input
                        id="bioavailability"
                        value={form.bioavailability}
                        onChange={(event) => updateField('bioavailability', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. 80 %"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="halfLifeHours">
                        Demi-vie (heures)
                      </label>
                      <input
                        id="halfLifeHours"
                        value={form.halfLifeHours}
                        onChange={(event) => updateField('halfLifeHours', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. 6-8 h"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="plasmaProteinBinding">
                        Liaison protéique
                      </label>
                      <input
                        id="plasmaProteinBinding"
                        value={form.plasmaProteinBinding}
                        onChange={(event) =>
                          updateField('plasmaProteinBinding', event.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex. 20 %"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="elimination">
                        Élimination
                      </label>
                      <input
                        id="elimination"
                        value={form.elimination}
                        onChange={(event) => updateField('elimination', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. Rénale"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="therapeuticRange">
                        Marge thérapeutique
                      </label>
                      <input
                        id="therapeuticRange"
                        value={form.therapeuticRange}
                        onChange={(event) => updateField('therapeuticRange', event.target.value)}
                        className={inputClass}
                        placeholder="Ex. 10-20 mg/L"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
            >
              Annuler
            </button>
            {mode === 'drug' && (
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F766E]"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter le médicament
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
