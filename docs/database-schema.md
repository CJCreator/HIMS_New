# Database Schema Document
## AROCORD-HIMS (Healthcare Information Management System)

**Project Name**: AROCORD-HIMS  
**Version**: 2.3  
**Date**: December 2025  
**Status**: Production Ready (90% Complete)  

---

## 1. Introduction

### 1.1 Purpose
This Database Schema Document provides a comprehensive overview of the AROCORD-HIMS database design, including entity-relationship diagrams, table structures, relationships, and data integrity constraints.

### 1.2 Database Technology
- **Primary Database**: PostgreSQL 15+
- **Document Store**: MongoDB for unstructured data
- **Cache**: Redis for session and application caching
- **Search**: Elasticsearch for advanced search capabilities

---

## 2. Entity-Relationship Diagram

### 2.1 Core Entities Overview

```
┌─────────────────┐       ┌─────────────────┐
│     Users       │       │    Patients     │
│                 │       │                 │
│ - id            │◄─────►│ - id            │
│ - username      │       │ - mrn           │
│ - email         │       │ - demographics  │
│ - role          │       │ - insurance     │
│ - status        │       │ - emergency_ct  │
└─────────────────┘       └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│  Appointments   │       │Medical Records  │
│                 │       │                 │
│ - id            │       │ - id            │
│ - patient_id    │◄─────►│ - patient_id    │
│ - doctor_id     │       │ - record_type   │
│ - scheduled_time│       │ - data          │
│ - status        │       │ - recorded_by   │
└─────────────────┘       └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│ Consultations   │       │ Prescriptions   │
│                 │       │                 │
│ - id            │       │ - id            │
│ - patient_id    │◄─────►│ - patient_id    │
│ - doctor_id     │       │ - doctor_id     │
│ - workflow_type │       │ - medications   │
│ - current_step  │       │ - priority      │
└─────────────────┘       └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│ Lab Orders      │       │   Billing       │
│                 │       │                 │
│ - id            │       │ - id            │
│ - patient_id    │◄─────►│ - patient_id    │
│ - test_type     │       │ - charges       │
│ - priority      │       │ - payments      │
│ - status        │       │ - insurance     │
└─────────────────┘       └─────────────────┘
```

---

## 3. Core Tables

### 3.1 Users Table

**Purpose**: Stores user accounts for all system roles

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist', 'nurse', 'pharmacist', 'lab', 'patient')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active),

    -- Constraints
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CHECK (char_length(password_hash) >= 60)
);
```

**Relationships**:
- One-to-many with appointments (doctor_id, created_by)
- One-to-many with consultations (doctor_id)
- One-to-many with prescriptions (doctor_id, pharmacist_id)
- One-to-many with medical_records (recorded_by)

### 3.2 Patients Table

**Purpose**: Stores patient demographic and contact information

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    ssn VARCHAR(11), -- Encrypted
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSONB, -- Structured address data
    emergency_contact JSONB, -- Contact person details
    insurance_info JSONB, -- Insurance provider details
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_patients_mrn (mrn),
    INDEX idx_patients_name (first_name, last_name),
    INDEX idx_patients_dob (date_of_birth),
    INDEX idx_patients_phone (phone),
    INDEX idx_patients_email (email),
    INDEX idx_patients_active (is_active),

    -- Full-text search
    INDEX idx_patients_search ON patients USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || mrn)),

    -- Constraints
    CHECK (date_of_birth <= CURRENT_DATE),
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

**Relationships**:
- One-to-many with appointments
- One-to-many with consultations
- One-to-many with prescriptions
- One-to-many with medical_records
- One-to-many with lab_orders
- One-to-many with billing_records

### 3.3 Appointments Table

**Purpose**: Manages appointment scheduling and status

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    receptionist_id UUID REFERENCES users(id), -- Who scheduled
    appointment_type VARCHAR(50) NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 15,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')),
    check_in_time TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    room_number VARCHAR(10),
    notes TEXT,
    cancellation_reason TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_appointments_patient (patient_id),
    INDEX idx_appointments_doctor (doctor_id),
    INDEX idx_appointments_time (scheduled_time),
    INDEX idx_appointments_status (status),
    INDEX idx_appointments_type (appointment_type),

    -- Composite indexes
    INDEX idx_appointments_doctor_time (doctor_id, scheduled_time),
    INDEX idx_appointments_patient_time (patient_id, scheduled_time),

    -- Constraints
    CHECK (scheduled_time > CURRENT_TIMESTAMP),
    CHECK (duration_minutes BETWEEN 5 AND 480),
    EXCLUDE (doctor_id WITH =) WHERE (status NOT IN ('cancelled', 'completed'))
        USING gist (tstzrange(scheduled_time, scheduled_time + (duration_minutes || ' minutes')::interval))
);
```

