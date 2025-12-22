/**
 * Utility functions for masking sensitive data in the UI
 */

export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2
    ? local.substring(0, 2) + '*'.repeat(local.length - 2)
    : local + '*';
  return `${maskedLocal}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return phone;
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;

  // For US numbers: (XXX) XXX-XXXX -> (XXX) XXX-XXXX (mask middle digits)
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${'*'.repeat(4)}`;
  }

  // For international or other formats, mask all but last 4 digits
  return '*'.repeat(Math.max(0, digits.length - 4)) + digits.substring(digits.length - 4);
};

export const maskSSN = (ssn: string): string => {
  if (!ssn) return ssn;
  const digits = ssn.replace(/\D/g, '');
  if (digits.length !== 9) return ssn;
  return `XXX-XX-${digits.substring(5)}`;
};

export const maskCreditCard = (cardNumber: string): string => {
  if (!cardNumber) return cardNumber;
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 4) return cardNumber;
  return '*'.repeat(Math.max(0, digits.length - 4)) + digits.substring(digits.length - 4);
};