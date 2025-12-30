# Frontend Documentation
## AROCORD-HIMS (Healthcare Information Management System)

**Project Name**: AROCORD-HIMS
**Version**: 2.3
**Date**: December 2025
**Status**: Production Ready (90% Complete)

---

## 1. Frontend Architecture Overview

### 1.1 Technology Stack
- **Framework**: React 18.2.0 with TypeScript 5.7.2
- **Build Tool**: Vite 5.0 for fast development and optimized production builds
- **State Management**: Redux Toolkit 2.0 with RTK Query for API state management
- **Routing**: React Router 6.4 with protected routes and role-based access
- **UI Library**: Custom component library with Tailwind CSS 3.3
- **Testing**: Vitest for unit testing, Playwright for E2E testing
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### 1.2 Architecture Patterns
- **Component-Based Architecture**: Reusable, composable UI components
- **Container/Presentational Pattern**: Separation of logic and presentation
- **Custom Hooks**: Encapsulated component logic and API interactions
- **Context Providers**: Global state management for themes, notifications, and user context
- **Higher-Order Components**: Authentication and authorization wrappers

---

## 2. Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   ├── forms/           # Form components and validation
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   ├── medical/         # Healthcare-specific components
│   └── shared/          # Shared utilities and helpers
├── pages/               # Page components and route handlers
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages by role
│   ├── patients/        # Patient management pages
│   ├── consultations/   # Consultation workflow pages
│   └── admin/           # Administrative pages
├── hooks/               # Custom React hooks
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices for different domains
│   └── api/             # RTK Query API definitions
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions
├── constants/           # Application constants and configurations
├── services/            # API service layer
└── styles/              # Global styles and theme definitions
```

---

## 3. Core Components

### 3.1 UI Components

#### **Button Component**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  children
}) => {
  // Implementation with proper accessibility and loading states
};
```

#### **Input Component**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  value: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  error,
  required = false,
  disabled = false,
  onChange,
  onBlur
}) => {
  // Implementation with validation and accessibility
};
```

### 3.2 Form Components

#### **Consultation Form**
```typescript
const ConsultationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ConsultationData>({});

  const handleStepSubmit = async (stepData: any) => {
    // Auto-save logic
    await consultationApi.saveStep({
      consultationId: formData.id,
      step,
      data: stepData
    });

    // Update local state
    setFormData(prev => ({ ...prev, ...stepData }));

    // Move to next step or complete
    if (step < 11) {
      setStep(step + 1);
    } else {
      await completeConsultation(formData);
    }
  };

  return (
    <ConsultationLayout currentStep={step}>
      <StepRenderer
        step={step}
        data={formData}
        onSubmit={handleStepSubmit}
        onPrevious={() => setStep(step - 1)}
      />
    </ConsultationLayout>
  );
};
```

### 3.3 Layout Components

#### **Responsive Layout**
```typescript
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user?.role}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
```

---

## 4. State Management

### 4.1 Redux Store Structure

#### **Store Configuration**
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { himsApi } from './api/himsApi';
import uiSlice from './slices/uiSlice';
import notificationSlice from './slices/notificationSlice';
import consultationSlice from './slices/consultationSlice';

export const store = configureStore({
  reducer: {
    [himsApi.reducerPath]: himsApi.reducer,
    ui: uiSlice,
    notifications: notificationSlice,
    consultation: consultationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(himsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### **API Integration with RTK Query**
```typescript
// store/api/himsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const himsApi = createApi({
  reducerPath: 'himsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: (params) => ({ url: 'patients', params }),
      providesTags: ['Patients'],
    }),
    createPatient: builder.mutation({
      query: (patient) => ({
        url: 'patients',
        method: 'POST',
        body: patient,
      }),
      invalidatesTags: ['Patients'],
    }),
    // Additional endpoints...
  }),
});
```

### 4.2 Custom Hooks

#### **Authentication Hook**
```typescript
// hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, refreshToken } from '../store/slices/authSlice';
import type { RootState } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRefreshToken = () => {
    dispatch(refreshToken());
  };

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    isAuthenticated: !!token,
  };
};
```

#### **Consultation Workflow Hook**
```typescript
// hooks/useConsultation.ts
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateStep,
  completeConsultation,
  saveProgress
} from '../store/slices/consultationSlice';