**Relationships**:
- Many-to-one with patients
- Many-to-one with users (doctor, receptionist)
- One-to-one with consultations

### 3.4 Consultations Table

**Purpose**: Tracks consultation workflow and progress

```sql
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    workflow_type VARCHAR(20) DEFAULT 'standard' CHECK (workflow_type IN ('standard', 'adaptive')),
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 5,
    step_data JSONB, -- Current step data
    workflow_state JSONB, -- Complete workflow state
    chief_complaint TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    duration_minutes INTEGER,
    notes TEXT,
    ai_summary TEXT, -- AI-generated summary
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_consultations_patient (patient_id),
    INDEX idx_consultations_doctor (doctor_id),
    INDEX idx_consultations_status (status),
    INDEX idx_consultations_started (started_at),
    INDEX idx_consultations_completed (completed_at),

    -- Constraints
    CHECK (current_step BETWEEN 1 AND total_steps),
    CHECK (completed_at IS NULL OR completed_at >= started_at)
);
```

**Relationships**:
- Many-to-one with patients
- Many-to-one with users (doctor)
- One-to-one with appointments
- One-to-many with prescriptions
- One-to-many with lab_orders

### 3.5 Prescriptions Table

**Purpose**: Manages medication prescriptions and dispensing

```sql
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    pharmacist_id UUID REFERENCES users(id),
    consultation_id UUID REFERENCES consultations(id),
    medications JSONB NOT NULL, -- Array of medication objects
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent_to_pharmacy', 'processing', 'ready', 'dispensed', 'cancelled')),
    pharmacy_id UUID, -- External pharmacy reference
    pickup_deadline TIMESTAMP,
    notes TEXT,
    drug_interactions JSONB, -- Detected interactions
    allergy_alerts JSONB, -- Patient allergy conflicts
    dispensed_at TIMESTAMP,
    dispensed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_prescriptions_patient (patient_id),
    INDEX idx_prescriptions_doctor (doctor_id),
    INDEX idx_prescriptions_status (status),
    INDEX idx_prescriptions_priority (priority),
    INDEX idx_prescriptions_created (created_at),

    -- Constraints
    CHECK (pickup_deadline > created_at),
    CHECK (dispensed_at IS NULL OR dispensed_at >= created_at)
);
```

**Medication JSONB Structure**:
```json
{
  "medications": [
    {
      "drug_id": "uuid",
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "once daily",
      "duration": "30 days",
      "instructions": "Take with food in the morning",
      "quantity": 30,
      "refills": 3
    }
  ]
}
```

### 3.6 Medical Records Table

**Purpose**: Stores all patient medical information

```sql
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('allergy', 'medication', 'diagnosis', 'procedure', 'vital_signs', 'lab_result', 'imaging', 'note')),
    record_subtype VARCHAR(50), -- Specific type within category
    data JSONB NOT NULL, -- Flexible data structure
    recorded_by UUID NOT NULL REFERENCES users(id),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_date TIMESTAMP, -- When the event occurred
    is_active BOOLEAN DEFAULT true,
    is_confidential BOOLEAN DEFAULT false,
    source_system VARCHAR(50), -- Where the data came from
    external_id VARCHAR(100), -- ID from external system
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_medical_records_patient (patient_id),
    INDEX idx_medical_records_type (record_type),
    INDEX idx_medical_records_recorded (recorded_at),
    INDEX idx_medical_records_active (is_active),

    -- Partial indexes
    INDEX idx_medical_records_allergies ON medical_records(patient_id) WHERE record_type = 'allergy' AND is_active = true,
    INDEX idx_medical_records_medications ON medical_records(patient_id) WHERE record_type = 'medication' AND is_active = true,

    -- Constraints
    CHECK (effective_date <= CURRENT_TIMESTAMP)
);
```

