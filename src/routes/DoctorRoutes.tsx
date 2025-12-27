import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load components
const EnhancedDoctorDashboard = lazy(() => import('@/pages/doctor/EnhancedDashboard').then(module => ({ default: module.EnhancedDoctorDashboard })));
const PatientQueue = lazy(() => import('@/pages/doctor/PatientQueue').then(module => ({ default: module.PatientQueue })));
const DoctorAppointments = lazy(() => import('@/pages/doctor/Appointments').then(module => ({ default: module.DoctorAppointments })));
const PrescriptionHistory = lazy(() => import('@/pages/doctor/PrescriptionHistory').then(module => ({ default: module.PrescriptionHistory })));
const PrescriptionSignature = lazy(() => import('@/pages/doctor/PrescriptionSignature'));
const DoctorPerformance = lazy(() => import('@/pages/doctor/DoctorPerformance'));
const DoctorProfile = lazy(() => import('@/pages/doctor/Profile').then(module => ({ default: module.DoctorProfile })));
const FinalConsultationFlow = lazy(() => import('@/pages/doctor/consultation/FinalConsultationFlow').then(module => ({ default: module.FinalConsultationFlow })));

export default function DoctorRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route index element={<EnhancedDoctorDashboard />} />
        <Route path="queue" element={<PatientQueue />} />
        <Route path="consultation/:patientId" element={<FinalConsultationFlow />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<PrescriptionHistory />} />
        <Route path="prescription-signature" element={<PrescriptionSignature />} />
        <Route path="performance" element={<DoctorPerformance />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Routes>
    </Suspense>
  );
}