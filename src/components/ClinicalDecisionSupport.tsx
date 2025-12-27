import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '@/components';
import { Brain, AlertTriangle, CheckCircle, Info, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ClinicalGuideline {
  id: string;
  title: string;
  source: string;
  year: number;
  level: 'A' | 'B' | 'C' | 'D';
  recommendation: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

interface DifferentialDiagnosis {
  condition: string;
  icd10: string;
  probability: number;
  evidence: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  nextSteps: string[];
}

interface TreatmentRecommendation {
  id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lifestyle' | 'referral';
  rationale: string;
  evidence: string;
  confidence: number;
  alternatives?: string[];
  contraindications?: string[];
}

interface ClinicalDecisionSupportProps {
  symptoms: string[];
  vitals?: any;
  history?: any;
  currentDiagnosis?: string;
  medications?: any[];
  onRecommendationSelect?: (recommendation: TreatmentRecommendation) => void;
  onGuidelineView?: (guideline: ClinicalGuideline) => void;
}

export function ClinicalDecisionSupport({
  symptoms,
  vitals,
  history,
  currentDiagnosis,
  medications = [],
  onRecommendationSelect,
  onGuidelineView
}: ClinicalDecisionSupportProps) {
  const [selectedTab, setSelectedTab] = useState<'diagnosis' | 'treatment' | 'guidelines'>('diagnosis');
  const [userFeedback, setUserFeedback] = useState<Record<string, 'helpful' | 'not-helpful'>>({});

  // Mock clinical decision support logic
  const analysis = useMemo(() => {
    const mockDifferentialDiagnosis: DifferentialDiagnosis[] = [
      {
        condition: 'Acute Coronary Syndrome',
        icd10: 'I24.9',
        probability: 85,
        evidence: ['Chest pain', 'Radiation to left arm', 'Elevated troponin', 'Risk factors present'],
        urgency: 'critical',
        nextSteps: ['Immediate ECG', 'Cardiac enzymes', 'Aspirin 325mg', 'Nitroglycerin SL']
      },
      {
        condition: 'Pulmonary Embolism',
        icd10: 'I26.99',
        probability: 65,
        evidence: ['Shortness of breath', 'Chest pain', 'Recent surgery', 'DVT history'],
        urgency: 'high',
        nextSteps: ['CT pulmonary angiogram', 'D-dimer', 'Anticoagulation', 'Risk stratification']
      },
      {
        condition: 'Pneumonia',
        icd10: 'J18.9',
        probability: 45,
        evidence: ['Fever', 'Cough', 'Shortness of breath', 'Crackles on auscultation'],
        urgency: 'medium',
        nextSteps: ['Chest X-ray', 'Sputum culture', 'Empiric antibiotics', 'Oxygen saturation']
      }
    ];

    const mockTreatmentRecommendations: TreatmentRecommendation[] = [
      {
        id: 'aspirin',
        name: 'Aspirin 325mg PO',
        type: 'medication',
        rationale: 'Antiplatelet therapy for suspected ACS per AHA/ACC guidelines',
        evidence: 'Class I recommendation for STEMI/NSTEMI (AHA 2021)',
        confidence: 95,
        contraindications: ['Active bleeding', 'Aspirin allergy', 'Recent GI bleed']
      },
      {
        id: 'ecg',
        name: '12-lead ECG',
        type: 'procedure',
        rationale: 'Immediate ECG to rule out STEMI',
        evidence: 'Class I recommendation within 10 minutes of presentation',
        confidence: 98
      },
      {
        id: 'troponin',
        name: 'Troponin I/T',
        type: 'procedure',
        rationale: 'Cardiac biomarker for myocardial injury',
        evidence: 'High sensitivity troponin preferred (ESC 2020)',
        confidence: 92
      },
      {
        id: 'lifestyle',
        name: 'Smoking Cessation Counseling',
        type: 'lifestyle',
        rationale: 'Critical for cardiovascular risk reduction',
        evidence: 'Reduces cardiovascular events by 30-50%',
        confidence: 88
      }
    ];

    const mockGuidelines: ClinicalGuideline[] = [
      {
        id: 'aha-acs',
        title: '2021 AHA/ACC/AHA Guideline for the Management of Patients With Acute Coronary Syndromes',
        source: 'American Heart Association',
        year: 2021,
        level: 'A',
        recommendation: 'Immediate aspirin administration for suspected ACS',
        strength: 'Strong'
      },
      {
        id: 'esc-nstemi',
        title: '2020 ESC Guidelines for the management of acute coronary syndromes in patients presenting without persistent ST-segment elevation',
        source: 'European Society of Cardiology',
        year: 2020,
        level: 'A',
        recommendation: 'Early invasive strategy within 24 hours for high-risk NSTEMI',
        strength: 'Strong'
      }
    ];

    return {
      differentialDiagnosis: mockDifferentialDiagnosis,
      treatmentRecommendations: mockTreatmentRecommendations,
      guidelines: mockGuidelines
    };
  }, [symptoms, vitals, history, currentDiagnosis, medications]);

  const getUrgencyColor = (urgency: DifferentialDiagnosis['urgency']) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleFeedback = (itemId: string, feedback: 'helpful' | 'not-helpful') => {
    setUserFeedback(prev => ({ ...prev, [itemId]: feedback }));
    // In a real implementation, this would send feedback to improve the AI model
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Clinical Decision Support</h3>
          <p className="text-sm text-gray-600">AI-powered diagnostic and treatment recommendations</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1">
        {[
          { id: 'diagnosis', label: 'Differential Diagnosis', count: analysis.differentialDiagnosis.length },
          { id: 'treatment', label: 'Treatment Recommendations', count: analysis.treatmentRecommendations.length },
          { id: 'guidelines', label: 'Clinical Guidelines', count: analysis.guidelines.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <Badge status="secondary" size="sm" className="ml-2">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {selectedTab === 'diagnosis' && (
          <div className="space-y-3">
            {analysis.differentialDiagnosis.map((dx, index) => (
              <div key={dx.condition} className="bg-white rounded-lg border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{dx.condition}</h4>
                      <Badge status="secondary" size="sm">{dx.icd10}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className={`font-medium ${getConfidenceColor(dx.probability)}`}>
                        {dx.probability}% probability
                      </span>
                      <Badge className={getUrgencyColor(dx.urgency)} size="sm">
                        {dx.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleFeedback(`dx-${index}`, 'helpful')}
                      className={`p-1 rounded ${userFeedback[`dx-${index}`] === 'helpful' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(`dx-${index}`, 'not-helpful')}
                      className={`p-1 rounded ${userFeedback[`dx-${index}`] === 'not-helpful' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Supporting Evidence:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dx.evidence.map((evidence, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Next Steps:</h5>
                    <div className="flex flex-wrap gap-2">
                      {dx.nextSteps.map((step, i) => (
                        <Badge key={i} status="info" size="sm">{step}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'treatment' && (
          <div className="space-y-3">
            {analysis.treatmentRecommendations.map((rec, index) => (
              <div key={rec.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                      <Badge status="secondary" size="sm">{rec.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className={`font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence}% confidence
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onRecommendationSelect?.(rec)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Select
                    </Button>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleFeedback(`rec-${index}`, 'helpful')}
                        className={`p-1 rounded ${userFeedback[`rec-${index}`] === 'helpful' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFeedback(`rec-${index}`, 'not-helpful')}
                        className={`p-1 rounded ${userFeedback[`rec-${index}`] === 'not-helpful' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Rationale:</h5>
                    <p className="text-sm text-gray-600">{rec.rationale}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Evidence:</h5>
                    <p className="text-sm text-gray-600">{rec.evidence}</p>
                  </div>

                  {rec.contraindications && rec.contraindications.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Contraindications:
                      </h5>
                      <ul className="text-sm text-red-600 space-y-1">
                        {rec.contraindications.map((contra, i) => (
                          <li key={i}>• {contra}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.alternatives && rec.alternatives.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Alternatives:</h5>
                      <div className="flex flex-wrap gap-1">
                        {rec.alternatives.map((alt, i) => (
                          <Badge key={i} status="secondary" size="sm">{alt}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'guidelines' && (
          <div className="space-y-3">
            {analysis.guidelines.map((guideline) => (
              <div key={guideline.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{guideline.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{guideline.source}</span>
                      <span>({guideline.year})</span>
                      <Badge status="info" size="sm">Level {guideline.level}</Badge>
                      <Badge status="secondary" size="sm">{guideline.strength}</Badge>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGuidelineView?.(guideline)}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </Button>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Key Recommendation:</h5>
                  <p className="text-sm text-gray-600">{guideline.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Confidence Notice */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">AI-Powered Clinical Support</p>
            <p>Recommendations are based on current medical guidelines and patient data. Always use clinical judgment and verify with additional testing when appropriate.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}