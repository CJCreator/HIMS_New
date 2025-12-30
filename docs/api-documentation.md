# API Documentation
## AROCORD-HIMS (Healthcare Information Management System)

**Project Name**: AROCORD-HIMS  
**Version**: 2.3  
**Date**: December 2025  
**Status**: Production Ready (90% Complete)  

---

## 1. Introduction

### 1.1 Overview
This API documentation provides comprehensive information about the AROCORD-HIMS RESTful APIs, including endpoints, request/response formats, authentication methods, and usage examples.

### 1.2 Base URL
```
Production: https://api.hims.arocord.com/v1
Staging: https://api-staging.hims.arocord.com/v1
Development: https://api-dev.hims.arocord.com/v1
```

### 1.3 Authentication
All API requests require authentication using JWT tokens.

**Header**: `Authorization: Bearer <jwt_token>`

---

## 2. Authentication APIs

### 2.1 Login
Authenticate user and receive JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "username": "dr.smith",
  "password": "secure_password",
  "mfa_code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "dr.smith",
      "email": "dr.smith@hims.com",
      "role": "doctor",
      "first_name": "Dr.",
      "last_name": "Smith"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 3600
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

### 2.2 Refresh Token
Refresh expired access token.

**Endpoint**: `POST /auth/refresh`

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2.3 Logout
Invalidate current session.

**Endpoint**: `POST /auth/logout`

---

## 3. Patient Management APIs

### 3.1 Get Patient List
Retrieve paginated list of patients.

**Endpoint**: `GET /patients`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `search`: Search term for name or MRN
- `status`: Filter by active status

**Response**:
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "uuid",
        "mrn": "MRN001",
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1980-05-15",
        "phone": "+1-555-0123",
        "email": "john.doe@email.com",
        "is_active": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### 3.2 Get Patient Details
Retrieve complete patient information.

**Endpoint**: `GET /patients/{id}`

