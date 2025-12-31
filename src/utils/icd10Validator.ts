// ICD-10 Validation Utilities
// Comprehensive validation for ICD-10 codes

import type { ICD10Code, ICD10ValidationResult } from '@/types/icd10.types';

export const ICD10_ERRORS = {
  INVALID_FORMAT: 'Invalid ICD-10 code format. Expected format: A00 or A00.00',
  CODE_NOT_FOUND: 'ICD-10 code not found in current version',
  DEPRECATED_CODE: 'This code has been deprecated. Please use: {newCode}',
  NOT_BILLABLE: 'This code is not billable for insurance claims',
  VERSION_MISMATCH: 'Code not available in selected version',
  NETWORK_ERROR: 'Unable to fetch ICD-10 data. Please try again',
  DUPLICATE_DIAGNOSIS: 'This diagnosis already exists for the patient',
  MISSING_PRIMARY: 'At least one primary diagnosis is required',
  TOO_MANY_CODES: 'Maximum number of diagnoses exceeded',
  INVALID_COMBINATION: 'This code cannot be used with the selected codes',
  REQUIRES_SPECIFICITY: 'A more specific code is required for billing'
};

export const ICD10_WARNINGS = {
  DEPRECATED: 'This code is deprecated and may not be accepted',
  NOT_SPECIFIC: 'Consider using a more specific code if available',
  UNCOMMON: 'This is an uncommon diagnosis for the reported symptoms',
  MISSING_DOCUMENTATION: 'Additional documentation may be required for this code',
  AGE_MISMATCH: 'This diagnosis is uncommon for the patient\'s age',
  GENDER_SPECIFIC: 'This code is typically used for a different gender',
  REQUIRES_SPECIFICITY: 'A more specific code is required for billing'
};

// Validate ICD-10 code format
export const validateCodeFormat = (code: string): { isValid: boolean; error?: string } => {
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Code is required' };
  }

  // Remove whitespace
  const cleanCode = code.trim().toUpperCase();

  // ICD-10 format: Letter + 2 digits + optional (. + 1-2 digits)
  const formatRegex = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/;
  
  if (!formatRegex.test(cleanCode)) {
    return { isValid: false, error: ICD10_ERRORS.INVALID_FORMAT };
  }

  // Length validation
  if (cleanCode.length < 3 || cleanCode.length > 7) {
    return { isValid: false, error: 'Code length must be between 3 and 7 characters' };
  }

  return { isValid: true };
};

// Validate code against business rules
export const validateBusinessRules = (
  code: ICD10Code,
  context?: {
    forBilling?: boolean;
    patientAge?: number;
    patientGender?: string;
    existingCodes?: string[];
  }
): { errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if code is active
  if (!code.isActive) {
    warnings.push(ICD10_WARNINGS.DEPRECATED);
  }

  // Check billable status for billing context
  if (context?.forBilling && !code.isBillable) {
    errors.push(ICD10_ERRORS.NOT_BILLABLE);
  }

  // Check for duplicate codes
  if (context?.existingCodes?.includes(code.code)) {
    errors.push(ICD10_ERRORS.DUPLICATE_DIAGNOSIS);
  }

  // Check code specificity (codes ending in .9 are often unspecified)
  if (code.code.endsWith('.9') && context?.forBilling) {
    warnings.push(ICD10_WARNINGS.NOT_SPECIFIC);
  }

  // Age-specific validations
  if (context?.patientAge !== undefined) {
    // Pediatric codes (P00-P96)
    if (code.code.startsWith('P') && context.patientAge > 18) {
      warnings.push(ICD10_WARNINGS.AGE_MISMATCH);
    }
    
    // Pregnancy codes (O00-O9A)
    if (code.code.startsWith('O') && (context.patientAge < 10 || context.patientAge > 60)) {
      warnings.push(ICD10_WARNINGS.AGE_MISMATCH);
    }
  }

  // Gender-specific validations
  if (context?.patientGender) {
    // Male-specific codes
    const maleSpecificPrefixes = ['N40', 'N41', 'N42', 'N43', 'N44', 'N45', 'N46', 'N47', 'N48', 'N49', 'N50'];
    if (maleSpecificPrefixes.some(prefix => code.code.startsWith(prefix)) && context.patientGender !== 'male') {
      errors.push('This code is specific to male patients');
    }

    // Female-specific codes
    const femaleSpecificPrefixes = ['N70', 'N71', 'N72', 'N73', 'N74', 'N75', 'N76', 'N77', 'N80', 'N81', 'N82', 'N83', 'N84', 'N85', 'N86', 'N87', 'N88', 'N89', 'N90', 'N91', 'N92', 'N93', 'N94', 'N95', 'N96', 'N97', 'N98'];
    if (femaleSpecificPrefixes.some(prefix => code.code.startsWith(prefix)) && context.patientGender !== 'female') {
      errors.push('This code is specific to female patients');
    }

    // Pregnancy codes
    if (code.code.startsWith('O') && context.patientGender !== 'female') {
      errors.push('Pregnancy codes are specific to female patients');
    }
  }

  return { errors, warnings };
};

