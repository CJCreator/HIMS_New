import { useState, useEffect } from 'react';

interface ConsultationState {
  patientId: string;
  currentStep: number;
  patientOverview?: any;
  clinicalAssessment?: any;
  treatmentPlan?: any;
  finalReview?: any;
  startTime?: number;
}

export const useConsultationState = (patientId: string = 'P001', phase: string = 'final') => {
  const storageKey = `consultation-${phase}-${patientId}`;
  
  const [state, setState] = useState<ConsultationState>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {
      patientId,
      currentStep: 1,
      startTime: Date.now()
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const updateStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const updateSection = (section: string, data: any) => {
    setState(prev => ({ ...prev, [section]: data }));
  };

  const saveData = (section: string, data: any) => {
    setState(prev => ({ ...prev, [section]: { ...prev[section as keyof ConsultationState], ...data } }));
  };

  const resetConsultation = () => {
    setState({
      patientId,
      currentStep: 1,
      startTime: Date.now()
    });
    localStorage.removeItem(storageKey);
  };

  const completeConsultation = () => {
    const completedKey = `consultation-completed-${patientId}-${Date.now()}`;
    localStorage.setItem(completedKey, JSON.stringify({
      ...state,
      completedAt: Date.now(),
      duration: Date.now() - (state.startTime || Date.now())
    }));
    resetConsultation();
  };

  return {
    state,
    currentStep: state.currentStep,
    updateStep,
    updateSection,
    saveData,
    resetConsultation,
    completeConsultation
  };
};
