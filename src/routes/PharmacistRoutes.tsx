import { Routes, Route } from 'react-router-dom';
import { EnhancedPharmacyDashboard } from '@/pages/pharmacy/EnhancedDashboard';
import { PrescriptionQueue } from '@/pages/pharmacy/PrescriptionQueue';
import { MedicationRequests } from '@/pages/pharmacy/MedicationRequests';
import { PatientRecords } from '@/pages/pharmacy/PatientRecords';
import { InventoryManagement } from '@/pages/pharmacy/InventoryManagement';
import { ExpiryAlerts } from '@/pages/pharmacy/ExpiryAlerts';
import ReorderManagement from '@/pages/pharmacy/ReorderManagement';
import BatchTracking from '@/pages/pharmacy/BatchTracking';
import InventoryAnalytics from '@/pages/pharmacy/InventoryAnalytics';

export default function PharmacistRoutes() {
  return (
    <Routes>
      <Route index element={<EnhancedPharmacyDashboard />} />
      <Route path="prescriptions" element={<PrescriptionQueue />} />
      <Route path="medication-requests" element={<MedicationRequests />} />
      <Route path="patients" element={<PatientRecords />} />
      <Route path="inventory" element={<InventoryManagement />} />
      <Route path="expiry-alerts" element={<ExpiryAlerts />} />
      <Route path="reorder-management" element={<ReorderManagement />} />
      <Route path="batch-tracking" element={<BatchTracking />} />
      <Route path="inventory-analytics" element={<InventoryAnalytics />} />
    </Routes>
  );
}