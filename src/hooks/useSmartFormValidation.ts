import { useState, useCallback, useEffect, useMemo } from 'react';
import { ValidationRule, FieldState } from './useFormValidation';

export interface SmartValidationRule extends ValidationRule {
  suggestions?: (value: any, allValues: Record<string, any>) => string[];
  warnings?: (value: any, allValues: Record<string, any>) => string[];
  autoCorrect?: (value: any) => any;
  dependencies?: string[]; // Fields that affect this validation
  contextAware?: boolean;
}

export interface SmartFieldState extends FieldState {
  suggestions: string[];
  warnings: string[];
  autoCorrected: boolean;
  lastAutoCorrect: any;
}

export interface ValidationContext {
  userRole: string;
  patientData?: any;
  previousEntries?: any[];
  commonPatterns?: Record<string, RegExp>;
}

export function useSmartFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, SmartValidationRule>,
  context?: ValidationContext
) {
  const [fields, setFields] = useState<Record<keyof T, SmartFieldState>>(() =>
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key],
        error: null,
        isValid: true,
        isDirty: false,
        isTouched: false,
        suggestions: [],
        warnings: [],
        autoCorrected: false,
        lastAutoCorrect: null,
      },
    }), {} as Record<keyof T, SmartFieldState>)
  );

  // Smart validation with context awareness
  const validateField = useCallback((name: keyof T, value: any, allValues: Partial<Record<keyof T, any>> = {}): {
    error: string | null;
    suggestions: string[];
    warnings: string[];
    autoCorrect: any | null;
  } => {
    const rules = validationRules[name];
    if (!rules) return { error: null, suggestions: [], warnings: [], autoCorrect: null };

    let error: string | null = null;
    let suggestions: string[] = [];
    let warnings: string[] = [];
    let autoCorrect: any = null;

    // Basic validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = 'This field is required';
    } else if (rules.pattern && value && !rules.pattern.test(value)) {
      error = 'Invalid format';
      // Suggest corrections for common patterns
      if (context?.commonPatterns) {
        suggestions = generatePatternSuggestions(value, context.commonPatterns);
      }
    } else if (rules.minLength && value && value.length < rules.minLength) {
      error = `Minimum ${rules.minLength} characters required`;
    } else if (rules.maxLength && value && value.length > rules.maxLength) {
      error = `Maximum ${rules.maxLength} characters allowed`;
      // Suggest truncation
      suggestions = [`Truncate to ${rules.maxLength} characters`];
    } else if (rules.min !== undefined && value < rules.min) {
      error = `Minimum value is ${rules.min}`;
    } else if (rules.max !== undefined && value > rules.max) {
      error = `Maximum value is ${rules.max}`;
    } else if (rules.custom) {
      error = rules.custom(value);
    }

    // Context-aware validation
    if (rules.contextAware && context) {
      const contextValidation = validateWithContext(name, value, allValues, context);
      if (contextValidation.error) error = contextValidation.error;
      suggestions.push(...contextValidation.suggestions);
      warnings.push(...contextValidation.warnings);
    }

    // Generate suggestions
    if (rules.suggestions) {
      suggestions.push(...rules.suggestions(value, allValues));
    }

    // Generate warnings
    if (rules.warnings) {
      warnings.push(...rules.warnings(value, allValues));
    }

    // Auto-correction
    if (rules.autoCorrect && !error) {
      const corrected = rules.autoCorrect(value);
      if (corrected !== value) {
        autoCorrect = corrected;
      }
    }

    return { error, suggestions, warnings, autoCorrect };
  }, [validationRules, context]);

  // Context-aware validation logic
  const validateWithContext = useCallback((
    fieldName: keyof T,
    value: any,
    allValues: Partial<Record<keyof T, any>>,
    context: ValidationContext
  ) => {
    let error: string | null = null;
    let suggestions: string[] = [];
    let warnings: string[] = [];

    switch (fieldName as string) {
      case 'diagnosis':
        // Check for drug interactions based on current medications
        if (context.patientData?.medications && value) {
          const interactions = checkDrugInteractions(value, context.patientData.medications);
          if (interactions.length > 0) {
            warnings.push(`Potential interactions with: ${interactions.join(', ')}`);
          }
        }
        break;

      case 'dosage':
        // Validate dosage against standard ranges
        if (value && allValues.medication) {
          const dosageValidation = validateDosage(value, allValues.medication, context.patientData);
          if (dosageValidation.error) error = dosageValidation.error;
          suggestions.push(...dosageValidation.suggestions);
        }
        break;

      case 'medication':
        // Check allergies and contraindications
        if (context.patientData?.allergies && value) {
          const allergyCheck = checkAllergies(value, context.patientData.allergies);
          if (allergyCheck.hasAllergy) {
            error = `Patient allergic to: ${allergyCheck.allergens.join(', ')}`;
          }
        }
        break;

      case 'appointmentDate':
        // Check for scheduling conflicts
        if (value && context.patientData?.id) {
          const conflicts = checkSchedulingConflicts(value, context.patientData.id);
          if (conflicts.length > 0) {
            warnings.push('Potential scheduling conflicts detected');
            suggestions.push('Consider alternative time slots');
          }
        }
        break;
    }

    return { error, suggestions, warnings };
  }, []);

  // Set field value with smart validation
  const setFieldValue = useCallback((name: keyof T, value: any, skipAutoCorrect = false) => {
    const allValues = Object.keys(fields).reduce((acc, key) => ({
      ...acc,
      [key]: fields[key as keyof T].value,
    }), {});

    const validation = validateField(name, value, allValues);

    // Apply auto-correction if available and not skipped
    const finalValue = !skipAutoCorrect && validation.autoCorrect !== null
      ? validation.autoCorrect
      : value;

    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: finalValue,
        error: validation.error,
        isValid: !validation.error,
        isDirty: true,
        suggestions: validation.suggestions,
        warnings: validation.warnings,
        autoCorrected: finalValue !== value,
        lastAutoCorrect: finalValue !== value ? finalValue : prev[name].lastAutoCorrect,
      },
    }));

    // Trigger validation for dependent fields
    const rules = validationRules[name];
    if (rules?.dependencies) {
      rules.dependencies.forEach(dep => {
        if (fields[dep as keyof T]) {
          const depValidation = validateField(dep as keyof T, fields[dep as keyof T].value, {
            ...allValues,
            [name]: finalValue,
          });
          setFields(prev => ({
            ...prev,
            [dep]: {
              ...prev[dep],
              error: depValidation.error,
              isValid: !depValidation.error,
              suggestions: depValidation.suggestions,
              warnings: depValidation.warnings,
            },
          }));
        }
      });
    }
  }, [fields, validateField, validationRules]);

  // Apply suggestion
  const applySuggestion = useCallback((fieldName: keyof T, suggestion: string) => {
    // Parse suggestion and apply appropriate action
    if (suggestion.startsWith('Truncate to')) {
      const maxLength = parseInt(suggestion.match(/(\d+)/)?.[1] || '0');
      const currentValue = fields[fieldName].value;
      if (typeof currentValue === 'string' && currentValue.length > maxLength) {
        setFieldValue(fieldName, currentValue.substring(0, maxLength), true);
      }
    } else {
      // For other suggestions, set as value
      setFieldValue(fieldName, suggestion, true);
    }
  }, [fields, setFieldValue]);

  // Smart validation on blur
  const validateOnBlur = useCallback((name: keyof T) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        isTouched: true,
      },
    }));

    // Additional async validation for complex checks
    if (validationRules[name]?.contextAware) {
      // Simulate async validation (e.g., API calls)
      setTimeout(() => {
        // Could check against external databases, etc.
      }, 100);
    }
  }, [validationRules]);

  // Get validation summary
  const getValidationSummary = useCallback(() => {
    const errors = Object.values(fields).filter(f => f.error).length;
    const warnings = Object.values(fields).reduce((sum, f) => sum + f.warnings.length, 0);
    const suggestions = Object.values(fields).reduce((sum, f) => sum + f.suggestions.length, 0);

    return { errors, warnings, suggestions };
  }, [fields]);

  return {
    fields,
    setFieldValue,
    validateOnBlur,
    applySuggestion,
    getValidationSummary,
    isValid: Object.values(fields).every(f => f.isValid),
    isDirty: Object.values(fields).some(f => f.isDirty),
    hasWarnings: Object.values(fields).some(f => f.warnings.length > 0),
    hasSuggestions: Object.values(fields).some(f => f.suggestions.length > 0),
  };
}

