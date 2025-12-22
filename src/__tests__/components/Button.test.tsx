import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    render(<Button loading>Loading Button</Button>);
    const spinner = screen.getByRole('button').querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('is disabled when loading is true', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-neutral-300', 'bg-white');
  });

  it('applies correct size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3');
  });
});