**Data Structure Examples**:

**Allergy Record**:
```json
{
  "allergen": "Penicillin",
  "reaction": "Rash",
  "severity": "moderate",
  "onset": "childhood",
  "notes": "Avoid all beta-lactam antibiotics"
}
```

**Vital Signs Record**:
```json
{
  "blood_pressure": "120/80",
  "heart_rate": 72,
  "temperature": 98.6,
  "temperature_unit": "F",
  "oxygen_saturation": 98,
  "respiratory_rate": 16,
  "weight": 150,
  "weight_unit": "lbs",
  "height": 68,
  "height_unit": "inches",
  "bmi": 22.8
}
```

### 3.7 Lab Orders Table

**Purpose**: Manages laboratory test orders and results

```sql
CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id),
    consultation_id UUID REFERENCES consultations(id),
    lab_technician_id UUID REFERENCES users(id),
    test_type VARCHAR(100) NOT NULL,
    test_code VARCHAR(20), -- LOINC code
    priority VARCHAR(10) DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'stat')),
    status VARCHAR(20) DEFAULT 'ordered' CHECK (status IN ('ordered', 'collected', 'processing', 'completed', 'cancelled')),
    specimen_type VARCHAR(50),
    collection_instructions TEXT,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    collected_at TIMESTAMP,
    collected_by UUID REFERENCES users(id),
    received_at TIMESTAMP,
    completed_at TIMESTAMP,
    results JSONB, -- Test results
    interpretation TEXT,
    critical_values JSONB, -- Any critical findings
    notes TEXT,
    external_lab_id VARCHAR(50), -- Reference to external lab system
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_lab_orders_patient (patient_id),
    INDEX idx_lab_orders_doctor (doctor_id),
    INDEX idx_lab_orders_status (status),
    INDEX idx_lab_orders_priority (priority),
    INDEX idx_lab_orders_ordered (ordered_at),

    -- Constraints
    CHECK (collected_at IS NULL OR collected_at >= ordered_at),
    CHECK (completed_at IS NULL OR completed_at >= collected_at)
);
```

### 3.8 Billing Records Table

**Purpose**: Manages billing, charges, and payments

```sql
CREATE TABLE billing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES consultations(id),
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    bill_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled')),
    charges JSONB NOT NULL, -- Detailed charge breakdown
    adjustments JSONB, -- Insurance adjustments, discounts
    payments JSONB, -- Payment history
    insurance_claims JSONB, -- Insurance processing details
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2),
    payment_plan_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_billing_patient (patient_id),
    INDEX idx_billing_status (status),
    INDEX idx_billing_due_date (due_date),
    INDEX idx_billing_invoice (invoice_number),

    -- Constraints
    CHECK (due_date >= bill_date),
    CHECK (paid_amount <= total_amount),
    CHECK (balance = total_amount - paid_amount)
);
```

---

## 4. Supporting Tables

### 4.1 Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES users(id),
    sender_id UUID REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(30) CHECK (category IN ('medication', 'appointment', 'lab', 'patient', 'system', 'inventory', 'billing')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    action_url VARCHAR(500), -- Link to take action
    action_taken BOOLEAN DEFAULT false,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notifications_recipient (recipient_id),
    INDEX idx_notifications_type (notification_type),
    INDEX idx_notifications_priority (priority),
    INDEX idx_notifications_read (is_read),
    INDEX idx_notifications_created (created_at)
);
```

### 4.2 Audit Log Table

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    patient_id UUID REFERENCES patients(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_user (user_id),
    INDEX idx_audit_patient (patient_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_resource (resource_type, resource_id),
    INDEX idx_audit_timestamp (timestamp)
);
```

### 4.3 System Configuration Table

```sql
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    modified_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_system_config_key (config_key)
);
```

---

## 5. Indexes and Performance

### 5.1 Primary Indexes
- All primary keys are automatically indexed
- Foreign key constraints create implicit indexes
- Unique constraints create unique indexes

### 5.2 Performance Indexes

