import { useState } from 'react';
import { toast } from 'sonner';
import { Card, Button, Modal, Input, Breadcrumbs } from '@/components';
import { TrendingUp, Lock, Calendar, Home, Wrench, CheckCircle, AlertTriangle, Users, Bed as BedIcon } from 'lucide-react';

interface Bed {
  id: string;
  number: string;
  ward: string;
  status: 'occupied' | 'available' | 'maintenance' | 'cleaning';
  patient?: string;
  assignedTo?: string;
  admissionDate?: string;
  expectedDischarge?: string;
  actualDischarge?: string;
  lastCleaned?: string;
  nextMaintenance?: string;
  bedType: 'ICU' | 'General' | 'Pediatric' | 'Emergency' | 'Private';
  equipment?: string[];
  isolation?: boolean;
}

interface BedAnalytics {
  ward: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  avgLengthOfStay: number;
  expectedDischarges: number;
}

interface EmergencyWorkflow {
  id: string;
  type: 'immediate_discharge' | 'transfer' | 'expedited_cleaning';
  bedId: string;
  patientId?: string;
  requestedBy: string;
  requestedAt: string;
  priority: 'critical' | 'high' | 'normal';
  status: 'pending' | 'in_progress' | 'completed';
  estimatedCompletion?: string;
}

const mockBeds: Bed[] = [
  { 
    id: '1', 
    number: 'A101', 
    ward: 'ICU', 
    status: 'occupied', 
    patient: 'John Doe', 
    assignedTo: 'Dr. Smith',
    admissionDate: '2024-01-10',
    expectedDischarge: '2024-01-20',
    bedType: 'ICU',
    equipment: ['Ventilator', 'Monitor', 'IV Pump'],
    isolation: false
  },
  { 
    id: '2', 
    number: 'A102', 
    ward: 'ICU', 
    status: 'available',
    bedType: 'ICU',
    lastCleaned: '2024-01-15 14:30',
    equipment: ['Ventilator', 'Monitor']
  },
  { 
    id: '3', 
    number: 'A103', 
    ward: 'ICU', 
    status: 'maintenance',
    bedType: 'ICU',
    nextMaintenance: '2024-01-16 09:00',
    equipment: ['Ventilator', 'Monitor']
  },
  { 
    id: '4', 
    number: 'B201', 
    ward: 'General', 
    status: 'occupied', 
    patient: 'Jane Smith', 
    assignedTo: 'Dr. Wilson',
    admissionDate: '2024-01-12',
    expectedDischarge: '2024-01-18',
    bedType: 'General',
    equipment: ['Monitor', 'IV Pump'],
    isolation: false
  },
  { 
    id: '5', 
    number: 'B202', 
    ward: 'General', 
    status: 'cleaning',
    bedType: 'General',
    lastCleaned: '2024-01-15 16:00',
    equipment: ['Monitor']
  },
  { 
    id: '6', 
    number: 'B203', 
    ward: 'General', 
    status: 'available',
    bedType: 'General',
    lastCleaned: '2024-01-15 10:15',
    equipment: ['Monitor', 'IV Pump']
  },
  { 
    id: '7', 
    number: 'C301', 
    ward: 'Pediatric', 
    status: 'occupied', 
    patient: 'Baby Johnson', 
    assignedTo: 'Dr. Brown',
    admissionDate: '2024-01-14',
    expectedDischarge: '2024-01-17',
    bedType: 'Pediatric',
    equipment: ['Monitor', 'Oxygen'],
    isolation: false
  },
  { 
    id: '8', 
    number: 'C302', 
    ward: 'Pediatric', 
    status: 'available',
    bedType: 'Pediatric',
    lastCleaned: '2024-01-15 12:45',
    equipment: ['Monitor', 'Oxygen']
  },
  {
    id: '9',
    number: 'D401',
    ward: 'Emergency',
    status: 'occupied',
    patient: 'Robert Chen',
    assignedTo: 'Dr. Davis',
    admissionDate: '2024-01-15 08:30',
    expectedDischarge: '2024-01-16 14:00',
    bedType: 'Emergency',
    equipment: ['Monitor', 'Defibrillator'],
    isolation: true
  },
  {
    id: '10',
    number: 'D402',
    ward: 'Emergency',
    status: 'available',
    bedType: 'Emergency',
    lastCleaned: '2024-01-15 09:15',
    equipment: ['Monitor', 'Defibrillator']
  }
];

const mockBedAnalytics: BedAnalytics[] = [
  {
    ward: 'ICU',
    totalBeds: 3,
    occupiedBeds: 1,
    availableBeds: 1,
    occupancyRate: 33.3,
    avgLengthOfStay: 5.2,
    expectedDischarges: 1
  },
  {
    ward: 'General',
    totalBeds: 3,
    occupiedBeds: 1,
    availableBeds: 1,
    occupancyRate: 33.3,
    avgLengthOfStay: 3.8,
    expectedDischarges: 1
  },
  {
    ward: 'Pediatric',
    totalBeds: 2,
    occupiedBeds: 1,
    availableBeds: 1,
    occupancyRate: 50.0,
    avgLengthOfStay: 2.5,
    expectedDischarges: 1
  },
  {
    ward: 'Emergency',
    totalBeds: 2,
    occupiedBeds: 1,
    availableBeds: 1,
    occupancyRate: 50.0,
    avgLengthOfStay: 1.2,
    expectedDischarges: 1
  }
];

