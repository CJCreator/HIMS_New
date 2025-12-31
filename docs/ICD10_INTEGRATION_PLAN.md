# ICD-10 Integration Plan for HIMS

## Executive Summary
Comprehensive integration plan for ICD-10 (International Classification of Diseases, 10th Revision) codes across the entire HIMS application to ensure accurate diagnosis coding, compliance with medical standards, and seamless workflow integration.

## 1. Scope & Affected Modules

### 1.1 Core Modules
- **Doctor Consultation Flow** - Primary diagnosis entry point
- **Patient Records** - Historical diagnosis tracking
- **Reporting & Analytics** - Disease statistics and trends
- **Billing System** - Insurance claims and coding
- **Lab Orders** - Diagnosis-based test ordering
- **Prescription Management** - Diagnosis-linked prescriptions
- **Search & Filter** - Global ICD-10 code search

### 1.2 User Roles Impacted
- Doctors (Primary users)
- Nurses (View/reference)
- Receptionists (Billing codes)
- Lab Technicians (Diagnosis context)
- Administrators (Reporting)
- Patients (View diagnoses)

## 2. Database Schema Design

### 2.1 ICD-10 Master Table
```sql
CREATE TABLE icd10_codes (
  id UUID PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description VARCHAR(255),
  category VARCHAR(100),
  chapter VARCHAR(100),
  block_range VARCHAR(50),
  version VARCHAR(20) NOT NULL,
  effective_date DATE NOT NULL,
  end_date DATE,
  is_billable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  parent_code VARCHAR(10),
  includes TEXT[],
  excludes TEXT[],
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_code (code),
  INDEX idx_description (description),
  INDEX idx_category (category),
  INDEX idx_version (version),
  INDEX idx_active (is_active)
);
```

### 2.2 Patient Diagnosis Table
```sql
CREATE TABLE patient_diagnoses (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id),
  icd10_code_id UUID NOT NULL REFERENCES icd10_codes(id),
  icd10_code VARCHAR(10) NOT NULL,
  diagnosis_type VARCHAR(20) CHECK (diagnosis_type IN ('primary', 'secondary', 'differential', 'ruled_out')),
  status VARCHAR(20) CHECK (status IN ('active', 'resolved', 'chronic', 'recurrent')),
  diagnosed_by UUID REFERENCES users(id),
  diagnosed_at TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP,
  consultation_id UUID REFERENCES consultations(id),
  notes TEXT,
  severity VARCHAR(20),
  confidence_level VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_patient (patient_id),
  INDEX idx_code (icd10_code),
  INDEX idx_status (status),
  INDEX idx_diagnosed_at (diagnosed_at)
);
```

### 2.3 ICD-10 Version History
```sql
CREATE TABLE icd10_versions (
  id UUID PRIMARY KEY,
  version VARCHAR(20) NOT NULL UNIQUE,
  release_date DATE NOT NULL,
  effective_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  country_code VARCHAR(5) DEFAULT 'US',
  description TEXT,
  total_codes INTEGER,
  changes_summary TEXT,
  source_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.4 ICD-10 Search Index
```sql
CREATE TABLE icd10_search_index (
  id UUID PRIMARY KEY,
  icd10_code_id UUID REFERENCES icd10_codes(id),
  search_terms TEXT[],
  synonyms TEXT[],
  common_misspellings TEXT[],
  search_vector TSVECTOR,
  popularity_score INTEGER DEFAULT 0,
  INDEX idx_search_vector (search_vector),
  INDEX idx_popularity (popularity_score)
);
```

## 3. TypeScript Type Definitions

### 3.1 Core Types
```typescript
// src/types/icd10.types.ts
export interface ICD10Code {
  id: string;
  code: string;
  description: string;
  shortDescription?: string;
  category: string;
  chapter: string;
  blockRange?: string;
  version: string;
  effectiveDate: string;
  endDate?: string;
  isBillable: boolean;
  isActive: boolean;
  parentCode?: string;
  includes?: string[];
  excludes?: string[];
  notes?: string;
  metadata?: Record<string, any>;
}

export interface PatientDiagnosis {
  id: string;
  patientId: string;
  icd10CodeId: string;
  icd10Code: string;
  icd10Details?: ICD10Code;
  diagnosisType: 'primary' | 'secondary' | 'differential' | 'ruled_out';
  status: 'active' | 'resolved' | 'chronic' | 'recurrent';
  diagnosedBy: string;
  diagnosedByName?: string;
  diagnosedAt: string;
  resolvedAt?: string;
  consultationId?: string;
  notes?: string;
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  confidenceLevel?: 'definitive' | 'probable' | 'possible' | 'suspected';
}

