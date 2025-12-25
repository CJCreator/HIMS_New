import { useState } from 'react';
import { toast } from 'sonner';
import { Card, Button, Input } from '@/components';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function Settings() {
  const [hospitalName, setHospitalName] = useState('AroCord General Hospital');
  const [address, setAddress] = useState('123 Medical Center Drive');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('admin@arocord.com');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!hospitalName.trim()) newErrors.hospitalName = 'Hospital Name is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email';
    if (!phone.match(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)) newErrors.phone = 'Please enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSettings = () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }
    toast.success('Settings saved successfully');
    setHasUnsavedChanges(false);
  };

  const handleFieldChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        {hasUnsavedChanges && <p className="text-sm text-warning mt-1">⚠️ You have unsaved changes</p>}
      </div>
      <div className="max-w-4xl space-y-6">
        <Card>
          <h2 className="text-h3 text-neutral-900 mb-6">Hospital Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Hospital Name"
                value={hospitalName}
                onChange={(e) => handleFieldChange(setHospitalName, e.target.value)}
                onBlur={validateForm}
                required
              />
              {errors.hospitalName && <p className="text-sm text-error mt-1">{errors.hospitalName}</p>}
            </div>
            <div>
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => handleFieldChange(setPhone, e.target.value)}
                onBlur={validateForm}
              />
              {errors.phone && <p className="text-sm text-error mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => handleFieldChange(setEmail, e.target.value)}
                onBlur={validateForm}
                required
              />
              {errors.email && <p className="text-sm text-error mt-1">{errors.email}</p>}
            </div>
            <Input
              label="Address"
              value={address}
              onChange={(e) => handleFieldChange(setAddress, e.target.value)}
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
            <Button variant="secondary" className="justify-start" onClick={() => setShowPasswordModal(true)}>
              🔐 Change Admin Password
            </Button>
            <Button variant="secondary" className="justify-start" onClick={() => toast.success('Backup started successfully')}>
              💾 Create Backup
            </Button>
            <Button variant="secondary" className="justify-start" onClick={() => toast.info('Audit logs feature coming soon')}>
              📊 View Audit Logs
            </Button>
            <Button variant="secondary" className="justify-start" onClick={() => toast.success('System is up to date')}>
              🔄 System Update
            </Button>
          </div>
        </Card>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPasswordModal(false)}>
            <div className="max-w-md w-full m-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <Card>
              <h3 className="text-h3 mb-4">Change Password</h3>
              <div className="space-y-4">
                <Input label="Current Password" type="password" />
                <Input label="New Password" type="password" />
                <Input label="Confirm New Password" type="password" />
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                  <Button onClick={() => { toast.success('Password changed successfully'); setShowPasswordModal(false); }}>Change Password</Button>
                </div>
              </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}