# API Documentation
## AROCORD-HIMS Healthcare Information Management System

## Document Information
- **API Version**: v1.0
- **Base URL**: `https://api.hims.arocord.com/v1`
- **Documentation Version**: 1.0
- **Last Updated**: January 2025
- **Format**: RESTful API with JSON responses

---

## 1. Overview

### 1.1 Introduction
The AROCORD-HIMS API provides programmatic access to healthcare management functionality, enabling integration with external systems, mobile applications, and third-party healthcare providers.

### 1.2 API Principles
- **RESTful Design**: Resource-based URLs with standard HTTP methods
- **JSON Format**: All requests and responses use JSON
- **Versioning**: API versioning through URL paths
- **Stateless**: No server-side session state
- **Idempotent**: Safe retry of operations

### 1.3 Base URL
```
Production: https://api.hims.arocord.com/v1
Staging:    https://api-staging.hims.arocord.com/v1
Development: https://api-dev.hims.arocord.com/v1
```

---

## 2. Authentication

### 2.1 Authentication Methods

#### 2.1.1 JWT Bearer Token Authentication
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2.1.2 API Key Authentication (for system integrations)
```http
X-API-Key: your-api-key-here
Authorization: Bearer your-jwt-token
```

### 2.2 Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "doctor@example.com",
  "password": "securepassword",
  "remember_me": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "doctor@example.com",
      "first_name": "Sarah",
      "last_name": "Smith",
      "role": "doctor"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 3600,
      "token_type": "Bearer"
    }
  }
}
```

#### POST /auth/refresh
Refresh expired access token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Invalidate current session.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2.3 Role-Based Access Control

| Role | Permissions |
|------|-------------|
| patient | Read own records, book appointments, view bills |
| receptionist | CRUD patients, appointments, billing |
| nurse | Read/update assigned patients, record vitals |
| doctor | Full clinical access, prescribe medications |
| pharmacist | Process prescriptions, manage inventory |
| lab_technician | Process lab orders, enter results |
| administrator | Full system access |

---

## 3. API Endpoints

### 3.1 Patient Management

#### GET /patients
Retrieve paginated list of patients.

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page
- `search` (string): Search term for name, email, phone
- `sort_by` (string): Field to sort by (name, dob, created_at)
- `sort_order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "uuid",
        "mrn": "123456",
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1985-03-15",
        "gender": "male",
        "phone_primary": "(555) 123-4567",
        "email": "john.doe@email.com",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1250,
      "total_pages": 63
    }
  }
}
```

#### POST /patients
Create a new patient record.

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1985-03-15",
  "gender": "male",
  "phone_primary": "(555) 123-4567",
  "email": "john.doe@email.com",
  "address_line_1": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "postal_code": "12345",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "(555) 987-6543"
}
```

#### GET /patients/{id}
Retrieve detailed patient information.

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "uuid",
      "mrn": "123456",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1985-03-15",
      "gender": "male",
      "phone_primary": "(555) 123-4567",
      "email": "john.doe@email.com",
      "address": {
        "line_1": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "postal_code": "12345"
      },
      "emergency_contact": {
        "name": "Jane Doe",
        "relationship": "spouse",
        "phone": "(555) 987-6543"
      },
      "insurance": {
        "primary": {
          "provider": "Blue Cross",
          "policy_number": "BC123456",
          "group_number": "GRP001"
        }
      },
      "allergies": [
        {
          "id": "uuid",
          "allergen": "Penicillin",
          "severity": "severe",
          "reaction": "Anaphylaxis"
        }
      ],
      "medications": [
        {
          "id": "uuid",
          "name": "Lisinopril",
          "dosage": "10mg",
          "frequency": "Once daily"
        }
      ],
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### PUT /patients/{id}
Update patient information.

#### DELETE /patients/{id}
Deactivate patient record (soft delete).

### 3.2 Appointment Management

#### GET /appointments
Retrieve appointments with filtering.