export interface ICD10SearchResult extends ICD10Code {
  relevanceScore: number;
  matchedTerms: string[];
  popularityScore: number;
}

export interface ICD10Version {
  id: string;
  version: string;
  releaseDate: string;
  effectiveDate: string;
  endDate?: string;
  isCurrent: boolean;
  countryCode: string;
  description?: string;
  totalCodes: number;
  changesSummary?: string;
}

export interface ICD10ValidationResult {
  isValid: boolean;
  code?: ICD10Code;
  errors: string[];
  warnings: string[];
  suggestions: ICD10Code[];
}
```

## 4. API Service Layer

### 4.1 ICD-10 Service
```typescript
// src/services/icd10Service.ts
import { api } from './api';
import type { ICD10Code, ICD10SearchResult, ICD10ValidationResult } from '@/types/icd10.types';

export const icd10Service = {
  // Search ICD-10 codes
  search: async (query: string, options?: {
    limit?: number;
    version?: string;
    billableOnly?: boolean;
    category?: string;
  }): Promise<ICD10SearchResult[]> => {
    const response = await api.get('/icd10/search', {
      params: { q: query, ...options }
    });
    return response.data;
  },

  // Get code details
  getByCode: async (code: string, version?: string): Promise<ICD10Code> => {
    const response = await api.get(`/icd10/code/${code}`, {
      params: { version }
    });
    return response.data;
  },

  // Validate code
  validate: async (code: string): Promise<ICD10ValidationResult> => {
    const response = await api.post('/icd10/validate', { code });
    return response.data;
  },

  // Get related codes
  getRelated: async (code: string): Promise<ICD10Code[]> => {
    const response = await api.get(`/icd10/code/${code}/related`);
    return response.data;
  },

  // Get code hierarchy
  getHierarchy: async (code: string): Promise<ICD10Code[]> => {
    const response = await api.get(`/icd10/code/${code}/hierarchy`);
    return response.data;
  },

  // Get popular codes
  getPopular: async (limit: number = 50): Promise<ICD10Code[]> => {
    const response = await api.get('/icd10/popular', { params: { limit } });
    return response.data;
  },

  // Get codes by category
  getByCategory: async (category: string): Promise<ICD10Code[]> => {
    const response = await api.get('/icd10/category', { params: { category } });
    return response.data;
  },

  // Sync with official source
  syncCodes: async (version: string): Promise<{ success: boolean; count: number }> => {
    const response = await api.post('/icd10/sync', { version });
    return response.data;
  }
};
```

## 5. Redux State Management

### 5.1 ICD-10 Slice
```typescript
// src/store/icd10Slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { icd10Service } from '@/services/icd10Service';
import type { ICD10Code, ICD10SearchResult } from '@/types/icd10.types';

interface ICD10State {
  searchResults: ICD10SearchResult[];
  selectedCode: ICD10Code | null;
  recentCodes: ICD10Code[];
  popularCodes: ICD10Code[];
  currentVersion: string;
  loading: boolean;
  error: string | null;
  cache: Record<string, ICD10Code>;
}

const initialState: ICD10State = {
  searchResults: [],
  selectedCode: null,
  recentCodes: [],
  popularCodes: [],
  currentVersion: '2024',
  loading: false,
  error: null,
  cache: {}
};

export const searchICD10 = createAsyncThunk(
  'icd10/search',
  async (query: string) => {
    return await icd10Service.search(query);
  }
);

export const fetchCodeDetails = createAsyncThunk(
  'icd10/fetchDetails',
  async (code: string) => {
    return await icd10Service.getByCode(code);
  }
);

export const fetchPopularCodes = createAsyncThunk(
  'icd10/fetchPopular',
  async () => {
    return await icd10Service.getPopular();
  }
);

