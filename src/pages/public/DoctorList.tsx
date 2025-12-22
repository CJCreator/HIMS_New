import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components';
import { Search, Star, MapPin, Clock } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  location: string;
  nextAvailable: string;
  image?: string;
}

export const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const [doctors] = useState<Doctor[]>([
    { id: '1', name: 'Dr. Sarah Smith', specialty: 'Cardiology', rating: 4.8, experience: 15, location: 'Building A, Floor 2', nextAvailable: '2024-01-25' },
    { id: '2', name: 'Dr. John Davis', specialty: 'Orthopedics', rating: 4.9, experience: 20, location: 'Building B, Floor 3', nextAvailable: '2024-01-24' },
    { id: '3', name: 'Dr. Emily Brown', specialty: 'Pediatrics', rating: 4.7, experience: 12, location: 'Building A, Floor 1', nextAvailable: '2024-01-26' },
    { id: '4', name: 'Dr. Michael Wilson', specialty: 'Neurology', rating: 4.9, experience: 18, location: 'Building C, Floor 4', nextAvailable: '2024-01-25' },
    { id: '5', name: 'Dr. Lisa Anderson', specialty: 'Dermatology', rating: 4.6, experience: 10, location: 'Building A, Floor 3', nextAvailable: '2024-01-27' },
    { id: '6', name: 'Dr. James Taylor', specialty: 'Cardiology', rating: 4.8, experience: 16, location: 'Building A, Floor 2', nextAvailable: '2024-01-24' }
  ]);

  const specialties = ['all', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
          <p className="text-gray-600">Search and book appointments with our specialists</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {doctor.name.split(' ')[1][0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{doctor.rating} • {doctor.experience} years exp.</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Next: {new Date(doctor.nextAvailable).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => navigate(`/public/doctor-availability/${doctor.id}`)}
                >
                  Book Now
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/public/doctor/${doctor.id}`)}>
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