**Response**:
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": "uuid",
      "mrn": "MRN001",
      "demographics": {
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1980-05-15",
        "gender": "male"
      },
      "contact": {
        "phone": "+1-555-0123",
        "email": "john.doe@email.com",
        "address": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345"
        }
      },
      "emergency_contact": {
        "name": "Jane Doe",
        "relationship": "spouse",
        "phone": "+1-555-0124"
      },
      "insurance": {
        "provider": "Blue Cross",
        "policy_number": "BC123456",
        "group_number": "GRP001"
      }
    }
  }
}
```

### 3.3 Create Patient
Register new patient.

**Endpoint**: `POST /patients`

**Request Body**:
```json
{
  "mrn": "MRN002",
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1985-03-20",
  "gender": "female",
  "phone": "+1-555-0125",
  "email": "jane.smith@email.com",
  "address": {
    "street": "456 Oak Ave",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "emergency_contact": {
    "name": "John Smith",
    "relationship": "spouse",
    "phone": "+1-555-0126"
  }
}
```

### 3.4 Update Patient
Modify patient information.

**Endpoint**: `PUT /patients/{id}`

**Request Body**: Same as create, partial updates allowed.

### 3.5 Get Patient Medical History
Retrieve patient's medical records.

**Endpoint**: `GET /patients/{id}/medical-history`

**Query Parameters**:
- `type`: Filter by record type (allergy, medication, diagnosis, etc.)
- `limit`: Number of records to return
- `offset`: Pagination offset

---

## 4. Appointment Management APIs

### 4.1 Get Appointments
Retrieve appointments with filtering.

**Endpoint**: `GET /appointments`

**Query Parameters**:
- `patient_id`: Filter by patient
- `doctor_id`: Filter by doctor
- `date_from`: Start date filter
- `date_to`: End date filter
- `status`: Appointment status filter

### 4.2 Create Appointment
Schedule new appointment.

**Endpoint**: `POST /appointments`

**Request Body**:
```json
{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "appointment_type": "consultation",
  "scheduled_time": "2025-01-15T10:00:00Z",
  "duration_minutes": 15,
  "notes": "Follow-up visit"
}
```

### 4.3 Update Appointment
Modify appointment details.

**Endpoint**: `PUT /appointments/{id}`

### 4.4 Cancel Appointment
Cancel an appointment.

**Endpoint**: `DELETE /appointments/{id}`

**Request Body**:
```json
{
  "cancellation_reason": "Patient requested cancellation",
  "notify_patient": true
}
```

---

## 5. Consultation APIs

### 5.1 Start Consultation
Initialize consultation workflow.

**Endpoint**: `POST /consultations`

**Request Body**:
```json
{
  "patient_id": "uuid",
  "appointment_id": "uuid",
  "workflow_type": "adaptive"
}
```

### 5.2 Get Consultation State
Retrieve current consultation progress.

**Endpoint**: `GET /consultations/{id}`

**Response**:
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "uuid",
      "patient_id": "uuid",
      "doctor_id": "uuid",
      "workflow_type": "adaptive",
      "current_step": 2,
      "total_steps": 11,
      "status": "in_progress",
      "step_data": {
        "patient_overview": { "completed": true },
        "vitals": { "completed": true, "data": { "bp": "120/80" } },
        "symptoms": { "in_progress": true }
      },
      "started_at": "2025-01-15T10:00:00Z"
    }
  }
}
```

### 5.3 Update Consultation Step
Save progress for current step.

**Endpoint**: `PUT /consultations/{id}/step`

**Request Body**:
```json
{
  "step_number": 2,
  "step_data": {
    "chief_complaint": "Headache and fatigue",
    "symptoms": [
      {
        "description": "Headache",
        "severity": "moderate",
        "duration": "3 days"
      }
    ]
  }
}
```

### 5.4 Complete Consultation
Finalize consultation and trigger notifications.

**Endpoint**: `POST /consultations/{id}/complete`

---

## 6. Prescription APIs

### 6.1 Create Prescription
Generate new prescription.

**Endpoint**: `POST /prescriptions`

**Request Body**:
```json
{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "consultation_id": "uuid",
  "medications": [
    {
      "drug_id": "uuid",
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "once daily",
      "duration": "30 days",
      "instructions": "Take with food",
      "quantity": 30,
      "refills": 3
    }
  ],
  "priority": "medium"
}
```

### 6.2 Get Prescription Queue
Retrieve prescriptions for pharmacy processing.

**Endpoint**: `GET /pharmacy/prescriptions`

**Query Parameters**:
- `status`: Filter by status (pending, processing, ready)
- `priority`: Filter by priority
- `limit`: Number of prescriptions to return

### 6.3 Process Prescription
Update prescription status in pharmacy.

**Endpoint**: `PUT /pharmacy/prescriptions/{id}/process`

**Request Body**:
```json
{
  "status": "ready",
  "notes": "Medication prepared and labeled",
  "ready_at": "2025-01-15T11:30:00Z"
}
```

### 6.4 Dispense Prescription
Mark prescription as dispensed.

**Endpoint**: `POST /pharmacy/prescriptions/{id}/dispense`

**Request Body**:
```json
{
  "dispensed_by": "uuid",
  "counseling_provided": true,
  "counseling_notes": "Patient educated on medication usage"
}
```

---

## 7. Laboratory APIs

### 7.1 Create Lab Order
Order laboratory tests.

**Endpoint**: `POST /lab/orders`

**Request Body**:
```json
{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "consultation_id": "uuid",
  "tests": [
    {
      "test_type": "Complete Blood Count",
      "test_code": "CBC",
      "priority": "routine",
      "specimen_type": "blood",
      "collection_instructions": "Fasting required"
    }
  ]
}
```

### 7.2 Get Lab Orders
Retrieve lab orders for processing.

**Endpoint**: `GET /lab/orders`

**Query Parameters**:
- `status`: Filter by status
- `priority`: Filter by priority
- `technician_id`: Filter by assigned technician

### 7.3 Enter Lab Results
Record test results.

**Endpoint**: `PUT /lab/orders/{id}/results`

**Request Body**:
```json
{
  "results": [
    {
      "test_code": "WBC",
      "value": "7.2",
      "unit": "K/uL",
      "reference_range": "4.0-11.0",
      "flag": "normal"
    },
    {
      "test_code": "HGB",
      "value": "14.1",
      "unit": "g/dL",
      "reference_range": "12.0-16.0",
      "flag": "normal"
    }
  ],
  "interpretation": "All values within normal range",
  "technician_id": "uuid",
  "completed_at": "2025-01-15T14:30:00Z"
}
```

---

## 8. Billing APIs

### 8.1 Create Invoice
Generate billing invoice.

**Endpoint**: `POST /billing/invoices`

**Request Body**:
```json
{
  "patient_id": "uuid",
  "consultation_id": "uuid",
  "charges": [
    {
      "description": "Office Visit - Level 3",
      "cpt_code": "99213",
      "quantity": 1,
      "unit_price": 150.00,
      "total": 150.00
    },
    {
      "description": "CBC with Differential",
      "cpt_code": "85025",
      "quantity": 1,
      "unit_price": 25.00,
      "total": 25.00
    }
  ],
  "due_date": "2025-02-15"
}
```

### 8.2 Process Payment
Record payment against invoice.

**Endpoint**: `POST /billing/payments`

**Request Body**:
```json
{
  "invoice_id": "uuid",
  "payment_method": "credit_card",
  "amount": 175.00,
  "payment_details": {
    "card_type": "visa",
    "last_four": "1234",
    "transaction_id": "txn_123456"
  }
}
```

### 8.3 Submit Insurance Claim
Submit claim to insurance provider.

**Endpoint**: `POST /billing/insurance-claims`

**Request Body**:
```json
{
  "invoice_id": "uuid",
  "insurance_provider": "Blue Cross",
  "policy_number": "BC123456",
  "diagnosis_codes": ["I10"],
  "procedure_codes": ["99213", "85025"]
}
```

---

## 9. Notification APIs

### 9.1 Get Notifications
Retrieve user notifications.

**Endpoint**: `GET /notifications`

**Query Parameters**:
- `status`: Filter by read/unread
- `priority`: Filter by priority level
- `category`: Filter by notification category
- `limit`: Number of notifications to return

**Response**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "info",
        "title": "Lab Results Available",
        "message": "CBC results for John Doe are ready for review",
        "priority": "medium",
        "category": "lab",
        "is_read": false,
        "created_at": "2025-01-15T14:30:00Z",
        "action_url": "/lab/results/123"
      }
    ],
    "unread_count": 5
  }
}
```

### 9.2 Mark Notification Read
Mark notification as read.

**Endpoint**: `PUT /notifications/{id}/read`

### 9.3 Send Notification
Create and send notification (Admin only).

**Endpoint**: `POST /notifications`

**Request Body**:
```json
{
  "recipient_ids": ["uuid1", "uuid2"],
  "type": "warning",
  "title": "System Maintenance",
  "message": "System will be unavailable from 2-4 AM",
  "priority": "high",
  "category": "system",
  "action_url": "/maintenance-schedule"
}
```

---

## 10. Analytics APIs

### 10.1 Get Dashboard Metrics
Retrieve KPI data for dashboards.

**Endpoint**: `GET /analytics/dashboard`

**Query Parameters**:
- `date_from`: Start date for metrics
- `date_to`: End date for metrics
- `role`: User role for role-specific metrics

**Response**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "total_patients": 1250,
      "active_appointments_today": 45,
      "average_wait_time": 15,
      "consultation_completion_rate": 92,
      "prescription_accuracy": 98,
      "patient_satisfaction": 4.6
    },
    "trends": {
      "patient_volume": [
        { "date": "2025-01-01", "count": 38 },
        { "date": "2025-01-02", "count": 42 }
      ]
    }
  }
}
```

