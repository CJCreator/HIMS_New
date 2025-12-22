import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Input } from '@/components';
import { addNotification } from '@/store/notificationSlice';

export function Settings() {
  const dispatch = useDispatch();
  const [hospitalName, setHospitalName] = useState('AroCord General Hospital');
  const [address, setAddress] = useState('123 Medical Center Drive');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('admin@arocord.com');

  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    dispatch(addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Hospital configuration has been updated successfully',
      priority: 'medium',
      category: 'system'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="max-w-4xl space-y-6">
        <Card>
          <h2 className="text-h3 text-neutral-900 mb-6">Hospital Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-h3 text-neutral-900 mb-6">System Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body font-medium text-neutral-900">Email Notifications</h3>
                <p className="text-body-sm text-neutral-600">Receive email alerts for critical events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body font-medium text-neutral-900">Auto Backup</h3>
                <p className="text-body-sm text-neutral-600">Automatically backup data daily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body font-medium text-neutral-900">Maintenance Mode</h3>
                <p className="text-body-sm text-neutral-600">Enable maintenance mode for system updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-h3 text-neutral-900 mb-6">Security & Backup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="secondary" className="justify-start">
              🔐 Change Admin Password
            </Button>
            <Button variant="secondary" className="justify-start">
              💾 Create Backup
            </Button>
            <Button variant="secondary" className="justify-start">
              📊 View Audit Logs
            </Button>
            <Button variant="secondary" className="justify-start">
              🔄 System Update
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}