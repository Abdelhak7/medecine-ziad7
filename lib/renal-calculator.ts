import { DrugMonograph, ALGERIAN_DRUG_DATABASE } from './pharmacopoeia-data';

export type Gender = 'homme' | 'femme';
export type CreatinineUnit = 'umol_l' | 'mg_l';

export interface PatientParameters {
  gender: Gender;
  age: number; // years
  weightKg: number; // kg
  creatinineValue: number;
  creatinineUnit: CreatinineUnit;
}

export interface RenalCalculationResult {
  cockcroftClearanceMlMin: number;
  ckdEpiGfrMlMin: number;
  kdigoStage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';
  kdigoLabel: string;
  isRenalFailureSevere: boolean; // ClCr < 30
  adjustedDoses: {
    drugId: string;
    brandName: string;
    dci: string;
    status: 'SAFE' | 'ADAPT' | 'CAUTION' | 'CONTRAINDICATED';
    recommendation: string;
  }[];
}

export function convertCreatinineToUmol(value: number, unit: CreatinineUnit): number {
  if (unit === 'mg_l') {
    // 1 mg/L = 8.84 µmol/L
    return value * 8.84;
  }
  return value;
}

export function convertCreatinineToMgDl(value: number, unit: CreatinineUnit): number {
  if (unit === 'umol_l') {
    // 1 µmol/L = 0.01131 mg/dL
    return value * 0.01131;
  }
  // If mg/L, 1 mg/L = 0.1 mg/dL
  return value * 0.1;
}

export function calculateCockcroftGault(params: PatientParameters): number {
  const { gender, age, weightKg, creatinineValue, creatinineUnit } = params;
  if (!age || !weightKg || !creatinineValue || creatinineValue <= 0) return 0;

  const creatUmol = convertCreatinineToUmol(creatinineValue, creatinineUnit);
  if (creatUmol <= 0) return 0;

  const coefficient = gender === 'homme' ? 1.23 : 1.04;
  const clearance = ((140 - age) * weightKg * coefficient) / creatUmol;

  return Math.max(0, Math.round(clearance * 10) / 10);
}

export function calculateCkdEpi(params: PatientParameters): number {
  const { gender, age, creatinineValue, creatinineUnit } = params;
  if (!age || !creatinineValue || creatinineValue <= 0) return 0;

  const scrMgDl = convertCreatinineToMgDl(creatinineValue, creatinineUnit);
  if (scrMgDl <= 0) return 0;

  const isFemale = gender === 'femme';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.329 : -0.411;
  const genderFactor = isFemale ? 1.018 : 1.0;

  const ratio = scrMgDl / kappa;
  const minPart = Math.pow(Math.min(ratio, 1.0), alpha);
  const maxPart = Math.pow(Math.max(ratio, 1.0), -1.209);
  const agePart = Math.pow(0.993, age);

  const gfr = 141 * minPart * maxPart * agePart * genderFactor;
  return Math.max(0, Math.round(gfr * 10) / 10);
}

export function getKdigoClassification(clearance: number): { stage: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5'; label: string } {
  if (clearance >= 90) {
    return { stage: 'G1', label: 'Fonction rénale normale ou augmentée (≥ 90 ml/min)' };
  } else if (clearance >= 60) {
    return { stage: 'G2', label: 'Insuffisance rénale légère (60-89 ml/min)' };
  } else if (clearance >= 45) {
    return { stage: 'G3a', label: 'Insuffisance rénale modérée à légère (45-59 ml/min)' };
  } else if (clearance >= 30) {
    return { stage: 'G3b', label: 'Insuffisance rénale modérée à sévère (30-44 ml/min)' };
  } else if (clearance >= 15) {
    return { stage: 'G4', label: 'Insuffisance rénale sévère (15-29 ml/min)' };
  } else {
    return { stage: 'G5', label: 'Défaillance rénale terminale (< 15 ml/min)' };
  }
}

export function getRenalAdjustmentForDrug(drug: DrugMonograph, clearance: number): {
  status: 'SAFE' | 'ADAPT' | 'CAUTION' | 'CONTRAINDICATED';
  recommendation: string;
} {
  for (const rule of drug.renalAdjustmentRules) {
    if (clearance >= rule.creatinineClearanceMin && clearance <= rule.creatinineClearanceMax) {
      return {
        status: rule.severity,
        recommendation: rule.adjustmentRecommendation,
      };
    }
  }

  // Fallback if below lowest or above highest
  if (clearance < 30) {
    return {
      status: 'CONTRAINDICATED',
      recommendation: 'Clairance très basse : adaptation obligatoire ou contre-indication stricte.',
    };
  }

  return {
    status: 'SAFE',
    recommendation: 'Posologie habituelle sans adaptation rénale nécessaire.',
  };
}

export function evaluatePatientRenalState(
  params: PatientParameters,
  drugs: DrugMonograph[] = ALGERIAN_DRUG_DATABASE
): RenalCalculationResult {
  const cockcroftClearance = calculateCockcroftGault(params);
  const ckdEpiGfr = calculateCkdEpi(params);
  const kdigo = getKdigoClassification(cockcroftClearance);

  const adjustedDoses = drugs.map((drug) => {
    const adj = getRenalAdjustmentForDrug(drug, cockcroftClearance);
    return {
      drugId: drug.id,
      brandName: drug.brandName,
      dci: drug.dci,
      status: adj.status,
      recommendation: adj.recommendation,
    };
  });

  return {
    cockcroftClearanceMlMin: cockcroftClearance,
    ckdEpiGfrMlMin: ckdEpiGfr,
    kdigoStage: kdigo.stage,
    kdigoLabel: kdigo.label,
    isRenalFailureSevere: cockcroftClearance < 30,
    adjustedDoses,
  };
}
