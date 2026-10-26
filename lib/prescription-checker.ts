import {
  DrugMonograph,
  DrugInteraction,
  DRUG_INTERACTIONS_RULES,
  ALGERIAN_DRUG_DATABASE
} from './pharmacopoeia-data';

export interface PrescribedItem {
  drug: DrugMonograph;
  dosageCustom?: string;
  indication?: string;
  selectedGenericId?: string; // If user selected generic substitution
}

export interface PrescriptionAnalysisResult {
  hasAbsoluteContraindication: boolean;
  hasRelativeWarning: boolean;
  activeInteractions: {
    rule: DrugInteraction;
    drugA: DrugMonograph;
    drugB: DrugMonograph;
  }[];
  renalAlerts: {
    drug: DrugMonograph;
    status: 'ADAPT' | 'CAUTION' | 'CONTRAINDICATED';
    message: string;
  }[];
  cnasSummary: {
    totalPpvDzd: number;
    cnasCoverageDzd: number;
    patientCopayDzd: number; // Ticket modérateur
    reimbursableCount: number;
    totalCount: number;
  };
}

export function analyzePrescription(
  prescribedItems: PrescribedItem[],
  clearanceMlMin?: number
): PrescriptionAnalysisResult {
  const activeInteractions: {
    rule: DrugInteraction;
    drugA: DrugMonograph;
    drugB: DrugMonograph;
  }[] = [];

  const drugs = prescribedItems.map(p => p.drug);

  // Check pairwise interactions
  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const drugA = drugs[i];
      const drugB = drugs[j];

      // Match rules regardless of order
      const rule = DRUG_INTERACTIONS_RULES.find(
        r =>
          (r.drugAId === drugA.id && r.drugBId === drugB.id) ||
          (r.drugAId === drugB.id && r.drugBId === drugA.id)
      );

      if (rule) {
        activeInteractions.push({ rule, drugA, drugB });
      }
    }
  }

  const hasAbsoluteContraindication = activeInteractions.some(
    i => i.rule.severity === 'CONTRAINDICATION_ABSOLUE'
  );
  const hasRelativeWarning = activeInteractions.some(
    i => i.rule.severity === 'ASSOCIATION_DECONSEILLEE'
  );

  // Check renal clearance alerts if clearance is provided
  const renalAlerts: {
    drug: DrugMonograph;
    status: 'ADAPT' | 'CAUTION' | 'CONTRAINDICATED';
    message: string;
  }[] = [];

  if (typeof clearanceMlMin === 'number' && clearanceMlMin > 0) {
    for (const item of prescribedItems) {
      const drug = item.drug;
      for (const rule of drug.renalAdjustmentRules) {
        if (clearanceMlMin >= rule.creatinineClearanceMin && clearanceMlMin <= rule.creatinineClearanceMax) {
          if (rule.severity !== 'SAFE') {
            renalAlerts.push({
              drug,
              status: rule.severity,
              message: rule.adjustmentRecommendation
            });
          }
          break;
        }
      }
    }
  }

  // Calculate CNAS Totals in DZD
  let totalPpvDzd = 0;
  let cnasCoverageDzd = 0;
  let reimbursableCount = 0;

  for (const item of prescribedItems) {
    const drug = item.drug;
    const price = drug.ppvDzd;
    totalPpvDzd += price;

    if (drug.cnasReimbursable) {
      reimbursableCount++;
      // CNAS reimburses based on tarif de référence or PPV, whichever is the formula
      const baseForCoverage = Math.min(drug.ppvDzd, drug.referenceTarifDzd);
      const coverage = (baseForCoverage * drug.cnasRatePercent) / 100;
      cnasCoverageDzd += coverage;
    }
  }

  const patientCopayDzd = Math.max(0, totalPpvDzd - cnasCoverageDzd);

  return {
    hasAbsoluteContraindication,
    hasRelativeWarning,
    activeInteractions,
    renalAlerts,
    cnasSummary: {
      totalPpvDzd: Math.round(totalPpvDzd * 100) / 100,
      cnasCoverageDzd: Math.round(cnasCoverageDzd * 100) / 100,
      patientCopayDzd: Math.round(patientCopayDzd * 100) / 100,
      reimbursableCount,
      totalCount: prescribedItems.length
    }
  };
}
