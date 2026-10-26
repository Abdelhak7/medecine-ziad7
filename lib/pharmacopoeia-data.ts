export interface AlgerianGeneric {
  tradeName: string;
  laboratory: string; // e.g. Saidal, Biopharm, Hikma DZ, Inpha-Medis, Laboratoires Salem
  dosageForm: string;
  ppvDzd: number; // Prix Public de Vente in Algerian Dinars
  referenceTarifDzd: number; // Tarif de référence CNAS
  cnasReimbursable: boolean;
  reimbursementRate: number; // 80% or 100%
}

export interface RenalRule {
  creatinineClearanceMin: number; // ml/min
  creatinineClearanceMax: number; // ml/min
  adjustmentRecommendation: string;
  severity: 'SAFE' | 'ADAPT' | 'CAUTION' | 'CONTRAINDICATED';
}

export interface DrugMonograph {
  id: string;
  brandName: string;
  dci: string; // Dénomination Commune Internationale
  atcCode: string;
  atcClassification: string;
  specialty: 'Cardiologie' | 'Urgences & Réanimation' | 'Infectiologie' | 'Néphrologie' | 'Métabolisme & Diabète' | 'Neurologie & Psychiatrie' | 'Pneumologie' | 'Gastro-entérologie';
  regulatoryStatus: 'Liste I' | 'Liste II' | 'Stupéfiant' | 'Non listé (Sans ordonnance)';
  holderLaboratory: string;
  originCountry: string;
  presentationForm: string;
  standardPackaging: string;
  // Clinical dosing
  adultDosage: string;
  pediatricDosage?: string;
  elderlyDosage?: string;
  administrationRoute: 'Voie Orale' | 'Sous-cutanée' | 'Intraveineuse lente / Perfusion' | 'Intramusculaire' | 'Inhalation';
  renalAdjustmentRules: RenalRule[];
  hepaticAdjustment?: string;
  // Safety
  absoluteContraindications: string[];
  relativeContraindications: string[];
  blackBoxWarning?: string;
  pregnancySafety: 'Contre-indiqué (T3)' | 'Contre-indiqué absolu' | 'Déconseillé' | 'Utilisable avec précaution' | 'Sans risque avéré';
  breastfeedingSafety: 'Contre-indiqué' | 'Déconseillé' | 'Possible';
  // CNAS Algerian Social Security
  cnasReimbursable: boolean;
  cnasRatePercent: number; // e.g. 80, 100
  ppvDzd: number; // Price in DZD
  referenceTarifDzd: number; // CNAS Reference price in DZD
  genericsAvailable: AlgerianGeneric[];
  pharmacokinetics: {
    bioavailability: string;
    halfLifeHours: string;
    plasmaProteinBinding: string;
    elimination: string;
    therapeuticRange?: string;
  };
}

export interface DrugInteraction {
  id?: string;
  drugAId: string;
  drugBId: string;
  severity: 'CONTRAINDICATION_ABSOLUE' | 'ASSOCIATION_DECONSEILLEE' | 'PRECAUTION_EMPLOI' | 'PRISE_EN_COMPTE';
  riskDescription: string;
  clinicalMechanism: string;
  actionProtocol: string;
}

export interface EmergencyProtocol {
  id: string;
  title: string;
  specialty: string;
  severityLevel: 'URGENCE VITALE (Immédiat)' | 'URGENCE RELATIVE (< 30 min)' | 'SURVEILLANCE RAPPROCHÉE';
  summary: string;
  clinicalSteps: {
    phase: string;
    action: string;
    drugsPrescribed: { drugId: string; posology: string; note: string }[];
    monitoring: string[];
  }[];
}

