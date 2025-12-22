import React, { useState } from 'react';
import { DiagnosisSuggester } from '../../components/DiagnosisSuggester';
import { DosageCalculator } from '../../components/DosageCalculator';
import { ICD10Search } from '../../components/ICD10Search';
import { ClinicalGuidelines } from '../../components/ClinicalGuidelines';

const Stethoscope = ({ className }: { className?: string }) => <span className={className}>🩺</span>;
const Calculator = ({ className }: { className?: string }) => <span className={className}>🧮</span>;
const Search = ({ className }: { className?: string }) => <span className={className}>🔍</span>;
const BookOpen = ({ className }: { className?: string }) => <span className={className}>📖</span>;

export const ClinicalSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'dosage' | 'icd10' | 'guidelines'>('diagnosis');

  const tabs = [
    { id: 'diagnosis', label: 'Diagnosis Support', icon: Stethoscope },
    { id: 'dosage', label: 'Dosage Calculator', icon: Calculator },
    { id: 'icd10', label: 'ICD-10 Search', icon: Search },
    { id: 'guidelines', label: 'Clinical Guidelines', icon: BookOpen }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Clinical Decision Support</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                activeTab === tab.id
                  ? 'bg-white text-doctor-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'diagnosis' && <DiagnosisSuggester />}
        {activeTab === 'dosage' && <DosageCalculator />}
        {activeTab === 'icd10' && <ICD10Search />}
        {activeTab === 'guidelines' && <ClinicalGuidelines />}
      </div>
    </div>
  );
};