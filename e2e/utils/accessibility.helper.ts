import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export class AccessibilityHelper {
  constructor(private page: Page) {}

  async runAccessibilityAudit(options?: {
    tags?: string[];
    exclude?: string[];
    include?: string[];
  }) {
    const builder = new AxeBuilder({ page: this.page });
    
    if (options?.tags) {
      builder.withTags(options.tags);
    }
    
    if (options?.exclude) {
      builder.exclude(options.exclude);
    }
    
    if (options?.include) {
      builder.include(options.include);
    }

    return await builder.analyze();
  }

  async checkKeyboardNavigation(startSelector: string, expectedStops: string[]) {
    await this.page.focus(startSelector);
    
    for (const expectedStop of expectedStops) {
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.locator(':focus').getAttribute('data-testid');
      if (focusedElement !== expectedStop) {
        throw new Error(`Expected focus on ${expectedStop}, but got ${focusedElement}`);
      }
    }
  }

  async checkAriaLabels(selectors: string[]) {
    for (const selector of selectors) {
      const element = this.page.locator(selector);
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaLabelledBy = await element.getAttribute('aria-labelledby');
      
      if (!ariaLabel && !ariaLabelledBy) {
        throw new Error(`Element ${selector} missing aria-label or aria-labelledby`);
      }
    }
  }

  async checkColorContrast() {
    const results = await this.runAccessibilityAudit({
      tags: ['wcag2aa', 'color-contrast']
    });
    
    return results.violations.filter(v => v.id === 'color-contrast');
  }

  async checkFormAccessibility(formSelector: string) {
    const results = await this.runAccessibilityAudit({
      include: [formSelector],
      tags: ['wcag2a', 'wcag2aa']
    });
    
    return results.violations;
  }
}