export const ALGERIAN_DRUG_DATABASE: DrugMonograph[] = [
  {
    id: 'lovenox-enoxaparine',
    brandName: 'Lovenox',
    dci: 'Énoxaparine sodique',
    atcCode: 'B01AB05',
    atcClassification: 'Héparines de bas poids moléculaire (HBPM) / Antithrombotique',
    specialty: 'Cardiologie',
    regulatoryStatus: 'Liste I',
    holderLaboratory: 'Sanofi-Aventis Algérie',
    originCountry: 'Algérie / France',
    presentationForm: 'Solution injectable en seringue préremplie',
    standardPackaging: 'Boîte de 2 seringues de 0,4 ml (4000 UI) / 0,6 ml (6000 UI)',
    adultDosage: 'Curatif (TVP/EP) : 100 UI anti-Xa/kg toutes les 12h SC, ou 150 UI/kg x 1/j. Préventif chirurgical : 4000 UI (0,4 ml) SC x 1/jour.',
    pediatricDosage: 'Nourrisson < 2 mois : 150 UI/kg/12h SC. Enfant > 2 mois : 100 UI/kg/12h SC (surveillance anti-Xa requise).',
    elderlyDosage: 'Pas d\'adaptation de dose systématique en préventif sauf si ClCr < 30 ml/min. Surveillance accrue des hématomes.',
    administrationRoute: 'Sous-cutanée',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 50, creatinineClearanceMax: 150, adjustmentRecommendation: 'Posologie usuelle sans modification', severity: 'SAFE' },
      { creatinineClearanceMin: 30, creatinineClearanceMax: 49, adjustmentRecommendation: 'Surveillance clinique et biologique renforcée. Même posologie ou espacement selon dosage anti-Xa.', severity: 'CAUTION' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 29, adjustmentRecommendation: 'Insuffisance rénale sévère : réduire à 100 UI/kg x 1/jour en curatif, ou 2000 UI/jour en préventif. Préférer l\'Héparine Non Fractionnée (HNF) sous contrôle TCA.', severity: 'ADAPT' }
    ],
    hepaticAdjustment: 'Prudence en cas d\'insuffisance hépatique sévère (risque majoré de saignement).',
    absoluteContraindications: [
      'Antécédent de Thrombopénie Induite par l\'Héparine (TIH) de type II immunoallergique',
      'Hémorragie évolutive active ou lésion organique susceptible de saigner (ulcère gastro-duodénal évolutif)',
      'Insuffisance rénale terminale sous dialyse sans surveillance de l\'activité anti-Xa',
      'Anesthésie péridurale ou rachianesthésie en cours de traitement curatif (risque d\'hématome intrarachidien)'
    ],
    relativeContraindications: [
      'Accident Vasculaire Cérébral hémorragique récent (< 3 mois)',
      'Hypertension artérielle sévère non contrôlée (> 200/110 mmHg)',
      'Association aux AINS à fortes doses ou antiagrégants plaquettaires sans surveillance'
    ],
    blackBoxWarning: 'ALERTE NOIRE : Risque d\'hématome épidural ou rachidien chez les patients bénéficiant d\'une anesthésie péridurale/rachidienne pouvant mener à une paralysie permanente.',
    pregnancySafety: 'Utilisable avec précaution',
    breastfeedingSafety: 'Possible',
    cnasReimbursable: true,
    cnasRatePercent: 100,
    ppvDzd: 1850.50,
    referenceTarifDzd: 1850.50,
    genericsAvailable: [
      {
        tradeName: 'Enoxa Saidal 4000 UI',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Seringue préremplie 0,4 ml',
        ppvDzd: 1250.00,
        referenceTarifDzd: 1250.00,
        cnasReimbursable: true,
        reimbursementRate: 100
      },
      {
        tradeName: 'Lovenox Générique Biopharm',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Seringue préremplie 0,6 ml (6000 UI)',
        ppvDzd: 1420.00,
        referenceTarifDzd: 1420.00,
        cnasReimbursable: true,
        reimbursementRate: 100
      }
    ],
    pharmacokinetics: {
      bioavailability: '92% après injection sous-cutanée',
      halfLifeHours: '4.5 à 7 heures (prolongée à 12h si insuffisance rénale)',
      plasmaProteinBinding: 'Faible liaison à l\'albumine, haute affinité antithrombine III',
      elimination: 'Rénale exclusive (forme active et métabolites)',
      therapeuticRange: 'Activité anti-Xa pic : 0.5 - 1.0 UI/ml (curatif 2x/j)'
    }
  },
  {
    id: 'kardegic-aspirine',
    brandName: 'Kardegic',
    dci: 'Acétylsalicylate de lysine (Aspirine)',
    atcCode: 'B01AC06',
    atcClassification: 'Antiagrégants plaquettaires / Inhibiteur COX-1',
    specialty: 'Cardiologie',
    regulatoryStatus: 'Non listé (Sans ordonnance)',
    holderLaboratory: 'Sanofi-Aventis Algérie',
    originCountry: 'Algérie',
    presentationForm: 'Poudre pour solution buvable en sachets-doses',
    standardPackaging: 'Boîte de 30 sachets de 75 mg, 160 mg ou 300 mg',
    adultDosage: 'Prévention secondaire cardiovasculaire : 75 mg à 160 mg x 1/jour en une prise au milieu d\'un repas. En phase aiguë de SCA : 160 à 300 mg à croquer ou IV.',
    pediatricDosage: 'Non recommandé chez l\'enfant de moins de 16 ans (Risque de Syndrome de Reye en contexte viral).',
    elderlyDosage: 'Privilégier la dose minimale efficace (75 mg/j) avec coprescription d\'un IPP si antécédents d\'ulcère.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 30, creatinineClearanceMax: 150, adjustmentRecommendation: 'Posologie habituelle (75-160 mg/j)', severity: 'SAFE' },
      { creatinineClearanceMin: 10, creatinineClearanceMax: 29, adjustmentRecommendation: 'Prudence : risque d\'aggravation de la filtration glomérulaire par inhibition des prostaglandines rénales.', severity: 'CAUTION' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 9, adjustmentRecommendation: 'Contre-indiqué en cas d\'insuffisance rénale terminale non dialysée.', severity: 'CONTRAINDICATED' }
    ],
    hepaticAdjustment: 'Contre-indiqué en cas d\'insuffisance hépato-cellulaire sévère (troubles de coagulation).',
    absoluteContraindications: [
      'Hypersensibilité aux dérivés salicylés ou aux AINS (Syndrome de Fernand-Widal / asthme induit)',
      'Ulcère gastroduodénal en évolution',
      'Maladie hémorragique constitutionnelle ou acquise (hémophilie, thrombopénie sévère)',
      'Grossesse à partir du début du 6ème mois (24 semaines d\'aménorrhée) : toxicité cardiopulmonaire foetale'
    ],
    relativeContraindications: [
      'Antécédents d\'ulcère peptique',
      'Goutte (hyperuricémie par compétition tubulaire)',
      'Association aux anticoagulants oraux directs (AOD) ou AVK sans indication stricte'
    ],
    pregnancySafety: 'Contre-indiqué (T3)',
    breastfeedingSafety: 'Déconseillé',
    cnasReimbursable: true,
    cnasRatePercent: 80,
    ppvDzd: 285.00,
    referenceTarifDzd: 260.00,
    genericsAvailable: [
      {
        tradeName: 'Aspegic Cardio Saidal 100 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 30 sachets',
        ppvDzd: 180.00,
        referenceTarifDzd: 180.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Cardio-Aspirine Biopharm 100 mg',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Boîte de 30 comprimés gastro-résistants',
        ppvDzd: 210.00,
        referenceTarifDzd: 210.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      }
    ],
    pharmacokinetics: {
      bioavailability: 'Absorption rapide, hydrolyse immédiate en acide salicylique',
      halfLifeHours: '15 à 20 minutes pour l\'acide acétylsalicylique, effet antiplaquettaire irréversible (7 à 10 jours)',
      plasmaProteinBinding: '80% à 90% pour l\'acide salicylique',
      elimination: 'Métabolisme hépatique et élimination urinaire pH-dépendante'
    }
  },
  {
    id: 'glucophage-metformine',
    brandName: 'Glucophage',
    dci: 'Metformine chlorhydrate',
    atcCode: 'A10BA02',
    atcClassification: 'Antidiabétiques oraux / Biguanide',
    specialty: 'Métabolisme & Diabète',
    regulatoryStatus: 'Liste I',
    holderLaboratory: 'Merck Santé / Inpha-Medis Algérie',
    originCountry: 'Algérie / France',
    presentationForm: 'Comprimés pelliculés sécables',
    standardPackaging: 'Boîte de 30 et 60 comprimés de 500 mg, 850 mg et 1000 mg',
    adultDosage: 'Dose initiale : 500 mg ou 850 mg x 1 à 2 fois/jour au cours des repas. Dose maximale : 3000 mg/jour en 3 prises.',
    pediatricDosage: 'À partir de 10 ans : 500 mg à 1000 mg/j en monothérapie ou avec insuline.',
    elderlyDosage: 'Évaluation obligatoire de la fonction rénale avant instauration et tous les 3 à 6 mois. Réduire la dose si ClCr < 60 ml/min.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 60, creatinineClearanceMax: 150, adjustmentRecommendation: 'Dose maximale 3000 mg/j. Surveillance annuelle de la clairance.', severity: 'SAFE' },
      { creatinineClearanceMin: 45, creatinineClearanceMax: 59, adjustmentRecommendation: 'Dose maximale 2000 mg/j. Surveillance rénale tous les 3-6 mois.', severity: 'SAFE' },
      { creatinineClearanceMin: 30, creatinineClearanceMax: 44, adjustmentRecommendation: 'Dose maximale 1000 mg/j. Prudence extrême. Ne pas initier à ce stade.', severity: 'ADAPT' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 29, adjustmentRecommendation: 'CONTRE-INDICATION ABSOLUE : Arrêt immédiat (Risque létal d\'acidose lactique).', severity: 'CONTRAINDICATED' }
    ],
    hepaticAdjustment: 'Contre-indiqué en cas d\'insuffisance hépatique (défaut d\'épuration des lactates).',
    absoluteContraindications: [
      'Insuffisance rénale sévère avec Clairance créatinine < 30 ml/min ou DFG < 30 ml/min/1.73m²',
      'Acidose métabolique aiguë ou subaiguë (acidose lactique, acidocétose diabétique)',
      'Hypoxie tissulaire aiguë : Choc cardiogénique ou septique, décompensation cardiaque, infarctus du myocarde récent',
      'Injection de produits de contraste iodés (interrompre 48h avant et reprendre 48h après si fonction rénale stable)',
      'Intoxication éthylique aiguë ou alcoolisme chronique'
    ],
    relativeContraindications: [
      'Chirurgie programmée sous anesthésie générale (interrompre 48h avant)',
      'Déshydratation aiguë, diarrhée profuse, vomissements (risque de néphrotoxicité induite)'
    ],
    blackBoxWarning: 'ALERTE MAJEURE : Acidose lactique potentiellement mortelle en cas d\'accumulation rénale ou de conditions hypoxémiques.',
    pregnancySafety: 'Utilisable avec précaution',
    breastfeedingSafety: 'Déconseillé',
    cnasReimbursable: true,
    cnasRatePercent: 100,
    ppvDzd: 360.00,
    referenceTarifDzd: 360.00,
    genericsAvailable: [
      {
        tradeName: 'Diabemyne Saidal 850 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 30 comprimés',
        ppvDzd: 195.00,
        referenceTarifDzd: 195.00,
        cnasReimbursable: true,
        reimbursementRate: 100
      },
      {
        tradeName: 'Metformine Hikma 1000 mg',
        laboratory: 'Hikma Pharmaceuticals Algérie',
        dosageForm: 'Boîte de 30 comprimés sécables',
        ppvDzd: 245.00,
        referenceTarifDzd: 245.00,
        cnasReimbursable: true,
        reimbursementRate: 100
      }
    ],
    pharmacokinetics: {
      bioavailability: '50% à 60% à jeun',
      halfLifeHours: '6.5 heures d\'élimination plasmatique',
      plasmaProteinBinding: 'Négligeable (se distribue dans les érythrocytes)',
      elimination: 'Rénale exclusive à 100% sous forme inchangée par filtration glomérulaire et sécrétion tubulaire'
    }
  },
  {
    id: 'augmentin-amoxicilline-acide-clavulanique',
    brandName: 'Augmentin',
    dci: 'Amoxicilline + Acide clavulanique',
    atcCode: 'J01CR02',
    atcClassification: 'Antibactériens bêtalactamines / Pénicillines + Inhibiteurs d\'enzymes',
    specialty: 'Infectiologie',
    regulatoryStatus: 'Liste I',
    holderLaboratory: 'GSK Algérie / Laboratoires Frater-Razes',
    originCountry: 'Algérie / Royaume-Uni',
    presentationForm: 'Poudre pour suspension buvable / Comprimés dispersibles / Poudre injectable IV',
    standardPackaging: 'Boîte de 16 ou 24 comprimés pelliculés (1g/125mg)',
    adultDosage: 'Infections modérées à sévères : 1 g/125 mg x 2 à 3 fois par jour au début des repas. Voie IV : 1 g/200 mg toutes les 8h.',
    pediatricDosage: 'Enfant (rapport 8/1) : 80 mg/kg/jour d\'amoxicilline répartis en 3 prises sans dépasser 3 g/jour.',
    elderlyDosage: 'Aucune adaptation requise sauf insuffisance rénale documentée.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 30, creatinineClearanceMax: 150, adjustmentRecommendation: 'Posologie habituelle (1g toutes les 8h à 12h)', severity: 'SAFE' },
      { creatinineClearanceMin: 10, creatinineClearanceMax: 29, adjustmentRecommendation: 'Adulte : 1 g d\'amoxicilline / 125 mg toutes les 12 heures.', severity: 'ADAPT' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 9, adjustmentRecommendation: 'Adulte : 500 mg d\'amoxicilline / 62.5 mg toutes les 24 heures. Dose de rappel après hémodialyse.', severity: 'ADAPT' }
    ],
    hepaticAdjustment: 'Prudence. Surveillance hebdomadaire de la fonction hépatique en cure prolongée (risque d\'hépatite cholestatique).',
    absoluteContraindications: [
      'Allergie avérée aux pénicillines, aux bêtalactamines ou à l\'acide clavulanique (choc anaphylactique, angio-œdème)',
      'Antécédent d\'ictère ou d\'atteinte hépatique imputable à l\'association amoxicilline/acide clavulanique'
    ],
    relativeContraindications: [
      'Mononucléose infectieuse (MNI) ou infection virale à CMV : risque élevé d\'éruption cutanée maculopapuleuse bénigne mais trompeuse',
      'Allaitement maternel (passage faible dans le lait, risque de candidose chez le nourrisson)'
    ],
    pregnancySafety: 'Utilisable avec précaution',
    breastfeedingSafety: 'Possible',
    cnasReimbursable: true,
    cnasRatePercent: 80,
    ppvDzd: 890.00,
    referenceTarifDzd: 740.00,
    genericsAvailable: [
      {
        tradeName: 'Clavulin Saidal 1g/125mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 16 sachets',
        ppvDzd: 560.00,
        referenceTarifDzd: 560.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Amoclan Hikma 1g',
        laboratory: 'Hikma Pharmaceuticals Algérie',
        dosageForm: 'Boîte de 16 comprimés pelliculés',
        ppvDzd: 610.00,
        referenceTarifDzd: 610.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Curam Biopharm 1000/125 mg',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Boîte de 14 comprimés',
        ppvDzd: 590.00,
        referenceTarifDzd: 590.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      }
    ],
    pharmacokinetics: {
      bioavailability: '70% à 80% (absorption optimale au début du repas)',
      halfLifeHours: 'Environ 1 heure pour les deux composants',
      plasmaProteinBinding: '18% pour l\'amoxicilline, 25% pour l\'acide clavulanique',
      elimination: 'Rénale majeure (60-70% d\'amoxicilline et 40-45% d\'acide clavulanique sous forme inchangée dans les urines en 6h)'
    }
  },
  {
    id: 'cordarone-amiodarone',
    brandName: 'Cordarone',
    dci: 'Amiodarone chlorhydrate',
    atcCode: 'C01BD01',
    atcClassification: 'Antiarythmiques de classe III (Vaughan-Williams)',
    specialty: 'Cardiologie',
    regulatoryStatus: 'Liste I',
    holderLaboratory: 'Sanofi-Aventis Algérie',
    originCountry: 'Algérie / France',
    presentationForm: 'Comprimés sécables / Ampoules injectables IV',
    standardPackaging: 'Boîte de 30 comprimés de 200 mg / Boîte de 6 ampoules de 150 mg/3 ml',
    adultDosage: 'Dose de charge orale : 600 à 1000 mg/j (3 à 5 cp) pendant 8 à 10 jours. Entretien : 200 mg/j 5 jours sur 7. Urgences (ACR/TV) : 300 mg en bolus IV dilué dans 20-30 ml G5% sur 2-3 min.',
    pediatricDosage: 'Dose de charge : 10 à 15 mg/kg/j pendant 4 à 14 jours, puis entretien 5 mg/kg/j.',
    elderlyDosage: 'Dose minimale d\'entretien (100 à 200 mg/j). Risque accru de bradycardie sévère et de dysthyroïdie.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 0, creatinineClearanceMax: 150, adjustmentRecommendation: 'Élimination non rénale. Aucune adaptation posologique requise en cas d\'insuffisance rénale.', severity: 'SAFE' }
    ],
    hepaticAdjustment: 'Prudence et surveillance des transaminases. Arrêt si élévation > 3 fois la normale.',
    absoluteContraindications: [
      'Bradycardie sinusale symptomatique, blocs sino-auriculaires non appareillés',
      'Bloc auriculo-ventriculaire du 2ème ou 3ème degré non appareillé',
      'Dysfonctionnement thyroïdien préexistant (hyper ou hypothyroïdie patente)',
      'Allergie à l\'iode ou à l\'amiodarone',
      'Association aux médicaments donnant des torsades de pointes (Ciprofloxacine, Sultopride, Érythromycine IV)',
      'Grossesse (sauf cas exceptionnel menaçant le pronostic maternel) : toxicité thyroïdienne fœtale',
      'Allaitement strict contre-indiqué'
    ],
    relativeContraindications: [
      'Association aux bêtabloquants ou inhibiteurs calciques bradycardisants (Diltiazem, Vérapamil)',
      'Association aux laxatifs stimulants (hypokaliémie)',
      'Pathologie pulmonaire interstitielle préexistante'
    ],
    blackBoxWarning: 'ALERTE MAJEURE : Toxicité pulmonaire interstitielle potentiellement fatale. Allongement du QT et torsades de pointes mortelles si hypokaliémie ou association de torsadogènes.',
    pregnancySafety: 'Contre-indiqué absolu',
    breastfeedingSafety: 'Contre-indiqué',
    cnasReimbursable: true,
    cnasRatePercent: 100,
    ppvDzd: 490.00,
    referenceTarifDzd: 490.00,
    genericsAvailable: [
      {
        tradeName: 'Amiodarone Saidal 200 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 30 comprimés sécables',
        ppvDzd: 290.00,
        referenceTarifDzd: 290.00,
        cnasReimbursable: true,
        reimbursementRate: 100
      }
    ],
    pharmacokinetics: {
      bioavailability: '30% à 50% (faible et variable)',
      halfLifeHours: 'Demi-vie extrêmement longue : 20 à 100 jours par accumulation tissulaire adipeuse',
      plasmaProteinBinding: '96% de liaison aux protéines plasmatiques',
      elimination: 'Essentiellement hépato-biliaire et fécale, métabolite actif : déséthylamiodarone'
    }
  },
  {
    id: 'ciproxine-ciprofloxacine',
    brandName: 'Ciproxine',
    dci: 'Ciprofloxacine',
    atcCode: 'J01MA02',
    atcClassification: 'Antibactériens fluoroquinolones / Inhibiteur topo-isomérase II',
    specialty: 'Infectiologie',
    regulatoryStatus: 'Liste I',
    holderLaboratory: 'Bayer / Biopharm Algérie',
    originCountry: 'Algérie / Allemagne',
    presentationForm: 'Comprimés pelliculés sécables / Flacons de perfusion 200 mg/100 ml',
    standardPackaging: 'Boîte de 10 comprimés de 500 mg ou 750 mg',
    adultDosage: 'Infections urinaires compliquées / Pyélonéphrites : 500 mg x 2/jour par voie orale pendant 7 à 14 jours. Prostatite : 500 mg x 2/jour pendant 28 jours.',
    pediatricDosage: 'Généralement non recommandé sauf mucoviscidose (infections à Pseudomonas) : 20 mg/kg/j en 2 prises.',
    elderlyDosage: 'Ajuster obligatoirement à la clairance rénale calculée par Cockcroft-Gault. Risque élevé de rupture tendineuse.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 60, creatinineClearanceMax: 150, adjustmentRecommendation: 'Dose standard : 500 à 750 mg toutes les 12h.', severity: 'SAFE' },
      { creatinineClearanceMin: 30, creatinineClearanceMax: 59, adjustmentRecommendation: 'Réduire : 250 à 500 mg toutes les 12 heures.', severity: 'ADAPT' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 29, adjustmentRecommendation: 'Insuffisance rénale sévère : 250 à 500 mg toutes les 24 heures maximum.', severity: 'ADAPT' }
    ],
    hepaticAdjustment: 'Aucun ajustement nécessaire en monothérapie si la fonction rénale est conservée.',
    absoluteContraindications: [
      'Hypersensibilité aux quinolones ou fluoroquinolones',
      'Antécédents de tendinopathies induites par une fluoroquinolone',
      'Association avec la Tizanidine ou l\'Amiodarone (torsades de pointes)',
      'Grossesse et allaitement (arthropathies des grosses articulations chez l\'enfant)'
    ],
    relativeContraindications: [
      'Myasthénie grave (risque d\'exacerbation des faiblesses musculaires respiratoires)',
      'Épilepsie ou antécédents convulsifs (abaissement du seuil épileptogène)',
      'Facteurs de risque d\'allongement du QT (syndrome du QT long congénital, hypokaliémie)'
    ],
    blackBoxWarning: 'ALERTE NOIRE ANSM/FDA : Tendinites et ruptures du tendon d\'Achille, neuropathies périphériques irréversibles et toxicité centrale neuropsychiatrique.',
    pregnancySafety: 'Contre-indiqué absolu',
    breastfeedingSafety: 'Contre-indiqué',
    cnasReimbursable: true,
    cnasRatePercent: 80,
    ppvDzd: 640.00,
    referenceTarifDzd: 510.00,
    genericsAvailable: [
      {
        tradeName: 'Cipro Saidal 500 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 10 comprimés sécables',
        ppvDzd: 380.00,
        referenceTarifDzd: 380.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Ciprolon Biopharm 500 mg',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Boîte de 10 comprimés',
        ppvDzd: 420.00,
        referenceTarifDzd: 420.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      }
    ],
    pharmacokinetics: {
      bioavailability: '70% à 80% (effet de premier passage hépatique faible)',
      halfLifeHours: '4 à 7 heures (allongée à 12h si insuffisance rénale sévère)',
      plasmaProteinBinding: '20% à 40%',
      elimination: 'Rénale à 50-70% sous forme inchangée, biliaire à 15%'
    }
  },
  {
    id: 'triatec-ramipril',
    brandName: 'Triatec',
    dci: 'Ramipril',
    atcCode: 'C09AA05',
    atcClassification: 'Inhibiteurs de l\'Enzyme de Conversion de l\'angiotensine (IEC)',
    specialty: 'Cardiologie',
    regulatoryStatus: 'Liste I',
    holderLaboratory: 'Sanofi-Aventis Algérie',
    originCountry: 'Algérie / France',
    presentationForm: 'Comprimés sécables',
    standardPackaging: 'Boîte de 30 comprimés de 2.5 mg, 5 mg ou 10 mg',
    adultDosage: 'Hypertension artérielle : débuter à 2.5 mg/j, titration progressive jusqu\'à 10 mg/j en une prise le matin. Post-infarctus : débuter à 2.5 mg x 2/j.',
    pediatricDosage: 'Non établi chez l\'enfant.',
    elderlyDosage: 'Débuter à 1.25 mg/jour. Surveillance impérative de la créatininémie et de la kaliémie à J7 et J15.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 60, creatinineClearanceMax: 150, adjustmentRecommendation: 'Dose usuelle jusqu\'à 10 mg/j.', severity: 'SAFE' },
      { creatinineClearanceMin: 30, creatinineClearanceMax: 59, adjustmentRecommendation: 'Dose initiale 1.25 mg/j, dose max 5 mg/j.', severity: 'ADAPT' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 29, adjustmentRecommendation: 'Dose initiale 1.25 mg 1 jour sur 2. Dose max 2.5 mg/j. Arrêt si élévation créatinine > 30%.', severity: 'ADAPT' }
    ],
    hepaticAdjustment: 'Dose max 2.5 mg/j en cas d\'insuffisance hépatique légère à modérée.',
    absoluteContraindications: [
      'Antécédent d\'angio-œdème lié à la prise d\'un IEC ou angio-œdème héréditaire / idiopathique',
      'Grossesse aux 2ème et 3ème trimestres (fœtotoxicité rénale majeure, oligohydramnios, anurie néonatale)',
      'Sténose bilatérale des artères rénales ou sténose de l\'artère sur rein unique',
      'Association avec l\'aliskirène chez les patients diabétiques ou insuffisants rénaux',
      'Association aux suppléments potassiques ou épargneurs de potassium sans contrôle strict (hyperkaliémie mortelle)'
    ],
    relativeContraindications: [
      'Grossesse au 1er trimestre',
      'Insuffisance rénale préexistante',
      'Association aux diurétiques dépléteurs d\'eau sans hydratation préalable'
    ],
    pregnancySafety: 'Contre-indiqué absolu',
    breastfeedingSafety: 'Déconseillé',
    cnasReimbursable: true,
    cnasRatePercent: 80,
    ppvDzd: 580.00,
    referenceTarifDzd: 520.00,
    genericsAvailable: [
      {
        tradeName: 'Ramipril Saidal 5 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 30 comprimés',
        ppvDzd: 320.00,
        referenceTarifDzd: 320.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Ramicor Biopharm 5 mg',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Boîte de 30 comprimés',
        ppvDzd: 360.00,
        referenceTarifDzd: 360.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      }
    ],
    pharmacokinetics: {
      bioavailability: 'Prodrogue hydrolysée en ramiprilate actif (bioactivité 28%)',
      halfLifeHours: '13 à 17 heures pour le ramiprilate',
      plasmaProteinBinding: '56% (ramiprilate)',
      elimination: 'Rénale à 60% et fécale à 40%'
    }
  },
  {
    id: 'lasilix-furosemide',
    brandName: 'Lasilix',
    dci: 'Furosémide',
    atcCode: 'C03CA01',
    atcClassification: 'Diurétiques de l\'anse de Henle',
    specialty: 'Urgences & Réanimation',
    regulatoryStatus: 'Liste II',
    holderLaboratory: 'Sanofi-Aventis Algérie',
    originCountry: 'Algérie / France',
    presentationForm: 'Comprimés sécables / Ampoules injectables 20 mg/2 ml',
    standardPackaging: 'Boîte de 30 comprimés de 40 mg / Boîte de 5 ampoules de 20 mg',
    adultDosage: 'OAP / Insuffisance cardiaque aiguë : 40 à 80 mg en bolus IV direct, à renouveler selon diurèse. Entretien oral : 20 à 80 mg/jour le matin.',
    pediatricDosage: '1 à 2 mg/kg/jour en 1 à 2 prises orales ou IV.',
    elderlyDosage: 'Dose minimale efficace. Risque majeur de déshydratation extracellulaire et d\'hypotension orthostatique.',
    administrationRoute: 'Intraveineuse lente / Perfusion',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 30, creatinineClearanceMax: 150, adjustmentRecommendation: 'Posologie habituelle 40 mg/j.', severity: 'SAFE' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 29, adjustmentRecommendation: 'Insuffisance rénale sévère : de fortes doses (jusqu\'à 250 à 500 mg/j) peuvent être nécessaires pour obtenir une diurèse efficace. Ne pas dépasser 4 mg/min en perfusion IV (ototoxicité).', severity: 'ADAPT' }
    ],
    hepaticAdjustment: 'Surveillance étroite en cas de cirrhose avec ascite (risque d\'encéphalopathie hépatique induite par l\'hypokaliémie).',
    absoluteContraindications: [
      'Insuffisance rénale aiguë anurique ne répondant pas au test de provocation au furosémide',
      'Encéphalopathie hépatique au cours de la cirrhose',
      'Hypovolémie ou déshydratation sévère',
      'Hypokaliémie sévère non corrigée (< 3.0 mmol/L)',
      'Hyponatrémie sévère (< 125 mmol/L)'
    ],
    relativeContraindications: [
      'Association aux aminosides (Gentamicine, Amikacine) : majoration de l\'ototoxicité et néphrotoxicité',
      'Goutte patente (hyperuricémie d\'élimination)'
    ],
    pregnancySafety: 'Déconseillé',
    breastfeedingSafety: 'Contre-indiqué',
    cnasReimbursable: true,
    cnasRatePercent: 100,
    ppvDzd: 190.00,
    referenceTarifDzd: 190.00,
    genericsAvailable: [
      {
        tradeName: 'Furosémide Saidal 40 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 30 comprimés',
        ppvDzd: 95.00,
        referenceTarifDzd: 95.00,
        cnasReimbursable: true,
        reimbursementRate: 100
      }
    ],
    pharmacokinetics: {
      bioavailability: '60% à 70% par voie orale, effet diurétique en 30 min (VO) ou 5 min (IV)',
      halfLifeHours: '1 à 1.5 heures (prolongée à 9h en insuffisance rénale terminale)',
      plasmaProteinBinding: '98% à 99% à l\'albumine',
      elimination: 'Rénale à 65% par sécrétion tubulaire active sous forme inchangée'
    }
  },
  {
    id: 'inexium-esomeprazole',
    brandName: 'Inexium',
    dci: 'Ésoméprazole magnésique',
    atcCode: 'A02BC05',
    atcClassification: 'Inhibiteurs de la Pompe à Protons (IPP) / Antiulcéreux',
    specialty: 'Gastro-entérologie',
    regulatoryStatus: 'Liste II',
    holderLaboratory: 'AstraZeneca / Biopharm Algérie',
    originCountry: 'Algérie / Suède',
    presentationForm: 'Comprimés gastro-résistants / Flacon injectable IV 40 mg',
    standardPackaging: 'Boîte de 14 ou 28 comprimés de 20 mg ou 40 mg',
    adultDosage: 'Reflux gastro-œsophagien érosif : 40 mg x 1/jour pendant 4 à 8 semaines le matin à jeun. Prévention des lésions sous AINS : 20 mg x 1/jour.',
    pediatricDosage: 'À partir de 12 ans : 20 à 40 mg x 1/jour.',
    elderlyDosage: 'Aucun ajustement posologique nécessaire.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 0, creatinineClearanceMax: 150, adjustmentRecommendation: 'Aucune adaptation requise en cas d\'insuffisance rénale.', severity: 'SAFE' }
    ],
    hepaticAdjustment: 'Insuffisance hépatique sévère (Child-Pugh C) : ne pas dépasser une dose maximale de 20 mg/jour.',
    absoluteContraindications: [
      'Hypersensibilité aux dérivés benzimidazolés ou aux excipients',
      'Association contre-indiquée avec le Nelfinavir (diminution drastique des concentrations de l\'antirétroviral)'
    ],
    relativeContraindications: [
      'Association au Clopidogrel (diminution de l\'activation antiagrégante par compétition CYP2C19 - préférer le Pantoprazole)',
      'Traitement prolongé sans réévaluation (risque d\'hypomagnésémie et fractures ostéoporotiques)'
    ],
    pregnancySafety: 'Utilisable avec précaution',
    breastfeedingSafety: 'Déconseillé',
    cnasReimbursable: true,
    cnasRatePercent: 80,
    ppvDzd: 780.00,
    referenceTarifDzd: 620.00,
    genericsAvailable: [
      {
        tradeName: 'Ésoméprazole Saidal 40 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 28 comprimés gastro-résistants',
        ppvDzd: 480.00,
        referenceTarifDzd: 480.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Ezol Biopharm 40 mg',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Boîte de 28 gélules',
        ppvDzd: 510.00,
        referenceTarifDzd: 510.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      }
    ],
    pharmacokinetics: {
      bioavailability: '64% après dose unique, 89% à l\'état d\'équilibre',
      halfLifeHours: '1.3 heures',
      plasmaProteinBinding: '97%',
      elimination: 'Métabolisme hépatique quasi complet via CYP2C19 et CYP3A4, excrétion rénale métabolites 80%'
    }
  },
  {
    id: 'doliprane-paracetamol',
    brandName: 'Doliprane',
    dci: 'Paracétamol',
    atcCode: 'N02BE01',
    atcClassification: 'Autres analgésiques et antipyrétiques / Anilides',
    specialty: 'Urgences & Réanimation',
    regulatoryStatus: 'Non listé (Sans ordonnance)',
    holderLaboratory: 'Sanofi-Aventis Algérie',
    originCountry: 'Algérie',
    presentationForm: 'Comprimés effervescents / Gélules / Sirop / Suppositoires / IV Perfalgan',
    standardPackaging: 'Boîte de 16 comprimés sécables de 1000 mg ou 500 mg',
    adultDosage: '1000 mg par prise, espacée de 4 à 6 heures minimum. Ne jamais dépasser 4000 mg/jour chez l\'adulte de plus de 50 kg.',
    pediatricDosage: '60 mg/kg/jour à répartir en 4 ou 6 prises, soit environ 15 mg/kg toutes les 6 heures.',
    elderlyDosage: 'Privilégier un maximum de 3000 mg/jour en cas de dénutrition ou d\'insuffisance rénale.',
    administrationRoute: 'Voie Orale',
    renalAdjustmentRules: [
      { creatinineClearanceMin: 50, creatinineClearanceMax: 150, adjustmentRecommendation: 'Espacement usuel de 4 heures minimum entre les prises (max 4g/j).', severity: 'SAFE' },
      { creatinineClearanceMin: 10, creatinineClearanceMax: 49, adjustmentRecommendation: 'Espacement minimal de 6 heures entre les prises (max 3g/j).', severity: 'ADAPT' },
      { creatinineClearanceMin: 0, creatinineClearanceMax: 9, adjustmentRecommendation: 'Espacement minimal obligatoire de 8 heures entre les prises (max 2g/j).', severity: 'ADAPT' }
    ],
    hepaticAdjustment: 'CONTRE-INDIQUÉ en cas d\'insuffisance hépatocellulaire sévère. Réduire à 2-3 g/j max si alcoolisme chronique ou cirrhose compensée.',
    absoluteContraindications: [
      'Hypersensibilité au paracétamol ou aux excipients',
      'Insuffisance hépatocellulaire sévère ou décompensée (Child-Pugh C)',
      'Hépatite aiguë virale ou toxique en évolution'
    ],
    relativeContraindications: [
      'Dénutrition chronique sévère / Jeûne prolongé (épuisement des stocks hépatiques de glutathion)',
      'Alcoolisme chronique (sensibilité accrue à la toxicité du métabolite réactif NAPQI)'
    ],
    blackBoxWarning: 'ALERTE TOXICITÉ : Risque d\'hépatite fulminante mortelle par surdosage accidentel ou volontaire (> 10g chez l\'adulte, > 150 mg/kg chez l\'enfant). Antidote d\'urgence : N-Acétylcystéine (NAC).',
    pregnancySafety: 'Utilisable avec précaution',
    breastfeedingSafety: 'Possible',
    cnasReimbursable: true,
    cnasRatePercent: 80,
    ppvDzd: 165.00,
    referenceTarifDzd: 165.00,
    genericsAvailable: [
      {
        tradeName: 'Paracétamol Saidal 1000 mg',
        laboratory: 'Groupe Saidal',
        dosageForm: 'Boîte de 16 comprimés',
        ppvDzd: 85.00,
        referenceTarifDzd: 85.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      },
      {
        tradeName: 'Paramol Biopharm 1000 mg',
        laboratory: 'Biopharm Algérie',
        dosageForm: 'Boîte de 16 comprimés',
        ppvDzd: 110.00,
        referenceTarifDzd: 110.00,
        cnasReimbursable: true,
        reimbursementRate: 80
      }
    ],
    pharmacokinetics: {
      bioavailability: '60% à 90% par voie orale, pic plasmatique en 30 à 60 minutes',
      halfLifeHours: '2 heures chez l\'adulte sain',
      plasmaProteinBinding: 'Faible (< 20%) aux concentrations thérapeutiques',
      elimination: 'Métabolisme hépatique à 90% par glucuro et sulfoconjugaison, 5% métabolisé par CYP2E1 en métabolite toxique NAPQI détoxifié par le glutathion'
    }
  }
];

