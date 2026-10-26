---
name: Clinical Precision & Diagnostic Authority
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#001428'
  on-primary: '#ffffff'
  primary-container: '#0f2942'
  on-primary-container: '#7991af'
  inverse-primary: '#b0c9e8'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#310001'
  on-tertiary: '#ffffff'
  tertiary-container: '#580004'
  on-tertiary-container: '#ff4f46'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  title-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  mono-data:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.005em
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system is tailored for on-call medical practitioners, emergency physicians, and clinical residents in Algeria who require split-second pharmacopoeia lookup, dosage validation, and drug-drug interaction screening under cognitive stress. 

The aesthetic is grounded in **Clinical Functionalism**: an intersection of high-end clinical software engineering, rigorous Swiss informational typography, and surgical clarity. The visual language rejects gratuitous decorative flourishes, prioritizing zero-latency readability, structural containment, and fail-safe diagnostic clarity. It instills absolute scientific authority, calm composure during high-urgency decisions, and unwavering precision.

## Colors

The palette establishes a sterile, high-contrast visual environment that anchors clinical credibility and flags pharmacological risks unmistakably:

- **Primary (`#0F2942`)**: Deep Medical Navy. Represents diagnostic gravity, stability, and structure. Used for app shells, primary navigation, headers, critical text, and authoritative actions.
- **Secondary (`#0D9488`)**: Medical Clinical Teal. Symbolizes therapeutic efficacy, pharmacological action, and positive status confirmation. Used for primary CTAs, interactive states, and verified monograph badges.
- **Tertiary / Contraindication Crimson (`#DC2626`)**: Critical clinical stop signal. Reserved strictly for lethal drug interactions, absolute contraindications (grossesse, insuffisance rénale sévère), and blackout clinical alerts.
- **Cautionary Amber (`#D97706`)**: Clinical precaution signal. Employed for dose adjustments, hepatic monitoring, and potential interactions requiring clinical vigilance.
- **Neutral Base (`#F8FAFC` to `#FFFFFF`)**: Pure clinical slate and white foundation layers that minimize eye fatigue in low-light hospital emergency rooms while keeping contrast ratios above WCAG AAA standards.
- **Border & Hairline Neutral (`#E2E8F0`)**: Low-chroma structural dividers for high-density tabular and monograph displays.

## Typography

The typography is driven entirely by **Inter**, configured specifically for scientific and clinical utility:

- **OpenType Tabular Figures (`tnum`)**: Mandatory across all diagnostic and dosage numerical contexts (posology, creatinine clearance, mg/kg computations, and pricing in DZD). This guarantees perfect vertical column alignment in dense tables.
- **Hierarchy Under Pressure**: Monograph titles and active molecules (DCI - Dénomination Commune Internationale) are rendered in bold weights with tight letter-spacing to prevent visual drift during rapid vertical scanning.
- **Micro-labels (`label-caps`)**: All therapeutic classifications (ex. *ATC Class, Inhibiteur de la Pompe à Protons*) and regulatory statuses (ex. *Liste I, Liste II, Stupéfiant*) utilize uppercase styling with generous tracking to guarantee instant identification at small scales.

## Layout & Spacing

The layout operates on a compact, high-information-density fluid grid constructed around rapid lookups:

- **Layout Philosophy**: Tight vertical rhythm with minimal decorative breathing room. In an emergency or rapid consultation setting, scroll distance must be minimized so complete therapeutic regimens remain visible above the fold.
- **Breakpoints & Multi-Panel Screen Behavior**:
  - **Desktop (≥ 1280px)**: 3-column layout featuring persistent category/specialty navigation on the left, high-speed indexed search and monograph details in the center, and a dedicated, persistent Interaction & Contraindication Drawer on the right.
  - **Tablet (768px - 1279px)**: 2-column layout with a collapsible sidebar and contextual side sheet for patient interaction validation.
  - **Mobile (< 768px)**: Single-column emergency stack with persistent sticky bottom search and quick-switch pills for Posologie, Contre-indications, and Interactions.

## Elevation & Depth

This design system avoids heavy shadows, blur effects, and skeuomorphic gradients in favor of **Crisp Boundary Planes and Tonal Layering**:

