# System Architecture Document
## AROCORD-HIMS (Healthcare Information Management System)

**Project Name**: AROCORD-HIMS  
**Version**: 2.3  
**Date**: December 2025  
**Status**: Production Ready (90% Complete)  

---

## 1. Introduction

### 1.1 Purpose
This System Architecture Document (SAD) provides a comprehensive overview of the AROCORD-HIMS system architecture, including components, data flows, deployment architecture, and technical design decisions.

### 1.2 Scope
The SAD covers the overall system architecture, component interactions, data architecture, security architecture, and deployment considerations.

---

## 2. System Overview

### 2.1 Architecture Principles

#### **Microservices Architecture**
- **Modular Design**: Independent, loosely coupled services
- **Scalability**: Horizontal scaling of individual components
- **Technology Diversity**: Appropriate technology stack per service
- **Independent Deployment**: Services can be deployed independently

#### **Event-Driven Architecture**
- **Asynchronous Communication**: WebSocket-based real-time updates
- **Event Sourcing**: State changes tracked as events
- **Message Queues**: Reliable inter-service communication
- **Pub/Sub Pattern**: Broadcast notifications to multiple subscribers

#### **API-First Design**
- **RESTful APIs**: Standard HTTP methods and status codes
- **OpenAPI Specification**: Comprehensive API documentation
- **Versioning Strategy**: Semantic versioning for backward compatibility
- **Rate Limiting**: Protection against API abuse

---

## 3. Technology Stack

### 3.1 Frontend Architecture

#### **Core Framework**
- **React 18.3.1**: Component-based UI framework
- **TypeScript 5.7.2**: Type-safe JavaScript development
- **Vite 6.0.3**: Fast build tool and development server

#### **State Management**
- **Redux Toolkit 2.3.0**: Centralized state management
- **30+ Specialized Slices**: Domain-specific state management
- **RTK Query**: Data fetching and caching
- **Local Storage**: Client-side persistence

#### **UI/UX Framework**
- **Tailwind CSS 3.4.15**: Utility-first CSS framework
- **Headless UI**: Accessible UI components
- **Heroicons + Lucide React**: Icon library
- **Recharts**: Data visualization components

#### **Real-time Communication**
- **WebSocket**: Bidirectional communication
- **Custom WebSocket Provider**: Connection management
- **Real-time Notifications**: Instant updates across clients

### 3.2 Backend Architecture

#### **API Layer**
- **Node.js/Express**: RESTful API server
- **TypeScript**: Type-safe backend development
- **OpenAPI/Swagger**: API documentation and validation
- **JWT Authentication**: Secure token-based authentication

#### **Database Layer**
- **PostgreSQL**: Primary relational database
- **MongoDB**: Document storage for unstructured data
- **Redis**: Caching and session management
- **Database Sharding**: Horizontal scaling support

#### **Integration Layer**
- **HL7 FHIR**: Healthcare data exchange
- **EDI 837/835**: Insurance claims processing
- **NCPDP**: Pharmacy claims
- **REST/GraphQL**: Third-party integrations

---

## 4. Component Architecture

### 4.1 Frontend Components

#### **Core Components**
```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx       # Enhanced button with loading states
│   ├── Badge.tsx        # Multi-variant status indicators
│   ├── Modal.tsx        # Accessible modal dialogs
│   ├── Table.tsx        # Data tables with sorting/filtering
│   └── AdaptiveConsultationFlow.tsx
├── pages/               # Route-based page components
│   ├── doctor/          # Doctor-specific pages
│   ├── patient-portal/  # Patient portal pages
│   ├── pharmacy/        # Pharmacy management pages
│   └── admin/           # Administrative pages
├── hooks/               # Custom React hooks
│   ├── useConsultationState.ts
│   ├── useAutoSave.ts
│   └── useWebSocket.ts
├── store/               # Redux state management
│   ├── slices/          # Feature-specific slices
│   └── index.ts         # Store configuration
└── routes/              # Route definitions
```

#### **Component Hierarchy**
```
App (Root)
├── WebSocketProvider
├── ResponsiveLayout
│   ├── Sidebar (Navigation)
│   ├── Header (Notifications, User Menu)
│   └── Main Content Area
        ├── Route-based Pages
        └── Modal Overlays
```

### 4.2 Backend Components

#### **API Structure**
```
api/
├── controllers/         # Request handlers
├── services/           # Business logic
├── models/             # Data models
├── middleware/         # Authentication, validation
├── routes/             # API endpoints
└── utils/              # Helper functions
```

