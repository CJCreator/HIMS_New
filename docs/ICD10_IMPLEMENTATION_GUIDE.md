# ICD-10 Integration Implementation Guide

## Quick Start

### 1. Installation & Setup

```bash
# No additional packages needed - uses existing dependencies
# Ensure Redux store is configured with icd10Slice
```

### 2. Import Required Components

```typescript
import { ICD10SearchAutocomplete } from '@/components/ICD10SearchAutocomplete';
import { ICD10Selector } from '@/components/ICD10Selector';
import { DiagnosisForm } from '@/components/DiagnosisForm';
import { icd10Service } from '@/services/icd10Service';
import { validateICD10Code } from '@/utils/icd10Validator';
```

### 3. Basic Usage Examples

#### Simple Search Autocomplete

```typescript
import { ICD10SearchAutocomplete } from '@/components/ICD10SearchAutocomplete';

function MyComponent() {
  const handleSelect = (code: ICD10Code) => {
    console.log('Selected code:', code);
  };

  return (
    <ICD10SearchAutocomplete
      onSelect={handleSelect}
      placeholder="Search diagnoses..."
      billableOnly={true}
    />
  );
}
```

#### Full Diagnosis Management

```typescript
import { DiagnosisForm } from '@/components/DiagnosisForm';

function ConsultationPage({ patientId, consultationId }) {
  const handleSave = async (diagnoses) => {
    // Save diagnoses to backend
    await api.post('/consultations/diagnoses', { diagnoses });
  };

  return (
    <DiagnosisForm
      patientId={patientId}
      consultationId={consultationId}
      onSave={handleSave}
      billableOnly={true}
    />
  );
}
```

#### Custom Diagnosis Selector

```typescript
import { ICD10Selector } from '@/components/ICD10Selector';
import { useState } from 'react';

function CustomDiagnosisManager() {
  const [diagnoses, setDiagnoses] = useState([]);

  const handleAdd = (diagnosis) => {
    setDiagnoses(prev => [...prev, { ...diagnosis, id: Date.now() }]);
  };

  const handleRemove = (id) => {
    setDiagnoses(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdate = (id, updates) => {
    setDiagnoses(prev => 
      prev.map(d => d.id === id ? { ...d, ...updates } : d)
    );
  };

  return (
    <ICD10Selector
      selectedCodes={diagnoses}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onUpdate={handleUpdate}
      maxCodes={10}
      requirePrimary={true}
    />
  );
}
```

## Integration Points

### 1. Doctor Consultation Flow

**File**: `src/pages/doctor/consultation/TreatmentPlanHub.tsx`

```typescript
import { DiagnosisForm } from '@/components/DiagnosisForm';

// Add to treatment plan step
<DiagnosisForm
  patientId={patientId}
  consultationId={consultationId}
  billableOnly={true}
  onSave={handleDiagnosisSave}
/>
```

### 2. Patient Records - Problem List

**File**: `src/pages/patient-records/ProblemList.tsx`

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatientDiagnoses } from '@/store/icd10Slice';

function ProblemList({ patientId }) {
  const dispatch = useDispatch();
  const { patientDiagnoses, loading } = useSelector(state => state.icd10);

  useEffect(() => {
    dispatch(fetchPatientDiagnoses(patientId));
  }, [patientId]);

  return (
    <div>
      {patientDiagnoses.map(diagnosis => (
        <DiagnosisCard key={diagnosis.id} diagnosis={diagnosis} />
      ))}
    </div>
  );
}
```

### 3. Billing Integration

**File**: `src/pages/receptionist/billing/InvoiceGeneration.tsx`

```typescript
import { icd10Service } from '@/services/icd10Service';

