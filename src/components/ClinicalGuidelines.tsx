import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';

const BookOpen = ({ className }: { className?: string }) => <span className={className}>📖</span>;
const Search = ({ className }: { className?: string }) => <span className={className}>🔍</span>;
const ExternalLink = ({ className }: { className?: string }) => <span className={className}>🔗</span>;

interface Guideline {
  id: string;
  title: string;
  organization: string;
  category: string;
  lastUpdated: string;
  summary: string;
  keyRecommendations: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  url?: string;
}

export const ClinicalGuidelines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedGuideline, setExpandedGuideline] = useState<string | null>(null);

  const guidelines: Guideline[] = [
    {
      id: '1',
      title: 'Hypertension Management Guidelines',
      organization: 'American Heart Association',
      category: 'Cardiovascular',
      lastUpdated: '2023-11-15',
      summary: 'Evidence-based recommendations for the prevention, detection, evaluation, and management of high blood pressure in adults.',
      keyRecommendations: [
        'Target BP <130/80 mmHg for most adults',
        'Lifestyle modifications as first-line therapy',
        'ACE inhibitors or ARBs as preferred initial therapy',
        'Regular monitoring and medication adherence'
      ],
      evidenceLevel: 'A',
      url: 'https://www.ahajournals.org/hypertension'
    },
    {
      id: '2',
      title: 'Type 2 Diabetes Management',
      organization: 'American Diabetes Association',
      category: 'Endocrine',
      lastUpdated: '2024-01-10',
      summary: 'Comprehensive guidelines for the diagnosis and management of type 2 diabetes mellitus.',
      keyRecommendations: [
        'HbA1c target <7% for most adults',
        'Metformin as first-line therapy',
        'Lifestyle interventions for all patients',
        'Regular screening for complications'
      ],
      evidenceLevel: 'A'
    },
    {
      id: '3',
      title: 'Community-Acquired Pneumonia Treatment',
      organization: 'Infectious Diseases Society',
      category: 'Infectious Disease',
      lastUpdated: '2023-09-20',
      summary: 'Guidelines for the diagnosis and treatment of adults with community-acquired pneumonia.',
      keyRecommendations: [
        'Empirical antibiotic therapy based on severity',
        'Amoxicillin for outpatient treatment',
        'Duration of therapy 5-7 days for most cases',
        'Follow-up chest X-ray if not improving'
      ],
      evidenceLevel: 'B'
    }
  ];

  const categories = ['all', ...Array.from(new Set(guidelines.map(g => g.category)))];

  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedGuideline(expandedGuideline === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Guidelines</h2>
        
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredGuidelines.map((guideline) => (
          <Card key={guideline.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{guideline.title}</h3>
                  {guideline.url && (
                    <a
                      href={guideline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>{guideline.organization}</span>
                  <span>•</span>
                  <span>{guideline.category}</span>
                  <span>•</span>
                  <span>Updated: {guideline.lastUpdated}</span>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded text-xs font-medium ${getEvidenceLevelColor(guideline.evidenceLevel)}`}>
                Level {guideline.evidenceLevel}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{guideline.summary}</p>

            <button
              onClick={() => toggleExpanded(guideline.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
            >
              {expandedGuideline === guideline.id ? 'Hide' : 'Show'} Key Recommendations
            </button>

            {expandedGuideline === guideline.id && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Key Recommendations:</h4>
                <ul className="space-y-2">
                  {guideline.keyRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start text-blue-800">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredGuidelines.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No guidelines found matching your criteria</p>
        </Card>
      )}
    </div>
  );
};