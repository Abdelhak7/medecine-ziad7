import { DrugMonograph } from './pharmacopoeia-data';

export interface MedicalSpecialty {
  id: string;
  name: string;
}

export interface PharmacologicalClass {
  id: string;
  name: string;
}

export const MEDICAL_SPECIALTIES: MedicalSpecialty[] = [
  { id: 'medecine-generale', name: 'Médecine générale' },
  { id: 'cardiologie', name: 'Cardiologie et maladies cardiovasculaires' },
  { id: 'pneumologie', name: 'Pneumologie' },
  { id: 'gastro-enterologie', name: 'Gastro-entérologie' },
  { id: 'neurologie', name: 'Neurologie' },
  { id: 'endocrinologie-diabetologie', name: 'Endocrinologie et diabétologie' },
  { id: 'maladies-infectieuses', name: 'Maladies infectieuses' },
  { id: 'nephrologie', name: 'Néphrologie' },
  { id: 'dermatologie', name: 'Dermatologie' },
  { id: 'gynecologie-obstetrique', name: 'Gynécologie-obstétrique' },
  { id: 'pediatrie', name: 'Pédiatrie' },
  { id: 'urgences-medicales', name: 'Urgences médicales' },
  { id: 'anesthesie-reanimation', name: 'Anesthésie-réanimation' },
  { id: 'hematologie', name: 'Hématologie' },
  { id: 'oncologie', name: 'Oncologie' },
  { id: 'rhumatologie', name: 'Rhumatologie' },
  { id: 'psychiatrie', name: 'Psychiatrie' },
  { id: 'ophtalmologie', name: 'Ophtalmologie' },
  { id: 'orl', name: 'ORL' },
  { id: 'urologie', name: 'Urologie' },
  { id: 'odontologie', name: 'Odontologie' },
  { id: 'allergologie-immunologie', name: 'Allergologie et immunologie' },
  { id: 'toxicologie', name: 'Toxicologie' },
  { id: 'geriatrie', name: 'Gériatrie' },
];

export const PHARMACOLOGICAL_CLASSES: PharmacologicalClass[] = [
  { id: 'antalgiques', name: 'Antalgiques' },
  { id: 'ains', name: 'Anti-inflammatoires non stéroïdiens (AINS)' },
  { id: 'antibiotiques', name: 'Antibiotiques' },
  { id: 'antiviraux', name: 'Antiviraux' },
  { id: 'antifongiques', name: 'Antifongiques' },
  { id: 'antiparasitaires', name: 'Antiparasitaires' },
  { id: 'antihypertenseurs', name: 'Antihypertenseurs' },
  { id: 'anticoagulants', name: 'Anticoagulants' },
  { id: 'antiagregants-plaquettaires', name: 'Antiagrégants plaquettaires' },
  { id: 'antiarythmiques', name: 'Antiarythmiques' },
  { id: 'antidiabetiques', name: 'Antidiabétiques' },
  { id: 'antihistaminiques', name: 'Antihistaminiques' },
  { id: 'corticoides', name: 'Corticoïdes' },
  { id: 'bronchodilatateurs', name: 'Bronchodilatateurs' },
  { id: 'antidepresseurs', name: 'Antidépresseurs' },
  { id: 'antipsychotiques', name: 'Antipsychotiques' },
  { id: 'antiepileptiques', name: 'Antiépileptiques' },
  { id: 'antiemetiques', name: 'Antiémétiques' },
  { id: 'antispasmodiques', name: 'Antispasmodiques' },
  { id: 'laxatifs', name: 'Laxatifs' },
  { id: 'diuretiques', name: 'Diurétiques' },
  { id: 'hypolipemiants', name: 'Hypolipémiants' },
  { id: 'antisecretoires-gastriques', name: 'Antisécrétoires gastriques' },
  { id: 'hormones-substituts-hormonaux', name: 'Hormones et substituts hormonaux' },
  { id: 'vaccins', name: 'Vaccins' },
  { id: 'anesthesiques', name: 'Anesthésiques' },
  { id: 'antidotes', name: 'Antidotes' },
  { id: 'immunosuppresseurs', name: 'Immunosuppresseurs' },
  { id: 'antineoplasiques', name: 'Antinéoplasiques' },
  { id: 'antianemiques', name: 'Antianémiques' },
  { id: 'vitamines-mineraux', name: 'Vitamines et minéraux' },
  { id: 'solutions-perfusion', name: 'Solutions de perfusion' },
  { id: 'antiseptiques-desinfectants', name: 'Antiseptiques et désinfectants' },
];

export interface MedicationClassificationLink {
  specialtyIds: string[];
  classIds: string[];
}

