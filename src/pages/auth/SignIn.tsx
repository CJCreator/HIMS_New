import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '@/components';
import { loginStart, loginSuccess } from '@/store/authSlice';
import { UserRole } from '@/types';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());

    // Mock authentication
    setTimeout(() => {
      const user = {
        id: '1',
        name: 'John Doe',
        email,
        role,
        avatar: undefined,
      };
      dispatch(loginSuccess(user));
      navigate(`/${role}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-h2 text-neutral-900 mb-2">Welcome to AroCord</h1>
          <p className="text-body text-neutral-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={!email || !password}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-body text-primary-600 hover:text-primary-700">
            Forgot your password?
          </a>
        </div>
      </Card>
    </div>
  );
}