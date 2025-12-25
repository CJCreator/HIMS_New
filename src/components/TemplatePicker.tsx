import { useState } from 'react';
import { consultationTemplateService, ConsultationTemplate } from '@/services/consultationTemplateService';
import { ResponsiveModal } from './ResponsiveModal';
import { ResponsiveButton } from './ResponsiveButton';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: ConsultationTemplate) => void;
}

export function TemplatePicker({ isOpen, onClose, onSelect }: TemplatePickerProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const templates = consultationTemplateService.getTemplates();
  
  const specialties = ['all', ...new Set(templates.map(t => t.specialty))];
  
  const filteredTemplates = selectedSpecialty === 'all'
    ? templates
    : templates.filter(t => t.specialty === selectedSpecialty);

  const handleSelect = (template: ConsultationTemplate) => {
    onSelect(template);
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Consultation Template"
      size="lg"
    >
      <div className="space-y-4">
        {/* Specialty Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Filter by Specialty
          </label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Template List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
              onClick={() => handleSelect(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{template.name}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{template.specialty}</p>
                  {template.chiefComplaint && (
                    <p className="text-sm text-neutral-500 mt-2">
                      Chief Complaint: {template.chiefComplaint}
                    </p>
                  )}
                </div>
                <ResponsiveButton
                  size="sm"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(template);
                  }}
                >
                  Use Template
                </ResponsiveButton>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            No templates found for this specialty
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
}