// Many-to-many links for the verified built-in pharmacopoeia. Drugs may belong
// to several specialties and classes without duplicating the monograph.
export const MEDICATION_CLASSIFICATION_LINKS: Record<string, MedicationClassificationLink> = {
  'lovenox-enoxaparine': {
    specialtyIds: [
      'cardiologie',
      'hematologie',
      'urgences-medicales',
      'gynecologie-obstetrique',
      'anesthesie-reanimation',
      'geriatrie',
    ],
    classIds: ['anticoagulants'],
  },
  'kardegic-aspirine': {
    specialtyIds: ['cardiologie', 'neurologie', 'urgences-medicales', 'medecine-generale'],
    classIds: ['antiagregants-plaquettaires'],
  },
  'glucophage-metformine': {
    specialtyIds: ['endocrinologie-diabetologie', 'nephrologie', 'medecine-generale'],
    classIds: ['antidiabetiques'],
  },
  'augmentin-amoxicilline-acide-clavulanique': {
    specialtyIds: [
      'maladies-infectieuses',
      'pneumologie',
      'orl',
      'urologie',
      'odontologie',
      'dermatologie',
      'pediatrie',
      'medecine-generale',
    ],
    classIds: ['antibiotiques'],
  },
  'cordarone-amiodarone': {
    specialtyIds: ['cardiologie', 'urgences-medicales', 'anesthesie-reanimation', 'geriatrie'],
    classIds: ['antiarythmiques'],
  },
  'ciproxine-ciprofloxacine': {
    specialtyIds: ['maladies-infectieuses', 'urologie', 'orl', 'pneumologie'],
    classIds: ['antibiotiques'],
  },
  'triatec-ramipril': {
    specialtyIds: [
      'cardiologie',
      'nephrologie',
      'endocrinologie-diabetologie',
      'geriatrie',
      'medecine-generale',
    ],
    classIds: ['antihypertenseurs'],
  },
  'lasilix-furosemide': {
    specialtyIds: [
      'cardiologie',
      'nephrologie',
      'urgences-medicales',
      'anesthesie-reanimation',
      'geriatrie',
    ],
    classIds: ['diuretiques'],
  },
  'inexium-esomeprazole': {
    specialtyIds: ['gastro-enterologie', 'rhumatologie', 'geriatrie', 'medecine-generale'],
    classIds: ['antisecretoires-gastriques'],
  },
  'doliprane-paracetamol': {
    specialtyIds: [
      'medecine-generale',
      'pediatrie',
      'urgences-medicales',
      'rhumatologie',
      'odontologie',
      'gynecologie-obstetrique',
      'neurologie',
      'geriatrie',
    ],
    classIds: ['antalgiques'],
  },
};

const specialtyNameById = new Map(
  MEDICAL_SPECIALTIES.map((specialty) => [specialty.id, specialty.name])
);
const classNameById = new Map(
  PHARMACOLOGICAL_CLASSES.map((pharmacologicalClass) => [
    pharmacologicalClass.id,
    pharmacologicalClass.name,
  ])
);

const dedupe = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

export const getDrugSpecialties = (drug: DrugMonograph): string[] => {
  const explicit = dedupe(drug.specialties ?? []);
  if (explicit.length > 0) return explicit;

  const link = MEDICATION_CLASSIFICATION_LINKS[drug.id];
  if (link) {
    return dedupe(
      link.specialtyIds
        .map((id) => specialtyNameById.get(id) ?? '')
        .filter(Boolean)
    );
  }

  return drug.specialty ? [drug.specialty] : [];
};

export const getDrugClasses = (drug: DrugMonograph): string[] => {
  const explicit = dedupe(drug.pharmacologicalClasses ?? []);
  if (explicit.length > 0) return explicit;

  const link = MEDICATION_CLASSIFICATION_LINKS[drug.id];
  if (link) {
    return dedupe(
      link.classIds.map((id) => classNameById.get(id) ?? '').filter(Boolean)
    );
  }

  return [];
};

export const getSpecialtyNames = () => MEDICAL_SPECIALTIES.map((specialty) => specialty.name);

export const getPharmacologicalClassNames = () =>
  PHARMACOLOGICAL_CLASSES.map((pharmacologicalClass) => pharmacologicalClass.name);

export const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const matchesDrugQuery = (drug: DrugMonograph, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const searchableValues = [
    drug.brandName,
    drug.dci,
    drug.atcCode,
    drug.atcClassification,
    drug.specialty,
    drug.holderLaboratory,
    drug.presentationForm,
    drug.standardPackaging,
    ...getDrugSpecialties(drug),
    ...getDrugClasses(drug),
  ];

  return searchableValues.some((value) =>
    normalizeSearchText(value).includes(normalizedQuery)
  );
};
