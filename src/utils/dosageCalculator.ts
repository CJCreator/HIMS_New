export interface DosageCalculationParams {
  weight: number; // in kg
  age: number; // in years
  medication: string;
  indication: string;
  renalFunction?: number; // creatinine clearance
  hepaticFunction?: 'normal' | 'mild' | 'moderate' | 'severe';
}

export interface DosageResult {
  dose: number;
  unit: string;
  frequency: string;
  route: string;
  warnings: string[];
  adjustments: string[];
}

export function calculateDosage(params: DosageCalculationParams): DosageResult {
  const { weight, age, medication, indication } = params;
  
  // Basic dosage calculation logic (simplified)
  let baseDose = 10; // mg/kg as default
  let frequency = 'twice daily';
  let route = 'oral';
  const warnings: string[] = [];
  const adjustments: string[] = [];

  // Age-based adjustments
  if (age < 18) {
    baseDose *= 0.8;
    adjustments.push('Pediatric dose adjustment applied');
  } else if (age > 65) {
    baseDose *= 0.9;
    adjustments.push('Geriatric dose adjustment applied');
  }

  // Weight-based calculation
  const calculatedDose = baseDose * weight;

  // Add warnings for extreme weights
  if (weight < 50) {
    warnings.push('Low body weight - monitor for increased sensitivity');
  } else if (weight > 100) {
    warnings.push('High body weight - consider dose capping');
  }

  return {
    dose: Math.round(calculatedDose * 100) / 100,
    unit: 'mg',
    frequency,
    route,
    warnings,
    adjustments
  };
}

export function validateDosageParams(params: DosageCalculationParams): string[] {
  const errors: string[] = [];

  if (params.weight <= 0) {
    errors.push('Weight must be greater than 0');
  }

  if (params.age < 0) {
    errors.push('Age cannot be negative');
  }

  if (!params.medication.trim()) {
    errors.push('Medication name is required');
  }

  if (!params.indication.trim()) {
    errors.push('Indication is required');
  }

  return errors;
}