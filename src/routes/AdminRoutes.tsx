import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { UserManagement } from '@/pages/admin/UserManagement';
import { BedManagement } from '@/pages/admin/BedManagement';
import { Analytics } from '@/pages/admin/Analytics';
import AppointmentAnalytics from '@/pages/admin/AppointmentAnalytics';
import PatientDemographics from '@/pages/admin/PatientDemographics';
import { ReminderSettings } from '@/pages/admin/ReminderSettings';
import { PatientFeedback } from '@/pages/admin/PatientFeedback';
import APIDocumentation from '@/pages/admin/APIDocumentation';
import { Settings } from '@/pages/admin/Settings';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="beds" element={<BedManagement />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="appointment-analytics" element={<AppointmentAnalytics />} />
      <Route path="demographics" element={<PatientDemographics />} />
      <Route path="reminders" element={<ReminderSettings />} />
      <Route path="feedback" element={<PatientFeedback />} />
      <Route path="api-docs" element={<APIDocumentation />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}