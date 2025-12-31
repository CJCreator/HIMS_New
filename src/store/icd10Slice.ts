// ICD-10 Redux Slice
// Manages ICD-10 codes state across the application

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { icd10Service } from '@/services/icd10Service';
import type {
  ICD10Code,
  ICD10SearchResult,
  ICD10Version,
  PatientDiagnosis,
  ICD10SearchOptions
} from '@/types/icd10.types';

interface ICD10State {
  searchResults: ICD10SearchResult[];
  selectedCode: ICD10Code | null;
  recentCodes: ICD10Code[];
  popularCodes: ICD10Code[];
  currentVersion: ICD10Version | null;
  versions: ICD10Version[];
  patientDiagnoses: PatientDiagnosis[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  cache: Record<string, ICD10Code>;
  lastSearchQuery: string;
}

const initialState: ICD10State = {
  searchResults: [],
  selectedCode: null,
  recentCodes: [],
  popularCodes: [],
  currentVersion: null,
  versions: [],
  patientDiagnoses: [],
  loading: false,
  searchLoading: false,
  error: null,
  cache: {},
  lastSearchQuery: ''
};

// Async thunks
export const searchICD10 = createAsyncThunk(
  'icd10/search',
  async ({ query, options }: { query: string; options?: ICD10SearchOptions }) => {
    return await icd10Service.search(query, options);
  }
);

export const fetchCodeDetails = createAsyncThunk(
  'icd10/fetchDetails',
  async ({ code, version }: { code: string; version?: string }) => {
    return await icd10Service.getByCode(code, version);
  }
);

export const fetchPopularCodes = createAsyncThunk(
  'icd10/fetchPopular',
  async (specialty?: string) => {
    return await icd10Service.getPopular(50, specialty);
  }
);

export const fetchVersions = createAsyncThunk(
  'icd10/fetchVersions',
  async () => {
    return await icd10Service.getVersions();
  }
);

export const fetchCurrentVersion = createAsyncThunk(
  'icd10/fetchCurrentVersion',
  async () => {
    return await icd10Service.getCurrentVersion();
  }
);

export const fetchPatientDiagnoses = createAsyncThunk(
  'icd10/fetchPatientDiagnoses',
  async (patientId: string) => {
    return await icd10Service.getPatientDiagnoses(patientId, { includeResolved: false });
  }
);

export const addDiagnosis = createAsyncThunk(
  'icd10/addDiagnosis',
  async ({ patientId, diagnosis }: { patientId: string; diagnosis: Partial<PatientDiagnosis> }) => {
    return await icd10Service.addPatientDiagnosis(patientId, diagnosis);
  }
);

export const updateDiagnosis = createAsyncThunk(
  'icd10/updateDiagnosis',
  async ({ diagnosisId, updates }: { diagnosisId: string; updates: Partial<PatientDiagnosis> }) => {
    return await icd10Service.updatePatientDiagnosis(diagnosisId, updates);
  }
);

export const deleteDiagnosis = createAsyncThunk(
  'icd10/deleteDiagnosis',
  async (diagnosisId: string) => {
    await icd10Service.deletePatientDiagnosis(diagnosisId);
    return diagnosisId;
  }
);

export const getSuggestions = createAsyncThunk(
  'icd10/getSuggestions',
  async ({ symptoms, context }: { symptoms: string[]; context?: any }) => {
    return await icd10Service.getSuggestions(symptoms, context);
  }
);

// Slice
const icd10Slice = createSlice({
  name: 'icd10',
  initialState,
  reducers: {
    setSelectedCode: (state, action: PayloadAction<ICD10Code | null>) => {
      state.selectedCode = action.payload;
      if (action.payload) {
        state.cache[action.payload.code] = action.payload;
      }
    },
    
    addRecentCode: (state, action: PayloadAction<ICD10Code>) => {
      const exists = state.recentCodes.find(c => c.code === action.payload.code);
      if (!exists) {
        state.recentCodes = [action.payload, ...state.recentCodes].slice(0, 10);
      }
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.lastSearchQuery = '';
    },
    
    cacheCode: (state, action: PayloadAction<ICD10Code>) => {
      state.cache[action.payload.code] = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setLastSearchQuery: (state, action: PayloadAction<string>) => {
      state.lastSearchQuery = action.payload;
    },
    
    clearCache: (state) => {
      state.cache = {};
    },
    
    loadRecentCodesFromStorage: (state) => {
      try {
        const stored = localStorage.getItem('icd10_recent_codes');
        if (stored) {
          state.recentCodes = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load recent codes:', error);
      }
    },
    
    saveRecentCodesToStorage: (state) => {
      try {
        localStorage.setItem('icd10_recent_codes', JSON.stringify(state.recentCodes));
      } catch (error) {
        console.error('Failed to save recent codes:', error);
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchICD10.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchICD10.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchICD10.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Search failed';
      })
      
      // Fetch code details
      .addCase(fetchCodeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCodeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCode = action.payload;
        state.cache[action.payload.code] = action.payload;
      })
      .addCase(fetchCodeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch code details';
      })
      
      // Popular codes
      .addCase(fetchPopularCodes.fulfilled, (state, action) => {
        state.popularCodes = action.payload;
      })
      
      // Versions
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.versions = action.payload;
      })
      .addCase(fetchCurrentVersion.fulfilled, (state, action) => {
        state.currentVersion = action.payload;
      })
      
      // Patient diagnoses
      .addCase(fetchPatientDiagnoses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientDiagnoses.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDiagnoses = action.payload;
      })
      .addCase(fetchPatientDiagnoses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch diagnoses';
      })
      
      // Add diagnosis
      .addCase(addDiagnosis.fulfilled, (state, action) => {
        state.patientDiagnoses.push(action.payload);
      })
      
      // Update diagnosis
      .addCase(updateDiagnosis.fulfilled, (state, action) => {
        const index = state.patientDiagnoses.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.patientDiagnoses[index] = action.payload;
        }
      })
      
      // Delete diagnosis
      .addCase(deleteDiagnosis.fulfilled, (state, action) => {
        state.patientDiagnoses = state.patientDiagnoses.filter(d => d.id !== action.payload);
      })
      
      // AI Suggestions
      .addCase(getSuggestions.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(getSuggestions.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Failed to get suggestions';
      });
  }
});

export const {
  setSelectedCode,
  addRecentCode,
  clearSearchResults,
  cacheCode,
  clearError,
  setLastSearchQuery,
  clearCache,
  loadRecentCodesFromStorage,
  saveRecentCodesToStorage
} = icd10Slice.actions;

export default icd10Slice.reducer;
