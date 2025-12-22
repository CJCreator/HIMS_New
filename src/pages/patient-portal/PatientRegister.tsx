import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sanitizer, validator } from '@/utils/sanitizer';

export function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!validator.required(formData.firstName)) newErrors.firstName = 'First name is required';
    if (!validator.required(formData.lastName)) newErrors.lastName = 'Last name is required';
    if (!validator.required(formData.dateOfBirth)) newErrors.dateOfBirth = 'Date of birth is required';
    if (!validator.required(formData.gender)) newErrors.gender = 'Gender is required';
    if (!validator.email(formData.email)) newErrors.email = 'Valid email is required';
    if (!validator.phone(formData.phone)) newErrors.phone = 'Valid phone is required';
    if (!validator.password(formData.password)) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/patient-portal/login', { state: { registered: true } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-large shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-h2 text-neutral-900 mb-2">Patient Registration</h1>
          <p className="text-body text-neutral-600">Create your patient portal account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-h4 text-neutral-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.firstName && <p className="text-body-sm text-error-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.lastName && <p className="text-body-sm text-error-600 mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.dateOfBirth && <p className="text-body-sm text-error-600 mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-body-sm text-error-600 mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-h4 text-neutral-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.email && <p className="text-body-sm text-error-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.phone && <p className="text-body-sm text-error-600 mt-1">{errors.phone}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h2 className="text-h4 text-neutral-900 mb-4">Medical Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Blood Type</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g., Penicillin, Peanuts"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="text-h4 text-neutral-900 mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div>
            <h2 className="text-h4 text-neutral-900 mb-4">Account Security</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.password && <p className="text-body-sm text-error-600 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-body-sm font-medium text-neutral-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-small"
                />
                {errors.confirmPassword && <p className="text-body-sm text-error-600 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link to="/patient-portal/login" className="text-body text-primary-600 hover:text-primary-700">
              Already have an account? Sign in
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-small hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
