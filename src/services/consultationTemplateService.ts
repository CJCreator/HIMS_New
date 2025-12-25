export interface ConsultationTemplate {
  id: string;
  name: string;
  specialty: string;
  chiefComplaint?: string;
  symptoms?: string[];
  examination?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  labTests?: string[];
  followUp?: string;
}

const templates: ConsultationTemplate[] = [
  {
    id: 'hypertension',
    name: 'Hypertension Follow-up',
    specialty: 'Cardiology',
    chiefComplaint: 'Hypertension follow-up',
    symptoms: ['Elevated blood pressure', 'Headache'],
    examination: 'BP monitoring, cardiovascular examination',
    diagnosis: 'Essential hypertension',
    treatment: 'Continue antihypertensive medication, lifestyle modifications',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
    ],
    labTests: ['Lipid profile', 'Renal function test'],
    followUp: '1 month',
  },
  {
    id: 'diabetes',
    name: 'Diabetes Management',
    specialty: 'Endocrinology',
    chiefComplaint: 'Diabetes mellitus follow-up',
    symptoms: ['Polyuria', 'Polydipsia', 'Fatigue'],
    examination: 'Blood glucose monitoring, foot examination',
    diagnosis: 'Type 2 Diabetes Mellitus',
    treatment: 'Oral hypoglycemic agents, diet control, exercise',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
    ],
    labTests: ['HbA1c', 'Fasting blood sugar', 'Lipid profile'],
    followUp: '3 months',
  },
  {
    id: 'respiratory',
    name: 'Respiratory Infection',
    specialty: 'General Medicine',
    chiefComplaint: 'Cough and fever',
    symptoms: ['Cough', 'Fever', 'Sore throat', 'Body ache'],
    examination: 'Chest auscultation, throat examination',
    diagnosis: 'Upper respiratory tract infection',
    treatment: 'Symptomatic treatment, rest, hydration',
    medications: [
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Three times daily', duration: '5 days' },
      { name: 'Cough syrup', dosage: '10ml', frequency: 'Three times daily', duration: '5 days' },
    ],
    followUp: '1 week if symptoms persist',
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal Pain',
    specialty: 'Orthopedics',
    chiefComplaint: 'Joint pain',
    symptoms: ['Joint pain', 'Stiffness', 'Limited mobility'],
    examination: 'Joint examination, range of motion assessment',
    diagnosis: 'Osteoarthritis',
    treatment: 'Pain management, physiotherapy, lifestyle modifications',
    medications: [
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily', duration: '14 days' },
    ],
    labTests: ['X-ray joint', 'ESR', 'CRP'],
    followUp: '2 weeks',
  },
  {
    id: 'general-checkup',
    name: 'General Health Checkup',
    specialty: 'General Medicine',
    chiefComplaint: 'Routine health checkup',
    examination: 'General physical examination, vital signs',
    labTests: ['Complete blood count', 'Lipid profile', 'Blood sugar', 'Liver function test', 'Kidney function test'],
    followUp: '6 months',
  },
];

class ConsultationTemplateService {
  getTemplates(): ConsultationTemplate[] {
    return templates;
  }

  getTemplateById(id: string): ConsultationTemplate | undefined {
    return templates.find(t => t.id === id);
  }

  getTemplatesBySpecialty(specialty: string): ConsultationTemplate[] {
    return templates.filter(t => t.specialty === specialty);
  }

  applyTemplate(template: ConsultationTemplate): Partial<ConsultationTemplate> {
    return {
      chiefComplaint: template.chiefComplaint,
      symptoms: template.symptoms ? [...template.symptoms] : [],
      examination: template.examination,
      diagnosis: template.diagnosis,
      treatment: template.treatment,
      medications: template.medications ? [...template.medications] : [],
      labTests: template.labTests ? [...template.labTests] : [],
      followUp: template.followUp,
    };
  }
}

export const consultationTemplateService = new ConsultationTemplateService();
