import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SignIn } from '@/pages/auth/SignIn';
import { TestPage } from '@/pages/TestPage';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { UserManagement } from '@/pages/admin/UserManagement';
import { BedManagement } from '@/pages/admin/BedManagement';
import { Settings } from '@/pages/admin/Settings';
import { DoctorDashboard } from '@/pages/doctor/Dashboard';
import { PatientQueue } from '@/pages/doctor/PatientQueue';
import { ConsultationFlow } from '@/pages/doctor/consultation/ConsultationFlow';
import { DoctorAppointments } from '@/pages/doctor/Appointments';
import { DoctorProfile } from '@/pages/doctor/Profile';
import { PrescriptionHistory } from '@/pages/doctor/PrescriptionHistory';
import PrescriptionSignature from '@/pages/doctor/PrescriptionSignature';
import { ReceptionistDashboard } from '@/pages/receptionist/Dashboard';
import { AppointmentCalendar } from '@/pages/receptionist/appointments/AppointmentCalendar';
import { PatientRegistration } from '@/pages/receptionist/patients/PatientRegistration';
import { PatientList } from '@/pages/receptionist/patients/PatientList';
import { BillingDashboard } from '@/pages/receptionist/billing/BillingDashboard';
import { InvoiceGeneration } from '@/pages/receptionist/billing/InvoiceGeneration';
import { NurseDashboard } from '@/pages/nurse/Dashboard';
import { EnhancedNurseDashboard } from '@/pages/nurse/EnhancedDashboard';
import { VitalsEntry } from '@/pages/nurse/VitalsEntry';
import { PatientRecords } from '@/pages/nurse/PatientRecords';
import { MedicationRequest } from '@/pages/nurse/MedicationRequest';
import { PharmacyDashboard } from '@/pages/pharmacy/PharmacyDashboard';
import { EnhancedPharmacyDashboard } from '@/pages/pharmacy/EnhancedDashboard';
import { PrescriptionQueue } from '@/pages/pharmacy/PrescriptionQueue';
import { MedicationRequests } from '@/pages/pharmacy/MedicationRequests';
import { InventoryManagement } from '@/pages/pharmacy/InventoryManagement';
import { ExpiryAlerts } from '@/pages/pharmacy/ExpiryAlerts';
import { WardManagement } from '@/pages/nurse/WardManagement';
import { ShiftHandover } from '@/pages/nurse/ShiftHandover';
import { Analytics } from '@/pages/admin/Analytics';
import { Reports } from '@/pages/admin/Reports';
import { NotificationTemplates } from '@/pages/admin/NotificationTemplates';
import { QueueDisplay } from '@/pages/admin/QueueDisplay';
import { ReminderSettings } from '@/pages/admin/ReminderSettings';
import { PatientFeedback } from '@/pages/admin/PatientFeedback';
import { PatientLogin } from '@/pages/patient-portal/PatientLogin';
import { PatientDashboard } from '@/pages/patient-portal/PatientDashboard';
import { MyAppointments } from '@/pages/patient-portal/MyAppointments';
import { MyPrescriptions } from '@/pages/patient-portal/MyPrescriptions';
import { LabResults } from '@/pages/patient-portal/LabResults';
import { Feedback } from '@/pages/patient-portal/Feedback';
import RecordDownload from '@/pages/patient-portal/RecordDownload';
import HealthSummary from '@/pages/patient-portal/HealthSummary';
import MedicationAdherence from '@/pages/patient-portal/MedicationAdherence';
import SymptomChecker from '@/pages/patient-portal/SymptomChecker';
import SecureMessaging from '@/pages/patient-portal/SecureMessaging';
import DoctorPerformance from '@/pages/doctor/DoctorPerformance';
import AppointmentAnalytics from '@/pages/admin/AppointmentAnalytics';
import RevenueReports from '@/pages/receptionist/billing/RevenueReports';
import InventoryAnalytics from '@/pages/pharmacy/InventoryAnalytics';
import PatientDemographics from '@/pages/admin/PatientDemographics';
import InsuranceClaims from '@/pages/receptionist/billing/InsuranceClaims';
import APIDocumentation from '@/pages/admin/APIDocumentation';
import { SystemComparisonDashboard } from '@/pages/admin/SystemComparison';
import { ImplementationProgress } from '@/pages/admin/ImplementationProgress';
import { AllergyManagement } from '@/pages/patient-records/AllergyManagement';
import PatientTimeline from '@/pages/patient-records/PatientTimeline';
import ProblemList from '@/pages/patient-records/ProblemList';
import ImmunizationTracker from '@/pages/patient-records/ImmunizationTracker';
import RecurringAppointmentForm from '@/components/RecurringAppointmentForm';
import Waitlist from '@/pages/receptionist/Waitlist';
import PaymentPlans from '@/pages/receptionist/billing/PaymentPlans';
import ReorderManagement from '@/pages/pharmacy/ReorderManagement';
import BatchTracking from '@/pages/pharmacy/BatchTracking';
import { BookAppointment } from '@/pages/public/BookAppointment';
import { ClinicalSupport } from '@/pages/doctor/ClinicalSupport';
import { TelemedicineDashboard } from '@/pages/telemedicine/TelemedicineDashboard';
import { VirtualWaitingRoom } from '@/pages/telemedicine/VirtualWaitingRoom';
import { VideoConsultation } from '@/pages/telemedicine/VideoConsultation';
import { ConsultationScheduler } from '@/pages/telemedicine/ConsultationScheduler';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { WebSocketProvider } from '@/components/WebSocketProvider';
import { EmergencyButton } from '@/components/EmergencyAlert';
import { QuickAccessGuide } from '@/pages/QuickAccessGuide';

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

          <Route path="/*" element={
            <WebSocketProvider>
              <ResponsiveLayout>
                <Routes>
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="beds" element={<BedManagement />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="notifications" element={<NotificationTemplates />} />
                        <Route path="queue-display" element={<QueueDisplay />} />
                        <Route path="reminders" element={<ReminderSettings />} />
                        <Route path="feedback" element={<PatientFeedback />} />
                        <Route path="appointment-analytics" element={<AppointmentAnalytics />} />
                        <Route path="demographics" element={<PatientDemographics />} />
                        <Route path="api-docs" element={<APIDocumentation />} />
                        <Route path="system-comparison" element={<SystemComparisonDashboard />} />
                        <Route path="implementation-progress" element={<ImplementationProgress />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/doctor/*"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <Routes>
                        <Route index element={<DoctorDashboard />} />
                        <Route path="queue" element={<PatientQueue />} />
                        <Route path="consultation" element={<ConsultationFlow />} />
                        <Route path="consultation/:patientId" element={<ConsultationFlow />} />
                        <Route path="appointments" element={<DoctorAppointments />} />
                        <Route path="profile" element={<DoctorProfile />} />
                        <Route path="prescriptions" element={<PrescriptionHistory />} />
                        <Route path="prescription-signature" element={<PrescriptionSignature />} />
                        <Route path="performance" element={<DoctorPerformance />} />
                        <Route path="clinical-support" element={<ClinicalSupport />} />
                        <Route path="telemedicine" element={<TelemedicineDashboard />} />
                        <Route path="virtual-waiting-room" element={<VirtualWaitingRoom />} />
                        <Route path="video-consultation" element={<VideoConsultation />} />
                        <Route path="consultation-scheduler" element={<ConsultationScheduler />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/receptionist/*"
                  element={
                    <ProtectedRoute allowedRoles={['receptionist']}>
                      <Routes>
                        <Route index element={<ReceptionistDashboard />} />
                        <Route path="appointments" element={<AppointmentCalendar />} />
                        <Route path="patients" element={<PatientList />} />
                        <Route path="patients/register" element={<PatientRegistration />} />
                        <Route path="billing" element={<BillingDashboard />} />
                        <Route path="billing/invoice" element={<InvoiceGeneration />} />
                        <Route path="billing/payment-plans" element={<PaymentPlans />} />
                        <Route path="billing/revenue-reports" element={<RevenueReports />} />
                        <Route path="billing/insurance-claims" element={<InsuranceClaims />} />
                        <Route path="recurring-appointments" element={<RecurringAppointmentForm />} />
                        <Route path="waitlist" element={<Waitlist />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/nurse/*"
                  element={
                    <ProtectedRoute allowedRoles={['nurse']}>
                      <Routes>
                        <Route index element={<EnhancedNurseDashboard />} />
                        <Route path="dashboard-legacy" element={<NurseDashboard />} />
                        <Route path="vitals/:patientId" element={<VitalsEntry />} />
                        <Route path="vitals/new" element={<VitalsEntry />} />
                        <Route path="patients" element={<PatientRecords />} />
                        <Route path="allergy-management" element={<AllergyManagement />} />
                        <Route path="patient-timeline" element={<PatientTimeline />} />
                        <Route path="problem-list" element={<ProblemList />} />
                        <Route path="immunization" element={<ImmunizationTracker />} />
                        <Route path="medication-requests" element={<MedicationRequest />} />
                        <Route path="wards" element={<WardManagement />} />
                        <Route path="shift-handover" element={<ShiftHandover />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/pharmacist/*"
                  element={
                    <ProtectedRoute allowedRoles={['pharmacist']}>
                      <Routes>
                        <Route index element={<EnhancedPharmacyDashboard />} />
                        <Route path="dashboard-legacy" element={<PharmacyDashboard />} />
                        <Route path="prescriptions" element={<PrescriptionQueue />} />
                        <Route path="medication-requests" element={<MedicationRequests />} />
                        <Route path="patients" element={<PatientRecords />} />
                        <Route path="inventory" element={<InventoryManagement />} />
                        <Route path="expiry-alerts" element={<ExpiryAlerts />} />
                        <Route path="reorder-management" element={<ReorderManagement />} />
                        <Route path="batch-tracking" element={<BatchTracking />} />
                        <Route path="inventory-analytics" element={<InventoryAnalytics />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/patient-portal/*"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <Routes>
                        <Route index element={<PatientDashboard />} />
                        <Route path="appointments" element={<MyAppointments />} />
                        <Route path="prescriptions" element={<MyPrescriptions />} />
                        <Route path="lab-results" element={<LabResults />} />
                        <Route path="feedback" element={<Feedback />} />
                        <Route path="health-summary" element={<HealthSummary />} />
                        <Route path="medication-adherence" element={<MedicationAdherence />} />
                        <Route path="symptom-checker" element={<SymptomChecker />} />
                        <Route path="messages" element={<SecureMessaging />} />
                        <Route path="record-download" element={<RecordDownload />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                </Routes>
                <EmergencyButton />
              </ResponsiveLayout>
            </WebSocketProvider>
          } />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;