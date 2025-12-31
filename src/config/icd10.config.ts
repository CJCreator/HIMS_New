// ICD-10 Configuration
// Central configuration for ICD-10 integration

import type { ICD10Config, ICD10CountryCode } from '@/types/icd10.types';

export const ICD10_CONFIG: ICD10Config = {
  // Default version (fiscal year)
  defaultVersion: '2024',
  
  // Default country code
  defaultCountry: 'US',
  
  // Supported country variations
  supportedCountries: ['US', 'CA', 'AU', 'DE', 'GB', 'FR', 'JP', 'IN'],
  
  // Auto-update from official sources
  autoUpdate: true,
  
  // Cache expiry in milliseconds (24 hours)
  cacheExpiry: 86400000,
  
  // Minimum search query length
  searchMinLength: 2,
  
  // Search debounce delay in milliseconds
  searchDebounce: 300,
  
  // Maximum search results
  maxResults: 50,
  
  // Enable fuzzy search for typos
  enableFuzzySearch: true,
  
  // Enable AI-powered suggestions
  enableAISuggestions: true
};

// Country-specific configurations
export const COUNTRY_CONFIGS: Record<ICD10CountryCode, {
  name: string;
  version: string;
  apiEndpoint?: string;
  requiresBillable: boolean;
  supportedLanguages: string[];
}> = {
  US: {
    name: 'United States (ICD-10-CM)',
    version: 'ICD-10-CM',
    apiEndpoint: 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search',
    requiresBillable: true,
    supportedLanguages: ['en']
  },
  CA: {
    name: 'Canada (ICD-10-CA)',
    version: 'ICD-10-CA',
    requiresBillable: true,
    supportedLanguages: ['en', 'fr']
  },
  AU: {
    name: 'Australia (ICD-10-AM)',
    version: 'ICD-10-AM',
    requiresBillable: true,
    supportedLanguages: ['en']
  },
  DE: {
    name: 'Germany (ICD-10-GM)',
    version: 'ICD-10-GM',
    requiresBillable: true,
    supportedLanguages: ['de']
  },
  GB: {
    name: 'United Kingdom',
    version: 'ICD-10',
    requiresBillable: false,
    supportedLanguages: ['en']
  },
  FR: {
    name: 'France',
    version: 'ICD-10',
    requiresBillable: true,
    supportedLanguages: ['fr']
  },
  JP: {
    name: 'Japan',
    version: 'ICD-10',
    requiresBillable: true,
    supportedLanguages: ['ja']
  },
  IN: {
    name: 'India',
    version: 'ICD-10',
    requiresBillable: false,
    supportedLanguages: ['en', 'hi']
  }
};

// ICD-10 Chapters
export const ICD10_CHAPTERS = [
  { number: 1, range: 'A00-B99', title: 'Certain infectious and parasitic diseases' },
  { number: 2, range: 'C00-D49', title: 'Neoplasms' },
  { number: 3, range: 'D50-D89', title: 'Diseases of the blood and blood-forming organs' },
  { number: 4, range: 'E00-E89', title: 'Endocrine, nutritional and metabolic diseases' },
  { number: 5, range: 'F01-F99', title: 'Mental, Behavioral and Neurodevelopmental disorders' },
  { number: 6, range: 'G00-G99', title: 'Diseases of the nervous system' },
  { number: 7, range: 'H00-H59', title: 'Diseases of the eye and adnexa' },
  { number: 8, range: 'H60-H95', title: 'Diseases of the ear and mastoid process' },
  { number: 9, range: 'I00-I99', title: 'Diseases of the circulatory system' },
  { number: 10, range: 'J00-J99', title: 'Diseases of the respiratory system' },
  { number: 11, range: 'K00-K95', title: 'Diseases of the digestive system' },
  { number: 12, range: 'L00-L99', title: 'Diseases of the skin and subcutaneous tissue' },
  { number: 13, range: 'M00-M99', title: 'Diseases of the musculoskeletal system and connective tissue' },
  { number: 14, range: 'N00-N99', title: 'Diseases of the genitourinary system' },
  { number: 15, range: 'O00-O9A', title: 'Pregnancy, childbirth and the puerperium' },
  { number: 16, range: 'P00-P96', title: 'Certain conditions originating in the perinatal period' },
  { number: 17, range: 'Q00-Q99', title: 'Congenital malformations, deformations and chromosomal abnormalities' },
  { number: 18, range: 'R00-R99', title: 'Symptoms, signs and abnormal clinical and laboratory findings' },
  { number: 19, range: 'S00-T88', title: 'Injury, poisoning and certain other consequences of external causes' },
  { number: 20, range: 'V00-Y99', title: 'External causes of morbidity' },
  { number: 21, range: 'Z00-Z99', title: 'Factors influencing health status and contact with health services' },
  { number: 22, range: 'U00-U85', title: 'Codes for special purposes' }
];

