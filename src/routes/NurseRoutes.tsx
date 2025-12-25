import { Routes, Route } from 'react-router-dom';
import { NurseDashboard } from '@/pages/nurse/Dashboard';
import { VitalsEntry } from '@/pages/nurse/VitalsEntry';
import { PatientRecords } from '@/pages/nurse/PatientRecords';
import { MedicationRequest } from '@/pages/nurse/MedicationRequest';
import { WardManagement } from '@/pages/nurse/WardManagement';
import { ShiftHandover } from '@/pages/nurse/ShiftHandover';

export default function NurseRoutes() {
  return (
    <Routes>
      <Route index element={<NurseDashboard />} />
      <Route path="vitals" element={<VitalsEntry />} />
      <Route path="vitals/:patientId" element={<VitalsEntry />} />
      <Route path="patients" element={<PatientRecords />} />
      <Route path="medication-requests" element={<MedicationRequest />} />
      <Route path="wards" element={<WardManagement />} />
      <Route path="shift-handover" element={<ShiftHandover />} />
    </Routes>
  );
}