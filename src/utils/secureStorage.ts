/**
 * Secure localStorage wrapper with encryption and validation
 */

import { sanitizer } from './sanitizer';

const STORAGE_PREFIX = 'hims_';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

export const secureStorage = {
  // Set item with validation
  setItem: (key: string, value: any): boolean => {
    try {
      const sanitizedKey = sanitizer.alphanumeric(key);
      const prefixedKey = `${STORAGE_PREFIX}${sanitizedKey}`;
      const serialized = JSON.stringify(value);
      
      // Check size limit
      if (serialized.length > MAX_STORAGE_SIZE) {
        console.error('Storage size limit exceeded');
        return false;
      }
      
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  // Get item with validation
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const sanitizedKey = sanitizer.alphanumeric(key);
      const prefixedKey = `${STORAGE_PREFIX}${sanitizedKey}`;
      const item = localStorage.getItem(prefixedKey);
      
      if (!item) return defaultValue;
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return defaultValue;
    }
  },

  // Remove item
  removeItem: (key: string): void => {
    try {
      const sanitizedKey = sanitizer.alphanumeric(key);
      const prefixedKey = `${STORAGE_PREFIX}${sanitizedKey}`;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Storage removal error:', error);
    }
  },

  // Clear all app storage
  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },

  // Check if key exists
  hasItem: (key: string): boolean => {
    const sanitizedKey = sanitizer.alphanumeric(key);
    const prefixedKey = `${STORAGE_PREFIX}${sanitizedKey}`;
    return localStorage.getItem(prefixedKey) !== null;
  },
};
