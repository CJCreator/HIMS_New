import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateDosage, 
  validatePatientData, 
  checkRenalAdjustment,
  getDosageWarnings 
} from '@/utils/dosageCalculator';

describe('dosageCalculator', () => {
  describe('calculateDosage', () => {
    it('calculates correct paracetamol dosage for adult', () => {
      const result = calculateDosage({
        medication: 'Paracetamol',
        weight: 70,
        age: 30
      });

      expect(result.dose).toBe(1000);
      expect(result.unit).toBe('mg');
      expect(result.frequency).toBe('every 6 hours');
      expect(result.maxDailyDose).toBe(4000);
    });

    it('applies weight-based calculation for amoxicillin', () => {
      const result = calculateDosage({
        medication: 'Amoxicillin',
        weight: 80,
        age: 25
      });

      expect(result.dose).toBe(2000); // 25mg/kg * 80kg = 2000mg
      expect(result.frequency).toBe('every 8 hours');
    });

    it('caps maximum dose for safety', () => {
      const result = calculateDosage({
        medication: 'Paracetamol',
        weight: 120, // Very high weight
        age: 30
      });

      expect(result.dose).toBe(1000); // Should be capped at 1000mg
      expect(result.warnings).toContain('Maximum dose applied');
    });

    it('applies pediatric dosing for children', () => {
      const result = calculateDosage({
        medication: 'Paracetamol',
        weight: 20,
        age: 8
      });

      expect(result.dose).toBe(300); // 15mg/kg * 20kg = 300mg
      expect(result.frequency).toBe('every 6 hours');
      expect(result.maxDailyDose).toBe(1200); // Lower max for children
    });

    it('throws error for invalid medication', () => {
      expect(() => {
        calculateDosage({
          medication: 'InvalidDrug',
          weight: 70,
          age: 30
        });
      }).toThrow('Unknown medication: InvalidDrug');
    });
  });

  describe('validatePatientData', () => {
    it('validates correct patient data', () => {
      const patientData = {
        weight: 70,
        age: 30,
        creatinine: 1.0
      };

      const result = validatePatientData(patientData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects negative weight', () => {
      const patientData = {
        weight: -5,
        age: 30,
        creatinine: 1.0
      };

      const result = validatePatientData(patientData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Weight must be positive');
    });

    it('rejects unrealistic age', () => {
      const patientData = {
        weight: 70,
        age: 150,
        creatinine: 1.0
      };

      const result = validatePatientData(patientData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be between 0 and 120');
    });

    it('rejects invalid creatinine values', () => {
      const patientData = {
        weight: 70,
        age: 30,
        creatinine: -1
      };

      const result = validatePatientData(patientData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Creatinine must be positive');
    });
  });

  describe('checkRenalAdjustment', () => {
    it('requires no adjustment for normal kidney function', () => {
      const adjustment = checkRenalAdjustment({
        medication: 'Amoxicillin',
        creatinine: 1.0,
        age: 30,
        weight: 70
      });

      expect(adjustment.required).toBe(false);
      expect(adjustment.recommendations).toHaveLength(0);
    });

    it('recommends dose reduction for high creatinine', () => {
      const adjustment = checkRenalAdjustment({
        medication: 'Amoxicillin',
        creatinine: 3.0,
        age: 30,
        weight: 70
      });

      expect(adjustment.required).toBe(true);
      expect(adjustment.recommendations).toContain('Reduce dose by 50%');
      expect(adjustment.recommendations).toContain('Extend dosing interval to 12 hours');
    });

    it('provides elderly-specific adjustments', () => {
      const adjustment = checkRenalAdjustment({
        medication: 'Digoxin',
        creatinine: 1.5,
        age: 80,
        weight: 60
      });

      expect(adjustment.required).toBe(true);
      expect(adjustment.recommendations).toContain('Consider dose reduction due to age');
      expect(adjustment.severity).toBe('moderate');
    });

    it('handles medications not requiring renal adjustment', () => {
      const adjustment = checkRenalAdjustment({
        medication: 'Paracetamol',
        creatinine: 3.0,
        age: 30,
        weight: 70
      });

      expect(adjustment.required).toBe(false);
      expect(adjustment.note).toBe('No renal adjustment required for this medication');
    });
  });

  describe('getDosageWarnings', () => {
    it('warns about elderly patients', () => {
      const warnings = getDosageWarnings({
        medication: 'Benzodiazepine',
        age: 75,
        weight: 65,
        comorbidities: ['dementia']
      });

      expect(warnings).toContain('Use with caution in elderly patients');
      expect(warnings).toContain('Increased risk of falls and confusion');
    });

    it('warns about drug-disease interactions', () => {
      const warnings = getDosageWarnings({
        medication: 'NSAIDs',
        age: 45,
        weight: 70,
        comorbidities: ['heart failure', 'kidney disease']
      });

      expect(warnings).toContain('Contraindicated in heart failure');
      expect(warnings).toContain('May worsen kidney function');
    });

    it('warns about pregnancy category', () => {
      const warnings = getDosageWarnings({
        medication: 'ACE inhibitor',
        age: 28,
        weight: 60,
        isPregnant: true
      });

      expect(warnings).toContain('Contraindicated in pregnancy');
      expect(warnings).toContain('May cause fetal harm');
    });

    it('returns no warnings for safe combinations', () => {
      const warnings = getDosageWarnings({
        medication: 'Paracetamol',
        age: 30,
        weight: 70,
        comorbidities: []
      });

      expect(warnings).toHaveLength(0);
    });
  });

  describe('edge cases and error handling', () => {
    it('handles missing patient data gracefully', () => {
      expect(() => {
        calculateDosage({
          medication: 'Paracetamol',
          weight: null as any,
          age: 30
        });
      }).toThrow('Weight is required');
    });

    it('handles extreme weight values', () => {
      const result = calculateDosage({
        medication: 'Paracetamol',
        weight: 300, // Extreme obesity
        age: 30
      });

      expect(result.warnings).toContain('Extreme weight detected - consider clinical review');
      expect(result.dose).toBeLessThanOrEqual(1000); // Should still cap dose
    });

    it('handles neonatal dosing', () => {
      const result = calculateDosage({
        medication: 'Paracetamol',
        weight: 3.5, // Newborn weight
        age: 0.1 // 1 month old
      });

      expect(result.dose).toBe(52.5); // 15mg/kg * 3.5kg
      expect(result.warnings).toContain('Neonatal dosing - verify with pediatric guidelines');
    });
  });
});