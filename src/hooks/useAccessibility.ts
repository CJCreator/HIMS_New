import { useEffect, useRef } from 'react';

interface UseAccessibilityOptions {
  announcePageChange?: boolean;
  focusManagement?: boolean;
  skipLinks?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    announcePageChange = true,
    focusManagement = true,
    skipLinks = true
  } = options;

  const announcementRef = useRef<HTMLDivElement>(null);

  // Announce page changes to screen readers
  const announceToScreenReader = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  // Focus management for modals and page changes
  const manageFocus = (element: HTMLElement | null) => {
    if (element && focusManagement) {
      element.focus();
    }
  };

  // Skip to main content
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  // Keyboard event handler
  const handleKeyDown = (event: KeyboardEvent) => {
    // Skip to main content with Alt+S
    if (event.altKey && event.key === 's') {
      event.preventDefault();
      skipToMain();
    }
  };

  useEffect(() => {
    if (skipLinks) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [skipLinks]);

  return {
    announceToScreenReader,
    manageFocus,
    skipToMain,
    announcementRef
  };
};

// Hook for form accessibility
export const useFormAccessibility = () => {
  const validateFormAccessibility = (formElement: HTMLFormElement) => {
    const inputs = formElement.querySelectorAll('input, select, textarea');
    const violations: string[] = [];

    inputs.forEach((input) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      formElement.querySelector(`label[for="${(input as HTMLInputElement).id}"]`);
      
      if (!hasLabel) {
        violations.push(`Input ${(input as HTMLInputElement).id || (input as HTMLInputElement).name} missing label`);
      }
    });

    return violations;
  };

  return { validateFormAccessibility };
};