export const useConsultation = (consultationId: string) => {
  const dispatch = useDispatch();
  const consultation = useSelector(
    (state: RootState) => state.consultation.current
  );

  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const updateConsultationStep = useCallback(async (stepData: any) => {
    try {
      setAutoSaveStatus('saving');
      await dispatch(updateStep({ consultationId, stepData })).unwrap();
      setAutoSaveStatus('saved');

      // Reset status after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      throw error;
    }
  }, [consultationId, dispatch]);

  const completeConsultationFlow = useCallback(async () => {
    await dispatch(completeConsultation(consultationId)).unwrap();
  }, [consultationId, dispatch]);

  return {
    consultation,
    autoSaveStatus,
    updateStep: updateConsultationStep,
    completeConsultation: completeConsultationFlow,
  };
};
```

---

## 5. Routing and Navigation

### 5.1 Route Configuration

#### **Protected Routes**
```typescript
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  requireAuth = true
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

#### **Role-Based Routing**
```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Role-based route components
import DoctorDashboard from './pages/doctor/Dashboard';
import NurseQueue from './pages/nurse/Queue';
import ReceptionistAppointments from './pages/receptionist/Appointments';
import AdminUsers from './pages/admin/Users';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Doctor Routes */}
        <Route path="/doctor/*" element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DoctorDashboard />} />
          <Route path="consultations" element={<ConsultationList />} />
          <Route path="patients" element={<PatientList />} />
        </Route>

        {/* Nurse Routes */}
        <Route path="/nurse/*" element={
          <ProtectedRoute roles={['nurse']}>
            <NurseLayout />
          </ProtectedRoute>
        }>
          <Route index element={<NurseQueue />} />
          <Route path="vitals" element={<VitalsEntry />} />
        </Route>

        {/* Additional role-based routes... */}
      </Routes>
    </BrowserRouter>
  );
};
```

---

## 6. Real-time Features

### 6.1 WebSocket Integration

#### **Notification System**
```typescript
// services/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(process.env.REACT_APP_WS_URL!, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('notification', this.handleNotification);
    this.socket.on('consultation-update', this.handleConsultationUpdate);
    this.socket.on('queue-update', this.handleQueueUpdate);
  }

  private handleNotification = (notification: Notification) => {
    // Dispatch to Redux store
    store.dispatch(addNotification(notification));
  };

  private handleConsultationUpdate = (update: ConsultationUpdate) => {
    // Update consultation state
    store.dispatch(updateConsultation(update));
  };

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();
```

### 6.2 Real-time Dashboard Updates

#### **Live Queue Monitoring**
```typescript
// components/QueueStatus.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQueueStatus } from '../store/slices/queueSlice';

const QueueStatus: React.FC = () => {
  const dispatch = useDispatch();
  const queueStatus = useSelector((state: RootState) => state.queue.status);

  useEffect(() => {
    // Subscribe to queue updates
    const unsubscribe = wsService.subscribe('queue-update', (update) => {
      dispatch(updateQueueStatus(update));
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="queue-status">
      <h3>Current Queue Status</h3>
      <div className="status-grid">
        <StatusCard
          title="Waiting Patients"
          value={queueStatus.waiting}
          trend={queueStatus.waitingTrend}
        />
        <StatusCard
          title="In Consultation"
          value={queueStatus.inConsultation}
          trend={queueStatus.consultationTrend}
        />
        <StatusCard
          title="Average Wait Time"
          value={`${queueStatus.avgWaitTime} min`}
          trend={queueStatus.waitTimeTrend}
        />
      </div>
    </div>
  );
};
```

