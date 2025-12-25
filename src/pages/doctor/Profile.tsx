import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { WeeklyScheduleEditor } from '../../components/WeeklyScheduleEditor';

const User = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const Edit = ({ className }: { className?: string }) => <span className={className}>✏️</span>;
const Save = ({ className }: { className?: string }) => <span className={className}>💾</span>;
const Award = ({ className }: { className?: string }) => <span className={className}>🏆</span>;
const Calendar = ({ className }: { className?: string }) => <span className={className}>📅</span>;

export const DoctorProfile: React.FC = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    email: 'sarah.wilson@hospital.com',
    phone: '+1 (555) 123-4567',
    qualifications: 'MBBS, MD (Cardiology)',
    registration: 'TNMC1234',
    experience: '8 Years',
    department: 'Cardiology',
    bio: 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention.',
    languages: 'English, Spanish',
    consultationFee: '$150'
  });

  const handleSave = () => {
    dispatch(addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully',
      priority: 'medium',
      category: 'system'
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const achievements = [
    { title: 'Best Doctor Award 2023', organization: 'Medical Association' },
    { title: 'Excellence in Patient Care', organization: 'Hospital Board' },
    { title: 'Research Publication', organization: 'Cardiology Journal' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-doctor-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-doctor-600" />
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="text-center font-semibold"
                />
                <Input
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                  className="text-center"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.specialization}</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Department:</span>
              <span className="text-gray-900">{profileData.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Experience:</span>
              <span className="text-gray-900">{profileData.experience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Registration:</span>
              <span className="text-gray-900">{profileData.registration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Consultation Fee:</span>
              <span className="text-gray-900">{profileData.consultationFee}</span>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
              {isEditing ? (
                <Input
                  value={profileData.languages}
                  onChange={(e) => setProfileData({...profileData, languages: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{profileData.languages}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Professional Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              {isEditing ? (
                <Input
                  value={profileData.qualifications}
                  onChange={(e) => setProfileData({...profileData, qualifications: e.target.value})}
                />
              ) : (
                <p className="text-gray-900">{profileData.qualifications}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <p className="text-gray-900">{profileData.bio}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements & Awards
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.organization}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly Schedule Editor */}
      <WeeklyScheduleEditor />

      {/* Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4.9</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">156</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>
      </Card>
    </div>
  );
};