// Helper functions for context-aware validation
function generatePatternSuggestions(value: string, patterns: Record<string, RegExp>): string[] {
  const suggestions: string[] = [];

  // Common corrections for medical terms
  const corrections: Record<string, string> = {
    'aceteominophen': 'acetaminophen',
    'ibuprofin': 'ibuprofen',
    'ammoxicillin': 'amoxicillin',
    'prednisone': 'prednisolone',
    'warfarin': 'warfarin', // This one is correct, but often misspelled
  };

  if (corrections[value.toLowerCase()]) {
    suggestions.push(corrections[value.toLowerCase()]);
  }

  return suggestions;
}

function checkDrugInteractions(diagnosis: string, medications: any[]): string[] {
  // Mock drug interaction checking
  const interactions: Record<string, string[]> = {
    'diabetes': ['metformin', 'insulin'],
    'hypertension': ['lisinopril', 'amlodipine'],
    'depression': ['sertraline', 'fluoxetine'],
  };

  const diagnosisKey = diagnosis.toLowerCase();
  const currentMeds = medications.map(m => m.name?.toLowerCase() || '');

  for (const [condition, drugs] of Object.entries(interactions)) {
    if (diagnosisKey.includes(condition)) {
      return drugs.filter(drug => currentMeds.some(med => med.includes(drug)));
    }
  }

  return [];
}