- **Surfaces**: Canvas is set to `#F8FAFC`. Monograph containers and diagnostic cards sit at `#FFFFFF`. Grouped dosage blocks drop slightly to `#F1F5F9` to create instant visual segregation.
- **Border-First Definition**: Elevation is articulated through razor-sharp `1px` structural borders (`#E2E8F0`). 
- **Shadow Signature**: When overlays are necessary (such as modal calculators or search auto-complete popovers), a disciplined, cool-navy ambient shadow is used: `0 4px 20px -2px rgba(15, 41, 66, 0.08)`.
- **Alert Elevation**: Critical contraindication banners use zero ambient shadow, relying instead on solid `1.5px` borders (`#DC2626`) and tinted background fills (`#FEF2F2`) to prioritize clarity over decorative depth.

## Shapes

The design system employs a refined modern curvature that balances ergonomic approachability with professional restraint:

- **Cards & Data Modules**: Utilize `rounded-xl` (1.5rem / 24px) for master card containers, softening data-heavy surfaces while creating clear modular containers for separate drug monographs.
- **Internal Blocks & Inputs**: Sub-containers, table groupings, interactive inputs, and dosage calculators inherit a controlled `rounded-lg` (1rem / 16px) or `rounded` (0.5rem / 8px) scale for precise alignment.
- **Clinical Badges & Status Pills**: Rendered with fully rounded contours (pill shape) to differentiate metadata tags and alerts from actionable structural cards.

## Components

### Buttons
- **Primary CTA**: Deep Navy background (`#0F2942`) with crisp white typography and a sharp 0.5rem radius. Used for definitive actions (e.g., "Calculer la dose", "Valider l'ordonnance"). Hover transitions subtly to `#1E3A8A`.
- **Secondary / Therapeutic Action**: Medical Teal background (`#0D9488`), white text. Used for positive monograph interactions (e.g., "Ajouter au protocole").
- **Clinical Danger Action**: Solid Crimson (`#DC2626`) with white text for hazardous overrides or removing contraindicated drugs.
- **Ghost / Utility**: Borderless `#0F2942` text with `#F1F5F9` on hover for rapid tabular controls.

### Input Fields & Search Bars
- **Universal Drug Omnisearch**: The flagship component. Height: 48px; border: `1.5px solid #CBD5E1`; background: `#FFFFFF`; active focus: `1.5px solid #0D9488` with zero outer ring glow. Embedded leading search icon and trailing keyboard shortcut chip (`⌘K`). Supports real-time predictive matching of both brand names (ex. *Lovenox*) and generic DCI (ex. *Énoxaparine*).
- **Dosage Inputs**: Integrated unit badges (`mg`, `ml`, `kg`) pinned flush to the trailing inner edge with tabular monospaced numbers.

### Cards & Monograph Panels
- **Container**: White `#FFFFFF` surface wrapped in a subtle `1px solid #E2E8F0` border and `rounded-xl` perimeter.
- **Header Slot**: Integrated top bar featuring the commercial drug name in heavy weight, generic DCI subtitle, and immediate regulatory classification chip on the right edge.
- **Content Zones**: Divided by hairlines (`#F1F5F9`) into distinct medical sections: *Posologie & Mode d'administration*, *Contre-indications absolues*, *Interactions médicamenteuses*, and *Remboursement CNAS*.

### Chips, Badges & Alert Tags
- **DCI Tag**: Subtle slate-blue surface (`#F1F5F9`), slate text (`#475569`), uppercase typography.
- **Interaction Alert Badges**:
  - *Contre-indication absolue*: Pure crimson fill (`#FEF2F2`), border (`#F87171`), text (`#991B1B`), accompanied by an octagonal warning icon.
  - *Association déconseillée / Précaution*: Amber fill (`#FFFBEB`), border (`#FCD34D`), text (`#92400E`).
  - *Prise en compte*: Slate fill (`#F8FAFC`), border (`#CBD5E1`), text (`#334155`).
- **CNAS Reimbursement Pill**: Crisp green tinted background (`#ECFDF5`), emerald text (`#065F46`), confirming national insurance coverage percentages (ex. *Remboursable 80%*).

### Checkboxes, Radios & Switches
- **Form Controls**: High-contrast navy checks (`#0F2942`) with crisp white interior marks. Focused states use a precise 1px offset ring to assist keyboard-only navigation in rapid emergency inputs.

### Specialized Clinical Components
- **Creatinine Clearance (Cockcroft-Gault / CKD-EPI) Calculator Panel**: Compact floating drawer containing dual-numeric input inputs, rapid gender switch, and instant auto-recalculated renal dosage recommendations highlighted in clinical teal.
- **Drug-Drug Matrix Grid**: Dense comparative matrix using high-contrast danger iconography to indicate lethal combinations when co-prescribing multiple active principles.