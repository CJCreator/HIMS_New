/**
 * Accessibility Testing Utilities
 * WCAG 2.1 AA compliance checks
 */

/**
 * Check color contrast ratio
 */
export const checkColorContrast = (foreground: string, background: string): { ratio: number; passes: boolean } => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r, g, b] = rgb.map((val) => {
      const sRGB = val / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: ratio >= 4.5, // WCAG AA standard
  };
};

/**
 * Check keyboard navigation
 */
export const testKeyboardNavigation = (): { focusableElements: number; tabOrder: boolean } => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusableElements = document.querySelectorAll(focusableSelectors.join(','));
  const tabIndexes = Array.from(focusableElements).map((el) => parseInt(el.getAttribute('tabindex') || '0'));
  const tabOrder = tabIndexes.every((val, i, arr) => i === 0 || val >= arr[i - 1]);

  return {
    focusableElements: focusableElements.length,
    tabOrder,
  };
};

/**
 * Check ARIA labels
 */
export const checkARIALabels = (): { total: number; missing: number; elements: string[] } => {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  const missing: string[] = [];

  interactiveElements.forEach((el) => {
    const hasLabel =
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby') ||
      el.textContent?.trim() ||
      (el as HTMLInputElement).placeholder;

    if (!hasLabel) {
      missing.push(el.tagName + (el.id ? `#${el.id}` : ''));
    }
  });

  return {
    total: interactiveElements.length,
    missing: missing.length,
    elements: missing,
  };
};

/**
 * Check focus indicators
 */
export const checkFocusIndicators = (): { total: number; missing: number } => {
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
  let missing = 0;

  focusableElements.forEach((el) => {
    const styles = window.getComputedStyle(el, ':focus');
    const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
    const hasBoxShadow = styles.boxShadow !== 'none';
    const hasBorder = styles.borderWidth !== '0px';

    if (!hasOutline && !hasBoxShadow && !hasBorder) {
      missing++;
    }
  });

  return {
    total: focusableElements.length,
    missing,
  };
};

/**
 * Check heading hierarchy
 */
export const checkHeadingHierarchy = (): { valid: boolean; issues: string[] } => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const issues: string[] = [];
  let lastLevel = 0;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);

    if (index === 0 && level !== 1) {
      issues.push('First heading should be h1');
    }

    if (level - lastLevel > 1) {
      issues.push(`Skipped heading level: ${heading.tagName} after h${lastLevel}`);
    }

    lastLevel = level;
  });

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Check image alt text
 */
export const checkImageAltText = (): { total: number; missing: number; decorative: number } => {
  const images = document.querySelectorAll('img');
  let missing = 0;
  let decorative = 0;

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    if (alt === null) {
      missing++;
    } else if (alt === '') {
      decorative++;
    }
  });

  return {
    total: images.length,
    missing,
    decorative,
  };
};

/**
 * Run comprehensive accessibility audit
 */
export const runAccessibilityAudit = () => {
  console.log('♿ Running Accessibility Audit...\n');

  const keyboard = testKeyboardNavigation();
  console.log('⌨️  Keyboard Navigation:', keyboard);

  const aria = checkARIALabels();
  console.log('🏷️  ARIA Labels:', aria);

  const focus = checkFocusIndicators();
  console.log('🎯 Focus Indicators:', focus);

  const headings = checkHeadingHierarchy();
  console.log('📑 Heading Hierarchy:', headings);

  const images = checkImageAltText();
  console.log('🖼️  Image Alt Text:', images);

  const score = calculateAccessibilityScore({
    keyboard: keyboard.tabOrder ? 100 : 50,
    aria: ((aria.total - aria.missing) / aria.total) * 100,
    focus: ((focus.total - focus.missing) / focus.total) * 100,
    headings: headings.valid ? 100 : 70,
    images: images.missing === 0 ? 100 : ((images.total - images.missing) / images.total) * 100,
  });

  console.log(`\n📊 Accessibility Score: ${score}/100`);
  console.log(score >= 90 ? '✅ PASSED' : '❌ FAILED');

  return { keyboard, aria, focus, headings, images, score };
};

/**
 * Calculate overall accessibility score
 */
const calculateAccessibilityScore = (scores: Record<string, number>): number => {
  const values = Object.values(scores);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

/**
 * Test skip navigation links
 */
export const testSkipLinks = (): boolean => {
  const skipLink = document.querySelector('a[href^="#"][class*="skip"]');
  return !!skipLink;
};

/**
 * Check form labels
 */
export const checkFormLabels = (): { total: number; missing: number } => {
  const inputs = document.querySelectorAll('input, select, textarea');
  let missing = 0;

  inputs.forEach((input) => {
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel) {
      missing++;
    }
  });

  return {
    total: inputs.length,
    missing,
  };
};