**Query Parameters:**
- `patient_id` (uuid): Filter by patient
- `provider_id` (uuid): Filter by provider
- `date_from` (date): Start date filter
- `date_to` (date): End date filter
- `status` (string): Appointment status
- `department_id` (uuid): Department filter

#### POST /appointments
Schedule a new appointment.

**Request:**
```json
{
  "patient_id": "uuid",
  "provider_id": "uuid",
  "department_id": "uuid",
  "appointment_type": "General Consultation",
  "scheduled_date": "2024-01-20",
  "scheduled_time": "14:30:00",
  "duration_minutes": 30,
  "reason_for_visit": "Annual physical examination",
  "priority": "normal",
  "insurance_verified": true
}
```

#### PUT /appointments/{id}
Update appointment details.

#### PUT /appointments/{id}/status
Update appointment status.

**Request:**
```json
{
  "status": "checked_in",
  "notes": "Patient arrived 5 minutes early"
}
```

#### DELETE /appointments/{id}
Cancel appointment.

### 3.3 Consultation Management

#### GET /consultations
Retrieve consultations.

**Query Parameters:**
- `patient_id` (uuid): Filter by patient
- `provider_id` (uuid): Filter by provider
- `status` (string): Consultation status
- `date_from` (date): Start date
- `date_to` (date): End date

#### POST /consultations
Start a new consultation.

**Request:**
```json
{
  "appointment_id": "uuid",
  "patient_id": "uuid",
  "provider_id": "uuid",
  "consultation_type": "standard",
  "chief_complaint": "Headache for 3 days",
  "workflow_type": "adaptive"
}
```

#### GET /consultations/{id}
Retrieve consultation details with all steps.

