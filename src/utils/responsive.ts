// Standardized breakpoints for consistent responsive design
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Touch target minimum sizes (WCAG 2.1 AA)
export const touchTargets = {
  minimum: '44px', // 44x44px minimum
  comfortable: '48px', // 48x48px comfortable
  large: '56px', // 56x56px large
} as const;

// Responsive utilities
export const responsive = {
  isMobile: () => window.innerWidth < 768,
  isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: () => window.innerWidth >= 1024,
  
  // Get current breakpoint
  getCurrentBreakpoint: (): keyof typeof breakpoints => {
    const width = window.innerWidth;
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  },
};

// Responsive classes helper
export const responsiveClasses = {
  // Container padding
  containerPadding: 'px-3 sm:px-4 md:px-6 lg:px-8',
  
  // Text sizes
  heading1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  heading2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  heading3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  heading4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
  
  // Spacing
  sectionGap: 'space-y-4 sm:space-y-6 md:space-y-8',
  cardGap: 'space-y-3 sm:space-y-4',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  grid4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  
  // Touch targets
  button: 'min-h-[44px] min-w-[44px] px-4 py-2',
  iconButton: 'min-h-[44px] min-w-[44px] p-2',
  input: 'min-h-[44px] px-3 py-2',
  
  // Modal sizes
  modalSmall: 'w-full max-w-sm mx-4',
  modalMedium: 'w-full max-w-md mx-4',
  modalLarge: 'w-full max-w-2xl mx-4',
  modalFull: 'w-full max-w-4xl mx-4',
};
