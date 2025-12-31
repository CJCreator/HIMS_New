// ICD-10 Service Layer
// Handles all API interactions for ICD-10 code management

import type {
  ICD10Code,
  ICD10SearchResult,
  ICD10ValidationResult,
  ICD10SearchOptions,
  ICD10Version,
  ICD10Hierarchy,
  ICD10SyncResult,
  ICD10Statistics,
  ICD10CodeMapping,
  PatientDiagnosis
} from '@/types/icd10.types';

class ICD10Service {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 3600000; // 1 hour

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async search(query: string, options: ICD10SearchOptions = {}): Promise<ICD10SearchResult[]> {
    const cacheKey = `search:${query}:${JSON.stringify(options)}`;
    const cached = this.getCached<ICD10SearchResult[]>(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams({ q: query, ...options as any });
    const response = await fetch(`/api/icd10/search?${params}`);
    const data = await response.json();
    
    this.setCache(cacheKey, data);
    return data;
  }

  async getByCode(code: string, version?: string): Promise<ICD10Code> {
    const cacheKey = `code:${code}:${version || 'current'}`;
    const cached = this.getCached<ICD10Code>(cacheKey);
    if (cached) return cached;

    const params = version ? `?version=${version}` : '';
    const response = await fetch(`/api/icd10/code/${code}${params}`);
    const data = await response.json();
    
    this.setCache(cacheKey, data);
    return data;
  }

  async validate(code: string, version?: string): Promise<ICD10ValidationResult> {
    const response = await fetch('/api/icd10/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, version })
    });
    return response.json();
  }

  async getRelated(code: string, limit: number = 10): Promise<ICD10Code[]> {
    const cacheKey = `related:${code}:${limit}`;
    const cached = this.getCached<ICD10Code[]>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`/api/icd10/code/${code}/related?limit=${limit}`);
    const data = await response.json();
    
    this.setCache(cacheKey, data);
    return data;
  }

  async getHierarchy(code: string): Promise<ICD10Hierarchy> {
    const cacheKey = `hierarchy:${code}`;
    const cached = this.getCached<ICD10Hierarchy>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`/api/icd10/code/${code}/hierarchy`);
    const data = await response.json();
    
    this.setCache(cacheKey, data);
    return data;
  }

  async getPopular(limit: number = 50, specialty?: string): Promise<ICD10Code[]> {
    const cacheKey = `popular:${limit}:${specialty || 'all'}`;
    const cached = this.getCached<ICD10Code[]>(cacheKey);
    if (cached) return cached;

    const params = specialty ? `?limit=${limit}&specialty=${specialty}` : `?limit=${limit}`;
    const response = await fetch(`/api/icd10/popular${params}`);
    const data = await response.json();
    
    this.setCache(cacheKey, data);
    return data;
  }

  async getByCategory(category: string, version?: string): Promise<ICD10Code[]> {
    const params = version ? `?category=${category}&version=${version}` : `?category=${category}`;
    const response = await fetch(`/api/icd10/category${params}`);
    return response.json();
  }

  async getVersions(): Promise<ICD10Version[]> {
    const cacheKey = 'versions';
    const cached = this.getCached<ICD10Version[]>(cacheKey);
    if (cached) return cached;

    const response = await fetch('/api/icd10/versions');
    const data = await response.json();
    
    this.setCache(cacheKey, data);
    return data;
  }

  async getCurrentVersion(): Promise<ICD10Version> {
    const response = await fetch('/api/icd10/versions/current');
    return response.json();
  }

  async syncCodes(version: string): Promise<ICD10SyncResult> {
    const response = await fetch('/api/icd10/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version })
    });
    this.cache.clear();
    return response.json();
  }

  async getStatistics(version?: string): Promise<ICD10Statistics> {
    const params = version ? `?version=${version}` : '';
    const response = await fetch(`/api/icd10/statistics${params}`);
    return response.json();
  }

  async getCodeMapping(oldCode: string, fromVersion: string, toVersion: string): Promise<ICD10CodeMapping> {
    const response = await fetch(`/api/icd10/mapping?code=${oldCode}&from=${fromVersion}&to=${toVersion}`);
    return response.json();
  }

  async batchValidate(codes: string[]): Promise<ICD10ValidationResult[]> {
    const response = await fetch('/api/icd10/validate/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes })
    });
    return response.json();
  }

  async getSuggestions(symptoms: string[], patientContext?: any): Promise<ICD10SearchResult[]> {
    const response = await fetch('/api/icd10/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, context: patientContext })
    });
    return response.json();
  }

  async getPatientDiagnoses(patientId: string, options?: any): Promise<PatientDiagnosis[]> {
    const params = options ? `?${new URLSearchParams(options)}` : '';
    const response = await fetch(`/api/patients/${patientId}/diagnoses${params}`);
    return response.json();
  }

  async addPatientDiagnosis(patientId: string, diagnosis: Partial<PatientDiagnosis>): Promise<PatientDiagnosis> {
    const response = await fetch(`/api/patients/${patientId}/diagnoses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagnosis)
    });
    return response.json();
  }

  async updatePatientDiagnosis(diagnosisId: string, updates: Partial<PatientDiagnosis>): Promise<PatientDiagnosis> {
    const response = await fetch(`/api/diagnoses/${diagnosisId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  async deletePatientDiagnosis(diagnosisId: string): Promise<void> {
    await fetch(`/api/diagnoses/${diagnosisId}`, { method: 'DELETE' });
  }

  clearCache(): void {
    this.cache.clear();
  }

  async exportCodes(version: string, format: 'json' | 'csv' | 'xml' = 'json'): Promise<Blob> {
    const response = await fetch(`/api/icd10/export?version=${version}&format=${format}`);
    return response.blob();
  }
}

export const icd10Service = new ICD10Service();
