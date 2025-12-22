/**
 * Client-side rate limiter to prevent excessive API calls
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if request is allowed
   * @param key - Unique identifier for the rate limit (e.g., 'api-call', 'login-attempt')
   * @param config - Rate limit configuration
   * @returns true if request is allowed, false otherwise
   */
  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove expired requests
    const validRequests = requests.filter(
      timestamp => now - timestamp < config.windowMs
    );
    
    // Check if limit exceeded
    if (validRequests.length >= config.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(key: string, config: RateLimitConfig): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(
      timestamp => now - timestamp < config.windowMs
    );
    
    return Math.max(0, config.maxRequests - validRequests.length);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

// Predefined rate limit configs
export const RATE_LIMITS = {
  API_CALL: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  LOGIN_ATTEMPT: { maxRequests: 5, windowMs: 300000 }, // 5 attempts per 5 minutes
  FORM_SUBMIT: { maxRequests: 10, windowMs: 60000 }, // 10 submits per minute
  SEARCH: { maxRequests: 30, windowMs: 60000 }, // 30 searches per minute
};