const icd10Slice = createSlice({
  name: 'icd10',
  initialState,
  reducers: {
    setSelectedCode: (state, action: PayloadAction<ICD10Code | null>) => {
      state.selectedCode = action.payload;
    },
    addRecentCode: (state, action: PayloadAction<ICD10Code>) => {
      state.recentCodes = [
        action.payload,
        ...state.recentCodes.filter(c => c.code !== action.payload.code)
      ].slice(0, 10);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    cacheCode: (state, action: PayloadAction<ICD10Code>) => {
      state.cache[action.payload.code] = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchICD10.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchICD10.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchICD10.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(fetchCodeDetails.fulfilled, (state, action) => {
        state.selectedCode = action.payload;
        state.cache[action.payload.code] = action.payload;
      })
      .addCase(fetchPopularCodes.fulfilled, (state, action) => {
        state.popularCodes = action.payload;
      });
  }
});

export const { setSelectedCode, addRecentCode, clearSearchResults, cacheCode } = icd10Slice.actions;
export default icd10Slice.reducer;
```

## 6. UI Components

### 6.1 Enhanced ICD-10 Search Component
See: `src/components/ICD10SearchAutocomplete.tsx`

### 6.2 ICD-10 Selector Component
See: `src/components/ICD10Selector.tsx`

### 6.3 Diagnosis Form Component
See: `src/components/DiagnosisForm.tsx`

## 7. Validation Rules

### 7.1 Code Format Validation
- Valid format: Letter + 2-3 digits + optional decimal + 1-2 digits
- Examples: A00, J20.9, E11.65
- Regex: `^[A-Z][0-9]{2}(\.[0-9]{1,2})?$`

### 7.2 Business Rules
1. **Billable Codes**: Only billable codes can be used for insurance claims
2. **Active Codes**: Warn when using deprecated codes
3. **Version Compatibility**: Ensure code exists in selected version
4. **Primary Diagnosis**: At least one primary diagnosis required
5. **Code Specificity**: Encourage most specific code available
6. **Exclusion Rules**: Validate against excluded codes

### 7.3 Validation Service
```typescript
// src/utils/icd10Validator.ts
export const validateICD10Code = (code: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Format validation
  const formatRegex = /^[A-Z][0-9]{2}(\.[0-9]{1,2})?$/;
  if (!formatRegex.test(code)) {
    errors.push('Invalid ICD-10 code format');
  }
  
  // Length validation
  if (code.length < 3 || code.length > 7) {
    errors.push('Code length must be between 3 and 7 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
```

## 8. Integration Points

### 8.1 Doctor Consultation Flow
- **Step 3: Treatment Plan Hub** - Add diagnosis with ICD-10 codes
- **Clinical Assessment** - Suggest codes based on symptoms
- **Prescription Creation** - Link prescriptions to diagnoses

### 8.2 Patient Records
- **Problem List** - Display active diagnoses with ICD-10 codes
- **Medical History** - Show historical diagnoses
- **Timeline** - Include diagnosis events

### 8.3 Billing System
- **Invoice Generation** - Include ICD-10 codes for insurance
- **Claims Processing** - Validate codes for billing
- **Reports** - Generate diagnosis-based billing reports

### 8.4 Reporting & Analytics
- **Disease Statistics** - Track diagnosis trends
- **Epidemiology Reports** - Population health analytics
- **Quality Metrics** - Diagnosis accuracy tracking

## 9. API Integration

### 9.1 Official ICD-10 Sources
- **WHO ICD API**: https://icd.who.int/icdapi
- **CMS ICD-10**: https://www.cms.gov/medicare/coding/icd10
- **UMLS API**: https://uts.nlm.nih.gov/uts/umls/home

### 9.2 Sync Strategy
1. **Initial Load**: Import complete ICD-10 database
2. **Quarterly Updates**: Sync with official releases
3. **Incremental Updates**: Daily sync for corrections
4. **Version Management**: Maintain multiple versions

## 10. Versioning Strategy

### 10.1 Version Management
- Support multiple ICD-10 versions simultaneously
- Default to current fiscal year version
- Allow historical version selection for old records
- Track version changes and migrations

### 10.2 Migration Plan
```typescript
// When new version released
1. Import new codes to database
2. Mark old version as non-current
3. Map deprecated codes to new codes
4. Notify users of changes
5. Update default version
```

## 11. International Support

### 11.1 Country-Specific Variations
- **ICD-10-CM** (USA) - Clinical Modification
- **ICD-10-CA** (Canada) - Canadian version
- **ICD-10-AM** (Australia) - Australian Modification
- **ICD-10-GM** (Germany) - German Modification

### 11.2 Configuration
```typescript
// src/config/icd10.config.ts
export const ICD10_CONFIG = {
  defaultVersion: '2024',
  defaultCountry: 'US',
  supportedCountries: ['US', 'CA', 'AU', 'DE', 'GB'],
  autoUpdate: true,
  cacheExpiry: 86400, // 24 hours
  searchMinLength: 2,
  searchDebounce: 300,
  maxResults: 50
};
```

## 12. Error Handling

### 12.1 Error Types
- **Invalid Code**: Code doesn't exist
- **Deprecated Code**: Code no longer active
- **Version Mismatch**: Code not in selected version
- **Network Error**: API unavailable
- **Validation Error**: Business rule violation

### 12.2 Error Messages
```typescript
export const ICD10_ERRORS = {
  INVALID_FORMAT: 'Invalid ICD-10 code format. Expected format: A00.00',
  CODE_NOT_FOUND: 'ICD-10 code not found in current version',
  DEPRECATED_CODE: 'This code has been deprecated. Please use: {newCode}',
  NOT_BILLABLE: 'This code is not billable for insurance claims',
  VERSION_MISMATCH: 'Code not available in selected version',
  NETWORK_ERROR: 'Unable to fetch ICD-10 data. Please try again',
  DUPLICATE_DIAGNOSIS: 'This diagnosis already exists for the patient'
};
```

## 13. Performance Optimization

### 13.1 Caching Strategy
- **Browser Cache**: Store recent searches (24 hours)
- **Redux Cache**: Keep frequently used codes in memory
- **Service Worker**: Offline code lookup
- **Database Indexing**: Optimize search queries

### 13.2 Search Optimization
- **Debouncing**: 300ms delay on search input
- **Fuzzy Matching**: Handle typos and variations
- **Prefix Search**: Fast autocomplete
- **Popularity Ranking**: Show common codes first

## 14. Testing Strategy

### 14.1 Unit Tests
- Code format validation
- Search functionality
- Version management
- Cache operations

### 14.2 Integration Tests
- API integration
- Database operations
- Redux state management
- Component interactions

### 14.3 E2E Tests
- Complete diagnosis workflow
- Search and selection
- Validation scenarios
- Error handling

## 15. Documentation

### 15.1 Developer Documentation
- API reference
- Component usage
- Integration guide
- Migration guide

### 15.2 User Documentation
- ICD-10 code search guide
- Diagnosis entry workflow
- Best practices
- Common codes reference

### 15.3 Training Materials
- Video tutorials
- Interactive demos
- Quick reference cards
- FAQ document

## 16. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema implementation
- [ ] Type definitions
- [ ] Basic API service
- [ ] Redux slice setup

### Phase 2: Core Components (Week 3-4)
- [ ] ICD-10 search component
- [ ] Code selector component
- [ ] Validation utilities
- [ ] Error handling

### Phase 3: Integration (Week 5-6)
- [ ] Doctor consultation integration
- [ ] Patient records integration
- [ ] Billing system integration
- [ ] Reporting integration

### Phase 4: Enhancement (Week 7-8)
- [ ] Advanced search features
- [ ] AI-powered suggestions
- [ ] Analytics dashboard
- [ ] Performance optimization

### Phase 5: Testing & Documentation (Week 9-10)
- [ ] Comprehensive testing
- [ ] User documentation
- [ ] Training materials
- [ ] Production deployment

## 17. Success Metrics

### 17.1 Technical Metrics
- Search response time < 200ms
- 99.9% code validation accuracy
- Zero data loss during version updates
- < 1% error rate in code selection

### 17.2 User Metrics
- 90% user satisfaction
- < 30 seconds average diagnosis entry time
- 95% code accuracy in billing
- 80% reduction in coding errors

## 18. Compliance & Standards

### 18.1 Medical Standards
- HIPAA compliance for diagnosis data
- ICD-10 official coding guidelines
- CMS billing requirements
- WHO classification standards

### 18.2 Data Security
- Encrypted storage of diagnosis data
- Audit trail for all changes
- Role-based access control
- GDPR compliance for international use

## 19. Maintenance Plan

### 19.1 Regular Updates
- Quarterly ICD-10 version updates
- Monthly code popularity refresh
- Weekly search index optimization
- Daily cache cleanup

### 19.2 Monitoring
- API performance monitoring
- Error rate tracking
- User behavior analytics
- Code usage statistics

## 20. Support & Resources

### 20.1 Internal Resources
- ICD-10 coding specialist
- Technical support team
- Training coordinator
- Documentation maintainer

### 20.2 External Resources
- WHO ICD-10 documentation
- CMS coding guidelines
- Medical coding forums
- Professional coding associations

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Owner**: HIMS Development Team  
**Status**: Ready for Implementation