#### **Service Architecture**
- **Authentication Service**: User management and JWT tokens
- **Patient Service**: Patient data and medical records
- **Appointment Service**: Scheduling and calendar management
- **Consultation Service**: Workflow orchestration
- **Prescription Service**: Medication management
- **Notification Service**: Real-time messaging
- **Analytics Service**: Reporting and metrics

---

## 5. Data Architecture

### 5.1 Database Schema

#### **Core Entities**

**Patient Table**
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    mrn VARCHAR(20) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address JSONB,
    emergency_contact JSONB,
    insurance_info JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Medical Records**
```sql
CREATE TABLE medical_records (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    record_type VARCHAR(50), -- allergy, medication, diagnosis, etc.
    data JSONB,
    recorded_by UUID REFERENCES users(id),
    recorded_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

**Appointments**
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES users(id),
    scheduled_time TIMESTAMP,
    duration_minutes INTEGER,
    appointment_type VARCHAR(50),
    status VARCHAR(20), -- scheduled, completed, cancelled, no-show
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **Consultation Workflow**
```sql
CREATE TABLE consultations (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    workflow_type VARCHAR(20), -- standard, adaptive
    current_step INTEGER,
    step_data JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20)
);
```

#### **Prescriptions**
```sql
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES users(id),
    consultation_id UUID REFERENCES consultations(id),
    medications JSONB,
    priority VARCHAR(10), -- low, medium, high
    status VARCHAR(20), -- pending, processing, ready, dispensed
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 5.2 Data Flow Architecture

#### **Patient Journey Data Flow**
```
Patient Portal → API Gateway → Authentication Service
    ↓
Appointment Service → Database (Appointments)
    ↓
Notification Service → WebSocket → Frontend
    ↓
Consultation Service → Workflow Engine
    ↓
Prescription Service → Pharmacy Queue
    ↓
Billing Service → Payment Processing
```

#### **Real-time Data Synchronization**
```
Frontend Action → API Call → Service Layer
    ↓
Database Update → Event Publication
    ↓
Message Queue → Notification Service
    ↓
WebSocket Broadcast → Connected Clients
```

---

## 6. Security Architecture

### 6.1 Authentication Layer

#### **JWT Token Architecture**
```
Client Login → Credentials Validation → JWT Generation
    ↓
Token Storage (HttpOnly Cookie + LocalStorage)
    ↓
API Requests → Token Validation → User Context
    ↓
Role-Based Authorization → Resource Access
```

#### **Multi-Factor Authentication**
- **Primary Authentication**: Username/Password
- **Secondary Factors**: SMS OTP, Authenticator Apps
- **Admin Requirements**: Mandatory MFA for privileged accounts

### 6.2 Authorization Framework

#### **Role-Based Access Control (RBAC)**
```typescript
interface Permission {
  resource: string;
  action: string[]; // create, read, update, delete
  conditions?: object;
}

interface Role {
  name: string;
  permissions: Permission[];
  inherits?: string[]; // Role inheritance
}
```

#### **Permission Matrix**
| Role | Patient Records | Prescriptions | Appointments | Admin Functions |
|------|----------------|---------------|--------------|----------------|
| Patient | Own Only | Own Only | Own Only | None |
| Receptionist | All Patients | None | All | Limited |
| Nurse | Assigned Patients | None | None | None |
| Doctor | Assigned Patients | Create/Manage | Assigned | None |
| Pharmacist | None | All | None | Inventory |
| Admin | All | All | All | Full |

### 6.3 Data Protection

#### **Encryption Strategy**
- **Data at Rest**: AES-256 encryption for sensitive fields
- **Data in Transit**: TLS 1.3 for all communications
- **Key Management**: AWS KMS or equivalent HSM
- **Backup Encryption**: Encrypted backups with separate keys

#### **HIPAA Compliance Architecture**
```
Data Access → Audit Logging → Privacy Controls
    ↓
PHI Identification → Data Masking → Access Controls
    ↓
Retention Policies → Secure Deletion → Breach Detection
```

---

## 7. Integration Architecture

### 7.1 External System Integrations

#### **Healthcare Interoperability**
```
HIMS Core System
├── HL7 FHIR Server (Patient Data Exchange)
├── EDI 837/835 (Insurance Claims)
├── NCPDP (Pharmacy Claims)
├── DICOM (Medical Imaging)
└── LOINC/SNOMED (Clinical Terminology)
```

