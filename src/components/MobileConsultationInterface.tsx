import { useState } from 'react';
import { Card, Button, Badge } from '@/components';

interface MobileConsultationInterfaceProps {
  patientName: string;
  patientId: string;
}

export function MobileConsultationInterface({ patientName, patientId }: MobileConsultationInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'vitals' | 'notes' | 'actions'>('info');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <div className="bg-primary-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <Button variant="tertiary" size="sm" className="text-white">← Back</Button>
          <Badge status="pending">In Progress</Badge>
        </div>
        <h2 className="text-h4">{patientName}</h2>
        <p className="text-body-sm opacity-90">{patientId} • 45Y Male</p>
      </div>

      {/* Mobile Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="flex">
          {[
            { id: 'info', label: 'Info', icon: '👤' },
            { id: 'vitals', label: 'Vitals', icon: '📊' },
            { id: 'notes', label: 'Notes', icon: '📝' },
            { id: 'actions', label: 'Actions', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600'
              }`}
            >
              <div className="text-xl mb-1">{tab.icon}</div>
              <div className="text-xs font-medium">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'info' && (
          <>
            <Card className="p-4">
              <h3 className="text-body font-medium mb-2">⚠️ Allergies</h3>
              <div className="flex flex-wrap gap-2">
                <Badge status="error">Penicillin</Badge>
                <Badge status="error">Sulfa drugs</Badge>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-body font-medium mb-2">💊 Current Medications</h3>
              <div className="space-y-2">
                <p className="text-body-sm">• Metformin 500mg - Daily</p>
                <p className="text-body-sm">• Lisinopril 10mg - Daily</p>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'vitals' && (
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-neutral-50 rounded">
                <div className="text-body-sm text-neutral-600">BP</div>
                <div className="text-h4">120/80</div>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded">
                <div className="text-body-sm text-neutral-600">HR</div>
                <div className="text-h4">72</div>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded">
                <div className="text-body-sm text-neutral-600">Temp</div>
                <div className="text-h4">98.6°F</div>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded">
                <div className="text-body-sm text-neutral-600">O2</div>
                <div className="text-h4">98%</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'notes' && (
          <Card className="p-4">
            <textarea
              className="w-full p-3 border border-neutral-300 rounded text-body-sm"
              rows={8}
              placeholder="Add consultation notes..."
            />
            <Button className="w-full mt-3">🎤 Voice Input</Button>
          </Card>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-2">
            <Button className="w-full justify-start">💊 Add Prescription</Button>
            <Button className="w-full justify-start">🔬 Order Lab Tests</Button>
            <Button className="w-full justify-start">📅 Schedule Follow-up</Button>
            <Button className="w-full justify-start">✅ Complete Consultation</Button>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl">
        +
      </button>
    </div>
  );
}