async function generateInvoice(consultationId) {
  // Fetch diagnoses for consultation
  const diagnoses = await icd10Service.getPatientDiagnoses(patientId);
  
  // Filter billable codes
  const billableDiagnoses = diagnoses.filter(d => 
    d.icd10Details?.isBillable && d.diagnosisType === 'primary'
  );
  
  // Include in invoice
  return {
    ...invoiceData,
    diagnoses: billableDiagnoses.map(d => ({
      code: d.icd10Code,
      description: d.icd10Details?.description
    }))
  };
}
```

### 4. Lab Orders

**File**: `src/pages/doctor/consultation/FinalReviewStation.tsx`

```typescript
// Link lab orders to diagnoses
function LabOrderForm({ patientId }) {
  const { patientDiagnoses } = useSelector(state => state.icd10);

  return (
    <div>
      <label>Diagnosis for Lab Order</label>
      <select>
        {patientDiagnoses.map(d => (
          <option key={d.id} value={d.icd10Code}>
            {d.icd10Code} - {d.icd10Details?.description}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### 5. Reporting & Analytics

**File**: `src/pages/admin/reports/DiagnosisReport.tsx`

```typescript
import { icd10Service } from '@/services/icd10Service';

async function generateDiagnosisReport(startDate, endDate) {
  const statistics = await icd10Service.getStatistics();
  
  // Generate report with diagnosis trends
  return {
    totalDiagnoses: statistics.totalCodes,
    topDiagnoses: await getTopDiagnoses(startDate, endDate),
    byCategory: await getDiagnosesByCategory(startDate, endDate)
  };
}
```

## API Integration

### Backend Endpoints Required

```typescript
// GET /api/icd10/search?q={query}&limit={limit}&billableOnly={boolean}
// Response: ICD10SearchResult[]

// GET /api/icd10/code/{code}?version={version}
// Response: ICD10Code

// POST /api/icd10/validate
// Body: { code: string, version?: string }
// Response: ICD10ValidationResult

// GET /api/icd10/popular?limit={limit}&specialty={specialty}
// Response: ICD10Code[]

// GET /api/patients/{patientId}/diagnoses
// Response: PatientDiagnosis[]

// POST /api/patients/{patientId}/diagnoses
// Body: Partial<PatientDiagnosis>
// Response: PatientDiagnosis

// PATCH /api/diagnoses/{diagnosisId}
// Body: Partial<PatientDiagnosis>
// Response: PatientDiagnosis

// DELETE /api/diagnoses/{diagnosisId}
// Response: 204 No Content
```

### Mock Data for Development

```typescript
// src/services/mockDataService.ts

export const mockICD10Codes: ICD10Code[] = [
  {
    id: '1',
    code: 'J20.9',
    description: 'Acute bronchitis, unspecified',
    shortDescription: 'Acute bronchitis',
    category: 'Diseases of the respiratory system',
    chapter: 'Chapter X',
    version: '2024',
    effectiveDate: '2023-10-01',
    isBillable: true,
    isActive: true,
    includes: ['Bronchitis NOS', 'Tracheobronchitis NOS'],
    excludes: ['Chronic bronchitis NOS (J42)']
  },
  // Add more mock codes...
];
```

## Validation Examples

### Client-Side Validation

```typescript
import { validateICD10Code, validateBusinessRules } from '@/utils/icd10Validator';

// Format validation
const formatResult = validateCodeFormat('J20.9');
if (!formatResult.isValid) {
  console.error(formatResult.error);
}

// Business rules validation
const businessResult = validateBusinessRules(code, {
  forBilling: true,
  patientAge: 45,
  patientGender: 'male'
});

if (businessResult.errors.length > 0) {
  console.error('Validation errors:', businessResult.errors);
}

if (businessResult.warnings.length > 0) {
  console.warn('Warnings:', businessResult.warnings);
}
```

### Server-Side Validation

```typescript
// Backend validation endpoint
app.post('/api/icd10/validate', async (req, res) => {
  const { code, version } = req.body;
  
  // Check format
  if (!isValidFormat(code)) {
    return res.status(400).json({
      isValid: false,
      errors: ['Invalid code format']
    });
  }
  
  // Check if code exists
  const codeData = await db.icd10Codes.findOne({ code, version });
  if (!codeData) {
    return res.status(404).json({
      isValid: false,
      errors: ['Code not found']
    });
  }
  
  // Check if active
  if (!codeData.isActive) {
    return res.json({
      isValid: true,
      warnings: ['Code is deprecated'],
      suggestions: await findReplacementCodes(code)
    });
  }
  
  res.json({ isValid: true, code: codeData });
});
```

## Testing

### Unit Tests

```typescript
// src/utils/__tests__/icd10Validator.test.ts

import { validateCodeFormat, validateBusinessRules } from '../icd10Validator';

describe('ICD-10 Validation', () => {
  test('validates correct code format', () => {
    expect(validateCodeFormat('J20.9').isValid).toBe(true);
    expect(validateCodeFormat('E11.65').isValid).toBe(true);
  });

  test('rejects invalid format', () => {
    expect(validateCodeFormat('123').isValid).toBe(false);
    expect(validateCodeFormat('J').isValid).toBe(false);
  });

  test('validates billable codes for billing', () => {
    const code = { isBillable: false } as ICD10Code;
    const result = validateBusinessRules(code, { forBilling: true });
    expect(result.errors).toContain(expect.stringContaining('not billable'));
  });
});
```

### Integration Tests

```typescript
// src/__tests__/integration/icd10.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ICD10SearchAutocomplete } from '@/components/ICD10SearchAutocomplete';

test('searches and selects ICD-10 code', async () => {
  const onSelect = jest.fn();
  render(<ICD10SearchAutocomplete onSelect={onSelect} />);
  
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'diabetes' } });
  
  await waitFor(() => {
    expect(screen.getByText(/E11.9/)).toBeInTheDocument();
  });
  
  fireEvent.click(screen.getByText(/E11.9/));
  expect(onSelect).toHaveBeenCalled();
});
```

## Performance Optimization

### Caching Strategy

```typescript
// Implement in icd10Service.ts
private cache = new Map<string, { data: any; timestamp: number }>();

async search(query: string) {
  const cacheKey = `search:${query}`;
  const cached = this.cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.data;
  }
  
  const data = await api.get('/icd10/search', { params: { q: query } });
  this.cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}
```

### Debouncing

```typescript
// Already implemented in ICD10SearchAutocomplete
const debouncedQuery = useDebounce(query, 300);
```

### Virtual Scrolling

```typescript
// For large result lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={searchResults.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <CodeResultItem code={searchResults[index]} />
    </div>
  )}
</FixedSizeList>
```

## Troubleshooting

### Common Issues

1. **Search not working**
   - Check API endpoint configuration
   - Verify Redux store includes icd10Slice
   - Check network requests in DevTools

2. **Validation errors**
   - Ensure code format is correct (e.g., "J20.9" not "j20.9")
   - Check if code exists in current version
   - Verify billable status for billing context

3. **Performance issues**
   - Enable caching in configuration
   - Reduce search debounce time
   - Implement virtual scrolling for large lists

4. **Type errors**
   - Ensure all ICD-10 types are imported from '@/types/icd10.types'
   - Check Redux store types match

## Best Practices

1. **Always validate codes** before saving
2. **Use billableOnly** flag for billing contexts
3. **Require primary diagnosis** for consultations
4. **Cache frequently used codes**
5. **Provide clear error messages** to users
6. **Log validation failures** for auditing
7. **Keep codes updated** with quarterly syncs
8. **Document clinical justification** in notes

## Support & Resources

- **Internal Documentation**: `/docs/ICD10_INTEGRATION_PLAN.md`
- **Type Definitions**: `/src/types/icd10.types.ts`
- **Configuration**: `/src/config/icd10.config.ts`
- **Validation Utils**: `/src/utils/icd10Validator.ts`

For questions or issues, contact the development team.
