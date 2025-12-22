import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  mechanism: string;
  clinicalEffect: string;
  management: string;
}

export interface AllergyWarning {
  id: string;
  drug?: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

export interface InteractionCheck {
  patientId: string;
  medications: string[];
  interactions: DrugInteraction[];
  warnings: AllergyWarning[];
  timestamp: string;
  overridden: boolean;
  overrideReason?: string;
}

interface DrugInteractionState {
  interactions: DrugInteraction[];
  patientAllergies: AllergyWarning[];
  checks: InteractionCheck[];
  currentCheck: InteractionCheck | null;
  loading: boolean;
  error: string | null;
}

const initialState: DrugInteractionState = {
  interactions: [
    {
      id: '1',
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'major',
      description: 'Increased risk of bleeding',
      mechanism: 'Additive anticoagulant effects',
      clinicalEffect: 'Hemorrhage, bruising, prolonged bleeding time',
      management: 'Monitor INR closely, consider dose adjustment'
    },
    {
      id: '2',
      drug1: 'Metformin',
      drug2: 'Contrast Media',
      severity: 'contraindicated',
      description: 'Risk of lactic acidosis',
      mechanism: 'Impaired renal function',
      clinicalEffect: 'Lactic acidosis, kidney damage',
      management: 'Discontinue metformin 48h before contrast'
    }
  ],
  patientAllergies: [],
  checks: [],
  currentCheck: null,
  loading: false,
  error: null
};

const drugInteractionSlice = createSlice({
  name: 'drugInteraction',
  initialState,
  reducers: {
    checkInteractions: (state, action: PayloadAction<{ patientId: string; drugs: string[] }>) => {
      const { patientId, drugs } = action.payload;
      const interactions: DrugInteraction[] = [];
      const warnings: AllergyWarning[] = [];
      
      // Check for interactions between medications
      for (let i = 0; i < drugs.length; i++) {
        for (let j = i + 1; j < drugs.length; j++) {
          const interaction = state.interactions.find(
            int => (int.drug1 === drugs[i] && int.drug2 === drugs[j]) ||
                   (int.drug1 === drugs[j] && int.drug2 === drugs[i])
          );
          if (interaction) {
            interactions.push(interaction);
          }
        }
        
        // Check for allergies
        const allergy = state.patientAllergies.find(
          allergy => drugs[i].toLowerCase().includes(allergy.allergen.toLowerCase())
        );
        if (allergy) {
          warnings.push({
            ...allergy,
            drug: drugs[i]
          });
        }
      }

      const check: InteractionCheck = {
        patientId,
        medications: drugs,
        interactions,
        warnings,
        timestamp: new Date().toISOString(),
        overridden: false
      };

      state.currentCheck = check;
      state.checks.push(check);
    },
    
    overrideInteraction: (state, action: PayloadAction<{ checkId: string; reason: string }>) => {
      const check = state.checks.find(c => c.patientId === action.payload.checkId);
      if (check) {
        check.overridden = true;
        check.overrideReason = action.payload.reason;
      }
    },

    setPatientAllergies: (state, action: PayloadAction<AllergyWarning[]>) => {
      state.patientAllergies = action.payload;
    },
    
    clearCurrentCheck: (state) => {
      state.currentCheck = null;
    }
  }
});

export const { checkInteractions, overrideInteraction, setPatientAllergies, clearCurrentCheck } = drugInteractionSlice.actions;
export default drugInteractionSlice.reducer;