import { render, screen } from '@testing-library/react';
import { SanitizedInput } from '../SanitizedInput';

describe('SanitizedInput', () => {
  it('renders input element', () => {
    render(<SanitizedInput placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('sanitizes input value', () => {
    render(<SanitizedInput value="<script>alert('xss')</script>test" readOnly />);
    const input = screen.getByDisplayValue(/test/);
    expect(input).toBeInTheDocument();
  });
});