import { Routes, Route } from 'react-router-dom';
import { ReceptionistDashboard } from '@/pages/receptionist/Dashboard';
import { AppointmentCalendar } from '@/pages/receptionist/appointments/AppointmentCalendar';
import { PatientList } from '@/pages/receptionist/patients/PatientList';
import { PatientRegistration } from '@/pages/receptionist/patients/PatientRegistration';
import Waitlist from '@/pages/receptionist/Waitlist';
import { BillingDashboard } from '@/pages/receptionist/billing/BillingDashboard';
import PaymentPlans from '@/pages/receptionist/billing/PaymentPlans';
import RevenueReports from '@/pages/receptionist/billing/RevenueReports';
import InsuranceClaims from '@/pages/receptionist/billing/InsuranceClaims';

export default function ReceptionistRoutes() {
  return (
    <Routes>
      <Route index element={<ReceptionistDashboard />} />
      <Route path="appointments" element={<AppointmentCalendar />} />
      <Route path="recurring-appointments" element={<AppointmentCalendar />} />
      <Route path="waitlist" element={<Waitlist />} />
      <Route path="patients" element={<PatientList />} />
      <Route path="patients/register" element={<PatientRegistration />} />
      <Route path="billing" element={<BillingDashboard />} />
      <Route path="billing/payment-plans" element={<PaymentPlans />} />
      <Route path="billing/revenue-reports" element={<RevenueReports />} />
      <Route path="billing/insurance-claims" element={<InsuranceClaims />} />
    </Routes>
  );
}