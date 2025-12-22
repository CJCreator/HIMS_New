import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter, RATE_LIMITS } from '../rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    rateLimiter.clearAll();
  });

  it('should allow requests within limit', () => {
    expect(rateLimiter.isAllowed('test', { maxRequests: 3, windowMs: 1000 })).toBe(true);
    expect(rateLimiter.isAllowed('test', { maxRequests: 3, windowMs: 1000 })).toBe(true);
    expect(rateLimiter.isAllowed('test', { maxRequests: 3, windowMs: 1000 })).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    const config = { maxRequests: 2, windowMs: 1000 };
    rateLimiter.isAllowed('test', config);
    rateLimiter.isAllowed('test', config);
    expect(rateLimiter.isAllowed('test', config)).toBe(false);
  });

  it('should track remaining requests', () => {
    const config = { maxRequests: 5, windowMs: 1000 };
    expect(rateLimiter.getRemaining('test', config)).toBe(5);
    rateLimiter.isAllowed('test', config);
    expect(rateLimiter.getRemaining('test', config)).toBe(4);
  });

  it('should reset after clearing', () => {
    const config = { maxRequests: 1, windowMs: 1000 };
    rateLimiter.isAllowed('test', config);
    rateLimiter.reset('test');
    expect(rateLimiter.isAllowed('test', config)).toBe(true);
  });

  it('should have predefined rate limits', () => {
    expect(RATE_LIMITS.LOGIN_ATTEMPT.maxRequests).toBe(5);
    expect(RATE_LIMITS.API_CALL.maxRequests).toBe(100);
  });
});