export const DRUG_INTERACTIONS_RULES: DrugInteraction[] = [
  {
    drugAId: 'cordarone-amiodarone',
    drugBId: 'ciproxine-ciprofloxacine',
    severity: 'CONTRAINDICATION_ABSOLUE',
    riskDescription: 'Risque majeur de torsades de pointes et d\'arrêt cardiaque subit par allongement additif de l\'intervalle QT.',
    clinicalMechanism: 'Blocage synergique des canaux potassiques IKr myocardiques et compétition enzymatique, menant à une repolarisation ventriculaire retardée et instable.',
    actionProtocol: 'INTERDICTION FORMELLE DE CO-PRESCRIPTION. Remplacer la ciprofloxacine par une bêtalactamine (Augmentin ou Ceftriaxone) ou un aminoside sans effet sur l\'électrophysiologie cardiaque.'
  },
  {
    id: 'lovenox-kardegic',
    drugAId: 'lovenox-enoxaparine',
    drugBId: 'kardegic-aspirine',
    severity: 'ASSOCIATION_DECONSEILLEE',
    riskDescription: 'Risque hémorragique digestif et intracrânien sévère par addition de l\'inhibition plaquettaire et de l\'anticoagulation.',
    clinicalMechanism: 'Inhibition irréversible de la COX-1 plaquettaire combinée à l\'inhibition du facteur Xa activé par l\'antithrombine III.',
    actionProtocol: 'N\'associer que dans le cadre validé d\'un Syndrome Coronarien Aigu (SCA) ou d\'angioplastie coronaire avec stent. Surveillance quotidienne de l\'hémoglobine, du point de ponction et recherche de méléna.'
  },
  {
    drugAId: 'triatec-ramipril',
    drugBId: 'kardegic-aspirine',
    severity: 'PRECAUTION_EMPLOI',
    riskDescription: 'Diminution de l\'effet antihypertenseur du ramipril et risque d\'insuffisance rénale aiguë chez le sujet âgé ou déshydraté.',
    clinicalMechanism: 'L\'aspirine à doses anti-inflammatoires (> 500 mg/j) inhibe la synthèse des prostaglandines vasodilatatrices rénales, neutralisant l\'effet hémodynamique bénéfique de l\'IEC sur l\'artériole efférente.',
    actionProtocol: 'À dose antiagrégante faible (75-160 mg/j), l\'interaction reste minime. Maintenir une hydratation adéquate et contrôler la créatininémie à J15.'
  },
  {
    drugAId: 'triatec-ramipril',
    drugBId: 'lasilix-furosemide',
    severity: 'PRECAUTION_EMPLOI',
    riskDescription: 'Risque d\'hypotension artérielle brutale de première dose et d\'insuffisance rénale fonctionnelle par hypovolémie relative.',
    clinicalMechanism: 'La stimulation du système rénine-angiotensine induite par le diurétique de l\'anse rend la pression artérielle extrêmement dépendante de l\'angiotensine II.',
    actionProtocol: 'Arrêter ou réduire la dose de Lasilix 3 jours avant d\'introduire le Ramipril, ou débuter le Ramipril à dose très faible (1.25 mg) au coucher.'
  },
  {
    drugAId: 'glucophage-metformine',
    drugBId: 'triatec-ramipril',
    severity: 'PRISE_EN_COMPTE',
    riskDescription: 'Majoration possible de l\'effet hypoglycémiant en début de traitement.',
    clinicalMechanism: 'Les IEC peuvent améliorer la sensibilité périphérique à l\'insuline en facilitant la captation musculaire du glucose.',
    actionProtocol: 'Renforcer l\'autosurveillance glycémique pendant les deux premières semaines d\'instauration conjointe.'
  },
  {
    drugAId: 'inexium-esomeprazole',
    drugBId: 'ciproxine-ciprofloxacine',
    severity: 'PRISE_EN_COMPTE',
    riskDescription: 'Possible diminution modérée de l\'absorption digestive de la fluoroquinolone par élévation du pH gastrique.',
    clinicalMechanism: 'L\'augmentation du pH intragastrique induite par l\'IPP modifie la solubilité de la ciprofloxacine.',
    actionProtocol: 'Prendre l\'Inexium le matin à jeun et administrer la Ciproxine au moins 2 heures après.'
  }
];

