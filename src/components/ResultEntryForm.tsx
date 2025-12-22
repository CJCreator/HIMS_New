import React, { useState } from 'react';
import { Button, Input } from './';
import { AlertCircle } from 'lucide-react';

interface ResultEntryFormProps {
  testName: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ResultEntryForm: React.FC<ResultEntryFormProps> = ({ testName, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    value: '',
    unit: '',
    normalRange: '',
    method: '',
    notes: ''
  });

  const [isCritical, setIsCritical] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, isCritical });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">{testName} - Result Entry</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Result Value *"
          value={formData.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, value: e.target.value })}
          required
        />
        <Input
          label="Unit *"
          value={formData.unit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, unit: e.target.value })}
          placeholder="e.g., mg/dL, g/dL"
          required
        />
      </div>

      <Input
        label="Normal Range *"
        value={formData.normalRange}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, normalRange: e.target.value })}
        placeholder="e.g., 70-100"
        required
      />

      <Input
        label="Test Method"
        value={formData.method}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, method: e.target.value })}
        placeholder="e.g., Automated analyzer"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Additional observations..."
        />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCritical}
          onChange={(e) => setIsCritical(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm font-medium text-gray-700">Mark as Critical Value</span>
      </label>

      {isCritical && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            Critical values require immediate physician notification
          </p>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit Result
        </Button>
      </div>
    </form>
  );
};
