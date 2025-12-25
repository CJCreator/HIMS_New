// WCAG 2.1 AA Compliance utilities
export const wcag = {
  // Color contrast checker (simplified - use actual contrast calculation in production)
  checkContrast: (foreground: string, background: string): boolean => {
    // Minimum contrast ratio for WCAG AA: 4.5:1 for normal text, 3:1 for large text
    // This is a placeholder - implement actual contrast calculation
    return true;
  },

  // Focus visible styles
  focusStyles: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  
  // Skip to content
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md',
};

// Keyboard navigation helpers
export const keyboard = {
  isEnter: (e: React.KeyboardEvent) => e.key === 'Enter',
  isSpace: (e: React.KeyboardEvent) => e.key === ' ',
  isEscape: (e: React.KeyboardEvent) => e.key === 'Escape',
  isTab: (e: React.KeyboardEvent) => e.key === 'Tab',
  isArrowUp: (e: React.KeyboardEvent) => e.key === 'ArrowUp',
  isArrowDown: (e: React.KeyboardEvent) => e.key === 'ArrowDown',
  
  handleActivation: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (keyboard.isEnter(e) || keyboard.isSpace(e)) {
      e.preventDefault();
      callback();
    }
  },
};

// ARIA helpers
export const aria = {
  label: (text: string) => ({ 'aria-label': text }),
  labelledBy: (id: string) => ({ 'aria-labelledby': id }),
  describedBy: (id: string) => ({ 'aria-describedby': id }),
  expanded: (isExpanded: boolean) => ({ 'aria-expanded': isExpanded }),
  selected: (isSelected: boolean) => ({ 'aria-selected': isSelected }),
  checked: (isChecked: boolean) => ({ 'aria-checked': isChecked }),
  disabled: (isDisabled: boolean) => ({ 'aria-disabled': isDisabled }),
  hidden: (isHidden: boolean) => ({ 'aria-hidden': isHidden }),
  live: (priority: 'polite' | 'assertive' = 'polite') => ({ 'aria-live': priority }),
  current: (type: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false') => ({ 'aria-current': type }),
};

// Screen reader only class
export const srOnly = 'sr-only';
export const notSrOnly = 'not-sr-only';

// Focus management
export const focusManagement = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll(selector));
  },

  // Focus first element
  focusFirst: (container: HTMLElement) => {
    const elements = focusManagement.getFocusableElements(container);
    elements[0]?.focus();
  },

  // Focus last element
  focusLast: (container: HTMLElement) => {
    const elements = focusManagement.getFocusableElements(container);
    elements[elements.length - 1]?.focus();
  },

  // Trap focus within container
  trapFocus: (container: HTMLElement) => {
    const elements = focusManagement.getFocusableElements(container);
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  },
};
