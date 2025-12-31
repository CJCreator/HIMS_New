export const ACCESSIBILITY_CONFIG = {
  // WCAG 2.1 AA Standards
  wcagTags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  
  // Color contrast ratios
  colorContrast: {
    normal: 4.5,
    large: 3.0
  },
  
  // Required ARIA attributes by component type
  ariaRequirements: {
    button: ['aria-label', 'role'],
    input: ['aria-label', 'aria-labelledby', 'aria-describedby'],
    modal: ['aria-modal', 'aria-labelledby', 'role'],
    navigation: ['aria-label', 'role'],
    table: ['aria-label', 'role'],
    form: ['aria-label', 'novalidate']
  },
  
  // Keyboard navigation requirements
  keyboardNavigation: {
    focusableElements: [
      'button',
      'input',
      'select',
      'textarea',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ],
    skipLinks: true,
    trapFocus: true
  },
  
  // Screen reader requirements
  screenReader: {
    headingStructure: true,
    landmarkRoles: true,
    altText: true,
    liveRegions: true
  }
};

export const ACCESSIBILITY_RULES = {
  // Critical violations that must be fixed
  critical: [
    'color-contrast',
    'keyboard',
    'aria-required-attr',
    'aria-valid-attr-value',
    'button-name',
    'form-field-multiple-labels',
    'input-button-name',
    'label'
  ],
  
  // Important violations that should be fixed
  important: [
    'aria-hidden-focus',
    'focus-order-semantics',
    'heading-order',
    'landmark-one-main',
    'page-has-heading-one',
    'region'
  ],
  
  // Minor violations that can be addressed later
  minor: [
    'aria-allowed-attr',
    'duplicate-id',
    'html-has-lang',
    'meta-viewport'
  ]
};