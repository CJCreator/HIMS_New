import { Allergy } from '@/store/allergySlice';

interface DrugAllergyCheck {
  hasConflict: boolean;
  conflicts: Array<{
    drug: string;
    allergy: Allergy;
    severity: 'mild' | 'moderate' | 'severe';
    message: string;
  }>;
}

const drugFamilies: Record<string, string[]> = {
  penicillin: ['amoxicillin', 'ampicillin', 'penicillin', 'augmentin'],
  nsaids: ['aspirin', 'ibuprofen', 'naproxen', 'diclofenac'],
  sulfa: ['sulfamethoxazole', 'sulfasalazine', 'sulfadiazine'],
  cephalosporin: ['cephalexin', 'cefuroxime', 'ceftriaxone']
};

export function checkDrugAllergies(drugName: string, patientAllergies: Allergy[]): DrugAllergyCheck {
  const result: DrugAllergyCheck = {
    hasConflict: false,
    conflicts: []
  };

  const drugLower = drugName.toLowerCase();

  for (const allergy of patientAllergies) {
    if (allergy.type !== 'drug') continue;

    const allergenLower = allergy.allergen.toLowerCase();

    // Direct match
    if (drugLower.includes(allergenLower) || allergenLower.includes(drugLower)) {
      result.hasConflict = true;
      result.conflicts.push({
        drug: drugName,
        allergy,
        severity: allergy.severity,
        message: `Direct allergy match: Patient is allergic to ${allergy.allergen}`
      });
      continue;
    }

    // Check drug families
    for (const [family, drugs] of Object.entries(drugFamilies)) {
      const allergyInFamily = drugs.some(d => allergenLower.includes(d));
      const drugInFamily = drugs.some(d => drugLower.includes(d));

      if (allergyInFamily && drugInFamily) {
        result.hasConflict = true;
        result.conflicts.push({
          drug: drugName,
          allergy,
          severity: allergy.severity,
          message: `Cross-reactivity: ${drugName} is in the same family as ${allergy.allergen} (${family})`
        });
      }
    }
  }

  return result;
}
