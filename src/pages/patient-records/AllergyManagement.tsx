import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addAllergy, removeAllergy } from '@/store/allergySlice';
import { Card, Button, Input, Badge, Modal } from '@/components';
import { format } from 'date-fns';

export function AllergyManagement() {
  const dispatch = useDispatch();
  const { allergies } = useSelector((state: RootState) => state.allergies);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAllergy, setNewAllergy] = useState({
    patientId: 'P001',
    allergen: '',
    type: 'drug' as const,
    severity: 'moderate' as const,
    reaction: '',
    onsetDate: '',
    notes: '',
    addedBy: 'Dr. Current'
  });

  const filteredAllergies = allergies.filter(a =>
    a.allergen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.reaction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAllergy = () => {
    if (newAllergy.allergen && newAllergy.reaction) {
      dispatch(addAllergy(newAllergy));
      setShowAddModal(false);
      setNewAllergy({
        patientId: 'P001',
        allergen: '',
        type: 'drug',
        severity: 'moderate',
        reaction: '',
        onsetDate: '',
        notes: '',
        addedBy: 'Dr. Current'
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'severe':
        return <Badge status="error">Severe</Badge>;
      case 'moderate':
        return <Badge status="pending">Moderate</Badge>;
      default:
        return <Badge status="sent">Mild</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Allergy Management</h1>
          <p className="text-sm text-neutral-600 mt-1">Manage patient allergies and sensitivities</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <span>+</span>
          Add Allergy
        </Button>
      </div>

      <Card className="p-6">
        <Input
          placeholder="Search allergies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />

        <div className="space-y-3">
          {filteredAllergies.map((allergy) => (
            <div key={allergy.id} className="p-4 border-2 border-neutral-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">{allergy.allergen}</h3>
                    <p className="text-sm text-neutral-600 capitalize">{allergy.type} allergy</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(allergy.severity)}
                  <Button
                    variant="tertiary"
                    size="sm"
                    className="text-error"
                    onClick={() => dispatch(removeAllergy(allergy.id))}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-neutral-600">Reaction</p>
                  <p className="text-sm text-neutral-900">{allergy.reaction}</p>
                </div>
                {allergy.onsetDate && (
                  <div>
                    <p className="text-xs text-neutral-600">Onset Date</p>
                    <p className="text-sm text-neutral-900">{format(new Date(allergy.onsetDate), 'MMM dd, yyyy')}</p>
                  </div>
                )}
              </div>

              {allergy.notes && (
                <div className="p-3 bg-neutral-50 rounded-lg mb-3">
                  <p className="text-xs text-neutral-600 mb-1">Notes</p>
                  <p className="text-sm text-neutral-900">{allergy.notes}</p>
                </div>
              )}

              <div className="text-xs text-neutral-500">
                Added by {allergy.addedBy} on {format(new Date(allergy.addedAt), 'MMM dd, yyyy')}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Allergy" size="md">
        <div className="space-y-4">
          <Input
            label="Allergen"
            value={newAllergy.allergen}
            onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
            placeholder="e.g., Penicillin"
            required
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
            <select
              value={newAllergy.type}
              onChange={(e) => setNewAllergy({ ...newAllergy, type: e.target.value as any })}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="drug">Drug</option>
              <option value="food">Food</option>
              <option value="environmental">Environmental</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Severity</label>
            <select
              value={newAllergy.severity}
              onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value as any })}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <Input
            label="Reaction"
            value={newAllergy.reaction}
            onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
            placeholder="e.g., Skin rash, difficulty breathing"
            required
          />

          <Input
            label="Onset Date (Optional)"
            type="date"
            value={newAllergy.onsetDate}
            onChange={(e) => setNewAllergy({ ...newAllergy, onsetDate: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (Optional)</label>
            <textarea
              value={newAllergy.notes}
              onChange={(e) => setNewAllergy({ ...newAllergy, notes: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional information..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddAllergy} className="flex-1">
              Add Allergy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
