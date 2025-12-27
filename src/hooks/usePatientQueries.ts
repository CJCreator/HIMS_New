import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Query keys
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...patientKeys.lists(), filters] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
};

// Get all patients
export function usePatients(filters?: Record<string, any>) {
  return useQuery({
    queryKey: patientKeys.list(filters || {}),
    queryFn: () => apiService.getPatients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single patient
export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => apiService.getPatient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Create patient mutation
export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientData: any) => apiService.createPatient(patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

// Update patient mutation (if needed)
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.updateUser(id, data), // Assuming updateUser can be used for patients
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}