import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ICD10Search } from '../../components/ICD10Search';

// Mock components
jest.mock('../../components/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>
}));

jest.mock('../../components/Input', () => ({
  Input: ({ placeholder, value, onChange, className }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      data-testid="search-input"
    />
  )
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock alert
global.alert = jest.fn();

describe('ICD10Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search interface', () => {
    render(<ICD10Search />);
    
    expect(screen.getByText('ICD-10 Code Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by condition, symptom, or ICD-10 code...')).toBeInTheDocument();
    expect(screen.getByText('Enter at least 2 characters to search. Try: "diabetes", "hypertension", "J20", etc.')).toBeInTheDocument();
  });

  test('shows no results message for short search terms', () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'a' } });
    
    // Should not show results for single character
    expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
  });

  test('displays search results for valid search terms', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'diabetes' } });
    
    await waitFor(() => {
      expect(screen.getByText('Search Results (1)')).toBeInTheDocument();
      expect(screen.getByText('E11.9')).toBeInTheDocument();
      expect(screen.getByText('Type 2 diabetes mellitus without complications')).toBeInTheDocument();
    });
  });

  test('searches by ICD-10 code', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'J20' } });
    
    await waitFor(() => {
      expect(screen.getByText('Search Results (1)')).toBeInTheDocument();
      expect(screen.getByText('J20.9')).toBeInTheDocument();
      expect(screen.getByText('Acute bronchitis, unspecified')).toBeInTheDocument();
    });
  });

  test('searches by condition name', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'hypertension' } });
    
    await waitFor(() => {
      expect(screen.getByText('Search Results (1)')).toBeInTheDocument();
      expect(screen.getByText('I10')).toBeInTheDocument();
      expect(screen.getByText('Essential (primary) hypertension')).toBeInTheDocument();
    });
  });

  test('shows no results message for non-matching search', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No ICD-10 codes found for "nonexistent"')).toBeInTheDocument();
      expect(screen.getByText('Try different keywords or check spelling')).toBeInTheDocument();
    });
  });

  test('copies ICD-10 code to clipboard', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'diabetes' } });
    
    await waitFor(() => {
      expect(screen.getByText('E11.9')).toBeInTheDocument();
    });
    
    // Find and click the copy button
    const copyButton = screen.getByTitle('Copy code');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('E11.9');
    expect(global.alert).toHaveBeenCalledWith('Copied E11.9 to clipboard');
  });

  test('displays includes and excludes information', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'bronchitis' } });
    
    await waitFor(() => {
      expect(screen.getByText('Includes:')).toBeInTheDocument();
      expect(screen.getByText('Bronchitis NOS')).toBeInTheDocument();
      expect(screen.getByText('Excludes:')).toBeInTheDocument();
      expect(screen.getByText('Bronchitis NOS (J40)')).toBeInTheDocument();
    });
  });

  test('shows category information', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'diabetes' } });
    
    await waitFor(() => {
      expect(screen.getByText('Endocrine, nutritional and metabolic diseases')).toBeInTheDocument();
    });
  });

  test('handles case-insensitive search', async () => {
    render(<ICD10Search />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'DIABETES' } });
    
    await waitFor(() => {
      expect(screen.getByText('Search Results (1)')).toBeInTheDocument();
      expect(screen.getByText('E11.9')).toBeInTheDocument();
    });
  });
});