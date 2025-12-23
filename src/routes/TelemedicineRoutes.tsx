import { Routes, Route } from 'react-router-dom';
import { TelemedicineDashboard } from '@/pages/telemedicine/TelemedicineDashboard';
import { ConsultationScheduler } from '@/pages/telemedicine/ConsultationScheduler';
import { VirtualWaitingRoom } from '@/pages/telemedicine/VirtualWaitingRoom';
import { VideoConsultation } from '@/pages/telemedicine/VideoConsultation';

export default function TelemedicineRoutes() {
  return (
    <Routes>
      <Route index element={<TelemedicineDashboard />} />
      <Route path="scheduler" element={<ConsultationScheduler />} />
      <Route path="waiting-room" element={<VirtualWaitingRoom />} />
      <Route path="consultation/:sessionId" element={<VideoConsultation />} />
    </Routes>
  );
}