export const EMERGENCY_PROTOCOLS_DATABASE: EmergencyProtocol[] = [
  {
    id: 'sca-st-plus',
    title: 'Syndrome Coronarien Aigu avec Sus-Décalage de ST (SCA ST+ / IDM)',
    specialty: 'Cardiologie & Urgences',
    severityLevel: 'URGENCE VITALE (Immédiat)',
    summary: 'Prise en charge pré-hospitalière et salle de déchoquage dans les 10 premières minutes. Objectif : désobstruction coronaire urgente (Angioplastie primaire ou Fibrinolyse).',
    clinicalSteps: [
      {
        phase: '1. Phase d\'Attaque & Double Antiagrégation Immédiate',
        action: 'Pose de 2 VVP de gros calibre, monitoring ECG en continu, oxygène si SaO2 < 90%. Double antiagrégation plaquettaire per os.',
        drugsPrescribed: [
          { drugId: 'kardegic-aspirine', posology: '250 à 300 mg per os à croquer ou IV direct', note: 'Sans délai dès suspicion clinique et ECG' },
          { drugId: 'lovenox-enoxaparine', posology: 'Bolus IV 3000 UI puis 100 UI/kg SC 15 min après', note: 'Si < 75 ans et ClCr > 30 ml/min' }
        ],
        monitoring: ['ECG 12 dérivations toutes les 15 minutes', 'Pression artérielle non invasive toutes les 5 min', 'Surveillance des signes de bas débit ou d\'OAP']
      },
      {
        phase: '2. Sédation de la Douleur & Reperfusion',
        action: 'Antalgie si EVA > 6/10, transfert immédiat en salle de cathétérisme pour coronarographie d\'urgence (< 90 minutes).',
        drugsPrescribed: [
          { drugId: 'doliprane-paracetamol', posology: '1000 mg IVL sur 15 min', note: 'Si douleur modérée ou adjuvant' }
        ],
        monitoring: ['Disponibilité d\'un défibrillateur débrayé en mode synchrone', 'Vérification ClCr avant injection de produit de contraste']
      }
    ]
  },
  {
    id: 'oap-cardiogenique',
    title: 'Œdème Aigu du Poumon Cardiogénique (OAP)',
    specialty: 'Urgences & Réanimation',
    severityLevel: 'URGENCE VITALE (Immédiat)',
    summary: 'Insuffisance ventriculaire gauche aiguë avec inondation alvéolaire. Position assise jambes pendantes, oxygénothérapie à haut débit ou VNI CPAP précoce.',
    clinicalSteps: [
      {
        phase: '1. Déplétion Volémique & Vasodilatation',
        action: 'Diurèse forcée immédiate pour abaisser les pressions de remplissage VG et limiter le shunt pulmonaire.',
        drugsPrescribed: [
          { drugId: 'lasilix-furosemide', posology: '80 mg IVD direct en bolus lent sur 2 minutes', note: 'Renouveler à 80 mg à 30 min si diurèse < 100 ml/h' }
        ],
        monitoring: ['Quantification de la diurèse horaire par sonde urinaire', 'Saturation O2 continue', 'Auscultation des crépitants pulmonaires']
      },
      {
        phase: '2. Stabilisation Hémodynamique & Relais',
        action: 'Introduction prudente d\'un IEC dès que la pression artérielle systolique dépasse 100 mmHg.',
        drugsPrescribed: [
          { drugId: 'triatec-ramipril', posology: '1.25 mg per os à distance de la phase critique', note: 'Surveiller tension à 1h et 2h' }
        ],
        monitoring: ['Ionogramme sanguin et créatininémie à H12 pour dépister hypokaliémie induite par le Lasilix']
      }
    ]
  },
  {
    id: 'choc-septique',
    title: 'Sepsis Sévère & Choc Septique Hospitalier',
    specialty: 'Infectiologie & Réanimation',
    severityLevel: 'URGENCE VITALE (Immédiat)',
    summary: 'Défaillance d\'organe menaçant le pronostic vital causée par une réponse dérégulée de l\'hôte à une infection. Règle d\'or : Antibiothérapie ciblée dans la première heure (Golden Hour).',
    clinicalSteps: [
      {
        phase: '1. Remplissage Vasculaire & Prélèvements Bactériologiques',
        action: 'Hémocultures (2 paires) avant tout antibiotique sans retarder l\'injection de plus de 45 min. Cristalloïdes 30 ml/kg en 3 heures.',
        drugsPrescribed: [
          { drugId: 'augmentin-amoxicilline-acide-clavulanique', posology: '2 g / 200 mg IV direct toutes les 8 heures', note: 'En cas de porte d\'entrée respiratoire ou abdominale' },
          { drugId: 'ciproxine-ciprofloxacine', posology: '400 mg IV perfusion sur 60 min x 2/j', note: 'Si suspicion de germe à BGN résistant ou infection urinaire haute' }
        ],
        monitoring: ['Lactates artériels (seuil de gravité > 2 mmol/L)', 'Pression Artérielle Moyenne (PAM > 65 mmHg)', 'Diurèse horaire (> 0.5 ml/kg/h)']
      }
    ]
  }
];