### 10.2 Get Performance Reports
Generate detailed performance reports.

**Endpoint**: `GET /analytics/reports/{report_type}`

**Supported Report Types**:
- `appointment-utilization`
- `doctor-performance`
- `revenue-analysis`
- `patient-demographics`
- `queue-analytics`

**Query Parameters**:
- `date_from`: Report start date
- `date_to`: Report end date
- `group_by`: Grouping dimension (day, week, month)
- `filters`: Additional filters as JSON

### 10.3 Export Analytics Data
Export analytics data in various formats.

**Endpoint**: `GET /analytics/export`

**Query Parameters**:
- `report_type`: Type of data to export
- `format`: Export format (csv, excel, pdf)
- `date_from`: Start date
- `date_to`: End date

---

## 11. Patient Portal APIs

### 11.1 Patient Login
Authenticate patient portal user.

**Endpoint**: `POST /patient-portal/login`

**Request Body**:
```json
{
  "email": "patient@email.com",
  "password": "secure_password"
}
```

### 11.2 Get Patient Appointments
Retrieve patient's appointments.

**Endpoint**: `GET /patient-portal/appointments`

### 11.3 Book Appointment
Allow patient to book appointment.

**Endpoint**: `POST /patient-portal/appointments`

**Request Body**:
```json
{
  "doctor_id": "uuid",
  "appointment_type": "consultation",
  "preferred_date": "2025-01-20",
  "preferred_time": "10:00",
  "reason": "Follow-up visit"
}
```

### 11.4 Get Medical Records
Retrieve patient's medical history.

**Endpoint**: `GET /patient-portal/medical-records`

**Query Parameters**:
- `type`: Filter by record type
- `date_from`: Start date filter
- `date_to`: End date filter

### 11.5 Download Health Records
Generate downloadable health summary.

**Endpoint**: `GET /patient-portal/health-summary`

**Query Parameters**:
- `format`: Output format (pdf, json)
- `include_sensitive`: Include sensitive information

---

## 12. Error Handling

