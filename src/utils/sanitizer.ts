/**
 * Input sanitization utilities for frontend security
 */

export const sanitizer = {
  // Sanitize for logging to prevent log injection
  forLog: (input: string): string => {
    if (!input) return '';
    return input
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .slice(0, 200);
  },

  // Sanitize HTML to prevent XSS
  forHTML: (input: string): string => {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // Sanitize for display in UI
  forDisplay: (input: string): string => {
    if (!input) return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Validate and sanitize email
  email: (email: string): string => {
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  },

  // Validate and sanitize phone
  phone: (phone: string): string => {
    return phone.replace(/[^\d+\-() ]/g, '');
  },

  // Sanitize alphanumeric input
  alphanumeric: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9\s]/g, '');
  },
};

export const validator = {
  email: (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone: string): boolean => /^\+?[\d\s\-()]{10,}$/.test(phone),
  password: (password: string): boolean => password.length >= 8,
  required: (value: string): boolean => value.trim().length > 0,
};
