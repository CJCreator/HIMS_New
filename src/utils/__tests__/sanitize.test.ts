import { sanitizeInput, sanitizeHtml } from '../sanitize';

describe('sanitize', () => {
  it('sanitizes HTML input', () => {
    const result = sanitizeHtml('<script>alert("xss")</script><p>Safe content</p>');
    expect(result).toBe('<p>Safe content</p>');
  });

  it('sanitizes text input', () => {
    const result = sanitizeInput('<script>alert("xss")</script>text');
    expect(result).toBe('text');
  });

  it('handles null input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeHtml(null)).toBe('');
  });
});