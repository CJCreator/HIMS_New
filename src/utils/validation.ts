export const validators = {
  required: (value: any) => value ? '' : 'This field is required',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address',
  minLength: (min: number) => (value: string) => value.length >= min ? '' : `Minimum ${min} characters required`,
  maxLength: (max: number) => (value: string) => value.length <= max ? '' : `Maximum ${max} characters allowed`,
  phone: (value: string) => /^\d{10}$/.test(value.replace(/\D/g, '')) ? '' : 'Invalid phone number',
  password: (value: string) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain number';
    return '';
  },
};

export const validateField = (value: any, rules: Array<(val: any) => string>) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return '';
};
