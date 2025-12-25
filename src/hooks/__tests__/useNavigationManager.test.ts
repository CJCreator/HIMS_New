import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useNavigationManager } from '../useNavigationManager';

describe('useNavigationManager', () => {
  it('should allow navigation to current step', () => {
    const { result } = renderHook(() => 
      useNavigationManager(2, { patientOverview: true })
    );

    expect(result.current.canNavigateTo(2)).toBe(true);
  });

  it('should prevent navigation without required data', () => {
    const { result } = renderHook(() => 
      useNavigationManager(1, {})
    );

    expect(result.current.canNavigateTo(2)).toBe(false);
  });

  it('should return warnings for unsaved changes', () => {
    const { result } = renderHook(() => 
      useNavigationManager(2, { hasUnsavedChanges: true })
    );

    const warnings = result.current.getNavigationWarnings(1);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('should validate step data', () => {
    const { result } = renderHook(() => 
      useNavigationManager(1, { step1: { patientId: 'P001', vitals: {} } })
    );

    expect(result.current.validateStep(1)).toBe(true);
  });
});