---

## 7. Performance Optimization

### 7.1 Code Splitting

#### **Route-Based Splitting**
```typescript
// pages/index.ts
import { lazy } from 'react';

// Lazy load pages for better initial bundle size
export const DoctorDashboard = lazy(() => import('./doctor/Dashboard'));
export const PatientList = lazy(() => import('./patients/PatientList'));
export const ConsultationWorkflow = lazy(() => import('./consultations/Workflow'));
export const AdminAnalytics = lazy(() => import('./admin/Analytics'));

// Loading component
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);
```

#### **Component Splitting**
```typescript
// components/ConsultationForm.tsx
import { Suspense, lazy } from 'react';

const VitalSignsForm = lazy(() => import('./forms/VitalSignsForm'));
const SymptomsForm = lazy(() => import('./forms/SymptomsForm'));
const DiagnosisForm = lazy(() => import('./forms/DiagnosisForm'));

const ConsultationForm: React.FC<{ step: number }> = ({ step }) => {
  const renderStepForm = () => {
    switch (step) {
      case 2:
        return <VitalSignsForm />;
      case 3:
        return <SymptomsForm />;
      case 4:
        return <DiagnosisForm />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <Suspense fallback={<FormSkeleton />}>
      {renderStepForm()}
    </Suspense>
  );
};
```

### 7.2 Caching Strategies

#### **API Response Caching**
```typescript
// hooks/useCachedQuery.ts
import { useQuery } from '@reduxjs/toolkit/query/react';
import { skipToken } from '@reduxjs/toolkit/query';

export const useCachedQuery = (query: any, options: any = {}) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
    ...queryOptions
  } = options;

  return useQuery(query, {
    ...queryOptions,
    refetchOnMountOrArgChange: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
```

### 7.3 Image Optimization

#### **Responsive Images**
```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate responsive image URLs
    const responsiveSrc = generateResponsiveSrc(src, width);
    setImageSrc(responsiveSrc);
  }, [src, width]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={() => setIsLoading(false)}
      style={{ display: isLoading ? 'none' : 'block' }}
    />
  );
};
```

---

## 8. Testing Strategy

### 8.1 Unit Testing