**Response:**
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "uuid",
      "appointment_id": "uuid",
      "patient_id": "uuid",
      "provider_id": "uuid",
      "status": "in_progress",
      "current_step": 2,
      "started_at": "2024-01-15T14:30:00Z",
      "chief_complaint": "Headache for 3 days",
      "patient_overview": {
        "vitals": {
          "blood_pressure": "120/80",
          "heart_rate": 72,
          "temperature": 98.6
        },
        "allergies": ["Penicillin"],
        "current_medications": ["Lisinopril 10mg daily"]
      },
      "clinical_assessment": {
        "symptoms": [
          {
            "name": "headache",
            "severity": 7,
            "duration": "3 days",
            "description": "Frontal headache, worse with light"
          }
        ],
        "physical_exam": {
          "neurological": "Cranial nerves II-XII intact",
          "cardiovascular": "Regular rate and rhythm"
        }
      },
      "treatment_plan": {
        "diagnosis": [
          {
            "icd10_code": "R51",
            "description": "Headache",
            "primary": true
          }
        ],
        "plan": "Prescribe sumatriptan for acute relief, schedule follow-up"
      },
      "final_review": {
        "prescriptions": [
          {
            "medication_id": "uuid",
            "dosage": "50mg",
            "frequency": "As needed",
            "duration": "30 days"
          }
        ],
        "lab_orders": [
          {
            "test_code": "CBC",
            "priority": "routine"
          }
        ]
      }
    }
  }
}
```

#### PUT /consultations/{id}/step
Update consultation step data.

**Request:**
```json
{
  "step_number": 2,
  "step_data": {
    "symptoms": [
      {
        "name": "headache",
        "severity": 7,
        "location": "frontal",
        "duration": "3 days"
      }
    ]
  }
}
```

#### POST /consultations/{id}/complete
Complete consultation and trigger handoffs.

### 3.4 Prescription Management

#### GET /prescriptions
Retrieve prescriptions.

**Query Parameters:**
- `patient_id` (uuid): Filter by patient
- `provider_id` (uuid): Filter by provider
- `status` (string): Prescription status
- `priority` (string): Priority level

#### POST /prescriptions
Create a new prescription.

**Request:**
```json
{
  "consultation_id": "uuid",
  "patient_id": "uuid",
  "provider_id": "uuid",
  "medications": [
    {
      "medication_id": "uuid",
      "dosage": "500mg",
      "route": "oral",
      "frequency": "three_times_daily",
      "duration_days": 10,
      "quantity": 30,
      "instructions": "Take with food",
      "refills": 0
    }
  ],
  "priority": "normal",
  "notes": "Patient allergic to penicillin"
}
```

#### PUT /prescriptions/{id}/status
Update prescription status (pharmacy workflow).

**Request:**
```json
{
  "status": "dispensed",
  "pharmacist_id": "uuid",
  "dispensed_at": "2024-01-15T15:30:00Z",
  "counseling_provided": true,
  "notes": "Patient educated on proper usage"
}
```

### 3.5 Laboratory Management

#### GET /lab-orders
Retrieve laboratory orders.

#### POST /lab-orders
Create laboratory order.

**Request:**
```json
{
  "consultation_id": "uuid",
  "patient_id": "uuid",
  "provider_id": "uuid",
  "tests": [
    {
      "test_code": "CBC",
      "test_name": "Complete Blood Count",
      "priority": "routine",
      "clinical_notes": "Patient reports fatigue"
    },
    {
      "test_code": "CMP",
      "test_name": "Comprehensive Metabolic Panel",
      "priority": "routine"
    }
  ]
}
```

#### GET /lab-results
Retrieve laboratory results.

#### POST /lab-results
Enter laboratory results.

**Request:**
```json
{
  "lab_order_id": "uuid",
  "test_code": "CBC",
  "results": [
    {
      "component_code": "WBC",
      "component_name": "White Blood Cell Count",
      "value": "8.5",
      "unit": "K/uL",
      "reference_range": "4.0-11.0",
      "flag": "normal",
      "notes": ""
    },
    {
      "component_code": "HGB",
      "component_name": "Hemoglobin",
      "value": "14.2",
      "unit": "g/dL",
      "reference_range": "12.0-16.0",
      "flag": "normal"
    }
  ],
  "performed_by": "uuid",
  "performed_at": "2024-01-15T16:00:00Z",
  "status": "completed"
}
```

### 3.6 Billing and Insurance

#### GET /billing/records
Retrieve billing records.

#### POST /billing/records
Create billing record.

**Request:**
```json
{
  "consultation_id": "uuid",
  "patient_id": "uuid",
  "services": [
    {
      "cpt_code": "99201",
      "description": "Office visit, new patient",
      "quantity": 1,
      "unit_price": 150.00,
      "modifiers": []
    }
  ],
  "diagnoses": [
    {
      "icd10_code": "R51",
      "description": "Headache",
      "primary": true
    }
  ]
}
```

#### POST /billing/submit-claim
Submit insurance claim.

**Request:**
```json
{
  "billing_record_id": "uuid",
  "insurance_policy_id": "uuid",
  "claim_type": "professional",
  "date_of_service": "2024-01-15",
  "total_charges": 150.00,
  "diagnosis_codes": ["R51"],
  "procedure_codes": ["99201"]
}
```

### 3.7 Notification System

#### GET /notifications
Retrieve user notifications.

**Query Parameters:**
- `status` (string): read, unread, all
- `type` (string): appointment, medication, lab_result, etc.
- `limit` (integer): Number of notifications

#### PUT /notifications/{id}/read
Mark notification as read.

#### POST /notifications
Send notification (admin/system use).

**Request:**
```json
{
  "type": "appointment_reminder",
  "title": "Appointment Reminder",
  "message": "You have an appointment with Dr. Smith tomorrow at 2:00 PM",
  "recipients": ["uuid"],
  "channels": ["in_app", "email", "sms"],
  "priority": "normal",
  "action_url": "/appointments/uuid",
  "expires_at": "2024-01-16T14:00:00Z"
}
```

### 3.8 Analytics and Reporting

#### GET /analytics/dashboard
Retrieve dashboard metrics.

**Query Parameters:**
- `date_from` (date): Start date
- `date_to` (date): End date
- `department_id` (uuid): Department filter

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "total_patients": 1250,
      "active_patients": 1100,
      "appointments_today": 45,
      "average_wait_time": 12.5,
      "consultations_completed": 38,
      "prescriptions_dispensed": 67,
      "revenue_today": 8750.00
    },
    "charts": {
      "appointment_trends": [
        {"date": "2024-01-15", "scheduled": 45, "completed": 38}
      ],
      "department_utilization": [
        {"department": "Internal Medicine", "utilization": 85}
      ]
    }
  }
}
```

