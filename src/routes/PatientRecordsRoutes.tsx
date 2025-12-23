import { Routes, Route } from 'react-router-dom';
import { AllergyManagement } from '@/pages/patient-records/AllergyManagement';
import ImmunizationTracker from '@/pages/patient-records/ImmunizationTracker';
import PatientTimeline from '@/pages/patient-records/PatientTimeline';
import ProblemList from '@/pages/patient-records/ProblemList';

export default function PatientRecordsRoutes() {
  return (
    <Routes>
      <Route path="allergies/:patientId" element={<AllergyManagement />} />
      <Route path="immunizations/:patientId" element={<ImmunizationTracker />} />
      <Route path="timeline/:patientId" element={<PatientTimeline />} />
      <Route path="problems/:patientId" element={<ProblemList />} />
    </Routes>
  );
}
