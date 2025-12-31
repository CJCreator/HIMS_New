-- ICD-10 Database Migration Script
-- Version: 1.0
-- Description: Creates all necessary tables for ICD-10 integration

-- ============================================
-- 1. ICD-10 Master Codes Table
-- ============================================
CREATE TABLE IF NOT EXISTS icd10_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    chapter VARCHAR(100) NOT NULL,
    block_range VARCHAR(50),
    version VARCHAR(20) NOT NULL DEFAULT '2024',
    effective_date DATE NOT NULL,
    end_date DATE,
    is_billable BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    parent_code VARCHAR(10),
    includes TEXT[],
    excludes TEXT[],
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_code_version UNIQUE (code, version)
);

CREATE INDEX idx_icd10_code ON icd10_codes(code);
CREATE INDEX idx_icd10_description ON icd10_codes USING gin(to_tsvector('english', description));
CREATE INDEX idx_icd10_category ON icd10_codes(category);
CREATE INDEX idx_icd10_version ON icd10_codes(version);
CREATE INDEX idx_icd10_active ON icd10_codes(is_active) WHERE is_active = true;

-- ============================================
-- 2. Patient Diagnoses Table
-- ============================================
CREATE TABLE IF NOT EXISTS patient_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    icd10_code_id UUID NOT NULL,
    icd10_code VARCHAR(10) NOT NULL,
    diagnosis_type VARCHAR(20) NOT NULL CHECK (diagnosis_type IN ('primary', 'secondary', 'differential', 'ruled_out')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'resolved', 'chronic', 'recurrent')),
    diagnosed_by UUID NOT NULL,
    diagnosed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    consultation_id UUID,
    notes TEXT,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
    confidence_level VARCHAR(20) CHECK (confidence_level IN ('definitive', 'probable', 'possible', 'suspected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (icd10_code_id) REFERENCES icd10_codes(id) ON DELETE RESTRICT
);

CREATE INDEX idx_patient_diagnoses_patient ON patient_diagnoses(patient_id);
CREATE INDEX idx_patient_diagnoses_code ON patient_diagnoses(icd10_code);
CREATE INDEX idx_patient_diagnoses_status ON patient_diagnoses(status);
CREATE INDEX idx_patient_diagnoses_date ON patient_diagnoses(diagnosed_at);

-- ============================================
-- 3. ICD-10 Versions Table
-- ============================================
CREATE TABLE IF NOT EXISTS icd10_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(20) NOT NULL UNIQUE,
    release_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    country_code VARCHAR(5) DEFAULT 'US',
    description TEXT,
    total_codes INTEGER DEFAULT 0,
    changes_summary TEXT,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_icd10_versions_current ON icd10_versions(country_code) WHERE is_current = true;

-- ============================================
-- 4. ICD-10 Search Index Table
-- ============================================
CREATE TABLE IF NOT EXISTS icd10_search_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icd10_code_id UUID NOT NULL,
    search_terms TEXT[],
    synonyms TEXT[],
    popularity_score INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    FOREIGN KEY (icd10_code_id) REFERENCES icd10_codes(id) ON DELETE CASCADE
);

CREATE INDEX idx_icd10_search_popularity ON icd10_search_index(popularity_score DESC);

-- ============================================
-- 5. Sample Data
-- ============================================
INSERT INTO icd10_versions (version, release_date, effective_date, is_current, country_code, total_codes)
VALUES ('2024', '2023-09-01', '2023-10-01', true, 'US', 72000)
ON CONFLICT (version) DO NOTHING;

INSERT INTO icd10_codes (code, description, short_description, category, chapter, version, effective_date, is_billable, is_active)
VALUES 
    ('J20.9', 'Acute bronchitis, unspecified', 'Acute bronchitis', 'Diseases of the respiratory system', 'Chapter X', '2024', '2023-10-01', true, true),
    ('I10', 'Essential (primary) hypertension', 'Hypertension', 'Diseases of the circulatory system', 'Chapter IX', '2024', '2023-10-01', true, true),
    ('E11.9', 'Type 2 diabetes mellitus without complications', 'Type 2 diabetes', 'Endocrine diseases', 'Chapter IV', '2024', '2023-10-01', true, true)
ON CONFLICT (code, version) DO NOTHING;