#### GET /reports/{report_type}
Generate specific reports.

**Supported Report Types:**
- `patient_demographics`
- `appointment_utilization`
- `provider_productivity`
- `revenue_analysis`
- `inventory_status`
- `quality_metrics`

### 3.9 User Management (Admin Only)

#### GET /admin/users
Retrieve system users.

#### POST /admin/users
Create new user account.

**Request:**
```json
{
  "email": "nurse@example.com",
  "first_name": "Emily",
  "last_name": "Johnson",
  "role": "nurse",
  "department_id": "uuid",
  "phone": "(555) 123-4567",
  "send_invitation": true
}
```

#### PUT /admin/users/{id}/permissions
Update user permissions.

#### POST /admin/users/{id}/reset-password
Reset user password.

---

## 4. Error Handling

### 4.1 HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### 4.2 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains validation errors",
    "details": {
      "field_errors": {
        "email": ["Email address is required"],
        "phone": ["Phone number must be valid"]
      }
    },
    "request_id": "req_123456789",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 4.3 Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `AUTHENTICATION_FAILED` | 401 | Invalid credentials |
| `AUTHORIZATION_FAILED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `RESOURCE_CONFLICT` | 409 | Resource already exists or conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVICE_UNAVAILABLE` | 503 | External service unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 5. Rate Limiting

### 5.1 Rate Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Patient CRUD | 100 requests | 1 minute |
| Appointment CRUD | 50 requests | 1 minute |
| Consultation updates | 30 requests | 1 minute |
| Search operations | 20 requests | 1 minute |
| Report generation | 5 requests | 1 hour |

### 5.2 Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

### 5.3 Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "retry_after": 60,
      "limit": 100,
      "window": "1 minute"
    }
  }
}
```

---

## 6. Pagination

### 6.1 Standard Pagination

All list endpoints support pagination with the following parameters:
- `page` (integer, default: 1): Page number (1-based)
- `limit` (integer, default: 20, max: 100): Items per page

### 6.2 Pagination Response Format

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1250,
      "total_pages": 63,
      "has_next": true,
      "has_prev": false,
      "next_page": 2,
      "prev_page": null
    }
  }
}
```

---

## 7. Filtering and Sorting

### 7.1 Common Filter Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Full-text search | `search=headache` |
| `status` | string | Status filter | `status=active` |
| `date_from` | date | Start date filter | `date_from=2024-01-01` |
| `date_to` | date | End date filter | `date_to=2024-01-31` |
| `priority` | string | Priority filter | `priority=high` |

### 7.2 Sorting Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `sort_by` | string | Field to sort by | `sort_by=created_at` |
| `sort_order` | string | Sort direction | `sort_order=desc` |

Supported sort fields vary by endpoint and are documented in each endpoint's reference.

---

## 8. Webhooks

### 8.1 Webhook Configuration

#### POST /webhooks
Register webhook endpoint.

**Request:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["appointment.created", "prescription.ready"],
  "secret": "webhook_secret_key",
  "active": true
}
```

### 8.2 Supported Events

| Event | Description | Payload |
|-------|-------------|---------|
| `patient.created` | New patient registered | Patient data |
| `appointment.scheduled` | Appointment booked | Appointment data |
| `consultation.completed` | Consultation finished | Consultation summary |
| `prescription.ready` | Prescription ready for pickup | Prescription data |
| `lab_result.ready` | Lab results available | Result data |
| `billing.invoice_ready` | Invoice generated | Billing data |

### 8.3 Webhook Payload Format

```json
{
  "event": "appointment.scheduled",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "appointment": {
      "id": "uuid",
      "patient_id": "uuid",
      "provider_id": "uuid",
      "scheduled_date": "2024-01-20",
      "scheduled_time": "14:30:00"
    }
  },
  "signature": "sha256=signature_here"
}
```

---

## 9. API Versioning

### 9.1 Version Strategy
- **URL Path Versioning**: `/v1/resource`
- **Backward Compatibility**: New versions are additive
- **Deprecation Policy**: 12-month deprecation notice
- **Sunset Policy**: 24-month support after deprecation

### 9.2 Version Headers

```http
Accept: application/json; version=1.0
X-API-Version: 1.0
```

---

## 10. SDKs and Libraries

### 10.1 Official SDKs

#### JavaScript/TypeScript SDK
```javascript
import { HIMSClient } from '@arocord/hims-sdk';

