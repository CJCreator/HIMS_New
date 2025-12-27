import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Query keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...appointmentKeys.lists(), filters] as const,
};

// Get all appointments
export function useAppointments(filters?: Record<string, any>) {
  return useQuery({
    queryKey: appointmentKeys.list(filters || {}),
    queryFn: () => apiService.getAppointments(),
    staleTime: 2 * 60 * 1000, // 2 minutes for appointments
  });
}

// Create appointment mutation
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentData: any) => apiService.createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}