function validateDosage(dosage: any, medication: string, patientData?: any): {
  error: string | null;
  suggestions: string[];
} {
  // Mock dosage validation
  const standardDosages: Record<string, { min: number; max: number; unit: string }> = {
    'lisinopril': { min: 5, max: 40, unit: 'mg' },
    'metformin': { min: 500, max: 2000, unit: 'mg' },
    'sertraline': { min: 25, max: 200, unit: 'mg' },
  };

  const medKey = medication.toLowerCase();
  const standard = Object.entries(standardDosages).find(([key]) =>
    medKey.includes(key)
  )?.[1];

  if (standard && typeof dosage === 'number') {
    if (dosage < standard.min) {
      return {
        error: `Dosage below recommended minimum (${standard.min}${standard.unit})`,
        suggestions: [`Increase to ${standard.min}${standard.unit}`]
      };
    }
    if (dosage > standard.max) {
      return {
        error: `Dosage above recommended maximum (${standard.max}${standard.unit})`,
        suggestions: [`Reduce to ${standard.max}${standard.unit}`]
      };
    }
  }

  return { error: null, suggestions: [] };
}

function checkAllergies(medication: string, allergies: any[]): { hasAllergy: boolean; allergens: string[] } {
  const medicationKey = medication.toLowerCase();
  const allergenList = allergies
    .filter(allergy => medicationKey.includes(allergy.name?.toLowerCase() || ''))
    .map(allergy => allergy.name);

  return {
    hasAllergy: allergenList.length > 0,
    allergens: allergenList
  };
}

function checkSchedulingConflicts(date: string, patientId: string): any[] {
  // Mock scheduling conflict check
  // In real implementation, this would check against existing appointments
  return [];
}