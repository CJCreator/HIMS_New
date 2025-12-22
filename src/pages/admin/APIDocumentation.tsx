import { Card } from '../../components/Card';

export default function APIDocumentation() {
  const endpoints = [
    { method: 'POST', path: '/api/auth/login', desc: 'User authentication', auth: false },
    { method: 'GET', path: '/api/appointments', desc: 'Get user appointments', auth: true },
    { method: 'POST', path: '/api/appointments', desc: 'Book appointment', auth: true },
    { method: 'GET', path: '/api/prescriptions', desc: 'Get prescriptions', auth: true },
    { method: 'GET', path: '/api/lab-results', desc: 'Get lab results', auth: true },
    { method: 'POST', path: '/api/messages', desc: 'Send secure message', auth: true },
    { method: 'GET', path: '/api/health-summary', desc: 'Get health metrics', auth: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mobile App API Documentation</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Authentication</h2>
        <div className="bg-gray-50 p-4 rounded font-mono text-sm">
          <div className="mb-2">POST /api/auth/login</div>
          <div className="text-gray-600">Body: {'{ "email": "user@example.com", "password": "***" }'}</div>
          <div className="text-gray-600 mt-2">Response: {'{ "token": "jwt_token", "user": {...} }'}</div>
        </div>
        <p className="text-sm text-gray-600 mt-3">Include token in Authorization header: Bearer {'<token>'}</p>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">API Endpoints</h2>
        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
              <span className={`px-3 py-1 rounded text-xs font-bold ${ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {ep.method}
              </span>
              <code className="flex-1 font-mono text-sm">{ep.path}</code>
              <span className="text-sm text-gray-600">{ep.desc}</span>
              {ep.auth && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">🔒 Auth</span>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Push Notifications</h2>
        <div className="space-y-2 text-sm">
          <p>• Appointment reminders (24h, 1h before)</p>
          <p>• Lab results available</p>
          <p>• Prescription ready for pickup</p>
          <p>• New secure messages</p>
          <p>• Medication adherence reminders</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Rate Limiting</h2>
        <p className="text-sm text-gray-600">100 requests per minute per user</p>
        <p className="text-sm text-gray-600 mt-2">Response headers include: X-RateLimit-Remaining</p>
      </Card>
    </div>
  );
}