const mockEmergencyWorkflows: EmergencyWorkflow[] = [
  {
    id: '1',
    type: 'immediate_discharge',
    bedId: '1',
    patientId: 'patient_123',
    requestedBy: 'Dr. Emergency',
    requestedAt: '2024-01-15 14:20',
    priority: 'critical',
    status: 'in_progress',
    estimatedCompletion: '2024-01-15 15:30'
  },
  {
    id: '2',
    type: 'expedited_cleaning',
    bedId: '5',
    requestedBy: 'Nurse Supervisor',
    requestedAt: '2024-01-15 13:45',
    priority: 'high',
    status: 'pending',
    estimatedCompletion: '2024-01-15 15:00'
  }
];



export function BedManagement() {
  const [beds, setBeds] = useState<Bed[]>(mockBeds);
  const [bedAnalytics] = useState<BedAnalytics[]>(mockBedAnalytics);
  const [emergencyWorkflows] = useState<EmergencyWorkflow[]>(mockEmergencyWorkflows);
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [, setShowAnalyticsModal] = useState(false);
  const [, setShowEmergencyModal] = useState(false);
  const [, setSelectedBedForEmergency] = useState<Bed | null>(null);
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [newBed, setNewBed] = useState({ number: '', ward: 'General' });

  const wards = ['all', 'ICU', 'General', 'Pediatric', 'Emergency'];
  const filteredBeds = selectedWard === 'all' ? beds : beds.filter(bed => bed.ward === selectedWard);

  // Utility functions
  const calculateDaysInBed = (admissionDate?: string): number => {
    if (!admissionDate) return 0;
    const admission = new Date(admissionDate);
    const today = new Date();
    return Math.floor((today.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getOccupancyStatus = (bed: Bed): { status: string; color: string; days: number } => {
    if (bed.status === 'occupied' && bed.admissionDate) {
      const days = calculateDaysInBed(bed.admissionDate);
      if (days > 7) return { status: 'Long Stay', color: 'text-red-600', days };
      if (days > 3) return { status: 'Extended', color: 'text-yellow-600', days };
      return { status: 'Standard', color: 'text-green-600', days };
    }
    return { status: 'N/A', color: 'text-gray-500', days: 0 };
  };

  const getBedUtilizationRate = (): number => {
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
    return Math.round((occupiedBeds / totalBeds) * 100);
  };

  const handleEmergencyAction = (bed: Bed, action: EmergencyWorkflow['type']) => {
    setSelectedBedForEmergency(bed);
    setShowEmergencyModal(true);
    console.log(`Emergency action ${action} for bed ${bed.number}`);
  };

  const handleQuickAction = (bed: Bed, action: 'assign' | 'discharge' | 'clean') => {
    const updatedBeds = beds.map(b => {
      if (b.id === bed.id) {
        if (action === 'assign') return { ...b, status: 'occupied' as const };
        if (action === 'discharge') return { ...b, status: 'cleaning' as const, patient: undefined };
        if (action === 'clean') return { ...b, status: 'available' as const };
      }
      return b;
    });
    setBeds(updatedBeds);
    toast.success(`Bed ${bed.number} ${action === 'assign' ? 'assigned' : action === 'discharge' ? 'discharged' : 'cleaned'}`);
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Bed ${newBed.number} added to ${newBed.ward} ward`);
    setNewBed({ number: '', ward: 'General' });
    setShowAddBedModal(false);
  };

  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    available: beds.filter(b => b.status === 'available').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
    cleaning: beds.filter(b => b.status === 'cleaning').length,
    utilizationRate: getBedUtilizationRate(),
    expectedDischarges: beds.filter(b => b.expectedDischarge && new Date(b.expectedDischarge) <= new Date(Date.now() + 24*60*60*1000)).length
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bed Management</h1>
        <p className="text-gray-600">Real-time bed occupancy and operational management</p>
      </div>
        
        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="text-center">
            <div className="text-h2 text-neutral-900">{stats.total}</div>
            <div className="text-body text-neutral-600">Total Beds</div>
            <div className="text-xs text-primary-600 mt-1">{stats.utilizationRate}% utilization</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-error">{stats.occupied}</div>
            <div className="text-body text-neutral-600">Occupied</div>
            <div className="text-xs text-error-600 mt-1">{stats.expectedDischarges} discharging soon</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-success">{stats.available}</div>
            <div className="text-body text-neutral-600">Available</div>
            <div className="text-xs text-success-600 mt-1">Ready for assignment</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-warning">{stats.maintenance}</div>
            <div className="text-body text-neutral-600">Maintenance</div>
            <div className="text-xs text-warning-600 mt-1">Scheduled maintenance</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-info">{stats.cleaning}</div>
            <div className="text-body text-neutral-600">Cleaning</div>
            <div className="text-xs text-info-600 mt-1">Being cleaned</div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-h3 text-neutral-900">Bed Status Grid</h2>
              <p className="text-body text-neutral-600">Real-time bed occupancy with operational insights</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {wards.map(ward => (
                  <option key={ward} value={ward}>
                    {ward === 'all' ? 'All Wards' : ward}
                  </option>
                ))}
              </select>
              <Button 
                variant="secondary"
                onClick={() => setShowAnalyticsModal(true)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ward Analytics
              </Button>
              <Button onClick={() => setShowAddBedModal(true)}>Add New Bed</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => {
              const occupancyInfo = getOccupancyStatus(bed);
              return (
                <Card key={bed.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-h4 text-neutral-900">Bed {bed.number}</h3>
                      <p className="text-body-sm text-neutral-600">{bed.ward} Ward • {bed.bedType}</p>
                      {bed.isolation && (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mt-1 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Isolation
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      bed.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      bed.status === 'available' ? 'bg-green-100 text-green-800' :
                      bed.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {bed.status}
                    </span>
                  </div>
                  
                  {bed.patient && (
                    <div className="space-y-2 mb-3">
                      <div className="p-2 bg-red-50 rounded">
                        <p className="text-sm font-medium text-red-900">Patient: {bed.patient}</p>
                        <p className="text-xs text-red-700">Assigned to: {bed.assignedTo}</p>
                        {bed.admissionDate && (
                          <div className="mt-1">
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Admitted: {bed.admissionDate} ({occupancyInfo.days} days)
                            </p>
                            {bed.expectedDischarge && (
                              <p className="text-xs text-red-600 flex items-center gap-1">
                                <Home className="w-3 h-3" /> Expected discharge: {bed.expectedDischarge}
                              </p>
                            )}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${occupancyInfo.color}`}>
                          Status: {occupancyInfo.status}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bed.equipment && bed.equipment.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-neutral-600 mb-1">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {bed.equipment.map((item, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!bed.patient && (
                    <div className="mb-3">
                      {bed.lastCleaned && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Last cleaned: {bed.lastCleaned}
                        </p>
                      )}
                      {bed.nextMaintenance && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Wrench className="w-3 h-3" /> Next maintenance: {bed.nextMaintenance}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    {bed.status === 'available' && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleQuickAction(bed, 'assign')}
                        >
                          <Users className="w-4 h-4 mr-1" /> Assign Patient
                        </Button>
                        <Button 
                          variant="tertiary" 
                          size="sm"
                          onClick={() => handleEmergencyAction(bed, 'immediate_discharge')}
                          title="Emergency Assignment"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {bed.status === 'occupied' && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleQuickAction(bed, 'discharge')}
                        >
                          <Home className="w-4 h-4 mr-1" /> Schedule Discharge
                        </Button>
                        <Button 
                          variant="tertiary" 
                          size="sm"
                          onClick={() => handleEmergencyAction(bed, 'transfer')}
                          title="Emergency Transfer"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {bed.status === 'cleaning' && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleQuickAction(bed, 'clean')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark Cleaned
                      </Button>
                    )}
                    
                    {bed.status === 'maintenance' && (
                      <div className="text-center">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleEmergencyAction(bed, 'expedited_cleaning')}
                        >
                          <Wrench className="w-4 h-4 mr-1" /> Complete Maintenance
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
        
        {/* Emergency Workflows Section */}
        {emergencyWorkflows.length > 0 && (
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Emergency Workflows</h3>
            <div className="space-y-3">
              {emergencyWorkflows.map((workflow) => (
                <div key={workflow.id} className={`p-3 rounded-lg border-l-4 ${
                  workflow.priority === 'critical' ? 'bg-red-50 border-red-500' :
                  workflow.priority === 'high' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.priority === 'critical' ? 'bg-red-200 text-red-800' :
                          workflow.priority === 'high' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {workflow.priority.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium">{workflow.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Bed {beds.find(b => b.id === workflow.bedId)?.number} • Requested by {workflow.requestedBy}
                      </p>
                      <p className="text-xs text-neutral-500">{workflow.requestedAt}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'completed' ? 'bg-green-200 text-green-800' :
                        workflow.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {workflow.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {workflow.estimatedCompletion && (
                        <p className="text-xs text-neutral-500 mt-1">
                          ETA: {workflow.estimatedCompletion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      <Modal isOpen={showAddBedModal} onClose={() => setShowAddBedModal(false)} title="Add New Bed" size="sm">
        <form onSubmit={handleAddBed} className="space-y-4">
          <Input label="Bed Number" placeholder="e.g., A101" value={newBed.number} onChange={(e) => setNewBed({...newBed, number: e.target.value})} required />
          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Ward</label>
            <select className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500" value={newBed.ward} onChange={(e) => setNewBed({...newBed, ward: e.target.value})}>
              <option value="ICU">ICU</option>
              <option value="General">General</option>
              <option value="Pediatric">Pediatric</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddBedModal(false)}>Cancel</Button>
            <Button type="submit">Add Bed</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}