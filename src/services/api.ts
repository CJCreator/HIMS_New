const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string; role: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // User management
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Patient management
  async getPatients() {
    return this.request<any[]>('/patients');
  }

  async getPatient(id: string) {
    return this.request<any>(`/patients/${id}`);
  }

  async createPatient(patientData: any) {
    return this.request<any>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  // Appointments
  async getAppointments() {
    return this.request<any[]>('/appointments');
  }

  async createAppointment(appointmentData: any) {
    return this.request<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  // Prescriptions
  async getPrescriptions() {
    return this.request<any[]>('/prescriptions');
  }

  async updatePrescriptionStatus(id: string, status: string) {
    return this.request<any>(`/prescriptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Vitals
  async saveVitals(vitalsData: any) {
    return this.request<any>('/vitals', {
      method: 'POST',
      body: JSON.stringify(vitalsData),
    });
  }

  // Medication requests
  async getMedicationRequests() {
    return this.request<any[]>('/medication-requests');
  }

  async createMedicationRequest(requestData: any) {
    return this.request<any>('/medication-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }
}

export const apiService = new ApiService();