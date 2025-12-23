import { Routes, Route } from 'react-router-dom';
import { LabDashboard } from '@/pages/lab/LabDashboard';
import { OrderQueue } from '@/pages/lab/OrderQueue';
import { ResultEntry } from '@/pages/lab/ResultEntry';
import { ResultVerification } from '@/pages/lab/ResultVerification';
import { LabReports } from '@/pages/lab/LabReports';

export default function LabRoutes() {
  return (
    <Routes>
      <Route index element={<LabDashboard />} />
      <Route path="orders" element={<OrderQueue />} />
      <Route path="results" element={<ResultEntry />} />
      <Route path="verification" element={<ResultVerification />} />
      <Route path="reports" element={<LabReports />} />
    </Routes>
  );
}