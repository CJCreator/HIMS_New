import { Card, Button } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';
import { toast } from 'sonner';

export function PatientQueue() {
  const navigate = useNavigate();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { patients } = useSelector((state: RootState) => state.patients);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [consultationStates, setConsultationStates] = useState<Record<string, 'ready' | 'in-progress' | 'completed'>>({});
  
  const readyPatients = appointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'scheduled')
    .map(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      return {
        id: apt.patientId,
        name: apt.patientName,
        age: patient?.age || 0,
        appointment: apt.time,
        vitalsBy: 'Nurse Sarah',
        vitalsTime: apt.time,
        chiefComplaint: apt.type,
        priority: apt.status === 'confirmed' ? 'urgent' : 'normal',
        waitTime: '5 min'
      };
    });

  const startConsultation = async (patientId: string) => {
    setLoadingStates(prev => ({ ...prev, [patientId]: true }));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setConsultationStates(prev => ({ ...prev, [patientId]: 'in-progress' }));
    setLoadingStates(prev => ({ ...prev, [patientId]: false }));
    toast.success('Consultation started');
    navigate(`/doctor/consultation/${patientId}`);
  };

  const viewSummary = (patientId: string) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const writePrescription = (patientId: string) => {
    const state = consultationStates[patientId];
    if (state !== 'in-progress' && state !== 'completed') {
      toast.error('Please start consultation first');
      return;
    }
    navigate(`/doctor/consultation/${patientId}?tab=prescription`);
  };

  const handoffPatient = async (patientId: string) => {
    const state = consultationStates[patientId];
    if (state !== 'completed') {
      toast.error('Please complete consultation first');
      return;
    }
    setLoadingStates(prev => ({ ...prev, [`handoff-${patientId}`]: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoadingStates(prev => ({ ...prev, [`handoff-${patientId}`]: false }));
    toast.success('Patient handed off successfully');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Queue</h1>
        <p className="text-gray-600">Patients with completed pre-consultation preparation</p>
      </div>
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-h3 text-neutral-900">Ready for Consultation</h2>
              <p className="text-body text-neutral-600">Patients with completed pre-consultation preparation</p>
            </div>
            <div className="text-right">
              <div className="text-h4 text-doctor">{readyPatients.length}</div>
              <div className="text-body-sm text-neutral-600">Patients Ready</div>
            </div>
          </div>

          <div className="space-y-4">
            {readyPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-h4 text-neutral-900">{patient.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        patient.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        patient.priority === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {patient.priority}
                      </span>
                      <span className="text-body-sm text-neutral-500">
                        Age: {patient.age}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-body-sm">
                      <div>
                        <span className="text-neutral-600">Appointment:</span>
                        <div className="font-medium">{patient.appointment}</div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Chief Complaint:</span>
                        <div className="font-medium">{patient.chiefComplaint}</div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Vitals by:</span>
                        <div className="font-medium">{patient.vitalsBy}</div>
                        <div className="text-neutral-500">{patient.vitalsTime}</div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Waiting:</span>
                        <div className="font-medium text-warning">{patient.waitTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => viewSummary(patient.id)}
                      disabled={loadingStates[patient.id]}
                    >
                      View Summary
                    </Button>
                    <Button 
                      variant={consultationStates[patient.id] === 'in-progress' ? 'secondary' : 'primary'}
                      onClick={() => startConsultation(patient.id)}
                      disabled={loadingStates[patient.id] || consultationStates[patient.id] === 'in-progress'}
                    >
                      {loadingStates[patient.id] ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span> Starting...
                        </span>
                      ) : consultationStates[patient.id] === 'in-progress' ? (
                        'In Progress'
                      ) : (
                        'Start Consultation'
                      )}
                    </Button>
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => writePrescription(patient.id)}
                      disabled={!consultationStates[patient.id] || consultationStates[patient.id] === 'ready'}
                    >
                      Write Prescription
                    </Button>
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => handoffPatient(patient.id)}
                      disabled={consultationStates[patient.id] !== 'completed' || loadingStates[`handoff-${patient.id}`]}
                    >
                      {loadingStates[`handoff-${patient.id}`] ? 'Handing off...' : 'Handoff'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Workflow Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body">Registered by Reception</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">8 patients</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body">Vitals by Nursing</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">5 complete</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body">Ready for Doctor</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">3 waiting</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Today's Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body">Consultations Complete</span>
                <span className="text-h4 text-success">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body">Average Consultation</span>
                <span className="text-body font-medium">18 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body">Patient Satisfaction</span>
                <span className="text-body font-medium">4.8/5</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/doctor/appointments')}
              >
                📋 View All Patients
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/doctor/appointments')}
              >
                📊 Today's Schedule
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate('/doctor/prescriptions')}
              >
                💊 Pending Prescriptions
              </Button>
            </div>
          </Card>
        </div>
    </div>
  );
}