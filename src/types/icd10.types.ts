// ICD-10 Type Definitions for HIMS
// Comprehensive types for ICD-10 code management and integration

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
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ICD10SearchResult extends ICD10Code {
  relevanceScore: number;
  matchedTerms: string[];
  popularityScore: number;
  highlightedDescription?: string;
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
  sourceUrl?: string;
}

export interface ICD10ValidationResult {
  isValid: boolean;
  code?: ICD10Code;
  errors: string[];
  warnings: string[];
  suggestions: ICD10Code[];
}

export interface ICD10SearchOptions {
  limit?: number;
  version?: string;
  billableOnly?: boolean;
  category?: string;
  activeOnly?: boolean;
  countryCode?: string;
}

export interface ICD10Category {
  code: string;
  name: string;
  range: string;
  description?: string;
  codeCount: number;
}

export interface ICD10Chapter {
  number: number;
  title: string;
  range: string;
  categories: ICD10Category[];
}

export interface ICD10Hierarchy {
  chapter: ICD10Chapter;
  category: ICD10Category;
  subcategory?: ICD10Code;
  code: ICD10Code;
}

export interface DiagnosisFormData {
  icd10Code: string;
  diagnosisType: 'primary' | 'secondary' | 'differential' | 'ruled_out';
  status: 'active' | 'resolved' | 'chronic' | 'recurrent';
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  confidenceLevel?: 'definitive' | 'probable' | 'possible' | 'suspected';
  notes?: string;
  onsetDate?: string;
}

export interface ICD10SyncResult {
  success: boolean;
  version: string;
  codesAdded: number;
  codesUpdated: number;
  codesDeprecated: number;
  errors: string[];
  syncedAt: string;
}

export interface ICD10Statistics {
  totalCodes: number;
  billableCodes: number;
  activeCodes: number;
  deprecatedCodes: number;
  categoriesCount: number;
  chaptersCount: number;
  lastUpdated: string;
}

export interface ICD10SearchIndex {
  id: string;
  icd10CodeId: string;
  searchTerms: string[];
  synonyms: string[];
  commonMisspellings: string[];
  popularityScore: number;
}

export interface ICD10CodeMapping {
  oldCode: string;
  newCode: string;
  version: string;
  mappingType: 'exact' | 'approximate' | 'broader' | 'narrower';
  notes?: string;
}

export interface ICD10BillingInfo {
  code: string;
  isBillable: boolean;
  reimbursementCategory?: string;
  drgWeight?: number;
  averageReimbursement?: number;
  requiresDocumentation?: string[];
}

export interface ICD10ClinicalContext {
  code: string;
  commonSymptoms: string[];
  relatedConditions: string[];
  typicalTests: string[];
  standardTreatments: string[];
  prognosis?: string;
}

export type ICD10CountryCode = 'US' | 'CA' | 'AU' | 'DE' | 'GB' | 'FR' | 'JP' | 'IN';

export interface ICD10Config {
  defaultVersion: string;
  defaultCountry: ICD10CountryCode;
  supportedCountries: ICD10CountryCode[];
  autoUpdate: boolean;
  cacheExpiry: number;
  searchMinLength: number;
  searchDebounce: number;
  maxResults: number;
  enableFuzzySearch: boolean;
  enableAISuggestions: boolean;
}
