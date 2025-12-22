import { describe, it, expect } from 'vitest';
import { sanitizer, validator } from '../sanitizer';

describe('Sanitizer Utils', () => {
  describe('sanitizer.forLog', () => {
    it('should escape newlines', () => {
      expect(sanitizer.forLog('test\nline')).toBe('test\\nline');
    });

    it('should escape carriage returns', () => {
      expect(sanitizer.forLog('test\rline')).toBe('test\\rline');
    });

    it('should truncate long strings', () => {
      const longString = 'a'.repeat(300);
      expect(sanitizer.forLog(longString).length).toBe(200);
    });

    it('should handle empty strings', () => {
      expect(sanitizer.forLog('')).toBe('');
    });
  });

  describe('sanitizer.forHTML', () => {
    it('should escape HTML tags', () => {
      const result = sanitizer.forHTML('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
    });

    it('should handle empty strings', () => {
      expect(sanitizer.forHTML('')).toBe('');
    });
  });

  describe('sanitizer.forDisplay', () => {
    it('should escape special characters', () => {
      expect(sanitizer.forDisplay('<div>')).toBe('&lt;div&gt;');
      expect(sanitizer.forDisplay('"test"')).toBe('&quot;test&quot;');
      expect(sanitizer.forDisplay("'test'")).toBe('&#x27;test&#x27;');
    });
  });

  describe('sanitizer.email', () => {
    it('should trim and lowercase email', () => {
      expect(sanitizer.email('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
    });

    it('should return empty for invalid email', () => {
      expect(sanitizer.email('invalid')).toBe('');
    });
  });

  describe('sanitizer.phone', () => {
    it('should remove invalid characters', () => {
      expect(sanitizer.phone('123-456-7890')).toBe('123-456-7890');
      expect(sanitizer.phone('abc123def')).toBe('123');
    });
  });

  describe('validator.email', () => {
    it('should validate correct emails', () => {
      expect(validator.email('test@example.com')).toBe(true);
      expect(validator.email('invalid')).toBe(false);
    });
  });

  describe('validator.password', () => {
    it('should require minimum 8 characters', () => {
      expect(validator.password('12345678')).toBe(true);
      expect(validator.password('1234567')).toBe(false);
    });
  });
});
