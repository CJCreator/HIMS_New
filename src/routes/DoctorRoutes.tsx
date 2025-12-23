import { Routes, Route } from 'react-router-dom';
import { EnhancedDoctorDashboard } from '@/pages/doctor/EnhancedDashboard';
import { PatientQueue } from '@/pages/doctor/PatientQueue';
import { DoctorAppointments } from '@/pages/doctor/Appointments';
import { PrescriptionHistory } from '@/pages/doctor/PrescriptionHistory';
import PrescriptionSignature from '@/pages/doctor/PrescriptionSignature';
import DoctorPerformance from '@/pages/doctor/DoctorPerformance';
import { DoctorProfile } from '@/pages/doctor/Profile';
import { FinalConsultationFlow } from '@/pages/doctor/consultation/FinalConsultationFlow';

export default function DoctorRoutes() {
  return (
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
  );
}