**High-Cardinality Indexes**:
```sql
-- Patient search optimization
CREATE INDEX CONCURRENTLY idx_patients_full_name ON patients (first_name, last_name);
CREATE INDEX CONCURRENTLY idx_patients_dob_gender ON patients (date_of_birth, gender);

-- Appointment scheduling
CREATE INDEX CONCURRENTLY idx_appointments_doctor_schedule ON appointments (doctor_id, scheduled_time) WHERE status = 'scheduled';
CREATE INDEX CONCURRENTLY idx_appointments_patient_history ON appointments (patient_id, scheduled_time DESC);

-- Consultation workflow
CREATE INDEX CONCURRENTLY idx_consultations_active ON consultations (status) WHERE status = 'in_progress';
CREATE INDEX CONCURRENTLY idx_consultations_doctor_active ON consultations (doctor_id, status) WHERE status = 'in_progress';
```

**Partial Indexes**:
```sql
-- Active records only
CREATE INDEX CONCURRENTLY idx_active_appointments ON appointments (patient_id, scheduled_time) WHERE status IN ('scheduled', 'confirmed');
CREATE INDEX CONCURRENTLY idx_active_prescriptions ON prescriptions (patient_id, created_at) WHERE status NOT IN ('dispensed', 'cancelled');

-- Recent records
CREATE INDEX CONCURRENTLY idx_recent_lab_orders ON lab_orders (patient_id, ordered_at DESC) WHERE ordered_at > CURRENT_DATE - INTERVAL '90 days';
```

**Full-Text Search Indexes**:
```sql
-- Patient search
CREATE INDEX CONCURRENTLY idx_patients_fts ON patients USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || mrn));

-- Medical records search
CREATE INDEX CONCURRENTLY idx_medical_records_fts ON medical_records USING gin(to_tsvector('english', data::text)) WHERE is_active = true;
```

### 5.3 Index Maintenance

**Index Monitoring**:
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Identify unused indexes
SELECT indexrelname, tablename
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND schemaname = 'public';
```

---

## 6. Data Integrity and Constraints

### 6.1 Check Constraints

```sql
-- Email format validation
ALTER TABLE users ADD CONSTRAINT chk_users_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Date validations
ALTER TABLE patients ADD CONSTRAINT chk_patients_dob_future
    CHECK (date_of_birth <= CURRENT_DATE);

ALTER TABLE appointments ADD CONSTRAINT chk_appointments_future
    CHECK (scheduled_time > CURRENT_TIMESTAMP);

-- Status transition validations
ALTER TABLE prescriptions ADD CONSTRAINT chk_prescription_status_flow
    CHECK (status IN ('pending', 'sent_to_pharmacy', 'processing', 'ready', 'dispensed', 'cancelled'));
```

### 6.2 Foreign Key Constraints

```sql
-- Cascade deletes for patient data
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;

