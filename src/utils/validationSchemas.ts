// Validation utility functions for consistent form validation across the application

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const validateField = (value: string, rule: ValidationRule): string | null => {
  // Required validation
  if (rule.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  // Min length validation
  if (rule.minLength && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  // Max length validation
  if (rule.maxLength && value.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
};

export const validateForm = (data: Record<string, string>, schema: ValidationSchema): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(schema).forEach(field => {
    const value = data[field] || '';
    const rule = schema[field];
    const error = validateField(value, rule);
    
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{3}\)\s\d{3}-\d{4}$/,
  patientId: /^P\d{3,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

// Common validation schemas
export const authSchemas = {
  signIn: {
    email: {
      required: true,
      pattern: patterns.email
    },
    password: {
      required: true,
      minLength: 6
    }
  },
  patientLogin: {
    patientId: {
      required: true,
      pattern: patterns.patientId
    },
    dateOfBirth: {
      required: true
    }
  },
  patientRegister: {
    patientId: {
      required: true,
      pattern: patterns.patientId
    },
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    dateOfBirth: {
      required: true
    },
    phone: {
      required: true,
      minLength: 10
    },
    email: {
      required: true,
      pattern: patterns.email
    },
    address: {
      required: true,
      minLength: 10
    },
    emergencyContact: {
      required: true,
      minLength: 5
    }
  }
};

// Custom validators
export const customValidators = {
  confirmPassword: (password: string) => (value: string) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },
  
  futureDate: (value: string) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date <= today) {
      return 'Date must be in the future';
    }
    return null;
  },
  
  pastDate: (value: string) => {
    const date = new Date(value);
    const today = new Date();
    
    if (date >= today) {
      return 'Date must be in the past';
    }
    return null;
  }
};