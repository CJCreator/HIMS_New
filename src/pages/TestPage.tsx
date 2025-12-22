import { Card } from '@/components';

export function TestPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <h1 className="text-h2 text-neutral-900 mb-4">Test Page</h1>
          <p className="text-body text-neutral-600">
            This is a test page to verify routing is working correctly.
          </p>
          <div className="mt-4 p-4 bg-success/10 rounded-small">
            <p className="text-body text-success">✅ If you can see this page, routing is working!</p>
          </div>
        </Card>
      </div>
    </div>
  );
}