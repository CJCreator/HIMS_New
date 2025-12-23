import { Routes, Route } from 'react-router-dom';
import { CheckInKiosk } from '@/pages/queue/CheckInKiosk';
import { QueueDisplay } from '@/pages/queue/QueueDisplay';

export default function QueueRoutes() {
  return (
    <Routes>
      <Route path="check-in" element={<CheckInKiosk />} />
      <Route path="display" element={<QueueDisplay />} />
    </Routes>
  );
}