const client = new HIMSClient({
  baseURL: 'https://api.hims.arocord.com/v1',
  apiKey: 'your-api-key'
});

// Authenticate
const tokens = await client.auth.login('user@example.com', 'password');

// Get patients
const patients = await client.patients.list({ search: 'John' });
```

#### Python SDK
```python
from hims_sdk import HIMSClient

client = HIMSClient(
    base_url='https://api.hims.arocord.com/v1',
    api_key='your-api-key'
)

# Authenticate
tokens = client.auth.login('user@example.com', 'password')

# Get appointments
appointments = client.appointments.list(date_from='2024-01-01')
```

### 10.2 Third-Party Libraries
- **Postman Collection**: Pre-built API requests
- **OpenAPI Specification**: Import into API clients
- **Insomnia Workspace**: Pre-configured requests

---

## 11. Testing

### 11.1 Sandbox Environment
- **URL**: `https://api-sandbox.hims.arocord.com/v1`
- **Data**: Pre-populated with test data
- **Rate Limits**: Relaxed for testing
- **Notifications**: Disabled by default

### 11.2 Test Data
```json
{
  "test_patient": {
    "id": "test-patient-uuid",
    "mrn": "TEST001",
    "first_name": "Test",
    "last_name": "Patient"
  },
  "test_provider": {
    "id": "test-provider-uuid",
    "email": "test.doctor@example.com",
    "role": "doctor"
  }
}
```

---

## Appendix A: OpenAPI Specification

### Complete OpenAPI 3.0 Definition
```yaml
openapi: 3.0.3
info:
  title: AROCORD-HIMS API
  version: 1.0.0
  description: Healthcare Information Management System API

servers:
  - url: https://api.hims.arocord.com/v1
    description: Production server
  - url: https://api-staging.hims.arocord.com/v1
    description: Staging server

security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Patient:
      type: object
      properties:
        id:
          type: string
          format: uuid
        mrn:
          type: string
        first_name:
          type: string
        last_name:
          type: string
        date_of_birth:
          type: string
          format: date
        gender:
          type: string
          enum: [male, female, other, unknown]
        # ... additional properties

    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object

# Paths would be defined here...
```

## Appendix B: API Rate Limits by Plan

| Plan | Requests/Minute | Requests/Hour | Requests/Day |
|------|-----------------|----------------|--------------|
| Free | 60 | 1,000 | 5,000 |
| Basic | 300 | 10,000 | 50,000 |
| Professional | 1,000 | 50,000 | 200,000 |
| Enterprise | 5,000 | 250,000 | 1,000,000 |

## Appendix C: Changelog

### Version 1.0.0 (January 2025)
- Initial API release
- Core patient, appointment, and consultation endpoints
- Authentication and authorization
- Basic reporting and analytics

### Planned Features
- **v1.1.0**: Telemedicine endpoints, advanced analytics
- **v1.2.0**: FHIR R5 compliance, bulk operations
- **v2.0.0**: GraphQL support, real-time subscriptions

---

## Document Control

- **Version**: 1.0
- **Last Updated**: January 2025
- **API Version**: v1.0
- **Review Cycle**: Monthly with API updates
- **Document Owner**: API Development Team

---

**Approval Sign-off**

**API Architect**: ___________________________ Date: ____________

**Technical Lead**: ___________________________ Date: ____________

**Product Owner**: ___________________________ Date: ____________