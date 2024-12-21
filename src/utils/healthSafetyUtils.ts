import { format } from 'date-fns';
import * as XLSX from 'xlsx';

// NZ WorkSafe incident severity levels
export const SEVERITY_LEVELS = {
  NOTIFIABLE: 'notifiable', // Must be reported to WorkSafe NZ
  SERIOUS: 'serious',
  MINOR: 'minor',
  NEAR_MISS: 'near_miss',
};

// NZ WorkSafe hazard categories
export const HAZARD_CATEGORIES = {
  PHYSICAL: 'physical',
  CHEMICAL: 'chemical',
  BIOLOGICAL: 'biological',
  ERGONOMIC: 'ergonomic',
  PSYCHOSOCIAL: 'psychosocial',
  ELECTRICAL: 'electrical',
};

// NZ WorkSafe risk matrix
export const RISK_MATRIX = {
  LIKELIHOOD: ['rare', 'unlikely', 'possible', 'likely', 'almost_certain'],
  CONSEQUENCE: ['insignificant', 'minor', 'moderate', 'major', 'catastrophic'],
  RISK_LEVELS: {
    LOW: { min: 1, max: 4 },
    MEDIUM: { min: 5, max: 9 },
    HIGH: { min: 10, max: 15 },
    EXTREME: { min: 16, max: 25 },
  },
};

// Generate safety checklist based on hazards
export const generateSafetyChecklist = (hazards: any[]) => {
  const baseChecklist = [
    {
      category: 'General Workplace',
      items: [
        'Emergency exits are clearly marked and unobstructed',
        'First aid kits are fully stocked and accessible',
        'Fire extinguishers are in place and serviced',
        'Emergency procedures are displayed',
        'Adequate lighting throughout workplace',
        'Ventilation systems working effectively',
        'Walkways clear of obstacles',
        'Floor surfaces clean and even',
      ],
    },
    {
      category: 'Equipment & Machinery',
      items: [
        'Machine guards in place and functional',
        'Emergency stop buttons accessible and working',
        'Equipment maintenance up to date',
        'Operating instructions available',
        'PPE available and in good condition',
        'Tools properly stored when not in use',
        'Electrical equipment tested and tagged',
        'Lockout/tagout procedures in place',
      ],
    },
    {
      category: 'Hazardous Substances',
      items: [
        'Safety Data Sheets (SDS) available',
        'Chemicals properly labeled and stored',
        'Spill kits available and stocked',
        'Adequate ventilation in storage areas',
        'Appropriate PPE available',
        'Storage areas secured',
        'Incompatible materials separated',
        'Disposal procedures followed',
      ],
    },
  ];

  // Add hazard-specific checks
  const hazardChecks = hazards.map(hazard => ({
    category: `${hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)} Hazards`,
    items: [
      `Controls in place for ${hazard.description}`,
      ...hazard.controls,
      `Regular monitoring of ${hazard.type} hazards`,
      `Staff trained on ${hazard.type} hazard controls`,
    ],
  }));

  return [...baseChecklist, ...hazardChecks];
};

// Check if incident is notifiable to WorkSafe NZ
export const isNotifiableIncident = (incident: any): boolean => {
  const notifiableEvents = [
    'death',
    'amputation',
    'serious burn',
    'serious head injury',
    'serious eye injury',
    'serious lacerations',
    'spinal injury',
    'loss of consciousness',
    'serious infection',
  ];

  return (
    incident.severity === SEVERITY_LEVELS.NOTIFIABLE ||
    notifiableEvents.some((event) =>
      incident.description.toLowerCase().includes(event.toLowerCase())
    )
  );
};

// Calculate risk score based on likelihood and consequence
export const calculateRiskScore = (
  likelihood: string,
  consequence: string
): number => {
  const likelihoodIndex = RISK_MATRIX.LIKELIHOOD.indexOf(likelihood) + 1;
  const consequenceIndex = RISK_MATRIX.CONSEQUENCE.indexOf(consequence) + 1;
  return likelihoodIndex * consequenceIndex;
};

// Get risk level based on risk score
export const getRiskLevel = (riskScore: number): string => {
  if (riskScore >= RISK_MATRIX.RISK_LEVELS.EXTREME.min) return 'extreme';
  if (riskScore >= RISK_MATRIX.RISK_LEVELS.HIGH.min) return 'high';
  if (riskScore >= RISK_MATRIX.RISK_LEVELS.MEDIUM.min) return 'medium';
  return 'low';
};

// Generate WorkSafe NZ report
export const generateWorkSafeReport = (data: any) => {
  const workbook = XLSX.utils.book_new();

  // Incidents sheet
  const incidentsData = [
    ['Notifiable Incidents Register'],
    ['Generated:', format(new Date(), 'dd/MM/yyyy')],
    [''],
    ['Date', 'Type', 'Description', 'Severity', 'Status', 'Actions Taken'],
    ...data.incidents.map((incident: any) => [
      format(new Date(incident.date), 'dd/MM/yyyy'),
      incident.type,
      incident.description,
      incident.severity,
      incident.status,
      incident.actions.map((a: any) => a.description).join('; '),
    ]),
  ];

  const wsIncidents = XLSX.utils.aoa_to_sheet(incidentsData);
  XLSX.utils.book_append_sheet(workbook, wsIncidents, 'Incidents');

  // Hazards sheet
  const hazardsData = [
    ['Hazard Register'],
    ['Generated:', format(new Date(), 'dd/MM/yyyy')],
    [''],
    ['Type', 'Location', 'Risk Level', 'Controls', 'Review Date', 'Status'],
    ...data.hazards.map((hazard: any) => [
      hazard.type,
      hazard.location,
      hazard.risk,
      hazard.controls.join('; '),
      format(new Date(hazard.reviewDate), 'dd/MM/yyyy'),
      hazard.status,
    ]),
  ];

  const wsHazards = XLSX.utils.aoa_to_sheet(hazardsData);
  XLSX.utils.book_append_sheet(workbook, wsHazards, 'Hazards');

  return workbook;
};