import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAutoSave } from '../useAutoSave';

describe('useAutoSave', () => {
  it('should initialize with idle status', () => {
    const mockSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => 
      useAutoSave({ test: 'data' }, mockSave, { interval: 1000 })
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.lastSaved).toBeNull();
  });

  it('should call save function on interval', async () => {
    const mockSave = vi.fn().mockResolvedValue(undefined);
    renderHook(() => 
      useAutoSave({ test: 'data' }, mockSave, { interval: 100 })
    );

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    }, { timeout: 200 });
  });

  it('should handle save errors', async () => {
    const mockSave = vi.fn().mockRejectedValue(new Error('Save failed'));
    const { result } = renderHook(() => 
      useAutoSave({ test: 'data' }, mockSave, { interval: 100 })
    );

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    }, { timeout: 200 });
  });
});