#### **Third-Party Services**
```
HIMS Core System
├── Payment Gateways (Stripe, PayPal)
├── SMS Services (Twilio, AWS SNS)
├── Email Services (SendGrid, AWS SES)
├── Drug Databases (Medi-Span, First DataBank)
└── Telemedicine Platforms (Zoom, WebRTC)
```

### 7.2 API Gateway Architecture

#### **API Gateway Responsibilities**
- **Request Routing**: Route requests to appropriate services
- **Authentication**: JWT validation and user context
- **Rate Limiting**: Protect against abuse
- **Request Transformation**: Data format conversion
- **Response Caching**: Improve performance
- **Logging & Monitoring**: Centralized API analytics

#### **API Gateway Configuration**
```yaml
routes:
  - path: /api/v1/patients
    service: patient-service
    methods: [GET, POST, PUT]
    auth: required
    rate_limit: 1000/minute

  - path: /api/v1/appointments
    service: appointment-service
    methods: [GET, POST, PUT, DELETE]
    auth: required
    cache: 300s
```

---

## 8. Deployment Architecture

### 8.1 Infrastructure Architecture

#### **Cloud Infrastructure**
```
Internet
    ↓
Cloud Load Balancer (ALB/ELB)
    ↓
API Gateway (Kong/KrakenD)
    ↓
Application Servers (ECS/EKS)
├── Frontend Service (Static Hosting)
├── Backend API Services
├── Background Workers
└── Real-time Services
    ↓
Database Layer
├── Primary PostgreSQL (RDS)
├── Read Replicas
├── Redis Cache
└── Document Store (MongoDB)
```

#### **Container Orchestration**
```yaml
services:
  frontend:
    image: arocord-hims/frontend:v2.3
    replicas: 3
    ports:
      - "80:80"
    environment:
      - API_URL=https://api.hims.com

  api:
    image: arocord-hims/api:v2.3
    replicas: 5
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
```

### 8.2 High Availability Architecture

#### **Multi-AZ Deployment**
```
Region 1 (us-east-1)
├── AZ-1a
│   ├── Application Servers (3)
│   ├── Database Primary
│   └── Load Balancer
├── AZ-1b
│   ├── Application Servers (3)
│   ├── Database Replica
│   └── Load Balancer
└── AZ-1c
    ├── Application Servers (3)
    └── Database Replica
```

#### **Disaster Recovery**
- **RTO (Recovery Time Objective)**: < 4 hours
- **RPO (Recovery Point Objective)**: < 1 hour
- **Backup Strategy**: Multi-region backups
- **Failover Process**: Automated DNS failover

---

## 9. Performance Architecture

### 9.1 Caching Strategy

#### **Multi-Level Caching**
```
Browser Cache → CDN → Application Cache → Database Cache
     ↓             ↓            ↓              ↓
Static Assets  API Responses  Computed Data   Query Results
```

#### **Redis Caching Layers**
- **Session Store**: User session data
- **API Response Cache**: Frequently accessed data
- **Computed Cache**: Analytics and reports
- **Rate Limiting**: API usage tracking

### 9.2 Database Optimization

#### **Indexing Strategy**
```sql
-- Composite indexes for common queries
CREATE INDEX idx_patient_appointments ON appointments(patient_id, scheduled_time);
CREATE INDEX idx_consultation_status ON consultations(status, created_at);

-- Partial indexes for active records
CREATE INDEX idx_active_prescriptions ON prescriptions(status) WHERE status != 'dispensed';

-- Full-text search indexes
CREATE INDEX idx_patient_search ON patients USING gin(to_tsvector('english', first_name || ' ' || last_name));
```

#### **Query Optimization**
- **Connection Pooling**: Efficient database connections
- **Read Replicas**: Offload read operations
- **Query Caching**: Cache frequently executed queries
- **Pagination**: Limit result sets for large datasets

---

## 10. Monitoring and Observability

### 10.1 Application Monitoring

#### **APM (Application Performance Monitoring)**
```
Application Metrics
├── Response Times
├── Error Rates
├── Throughput
├── Memory Usage
└── CPU Utilization

Business Metrics
├── User Activity
├── Feature Usage
├── Conversion Rates
└── SLA Compliance
```

#### **Distributed Tracing**
```
Request Flow Tracking
├── Frontend → API Gateway
├── API Gateway → Service
├── Service → Database
└── Service → External APIs
```

### 10.2 Infrastructure Monitoring

#### **System Metrics**
- **Server Monitoring**: CPU, Memory, Disk, Network
- **Database Monitoring**: Connections, Query Performance, Replication
- **Network Monitoring**: Latency, Packet Loss, Bandwidth
- **Container Monitoring**: Pod Health, Resource Usage