// Validate code exclusions
export const validateExclusions = (
  code: ICD10Code,
  existingCodes: ICD10Code[]
): string[] => {
  const errors: string[] = [];

  if (!code.excludes || code.excludes.length === 0) {
    return errors;
  }

  // Check if any existing codes are in the exclusion list
  existingCodes.forEach(existing => {
    code.excludes?.forEach(exclusion => {
      // Simple check - in production, this would be more sophisticated
      if (exclusion.includes(existing.code)) {
        errors.push(`${code.code} cannot be used with ${existing.code}`);
      }
    });
  });

  return errors;
};

// Comprehensive validation
export const validateICD10Code = async (
  code: string,
  context?: {
    forBilling?: boolean;
    patientAge?: number;
    patientGender?: string;
    existingCodes?: ICD10Code[];
  }
): Promise<ICD10ValidationResult> => {
  const result: ICD10ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Format validation
  const formatCheck = validateCodeFormat(code);
  if (!formatCheck.isValid) {
    result.isValid = false;
    result.errors.push(formatCheck.error!);
    return result;
  }

  // In a real implementation, fetch code details from API
  // For now, return basic validation
  return result;
};

// Check if primary diagnosis exists
export const validatePrimaryDiagnosis = (diagnoses: Array<{ diagnosisType: string }>): boolean => {
  return diagnoses.some(d => d.diagnosisType === 'primary');
};

// Validate diagnosis count
export const validateDiagnosisCount = (count: number, max: number = 10): { isValid: boolean; error?: string } => {
  if (count > max) {
    return {
      isValid: false,
      error: ICD10_ERRORS.TOO_MANY_CODES
    };
  }
  return { isValid: true };
};

// Get code specificity level (higher is more specific)
export const getCodeSpecificity = (code: string): number => {
  const parts = code.split('.');
  if (parts.length === 1) return 1; // Category level (e.g., J20)
  if (parts[1].length === 1) return 2; // Subcategory (e.g., J20.0)
  return 3; // Most specific (e.g., J20.01)
};

// Suggest more specific codes
export const suggestMoreSpecificCodes = (code: ICD10Code): string[] => {
  // In production, this would query the database for child codes
  const suggestions: string[] = [];
  
  if (!code.code.includes('.')) {
    // Suggest adding subcategory
    for (let i = 0; i <= 9; i++) {
      suggestions.push(`${code.code}.${i}`);
    }
  } else if (code.code.split('.')[1].length === 1) {
    // Suggest adding more specificity
    const base = code.code;
    for (let i = 0; i <= 9; i++) {
      suggestions.push(`${base}${i}`);
    }
  }
  
  return suggestions;
};

// Validate code for specific use case
export const validateForUseCase = (
  code: ICD10Code,
  useCase: 'billing' | 'clinical' | 'research' | 'reporting'
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (useCase) {
    case 'billing':
      if (!code.isBillable) {
        errors.push(ICD10_ERRORS.NOT_BILLABLE);
      }
      if (code.code.endsWith('.9')) {
        warnings.push(ICD10_WARNINGS.REQUIRES_SPECIFICITY);
      }
      break;
      
    case 'clinical':
      if (!code.isActive) {
        warnings.push(ICD10_WARNINGS.DEPRECATED);
      }
      break;
      
    case 'research':
    case 'reporting':
      // More lenient for research/reporting
      if (!code.isActive) {
        warnings.push('Historical code - may affect data consistency');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
