import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { User, Phone, Mail, MapPin, AlertCircle, Bell } from 'lucide-react';
import { NotificationPreferences } from '../../components/NotificationPreferences';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'emergency' | 'preferences'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, City, State 12345',
    bloodType: 'O+',
    allergies: 'Penicillin',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 987-6543'
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {activeTab === 'personal' && (
          <Button
            variant={isEditing ? 'primary' : 'secondary'}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        )}
      </div>

      <div className="flex space-x-2 border-b">
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'emergency', label: 'Emergency Contact', icon: AlertCircle },
          { id: 'preferences', label: 'Preferences', icon: Bell }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'personal' && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!isEditing}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                rows={2}
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
              />
            </div>
            <Input
              label="Blood Type"
              value={profile.bloodType}
              onChange={(e) => setProfile({...profile, bloodType: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Known Allergies"
              value={profile.allergies}
              onChange={(e) => setProfile({...profile, allergies: e.target.value})}
              disabled={!isEditing}
            />
          </div>
        </Card>
      )}

      {activeTab === 'emergency' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Contact Name"
              value={profile.emergencyContact.name}
              onChange={(e) => setProfile({
                ...profile,
                emergencyContact: {...profile.emergencyContact, name: e.target.value}
              })}
            />
            <Input
              label="Relationship"
              value={profile.emergencyContact.relationship}
              onChange={(e) => setProfile({
                ...profile,
                emergencyContact: {...profile.emergencyContact, relationship: e.target.value}
              })}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profile.emergencyContact.phone}
              onChange={(e) => setProfile({
                ...profile,
                emergencyContact: {...profile.emergencyContact, phone: e.target.value}
              })}
            />
          </div>
          <div className="mt-6">
            <Button variant="primary">Update Emergency Contact</Button>
          </div>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <NotificationPreferences />
      )}
    </div>
  );
};