// Common diagnosis categories by specialty
export const SPECIALTY_COMMON_CODES: Record<string, string[]> = {
  'General Practice': ['J06.9', 'J20.9', 'I10', 'E11.9', 'M79.3', 'R51', 'K21.9'],
  'Cardiology': ['I10', 'I25.10', 'I48.91', 'I50.9', 'I21.9', 'I20.9'],
  'Pulmonology': ['J44.9', 'J45.909', 'J18.9', 'J20.9', 'J06.9'],
  'Endocrinology': ['E11.9', 'E11.65', 'E03.9', 'E78.5', 'E66.9'],
  'Gastroenterology': ['K21.9', 'K58.9', 'K76.0', 'K80.20', 'K29.70'],
  'Orthopedics': ['M25.561', 'M17.9', 'M19.90', 'M54.5', 'M79.3'],
  'Neurology': ['G43.909', 'G89.29', 'G47.00', 'G35', 'G20'],
  'Psychiatry': ['F41.9', 'F32.9', 'F33.9', 'F43.10', 'F90.9'],
  'Pediatrics': ['J06.9', 'J20.9', 'R50.9', 'J02.9', 'A09'],
  'Obstetrics': ['O80', 'O09.90', 'Z34.90', 'O26.90', 'O48.0']
};

// Sync schedule configuration
export const SYNC_CONFIG = {
  // Sync frequency
  dailySync: true,
  weeklyFullSync: true,
  
  // Sync times (UTC)
  dailySyncTime: '02:00',
  weeklySyncDay: 'Sunday',
  weeklySyncTime: '03:00',
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 60000, // 1 minute
  
  // Notification settings
  notifyOnSuccess: false,
  notifyOnFailure: true,
  notifyOnNewVersion: true
};

// Performance optimization settings
export const PERFORMANCE_CONFIG = {
  // Enable caching
  enableCache: true,
  
  // Cache strategies
  cacheStrategies: {
    search: 'memory', // memory, localStorage, indexedDB
    codes: 'indexedDB',
    popular: 'memory'
  },
  
  // Prefetch popular codes
  prefetchPopular: true,
  prefetchCount: 100,
  
  // Lazy load code details
  lazyLoadDetails: true,
  
  // Virtual scrolling for large lists
  enableVirtualScroll: true,
  virtualScrollThreshold: 50
};

// API endpoints
export const API_ENDPOINTS = {
  search: '/api/icd10/search',
  getCode: '/api/icd10/code',
  validate: '/api/icd10/validate',
  popular: '/api/icd10/popular',
  suggestions: '/api/icd10/suggestions',
  sync: '/api/icd10/sync',
  versions: '/api/icd10/versions',
  statistics: '/api/icd10/statistics'
};

// Feature flags
export const FEATURE_FLAGS = {
  enableAISuggestions: true,
  enableVoiceInput: false,
  enableOfflineMode: true,
  enableBulkImport: true,
  enableCodeMapping: true,
  enableClinicalContext: true,
  enableBillingValidation: true
};

// Validation rules
export const VALIDATION_RULES = {
  maxDiagnosesPerPatient: 10,
  requirePrimaryDiagnosis: true,
  requireBillableForClaims: true,
  warnOnDeprecatedCodes: true,
  blockInvalidCombinations: true,
  requireSpecificityForBilling: true
};

// UI preferences
export const UI_PREFERENCES = {
  showCodeHierarchy: true,
  showRelatedCodes: true,
  showClinicalNotes: true,
  highlightBillableCodes: true,
  showPopularityScore: false,
  compactView: false,
  defaultSortBy: 'relevance' as 'relevance' | 'code' | 'popularity'
};

export default ICD10_CONFIG;
