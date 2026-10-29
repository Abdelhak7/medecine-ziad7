import { DrugMonograph } from './pharmacopoeia-data';

export interface Pathology {
  id: string;
  name: string;
  specialtyIds: string[];
  description: string;
  medicationIds: string[];
}

// Pathologies are limited to indications explicitly present in the existing
// monograph data (dosages, ATC classifications, warnings and emergency protocols).
export const PATHOLOGY_DATABASE: Pathology[] = [
  {
    id: 'thrombose-veineuse-profonde',
    name: 'Thrombose veineuse profonde (TVP)',
    specialtyIds: ['cardiologie', 'hematologie'],
    description:
      'Traitement curatif des thromboses veineuses profondes et prévention des récidives thromboemboliques.',
    medicationIds: ['lovenox-enoxaparine'],
  },
  {
    id: 'embolie-pulmonaire',
    name: 'Embolie pulmonaire (EP)',
    specialtyIds: ['cardiologie', 'pneumologie'],
    description: 'Traitement curatif de l’embolie pulmonaire.',
    medicationIds: ['lovenox-enoxaparine'],
  },
  {
    id: 'prevention-thromboembolique-peroperatoire',
    name: 'Prévention thromboembolique veineuse péri-opératoire',
    specialtyIds: ['anesthesie-reanimation', 'hematologie'],
    description:
      'Prévention chirurgicale des événements thromboemboliques veineux par héparine de bas poids moléculaire.',
    medicationIds: ['lovenox-enoxaparine'],
  },
  {
    id: 'syndrome-coronarien-aigu',
    name: 'Syndrome coronarien aigu (SCA)',
    specialtyIds: ['cardiologie', 'urgences-medicales'],
    description:
      'Prise en charge aiguë du syndrome coronarien aigu avec antiagrégation plaquettaire et anticoagulation selon le protocole existant.',
    medicationIds: ['kardegic-aspirine', 'lovenox-enoxaparine'],
  },
  {
    id: 'prevention-secondaire-cardiovasculaire',
    name: 'Prévention secondaire cardiovasculaire',
    specialtyIds: ['cardiologie', 'medecine-generale'],
    description:
      'Prévention secondaire des événements cardiovasculaires par antiagrégation plaquettaire.',
    medicationIds: ['kardegic-aspirine'],
  },
  {
    id: 'diabete-type-2',
    name: 'Diabète de type 2',
    specialtyIds: [
      'endocrinologie-diabetologie',
      'medecine-generale',
      'nephrologie',
    ],
    description:
      'Prise en charge médicamenteuse du diabète de type 2 par un antidiabétique oral de la classe des biguanides.',
    medicationIds: ['glucophage-metformine'],
  },
  {
    id: 'infections-bacteriennes',
    name: 'Infections bactériennes à germes sensibles',
    specialtyIds: ['maladies-infectieuses', 'medecine-generale'],
    description:
      'Antibiothérapie des infections bactériennes documentées ou présumées à germes sensibles.',
    medicationIds: [
      'augmentin-amoxicilline-acide-clavulanique',
      'ciproxine-ciprofloxacine',
    ],
  },
  {
    id: 'infections-urinaires-compliquees',
    name: 'Infections urinaires compliquées / Pyélonéphrite',
    specialtyIds: ['nephrologie', 'urologie', 'maladies-infectieuses'],
    description:
      'Traitement des infections urinaires compliquées et des pyélonéphrites.',
    medicationIds: ['ciproxine-ciprofloxacine'],
  },
  {
    id: 'prostatite',
    name: 'Prostatite',
    specialtyIds: ['urologie', 'maladies-infectieuses'],
    description: 'Traitement antibiotique de la prostatite.',
    medicationIds: ['ciproxine-ciprofloxacine'],
  },
  {
    id: 'arythmies-cardiaques',
    name: 'Arythmies cardiaques',
    specialtyIds: ['cardiologie', 'urgences-medicales'],
    description:
      'Traitement des troubles du rythme cardiaque, notamment en situation aiguë.',
    medicationIds: ['cordarone-amiodarone'],
  },
  {
    id: 'hypertension-arterielle',
    name: 'Hypertension artérielle',
    specialtyIds: [
      'cardiologie',
      'nephrologie',
      'endocrinologie-diabetologie',
      'medecine-generale',
      'geriatrie',
    ],
    description:
      'Prise en charge de l’hypertension artérielle par un inhibiteur de l’enzyme de conversion.',
    medicationIds: ['triatec-ramipril'],
  },
  {
    id: 'post-infarctus-du-myocarde',
    name: 'Post-infarctus du myocarde',
    specialtyIds: ['cardiologie'],
    description:
      'Traitement par inhibiteur de l’enzyme de conversion après un infarctus du myocarde.',
    medicationIds: ['triatec-ramipril'],
  },
  {
    id: 'insuffisance-cardiaque-aigue',
    name: 'Insuffisance cardiaque aiguë / Œdème aigu du poumon',
    specialtyIds: [
      'cardiologie',
      'urgences-medicales',
      'nephrologie',
      'geriatrie',
    ],
    description:
      'Traitement de l’insuffisance cardiaque aiguë et de l’œdème aigu du poumon par diurétique de l’anse.',
    medicationIds: ['lasilix-furosemide'],
  },
  {
    id: 'reflux-gastro-oesophagien',
    name: 'Reflux gastro-œsophagien érosif',
    specialtyIds: ['gastro-enterologie', 'medecine-generale'],
    description: 'Traitement du reflux gastro-œsophagien érosif.',
    medicationIds: ['inexium-esomeprazole'],
  },
  {
    id: 'prevention-lesions-gastroduodenales-ains',
    name: 'Prévention des lésions gastroduodénales sous AINS',
    specialtyIds: ['gastro-enterologie', 'rhumatologie'],
    description:
      'Prévention des lésions gastroduodénales chez les patients traités par anti-inflammatoires non stéroïdiens.',
    medicationIds: ['inexium-esomeprazole'],
  },
  {
    id: 'douleur-et-fievre',
    name: 'Douleur et fièvre',
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
    description: 'Traitement symptomatique de la douleur et de la fièvre.',
    medicationIds: ['doliprane-paracetamol'],
  },
  {
    id: 'sepsis-severe-choc-septique',
    name: 'Sepsis sévère et choc septique',
    specialtyIds: ['maladies-infectieuses', 'urgences-medicales'],
    description:
      'Prise en charge anti-infectieuse du sepsis sévère et du choc septique selon le protocole existant.',
    medicationIds: [
      'augmentin-amoxicilline-acide-clavulanique',
      'ciproxine-ciprofloxacine',
    ],
  },
];

export const getPathologiesForSpecialty = (specialtyId: string) =>
  PATHOLOGY_DATABASE.filter((pathology) => pathology.specialtyIds.includes(specialtyId));

export const getPathologyMedications = (
  pathology: Pathology,
  drugs: DrugMonograph[]
) => {
  const drugsById = new Map(drugs.map((drug) => [drug.id, drug]));
  return Array.from(
    new Set(pathology.medicationIds.map((drugId) => drugsById.get(drugId)))
  ).filter((drug): drug is DrugMonograph => Boolean(drug));
};

export const getPathologySpecialtyNames = (
  pathology: Pathology,
  specialties: { id: string; name: string }[]
) => {
  const namesById = new Map(specialties.map((specialty) => [specialty.id, specialty.name]));
  return pathology.specialtyIds
    .map((specialtyId) => namesById.get(specialtyId))
    .filter((name): name is string => Boolean(name));
};
