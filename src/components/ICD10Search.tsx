import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Search, Copy } from 'lucide-react';

interface ICD10Code {
  code: string;
  description: string;
  category: string;
  includes: string[];
  excludes: string[];
}

export const ICD10Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ICD10Code[]>([]);

  const mockICD10Data: ICD10Code[] = [
    {
      code: 'J20.9',
      description: 'Acute bronchitis, unspecified',
      category: 'Diseases of the respiratory system',
      includes: ['Bronchitis NOS', 'Tracheobronchitis NOS'],
      excludes: ['Bronchitis NOS (J40)', 'Chronic bronchitis NOS (J42)']
    },
    {
      code: 'J06.9',
      description: 'Acute upper respiratory infection, unspecified',
      category: 'Diseases of the respiratory system',
      includes: ['Upper respiratory disease, acute', 'Upper respiratory infection NOS'],
      excludes: ['Influenza (J09-J11)', 'Streptococcal pharyngitis (J02.0)']
    },
    {
      code: 'I10',
      description: 'Essential (primary) hypertension',
      category: 'Diseases of the circulatory system',
      includes: ['High blood pressure', 'Hypertension (arterial) (benign) (essential) (malignant) (primary) (systemic)'],
      excludes: ['Hypertensive disease complicating pregnancy (O10-O11, O13-O16)']
    },
    {
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      category: 'Endocrine, nutritional and metabolic diseases',
      includes: ['Diabetes (mellitus) due to insulin secretory defect', 'Diabetes NOS'],
      excludes: ['Diabetes mellitus due to underlying condition (E08.-)', 'Drug or chemical induced diabetes mellitus (E09.-)']
    }
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      const filtered = mockICD10Data.filter(
        item =>
          item.code.toLowerCase().includes(term.toLowerCase()) ||
          item.description.toLowerCase().includes(term.toLowerCase()) ||
          item.includes.some(inc => inc.toLowerCase().includes(term.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Copied ${code} to clipboard`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ICD-10 Code Search</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by condition, symptom, or ICD-10 code..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Enter at least 2 characters to search. Try: "diabetes", "hypertension", "J20", etc.
        </p>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({results.length})
          </h3>
          
          {results.map((item) => (
            <Card key={item.code} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-bold text-blue-600">{item.code}</span>
                    <button
                      onClick={() => copyToClipboard(item.code)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.description}</h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.includes.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Includes:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.includes.map((include, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {include}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.excludes.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Excludes:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.excludes.map((exclude, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {exclude}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {searchTerm.length >= 2 && results.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No ICD-10 codes found for "{searchTerm}"</p>
          <p className="text-sm text-gray-400 mt-1">
            Try different keywords or check spelling
          </p>
        </Card>
      )}
    </div>
  );
};