#### **Alert Management**
```yaml
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    severity: critical
    channels: [slack, pager-duty]

  - name: Database Connection Pool Exhausted
    condition: db_connections > 95%
    severity: warning
    channels: [email, slack]
```

---

## 11. Scalability Considerations

### 11.1 Horizontal Scaling

#### **Application Scaling**
- **Auto-scaling Groups**: Scale based on CPU utilization
- **Load Balancing**: Distribute traffic across instances
- **Session Affinity**: Sticky sessions for stateful operations
- **Circuit Breakers**: Prevent cascade failures

#### **Database Scaling**
- **Read Replicas**: Scale read operations
- **Sharding**: Distribute data across multiple instances
- **Connection Pooling**: Efficient connection management
- **Query Optimization**: Reduce database load

### 11.2 Performance Optimization

#### **Frontend Optimization**
- **Code Splitting**: Lazy load route components
- **Asset Optimization**: Compress and cache static assets
- **Bundle Analysis**: Identify and reduce bundle size
- **Progressive Loading**: Load critical resources first

#### **Backend Optimization**
- **Async Processing**: Handle long-running tasks asynchronously
- **Caching Layers**: Reduce database load
- **Database Indexing**: Optimize query performance
- **API Rate Limiting**: Prevent abuse and ensure fair usage

---

## 12. Security Architecture

### 12.1 Defense in Depth

#### **Network Security**
```
Internet → WAF → Load Balancer → API Gateway → Application
    ↓        ↓         ↓           ↓            ↓
DDoS     SQLi     SSL       Auth       RBAC
Protection Injection Termination  Check      Check
```

#### **Application Security**
- **Input Validation**: Comprehensive request validation
- **Output Encoding**: Prevent XSS attacks
- **CSRF Protection**: Token-based CSRF prevention
- **Security Headers**: HTTP security headers

### 12.2 Compliance Architecture

#### **HIPAA Security Controls**
```
Administrative Safeguards
├── Security Management Process
├── Assigned Security Responsibility
├── Workforce Security
├── Information Access Management
├── Security Awareness Training
└── Security Incident Procedures

Physical Safeguards
├── Facility Access Controls
├── Workstation Use
└── Device and Media Controls

Technical Safeguards
├── Access Control
├── Audit Controls
├── Integrity
├── Person or Entity Authentication
└── Transmission Security
```

---

## 13. Backup and Recovery

### 13.1 Backup Strategy

#### **Data Backup**
- **Full Backups**: Daily full database backups
- **Incremental Backups**: Hourly incremental backups
- **Log Backups**: Continuous transaction log backups
- **Configuration Backups**: Infrastructure as Code backups

#### **Backup Storage**
- **Primary Storage**: Encrypted cloud storage (S3, GCS)
- **Secondary Storage**: Cross-region replication
- **Long-term Retention**: Archive storage for compliance
- **Backup Validation**: Automated integrity checks

### 13.2 Disaster Recovery

#### **Recovery Strategies**
- **RTO/RPO Targets**: < 4 hours / < 1 hour for critical systems
- **Failover Procedures**: Automated failover to backup region
- **Data Recovery**: Point-in-time recovery capabilities
- **Application Recovery**: Blue-green deployment for zero downtime

---

## 14. Future Architecture Considerations

### 14.1 Microservices Evolution

#### **Service Decomposition**
```
Monolithic Application
    ↓
Service Extraction
├── Patient Management Service
├── Appointment Service
├── Consultation Service
├── Pharmacy Service
├── Billing Service
└── Notification Service
```

#### **Event-Driven Architecture**
```
Synchronous APIs → Asynchronous Events
    ↓
Request/Response → Publish/Subscribe
    ↓
Tight Coupling → Loose Coupling
```

### 14.2 Emerging Technologies

#### **AI/ML Integration**
- **Clinical Decision Support**: ML-powered diagnosis assistance
- **Predictive Analytics**: Patient outcome prediction
- **Natural Language Processing**: Clinical note processing
- **Computer Vision**: Medical image analysis

#### **Edge Computing**
- **IoT Integration**: Wearable device data processing
- **Real-time Analytics**: Edge-based data processing
- **Offline Capability**: Local data processing and synchronization

---

## 15. Approval and Sign-off

**Chief Technology Officer**: ___________________________ Date: ____________

**Solutions Architect**: ___________________________ Date: ____________

**DevOps Lead**: ___________________________ Date: ____________

**Security Architect**: ___________________________ Date: ____________

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026  
**Document Owner**: Architecture Team