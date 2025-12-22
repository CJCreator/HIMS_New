import { describe, it, expect, beforeEach, vi } from 'vitest';
import { secureStorage } from '../secureStorage';

describe('Secure Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should set and get items', () => {
    const data = { name: 'John', role: 'doctor' };
    secureStorage.setItem('user', data);
    const retrieved = secureStorage.getItem('user');
    expect(retrieved).toEqual(data);
  });

  it('should return default value for missing items', () => {
    const result = secureStorage.getItem('missing', { default: true });
    expect(result).toEqual({ default: true });
  });

  it('should remove items', () => {
    secureStorage.setItem('test', 'value');
    secureStorage.removeItem('test');
    expect(secureStorage.getItem('test')).toBeNull();
  });

  it('should check if item exists', () => {
    secureStorage.setItem('exists', 'yes');
    expect(secureStorage.hasItem('exists')).toBe(true);
    expect(secureStorage.hasItem('notexists')).toBe(false);
  });

  it('should clear all app storage', () => {
    secureStorage.setItem('item1', 'value1');
    secureStorage.setItem('item2', 'value2');
    secureStorage.clear();
    expect(secureStorage.hasItem('item1')).toBe(false);
    expect(secureStorage.hasItem('item2')).toBe(false);
  });

  it('should sanitize keys', () => {
    secureStorage.setItem('test@#$key', 'value');
    expect(secureStorage.getItem('testkey')).toBe('value');
  });
});