### 12.1 Standard Error Response
All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2025-01-15T10:30:00Z",
    "request_id": "req_123456"
  }
}
```

### 12.2 Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing credentials |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 13. Rate Limiting

### 13.1 Rate Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | per minute |
| Patient Search | 100 requests | per minute |
| Data Retrieval | 500 requests | per minute |
| Data Modification | 200 requests | per minute |
| Analytics | 50 requests | per minute |

### 13.2 Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

---

## 14. Webhooks

### 14.1 Webhook Configuration
Configure webhook endpoints for real-time notifications.

**Endpoint**: `POST /webhooks`

**Request Body**:
```json
{
  "url": "https://app.example.com/webhooks/hims",
  "events": ["appointment.created", "prescription.ready", "lab.results"],
  "secret": "webhook_secret_key",
  "active": true
}
```

### 14.2 Supported Events

| Event | Description | Payload |
|-------|-------------|---------|
| `appointment.created` | New appointment scheduled | Appointment data |
| `appointment.updated` | Appointment modified | Updated appointment data |
| `prescription.ready` | Prescription ready for pickup | Prescription data |
| `lab.results` | Lab results available | Lab results data |
| `billing.invoice` | Invoice generated | Invoice data |

### 14.3 Webhook Payload

```json
{
  "event": "appointment.created",
  "timestamp": "2025-01-15T10:00:00Z",
  "data": {
    "appointment": {
      "id": "uuid",
      "patient_id": "uuid",
      "doctor_id": "uuid",
      "scheduled_time": "2025-01-15T10:00:00Z"
    }
  },
  "signature": "sha256=..."
}
```

---

## 15. SDKs and Libraries

### 15.1 Official SDKs

**JavaScript/TypeScript SDK**:
```javascript
import { HIMSClient } from '@arocord/hims-sdk';

const client = new HIMSClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.hims.arocord.com/v1'
});

// Get patient list
const patients = await client.patients.list({ limit: 20 });

// Create appointment
const appointment = await client.appointments.create({
  patient_id: 'uuid',
  doctor_id: 'uuid',
  scheduled_time: '2025-01-15T10:00:00Z'
});
```

**Python SDK**:
```python
from hims_sdk import HIMSClient

client = HIMSClient(api_key='your_api_key')

# Get patient details
patient = client.patients.get('patient_id')

# Create prescription
prescription = client.prescriptions.create({
    'patient_id': 'uuid',
    'medications': [...]
})
```

### 15.2 Community Libraries

- **Go SDK**: `github.com/arocord/hims-go`
- **Java SDK**: `com.arocord:hims-java-sdk`
- **PHP SDK**: `arocord/hims-php-sdk`

---

## 16. Versioning and Deprecation

### 16.1 API Versioning
API versions are indicated in the URL path: `/v1/`, `/v2/`, etc.

### 16.2 Deprecation Policy

1. **Announcement**: Deprecations announced 6 months in advance
2. **Sunset Period**: Deprecated endpoints remain functional for 12 months
3. **Migration Support**: Migration guides and support provided
4. **Breaking Changes**: Only in major version updates

### 16.3 Version Headers

```
X-API-Version: v1
X-API-Deprecated: This endpoint will be removed in v2.0
X-API-Sunset: 2026-06-01
```

---

## 17. Testing and Sandbox

### 17.1 Sandbox Environment
Test API integrations in the sandbox environment:

**Base URL**: `https://api-sandbox.hims.arocord.com/v1`

**Features**:
- Sample data pre-loaded
- No real patient data
- Rate limits relaxed
- Error simulation capabilities

### 17.2 Test Data

**Sample Patient IDs**:
- `patient_001`: Adult male, comprehensive history
- `patient_002`: Pediatric patient
- `patient_003`: Geriatric patient with complex conditions

**Sample Doctor IDs**:
- `doctor_001`: Family medicine
- `doctor_002`: Cardiology
- `doctor_003`: Pediatrics

---

## 18. Support and Resources

### 18.1 Developer Portal
- **Documentation**: `https://developers.hims.arocord.com`
- **API Explorer**: Interactive API testing
- **Code Examples**: Sample implementations
- **Changelog**: API updates and changes

### 18.2 Support Channels

**Technical Support**:
- **Email**: api-support@arocord.com
- **Forum**: `https://community.hims.arocord.com`
- **Status Page**: `https://status.hims.arocord.com`

**Business Hours**:
- Monday - Friday: 9:00 AM - 6:00 PM EST
- Emergency Support: 24/7 for critical issues

### 18.3 Service Level Agreement (SLA)

**API Availability**: 99.9% uptime
**Response Time**: < 500ms for 95% of requests
**Support Response**: < 4 hours for critical issues
**Incident Resolution**: < 24 hours for high-priority issues

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026  
**Document Owner**: API Development Team