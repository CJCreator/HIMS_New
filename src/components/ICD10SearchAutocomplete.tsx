import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchICD10, setSelectedCode, addRecentCode, clearSearchResults } from '@/store/icd10Slice';
import { useDebounce } from '@/hooks/useDebounce';
import type { ICD10Code, ICD10SearchResult } from '@/types/icd10.types';
import type { AppDispatch, RootState } from '@/store';

interface ICD10SearchAutocompleteProps {
  onSelect: (code: ICD10Code) => void;
  placeholder?: string;
  billableOnly?: boolean;
  category?: string;
  className?: string;
  autoFocus?: boolean;
}

export const ICD10SearchAutocomplete: React.FC<ICD10SearchAutocompleteProps> = ({
  onSelect,
  placeholder = 'Search ICD-10 codes...',
  billableOnly = false,
  category,
  className = '',
  autoFocus = false
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, searchLoading, recentCodes } = useSelector((state: RootState) => state.icd10);
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      dispatch(searchICD10({ 
        query: debouncedQuery, 
        options: { billableOnly, category, limit: 20 } 
      }));
      setIsOpen(true);
    } else {
      dispatch(clearSearchResults());
      setIsOpen(false);
    }
  }, [debouncedQuery, billableOnly, category, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: ICD10Code) => {
    dispatch(setSelectedCode(code));
    dispatch(addRecentCode(code));
    onSelect(code);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = query.length >= 2 ? searchResults : recentCodes;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[highlightedIndex]) {
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const displayResults = query.length >= 2 ? searchResults : (isOpen ? recentCodes : []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Search ICD-10 codes"
          aria-autocomplete="list"
          aria-controls="icd10-results"
          aria-expanded={isOpen}
        />
        {searchLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {isOpen && displayResults.length > 0 && (
        <div
          id="icd10-results"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {query.length < 2 && recentCodes.length > 0 && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
              Recent Codes
            </div>
          )}
          
          {displayResults.map((result, index) => (
            <div
              key={result.code}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex ? 'bg-primary-50' : 'hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-primary-600">
                      {result.code}
                    </span>
                    {result.isBillable && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                        Billable
                      </span>
                    )}
                    {!result.isActive && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                        Deprecated
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {result.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.category}
                  </p>
                </div>
                {'relevanceScore' in result && typeof result.relevanceScore === 'number' && (
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {Math.round(result.relevanceScore * 100)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && searchResults.length === 0 && !searchLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-500">No ICD-10 codes found</p>
          <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="text-xs text-gray-500 mt-1">
          Enter at least 2 characters to search
        </p>
      )}
    </div>
  );
};
