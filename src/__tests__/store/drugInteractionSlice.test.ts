import { configureStore } from '@reduxjs/toolkit';
import drugInteractionReducer, { 
  checkInteractions, 
  setPatientAllergies, 
  clearCurrentCheck,
  AllergyWarning 
} from '../../store/drugInteractionSlice';

describe('drugInteractionSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        drugInteraction: drugInteractionReducer
      }
    });
  });

  it('should detect drug interactions', () => {
    store.dispatch(checkInteractions({ 
      patientId: 'test-patient', 
      drugs: ['Warfarin', 'Aspirin'] 
    }));

    const state = store.getState().drugInteraction;
    expect(state.currentCheck).toBeTruthy();
    expect(state.currentCheck?.interactions).toHaveLength(1);
    expect(state.currentCheck?.interactions[0].severity).toBe('major');
  });

  it('should detect allergy warnings', () => {
    const allergies: AllergyWarning[] = [
      {
        id: '1',
        allergen: 'Penicillin',
        reaction: 'Rash, difficulty breathing',
        severity: 'severe',
        drug: ''
      }
    ];
    
    store.dispatch(setPatientAllergies(allergies));
    store.dispatch(checkInteractions({ 
      patientId: 'test-patient', 
      drugs: ['Penicillin V'] 
    }));

    const state = store.getState().drugInteraction;
    expect(state.currentCheck?.warnings).toHaveLength(1);
    expect(state.currentCheck?.warnings[0].severity).toBe('severe');
  });

  it('should clear current check', () => {
    store.dispatch(checkInteractions({ 
      patientId: 'test-patient', 
      drugs: ['Warfarin'] 
    }));

    expect(store.getState().drugInteraction.currentCheck).toBeTruthy();

    store.dispatch(clearCurrentCheck());
    
    expect(store.getState().drugInteraction.currentCheck).toBeNull();
  });

  it('should handle no interactions', () => {
    store.dispatch(checkInteractions({ 
      patientId: 'test-patient', 
      drugs: ['Acetaminophen'] 
    }));

    const state = store.getState().drugInteraction;
    expect(state.currentCheck?.interactions).toHaveLength(0);
    expect(state.currentCheck?.warnings).toHaveLength(0);
  });
});