-- Restrict deletes for user data
ALTER TABLE consultations ADD CONSTRAINT fk_consultations_doctor
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE RESTRICT;
```

### 6.3 Triggers

**Audit Trigger**:
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS trigger AS $$
BEGIN
    INSERT INTO audit_log (
        user_id, patient_id, action, resource_type, resource_id,
        old_values, new_values, timestamp
    ) VALUES (
        NEW.modified_by, NEW.patient_id, TG_OP, TG_TABLE_NAME, NEW.id,
        CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_patients_trigger
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

**Data Validation Triggers**:
```sql
-- Auto-calculate billing balance
CREATE OR REPLACE FUNCTION update_billing_balance() RETURNS trigger AS $$
BEGIN
    NEW.balance = NEW.total_amount - COALESCE(NEW.paid_amount, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_billing_balance
    BEFORE INSERT OR UPDATE ON billing_records
    FOR EACH ROW EXECUTE FUNCTION update_billing_balance();
```

---

## 7. Data Archiving and Retention

### 7.1 Archival Strategy

**Table Partitioning**:
```sql
-- Partition large tables by date
CREATE TABLE appointments_y2025m01 PARTITION OF appointments
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Automatic partitioning
CREATE TABLE medical_records PARTITION BY RANGE (recorded_at);
```

**Archival Process**:
```sql
-- Move old records to archive
INSERT INTO medical_records_archive
SELECT * FROM medical_records
WHERE recorded_at < CURRENT_DATE - INTERVAL '7 years';

DELETE FROM medical_records
WHERE recorded_at < CURRENT_DATE - INTERVAL '7 years';
```

### 7.2 Retention Policies

| Data Type | Active Retention | Archive Retention | Legal Hold |
|-----------|------------------|-------------------|------------|
| Patient Records | 7 years | 20 years | Indefinite |
| Consultations | 7 years | 20 years | Indefinite |
| Prescriptions | 7 years | 20 years | Indefinite |
| Lab Results | 7 years | 20 years | Indefinite |
| Billing Records | 7 years | 20 years | Indefinite |
| Audit Logs | 7 years | 20 years | Indefinite |
| System Logs | 2 years | 5 years | N/A |

---

## 8. Backup and Recovery

### 8.1 Backup Strategy

**Full Backups**:
- Daily full backups at 2:00 AM
- Compressed and encrypted
- Stored in primary and secondary locations
- Retention: 30 days

**Incremental Backups**:
- Hourly incremental backups
- Transaction log backups every 15 minutes
- Retention: 7 days

**Configuration Backups**:
- Schema and configuration backups
- Daily automated backups
- Version-controlled storage

### 8.2 Recovery Procedures

**Point-in-Time Recovery**:
```sql
-- Restore to specific timestamp
pg_restore -d hims_db -t 2025-01-15_14:30:00 backup_file.dump
```

**Disaster Recovery**:
1. Activate backup database instance
2. Restore latest backup
3. Apply transaction logs
4. Update DNS to point to backup instance
5. Validate system functionality

---

## 9. Sample Data

### 9.1 Development Data

**Sample Patient**:
```sql
INSERT INTO patients (mrn, first_name, last_name, date_of_birth, gender, phone, email)
VALUES ('MRN001', 'John', 'Doe', '1980-05-15', 'male', '+1-555-0123', 'john.doe@email.com');
```

**Sample User**:
```sql
INSERT INTO users (username, email, password_hash, role, first_name, last_name)
VALUES ('dr.smith', 'dr.smith@hims.com', '$2b$10$...', 'doctor', 'Dr.', 'Smith');
```

### 9.2 Test Scenarios

**Complete Patient Journey**:
1. Patient registration
2. Appointment booking
3. Check-in and vitals recording
4. Consultation workflow
5. Prescription creation
6. Lab order placement
7. Billing and payment

---

## 10. Database Maintenance

### 10.1 Routine Maintenance

**Daily Tasks**:
```sql
-- Update table statistics
ANALYZE VERBOSE;

-- Vacuum tables to reclaim space
VACUUM (ANALYZE, VERBOSE);

-- Reindex tables with high fragmentation
REINDEX TABLE CONCURRENTLY medical_records;
```

**Weekly Tasks**:
```sql
-- Check for table bloat
SELECT schemaname, tablename, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;

-- Archive old data
CALL archive_old_records();
```

### 10.2 Performance Monitoring

**Query Performance**:
```sql
-- Identify slow queries
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check for missing indexes
SELECT
    schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public' AND correlation < 0.5;
```

---

## 11. Security Considerations

### 11.1 Data Encryption

**At Rest**:
- Transparent Data Encryption (TDE) for PostgreSQL
- Encrypted backups
- Secure key management with AWS KMS

**In Transit**:
- TLS 1.3 for all connections
- Certificate-based authentication
- VPN for administrative access

### 11.2 Access Controls

**Row-Level Security**:
```sql
-- Enable RLS on sensitive tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors
CREATE POLICY doctor_patient_access ON patients
    FOR ALL USING (
        id IN (
            SELECT patient_id FROM appointments
            WHERE doctor_id = current_user_id()
        )
    );
```

**Data Masking**:
```sql
-- Mask sensitive data in non-production environments
CREATE VIEW patients_masked AS
SELECT
    id,
    mrn,
    first_name,
    last_name,
    date_of_birth,
    CASE WHEN current_setting('app.environment') = 'production'
         THEN phone ELSE 'XXX-XXX-' || RIGHT(phone, 4) END as phone,
    CASE WHEN current_setting('app.environment') = 'production'
         THEN email ELSE LEFT(email, 3) || '***' || RIGHT(email, POSITION('@' IN REVERSE(email))) END as email
FROM patients;
```

---

## 12. Approval and Sign-off

**Database Administrator**: ___________________________ Date: ____________

**Data Architect**: ___________________________ Date: ____________

**Security Officer**: ___________________________ Date: ____________

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026  
**Document Owner**: Database Administration Team