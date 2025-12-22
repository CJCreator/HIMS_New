import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, Button, Input, Table, Badge } from '@/components';

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { patients } = useSelector((state: RootState) => state.patients);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(p => ({
    id: p.id,
    name: p.name,
    age: p.age,
    phone: p.phone,
    lastVisit: new Date().toISOString().split('T')[0],
    status: 'active'
  }));

  const columns = [
    { key: 'id', header: 'Patient ID' },
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'phone', header: 'Phone' },
    { key: 'lastVisit', header: 'Last Visit' },
    {
      key: 'status',
      header: 'Status',
      render: (status: string) => (
        <Badge status={status === 'active' ? 'delivered' : 'pending'}>
          {status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="tertiary" size="sm">View</Button>
          <Button variant="tertiary" size="sm">Edit</Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Records</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-h3 text-neutral-900">Patient Records</h2>
              <p className="text-body text-neutral-600">Manage patient information and records</p>
            </div>
            <Button onClick={() => navigate('/receptionist/patients/register')}>
              + Register New Patient
            </Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search patients by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table columns={columns} data={filteredPatients} />
        </Card>
      </div>
    </div>
  );
}