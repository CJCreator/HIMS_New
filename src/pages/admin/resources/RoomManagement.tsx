import React, { useState } from 'react';
import { Card, Button } from '../../../components';
import { Bed, Edit, Trash2, Plus } from 'lucide-react';

interface Room {
  id: string;
  number: string;
  type: 'ICU' | 'General' | 'Private' | 'Operating' | 'Emergency';
  floor: number;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  equipment: string[];
}

export const RoomManagement: React.FC = () => {
  const [rooms] = useState<Room[]>([
    { id: '1', number: '101', type: 'ICU', floor: 1, capacity: 1, status: 'occupied', equipment: ['Ventilator', 'Monitor'] },
    { id: '2', number: '102', type: 'General', floor: 1, capacity: 2, status: 'available', equipment: ['Monitor'] },
    { id: '3', number: '201', type: 'Private', floor: 2, capacity: 1, status: 'available', equipment: ['TV', 'Monitor'] },
    { id: '4', number: 'OR-1', type: 'Operating', floor: 3, capacity: 1, status: 'maintenance', equipment: ['Surgical Equipment'] }
  ]);

  const [filter, setFilter] = useState<'all' | Room['status']>('all');

  const filteredRooms = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital rooms and availability</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="flex space-x-2">
        {['all', 'available', 'occupied', 'maintenance'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bed className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Room {room.number}</h3>
                  <p className="text-sm text-gray-600">{room.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>Floor: {room.floor}</p>
              <p>Capacity: {room.capacity} bed(s)</p>
              <div>
                <p className="font-medium text-gray-700 mb-1">Equipment:</p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="secondary" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
