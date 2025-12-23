import { Routes, Route } from 'react-router-dom';
import { PatientDashboard } from '@/pages/patient-portal/PatientDashboard';
import HealthSummary from '@/pages/patient-portal/HealthSummary';
import { MyAppointments } from '@/pages/patient-portal/MyAppointments';
import { LabResults } from '@/pages/patient-portal/LabResults';
import { MyPrescriptions } from '@/pages/patient-portal/MyPrescriptions';
import MedicationAdherence from '@/pages/patient-portal/MedicationAdherence';
import SymptomChecker from '@/pages/patient-portal/SymptomChecker';
import { Messages } from '@/pages/patient-portal/Messages';
import RecordDownload from '@/pages/patient-portal/RecordDownload';
import { Feedback } from '@/pages/patient-portal/Feedback';
import { MyRecords } from '@/pages/patient-portal/MyRecords';
import { MyBills } from '@/pages/patient-portal/MyBills';
import { PatientVideoConsultation } from '@/pages/patient-portal/VideoConsultation';
import { Profile } from '@/pages/patient-portal/Profile';

export default function PatientRoutes() {
  return (
    <Routes>
      <Route index element={<PatientDashboard />} />
      <Route path="health-summary" element={<HealthSummary />} />
      <Route path="appointments" element={<MyAppointments />} />
      <Route path="lab-results" element={<LabResults />} />
      <Route path="prescriptions" element={<MyPrescriptions />} />
      <Route path="medication-adherence" element={<MedicationAdherence />} />
      <Route path="symptom-checker" element={<SymptomChecker />} />
      <Route path="messages" element={<Messages />} />
      <Route path="record-download" element={<RecordDownload />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="records" element={<MyRecords />} />
      <Route path="bills" element={<MyBills />} />
      <Route path="video-consultation" element={<PatientVideoConsultation />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}