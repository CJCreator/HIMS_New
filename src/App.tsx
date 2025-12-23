import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SignIn } from '@/pages/auth/SignIn';
import { TestPage } from '@/pages/TestPage';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { WebSocketProvider } from '@/components/WebSocketProvider';
import { EmergencyButton } from '@/components/EmergencyAlert';
import { DemoModeToggle } from '@/components/DemoModeToggle';
import { QuickAccessGuide } from '@/pages/QuickAccessGuide';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { NotFound } from '@/pages/NotFound';
import { PatientLogin } from '@/pages/patient-portal/PatientLogin';
import { PatientRegister } from '@/pages/patient-portal/PatientRegister';
import { BookAppointment } from '@/pages/public/BookAppointment';
import { Suspense, lazy } from 'react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

// Lazy load route components
const AdminRoutes = lazy(() => import('@/routes/AdminRoutes'));
const DoctorRoutes = lazy(() => import('@/routes/DoctorRoutes'));
const ReceptionistRoutes = lazy(() => import('@/routes/ReceptionistRoutes'));
const NurseRoutes = lazy(() => import('@/routes/NurseRoutes'));
const PharmacistRoutes = lazy(() => import('@/routes/PharmacistRoutes'));
const LabRoutes = lazy(() => import('@/routes/LabRoutes'));
const PatientRoutes = lazy(() => import('@/routes/PatientRoutes'));
const QueueRoutes = lazy(() => import('@/routes/QueueRoutes'));
const PatientRecordsRoutes = lazy(() => import('@/routes/PatientRecordsRoutes'));
const TelemedicineRoutes = lazy(() => import('@/routes/TelemedicineRoutes'));

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/quick-access" element={<QuickAccessGuide />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/" element={<Navigate to="/quick-access" replace />} />
          <Route path="/patient-register" element={<PatientRegister />} />

          <Route path="/*" element={
            <WebSocketProvider>
              <ResponsiveLayout>
                <Routes>
                <Route
                  path="/admin/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <AdminRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/doctor/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['doctor']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <DoctorRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/receptionist/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['receptionist']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <ReceptionistRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/nurse/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['nurse']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <NurseRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/pharmacist/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['pharmacist']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <PharmacistRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/lab/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['lab']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <LabRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/patient-portal/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['patient']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <PatientRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/queue/*"
                  element={
                    <RouteErrorBoundary>
                      <Suspense fallback={<LoadingSkeleton />}>
                        <QueueRoutes />
                      </Suspense>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/patient-records/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['doctor', 'nurse', 'admin']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <PatientRecordsRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                
                <Route
                  path="/telemedicine/*"
                  element={
                    <RouteErrorBoundary>
                      <ProtectedRoute allowedRoles={['doctor', 'patient']}>
                        <Suspense fallback={<LoadingSkeleton />}>
                          <TelemedicineRoutes />
                        </Suspense>
                      </ProtectedRoute>
                    </RouteErrorBoundary>
                  }
                />
                </Routes>
                <EmergencyButton />
                <DemoModeToggle />
              </ResponsiveLayout>
            </WebSocketProvider>
          } />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;