#### **Component Testing**
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('opacity-50');
  });
});
```

#### **Hook Testing**
```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { Provider } from 'react-redux';
import { store } from '../../store';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useAuth', () => {
  it('returns authentication state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('handles login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        username: 'test@example.com',
        password: 'password'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### 8.2 Integration Testing

#### **E2E Testing with Playwright**
```typescript
// e2e/consultation-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Consultation Workflow', () => {
  test('completes full consultation process', async ({ page }) => {
    // Login as doctor
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'dr.smith');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    // Navigate to consultation
    await page.click('[data-testid="start-consultation"]');

    // Complete step 1: Patient Overview
    await page.fill('[data-testid="chief-complaint"]', 'Headache and fatigue');
    await page.click('[data-testid="next-step"]');

    // Complete step 2: Vital Signs
    await page.fill('[data-testid="blood-pressure"]', '120/80');
    await page.fill('[data-testid="heart-rate"]', '72');
    await page.fill('[data-testid="temperature"]', '98.6');
    await page.click('[data-testid="save-vitals"]');

    // Verify auto-save
    await expect(page.locator('[data-testid="auto-save-indicator"]'))
      .toHaveText('Saved');

    // Continue through remaining steps...
  });
});
```

---

## 9. Accessibility Implementation

### 9.1 ARIA Implementation

#### **Form Accessibility**
```typescript
// components/AccessibleForm.tsx
const AccessibleForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form
      role="form"
      aria-labelledby="form-title"
      noValidate
    >
      <h2 id="form-title">Patient Registration</h2>

      <div role="group" aria-labelledby="personal-info">
        <h3 id="personal-info">Personal Information</h3>

        <Input
          id="firstName"
          label="First Name"
          required
          aria-describedby={errors.firstName ? "firstName-error" : "firstName-help"}
          aria-invalid={!!errors.firstName}
        />

        {errors.firstName && (
          <div
            id="firstName-error"
            role="alert"
            aria-live="polite"
            className="error-message"
          >
            {errors.firstName}
          </div>
        )}

        <div id="firstName-help" className="help-text">
          Enter the patient's legal first name
        </div>
      </div>
    </form>
  );
};
```

### 9.2 Keyboard Navigation

#### **Focus Management**
```typescript
// hooks/useKeyboardNavigation.ts
import { useEffect, useRef } from 'react';

export const useKeyboardNavigation = (isOpen: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close modal
      }

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift+Tab: Move to previous focusable element
          if (document.activeElement === firstFocusableRef.current) {
            event.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          // Tab: Move to next focusable element
          if (document.activeElement === lastFocusableRef.current) {
            event.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    modalRef,
    firstFocusableRef,
    lastFocusableRef,
  };
};
```

---

## 10. Error Handling and Monitoring

### 10.1 Error Boundaries

#### **Global Error Boundary**
```typescript
// components/ErrorBoundary.tsx
import React from 'react';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to monitoring service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
```

### 10.2 Performance Monitoring

#### **Web Vitals Tracking**
```typescript
// utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const trackWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};

// Initialize in App.tsx
useEffect(() => {
  trackWebVitals();
}, []);
```

---

## 11. Build and Deployment

### 11.1 Build Configuration

#### **Vite Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          state: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### 11.2 Environment Configuration

#### **Environment Variables**
```typescript
// config/env.ts
const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  ENVIRONMENT: import.meta.env.MODE,
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
};

export default env;
```

---

## 12. Security Implementation

### 12.1 Client-Side Security

#### **XSS Prevention**
```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};
```

#### **CSRF Protection**
```typescript
// hooks/useCsrf.ts
import { useEffect, useState } from 'react';

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    const getCsrfToken = async () => {
      const response = await fetch('/api/csrf-token');
      const { token } = await response.json();
      setCsrfToken(token);
    };

    getCsrfToken();
  }, []);

  return csrfToken;
};
```

---

## 13. Mobile Responsiveness

### 13.1 Responsive Design Patterns

#### **Mobile-First Components**
```typescript
// components/MobileConsultationCard.tsx
const MobileConsultationCard: React.FC<ConsultationProps> = ({ consultation }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {consultation.patientName}
            </h3>
            <p className="text-xs text-gray-500">
              {consultation.appointmentTime}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Chief Complaint:</span>
              <span className="text-gray-900">{consultation.chiefComplaint}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <Badge status={consultation.status} />
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <Button size="sm" className="flex-1">
              Start Consultation
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 14. Internationalization

### 14.1 Multi-language Support

#### **i18n Configuration**
```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      navigation: {
        dashboard: 'Dashboard',
        patients: 'Patients',
        consultations: 'Consultations',
      },
      forms: {
        firstName: 'First Name',
        lastName: 'Last Name',
        save: 'Save',
      },
    },
  },
  es: {
    translation: {
      navigation: {
        dashboard: 'Panel de Control',
        patients: 'Pacientes',
        consultations: 'Consultas',
      },
      forms: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        save: 'Guardar',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

---

## 15. Offline Capability

### 15.1 Service Worker Implementation

#### **Offline Support**
```typescript
// public/service-worker.js
const CACHE_NAME = 'hims-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

#### **Offline Data Synchronization**
```typescript
// hooks/useOfflineSync.ts
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { syncOfflineData } from '../store/slices/offlineSlice';

export const useOfflineSync = () => {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      dispatch(syncOfflineData());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return { isOnline };
};
```

---

**Document Control**
**Version**: 1.0
**Last Updated**: December 2025
**Next Review**: March 2026
**Document Owner**: Frontend Development Team