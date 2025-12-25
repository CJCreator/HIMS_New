# Component Library Documentation

## Core Components

### Badge
Displays status, priority, or severity indicators.

**Usage:**
```tsx
import { Badge } from '@/components';

// Status badge
<Badge status="pending">Pending</Badge>

// Priority badge with icon
<Badge priority="urgent" showIcon>Urgent</Badge>

// Severity badge
<Badge severity="high">High Risk</Badge>
```

**Props:**
- `status?: BadgeStatus` - Status type (request, pending, sent, etc.)
- `priority?: 'low' | 'normal' | 'high' | 'urgent' | 'emergency'`
- `severity?: 'low' | 'medium' | 'high' | 'critical'`
- `showIcon?: boolean` - Display icon (default: false)
- `className?: string` - Additional CSS classes

---

### Button
Primary interactive element.

**Usage:**
```tsx
import { Button } from '@/components';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'danger'`
- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`
- `onClick?: () => void`

---

### Card
Container component for content grouping.

**Usage:**
```tsx
import { Card } from '@/components';

<Card className="p-4">
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

**Props:**
- `children: ReactNode`
- `className?: string`

---

### Input
Form input field with validation support.

**Usage:**
```tsx
import { Input } from '@/components';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

**Props:**
- `label?: string`
- `type?: string`
- `value: string`
- `onChange: (e) => void`
- `error?: string`
- `required?: boolean`

---

### Modal
Dialog overlay for focused interactions.

**Usage:**
```tsx
import { Modal } from '@/components';

<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `children: ReactNode`

---

## Enhanced Components

### EnhancedProgressTracker
Animated progress indicator for multi-step workflows.

**Usage:**
```tsx
import { EnhancedProgressTracker } from '@/components';

<EnhancedProgressTracker
  currentStep={2}
  steps={steps}
  onStepClick={(step) => navigateTo(step)}
/>
```

---

### SaveStatusIndicator
Real-time save status display.

**Usage:**
```tsx
import { SaveStatusIndicator } from '@/components';

<SaveStatusIndicator status="saved" lastSaved={new Date()} />
```

---

### DrugInteractionChecker
Automatic medication interaction detection.

**Usage:**
```tsx
import { DrugInteractionChecker } from '@/components';

<DrugInteractionChecker
  medications={medications}
  patientAllergies={allergies}
  onInteractionDetected={handleInteractions}
/>
```

---

## Hooks

### useAutoSave
Automatic data persistence with visual feedback.

**Usage:**
```tsx
import { useAutoSave } from '@/hooks/useAutoSave';

const { status, lastSaved, save } = useAutoSave(
  data,
  async (data) => await saveToServer(data),
  { interval: 30000 }
);
```

---

### useNavigationManager
Step validation and navigation warnings.

**Usage:**
```tsx
import { useNavigationManager } from '@/hooks/useNavigationManager';

const { canNavigateTo, getNavigationWarnings } = useNavigationManager(
  currentStep,
  consultationData
);
```

---

## Icons

All icons are from Lucide React. Import from centralized location:

```tsx
import { User, Calendar, Bell } from '@/components/icons';

<User className="w-5 h-5" />
```

---

## Styling Guidelines

### Colors
- Primary: `bg-primary`, `text-primary`
- Success: `bg-success`, `text-success`
- Warning: `bg-warning`, `text-warning`
- Error: `bg-error`, `text-error`

### Spacing
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px

### Border Radius
- small: 8px
- medium: 12px
- large: 16px

---

## Best Practices

1. **Always use TypeScript** - Define proper interfaces
2. **Accessibility** - Add ARIA labels and keyboard support
3. **Responsive** - Use mobile-first breakpoints
4. **Performance** - Lazy load heavy components
5. **Testing** - Write unit tests for reusable components

---

**Last Updated**: December 2024
