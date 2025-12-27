import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Input } from '@/components';
import {
  AlertTriangle,
  Shield,
  Pill,
  Plus,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Clock,
  Users
} from 'lucide-react';

interface Drug {
  id: string;
  name: string;
  genericName?: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
}

interface Interaction {
  id: string;
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
  description: string;
  mechanism: string;
  clinicalEffect: string;
  management: string;
  evidence: string;
  drugs: string[];
  category: 'pharmacokinetic' | 'pharmacodynamic' | 'unknown';
}

interface AllergyWarning {
  id: string;
  drug: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  lastReaction?: string;
}

interface EnhancedDrugInteractionCheckerProps {
  currentMedications: Drug[];
  patientId: string;
  patientAllergies?: string[];
  onInteractionFound?: (interactions: Interaction[], warnings: AllergyWarning[]) => void;
  onOverrideRequest?: (interactionId: string, reason: string) => void;
  realTime?: boolean;
}

export function EnhancedDrugInteractionChecker({
  currentMedications,
  patientId,
  patientAllergies = [],
  onInteractionFound,
  onOverrideRequest,
  realTime = true
}: EnhancedDrugInteractionCheckerProps) {
  const [newDrugQuery, setNewDrugQuery] = useState('');
  const [proposedDrug, setProposedDrug] = useState<Drug | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // Mock interaction database - in real implementation, this would come from a service
  const interactionDatabase = useMemo(() => ({
    'warfarin-aspirin': {
      severity: 'major' as const,
      description: 'Increased risk of bleeding due to additive anticoagulant effects',
      mechanism: 'Both drugs inhibit platelet aggregation and coagulation',
      clinicalEffect: 'Major bleeding, including intracranial hemorrhage',
      management: 'Consider alternative antiplatelet therapy, monitor INR closely',
      evidence: 'Strong evidence from multiple clinical trials (HAS-BLED score)',
      category: 'pharmacodynamic' as const
    },
    'warfarin-amiodarone': {
      severity: 'major' as const,
      description: 'Amiodarone inhibits warfarin metabolism, increasing anticoagulant effect',
      mechanism: 'CYP2C9 and CYP3A4 inhibition',
      clinicalEffect: 'Excessive anticoagulation, bleeding risk',
      management: 'Reduce warfarin dose by 30-50%, monitor INR weekly',
      evidence: 'Well-documented pharmacokinetic interaction',
      category: 'pharmacokinetic' as const
    },
    'lisinopril-potassium': {
      severity: 'moderate' as const,
      description: 'Risk of hyperkalemia',
      mechanism: 'ACE inhibitor reduces aldosterone, potassium supplement increases serum potassium',
      clinicalEffect: 'Hyperkalemia, cardiac arrhythmias',
      management: 'Monitor potassium levels, consider alternative supplements',
      evidence: 'Known electrolyte interaction',
      category: 'pharmacodynamic' as const
    }
  }), []);

  // Check for interactions
  const checkInteractions = useMemo(() => {
    if (!proposedDrug && currentMedications.length === 0) {
      return { interactions: [], warnings: [] };
    }

    const allDrugs = proposedDrug ? [...currentMedications, proposedDrug] : currentMedications;
    const interactions: Interaction[] = [];
    const warnings: AllergyWarning[] = [];

    // Check drug-drug interactions
    for (let i = 0; i < allDrugs.length; i++) {
      for (let j = i + 1; j < allDrugs.length; j++) {
        const drug1 = allDrugs[i].name.toLowerCase();
        const drug2 = allDrugs[j].name.toLowerCase();
        const key1 = `${drug1}-${drug2}`;
        const key2 = `${drug2}-${drug1}`;

        const interactionData = interactionDatabase[key1 as keyof typeof interactionDatabase] ||
                               interactionDatabase[key2 as keyof typeof interactionDatabase];

        if (interactionData) {
          interactions.push({
            id: `interaction-${i}-${j}`,
            ...interactionData,
            drugs: [allDrugs[i].name, allDrugs[j].name]
          });
        }
      }
    }

    // Check allergies
    allDrugs.forEach(drug => {
      patientAllergies.forEach(allergen => {
        if (drug.name.toLowerCase().includes(allergen.toLowerCase()) ||
            drug.genericName?.toLowerCase().includes(allergen.toLowerCase())) {
          warnings.push({
            id: `allergy-${drug.id}`,
            drug: drug.name,
            allergen,
            reaction: 'Previous allergic reaction documented',
            severity: 'severe',
            lastReaction: 'Unknown date'
          });
        }
      });
    });

    return { interactions, warnings };
  }, [currentMedications, proposedDrug, patientAllergies, interactionDatabase]);

  // Trigger callbacks when interactions are found
  useEffect(() => {
    if (checkInteractions.interactions.length > 0 || checkInteractions.warnings.length > 0) {
      onInteractionFound?.(checkInteractions.interactions, checkInteractions.warnings);
    }
  }, [checkInteractions, onInteractionFound]);

  // Real-time checking
  useEffect(() => {
    if (realTime && newDrugQuery.length > 2) {
      setIsChecking(true);
      // Simulate API delay
      const timeout = setTimeout(() => {
        // Mock drug lookup
        if (newDrugQuery.toLowerCase().includes('warfarin')) {
          setProposedDrug({
            id: 'proposed',
            name: 'Warfarin',
            genericName: 'Coumadin',
            dosage: '5mg',
            frequency: 'Daily'
          });
        } else if (newDrugQuery.toLowerCase().includes('aspirin')) {
          setProposedDrug({
            id: 'proposed',
            name: 'Aspirin',
            genericName: 'Acetylsalicylic acid',
            dosage: '81mg',
            frequency: 'Daily'
          });
        } else {
          setProposedDrug(null);
        }
        setIsChecking(false);
        setLastCheckTime(new Date());
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [newDrugQuery, realTime]);

  const handleAddProposedDrug = () => {
    if (proposedDrug) {
      // In real implementation, this would add to patient's medications
      console.log('Adding drug:', proposedDrug);
      setProposedDrug(null);
      setNewDrugQuery('');
    }
  };

  const getSeverityColor = (severity: Interaction['severity']) => {
    switch (severity) {
      case 'contraindicated': return 'bg-red-100 text-red-800 border-red-200';
      case 'major': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: Interaction['severity']) => {
    switch (severity) {
      case 'contraindicated':
      case 'major':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'moderate':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: Interaction['category']) => {
    switch (category) {
      case 'pharmacokinetic': return 'bg-purple-100 text-purple-800';
      case 'pharmacodynamic': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Drug Safety Checker</h3>
          <p className="text-sm text-gray-600">Real-time interaction detection and allergy screening</p>
        </div>
        {lastCheckTime && (
          <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last checked: {lastCheckTime.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Current Medications */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Pill className="w-4 h-4" />
          Current Medications ({currentMedications.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentMedications.map(med => (
            <div key={med.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <div className="font-medium text-gray-900">{med.name}</div>
                {med.genericName && (
                  <div className="text-sm text-gray-600">{med.genericName}</div>
                )}
                <div className="text-xs text-gray-500">
                  {med.dosage} {med.frequency}
                </div>
              </div>
              <Badge status="secondary" size="sm">Active</Badge>
            </div>
          ))}
          {currentMedications.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No current medications
            </div>
          )}
        </div>
      </div>

      {/* Add New Drug */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Check New Medication</h4>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for medication..."
              value={newDrugQuery}
              onChange={(e) => setNewDrugQuery(e.target.value)}
              className="pl-10"
            />
            {isChecking && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {proposedDrug && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-900">{proposedDrug.name}</div>
                <div className="text-sm text-blue-700">{proposedDrug.genericName}</div>
              </div>
              <Button size="sm" onClick={handleAddProposedDrug}>
                <Plus className="w-4 h-4 mr-1" />
                Add & Check
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Interactions and Warnings */}
      {(checkInteractions.interactions.length > 0 || checkInteractions.warnings.length > 0) && (
        <div className="space-y-4">
          {/* Interactions */}
          {checkInteractions.interactions.map(interaction => (
            <div key={interaction.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start gap-3">
                {getSeverityIcon(interaction.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-gray-900">
                      {interaction.drugs.join(' + ')}
                    </h5>
                    <Badge className={getSeverityColor(interaction.severity)} size="sm">
                      {interaction.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getCategoryColor(interaction.category)} size="sm">
                      {interaction.category}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3">{interaction.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Mechanism:</span>
                      <p className="text-gray-600 mt-1">{interaction.mechanism}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Clinical Effect:</span>
                      <p className="text-gray-600 mt-1">{interaction.clinicalEffect}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-900">Management:</span>
                      <p className="text-gray-600 mt-1">{interaction.management}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Evidence: {interaction.evidence}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOverrideRequest?.(interaction.id, '')}
                    >
                      Request Override
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Allergy Warnings */}
          {checkInteractions.warnings.map(warning => (
            <div key={warning.id} className="bg-white border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-red-900">Allergy Alert: {warning.drug}</h5>
                    <Badge className="bg-red-100 text-red-800" size="sm">
                      {warning.severity}
                    </Badge>
                  </div>

                  <div className="text-sm text-red-700">
                    <p><strong>Allergen:</strong> {warning.allergen}</p>
                    <p><strong>Reaction:</strong> {warning.reaction}</p>
                    {warning.lastReaction && (
                      <p><strong>Last Reaction:</strong> {warning.lastReaction}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safe Indicator */}
      {checkInteractions.interactions.length === 0 && checkInteractions.warnings.length === 0 && currentMedications.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h5 className="font-medium text-green-900">No Interactions Detected</h5>
              <p className="text-sm text-green-700">
                Current medication regimen appears safe based on available data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Interactions: <span className="font-medium text-red-600">{checkInteractions.interactions.length}</span>
            </span>
            <span className="text-gray-600">
              Warnings: <span className="font-medium text-orange-600">{checkInteractions.warnings.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Zap className="w-3 h-3" />
            <span className="text-xs">Real-time checking enabled</span>
          </div>
        </div>
      </div>
    </Card>
  );
}