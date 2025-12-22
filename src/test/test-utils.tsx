import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import patientReducer from '@/store/patientSlice';
import appointmentReducer from '@/store/appointmentSlice';
import notificationReducer from '@/store/notificationSlice';
import prescriptionReducer from '@/store/prescriptionSlice';

// Create test store with optional preloaded state
export const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      patients: patientReducer,
      appointments: appointmentReducer,
      notifications: notificationReducer,
      prescriptions: prescriptionReducer,
    },
    preloadedState,
  });
};

// Wrapper component with all providers
interface WrapperProps {
  children: ReactNode;
  store?: ReturnType<typeof createTestStore>;
}

export const TestWrapper = ({ children, store }: WrapperProps) => {
  const testStore = store || createTestStore();
  return (
    <Provider store={testStore}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestWrapper store={store}>{children}</TestWrapper>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
