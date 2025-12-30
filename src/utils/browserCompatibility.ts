/**
 * Browser Compatibility Testing Utilities
 * Detects browser features and compatibility issues
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  os: string;
}

/**
 * Detect browser information
 */
export const detectBrowser = (): BrowserInfo => {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  let os = 'Unknown';

  // Browser detection
  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    engine = 'Gecko';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    engine = 'Blink';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    engine = 'Blink';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    engine = 'WebKit';
  }

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  return { name, version, engine, os };
};

/**
 * Check CSS feature support
 */
export const checkCSSSupport = () => {
  const features = {
    grid: CSS.supports('display', 'grid'),
    flexbox: CSS.supports('display', 'flex'),
    customProperties: CSS.supports('--test', '0'),
    backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    aspectRatio: CSS.supports('aspect-ratio', '16/9'),
    containerQueries: CSS.supports('container-type', 'inline-size'),
  };

  return features;
};

/**
 * Check JavaScript API support
 */
export const checkJSSupport = () => {
  return {
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    mutationObserver: 'MutationObserver' in window,
    requestAnimationFrame: 'requestAnimationFrame' in window,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window,
    webWorkers: 'Worker' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),
  };
};

/**
 * Check animation support
 */
export const checkAnimationSupport = () => {
  return {
    cssAnimations: CSS.supports('animation', 'test 1s'),
    cssTransitions: CSS.supports('transition', 'all 1s'),
    cssTransforms: CSS.supports('transform', 'translateX(10px)'),
    willChange: CSS.supports('will-change', 'transform'),
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};

/**
 * Test framer-motion compatibility
 */
export const testFramerMotion = async (): Promise<boolean> => {
  try {
    const { motion } = await import('framer-motion');
    return !!motion;
  } catch {
    return false;
  }
};

/**
 * Check font loading
 */
export const checkFontLoading = async (fontFamily: string): Promise<boolean> => {
  if (!('fonts' in document)) return false;

  try {
    await document.fonts.load(`16px ${fontFamily}`);
    return document.fonts.check(`16px ${fontFamily}`);
  } catch {
    return false;
  }
};

/**
 * Test icon rendering
 */
export const testIconRendering = (): { svg: boolean; fontIcons: boolean } => {
  const testSVG = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    return svg.namespaceURI === 'http://www.w3.org/2000/svg';
  };

  const testFontIcons = () => {
    return CSS.supports('font-family', 'FontAwesome');
  };

  return {
    svg: testSVG(),
    fontIcons: testFontIcons(),
  };
};

/**
 * Run comprehensive compatibility test
 */
export const runCompatibilityTest = async () => {
  console.log('🌐 Running Browser Compatibility Test...\n');

  const browser = detectBrowser();
  console.log('🖥️  Browser:', browser);

  const css = checkCSSSupport();
  console.log('🎨 CSS Support:', css);

  const js = checkJSSupport();
  console.log('⚙️  JavaScript APIs:', js);

  const animations = checkAnimationSupport();
  console.log('✨ Animation Support:', animations);

  const framerMotion = await testFramerMotion();
  console.log('🎬 Framer Motion:', framerMotion ? '✅' : '❌');

  const interFont = await checkFontLoading('Inter');
  console.log('🔤 Inter Font:', interFont ? '✅' : '❌');

  const icons = testIconRendering();
  console.log('🎯 Icon Rendering:', icons);

  const compatible = calculateCompatibilityScore({
    css: Object.values(css).filter(Boolean).length / Object.keys(css).length * 100,
    js: Object.values(js).filter(Boolean).length / Object.keys(js).length * 100,
    animations: Object.values(animations).filter(Boolean).length / Object.keys(animations).length * 100,
    framerMotion: framerMotion ? 100 : 0,
    font: interFont ? 100 : 0,
    icons: icons.svg ? 100 : 0,
  });

  console.log(`\n📊 Compatibility Score: ${compatible}/100`);
  console.log(compatible >= 80 ? '✅ COMPATIBLE' : '⚠️  PARTIAL SUPPORT');

  return { browser, css, js, animations, framerMotion, interFont, icons, compatible };
};

/**
 * Calculate compatibility score
 */
const calculateCompatibilityScore = (scores: Record<string, number>): number => {
  const values = Object.values(scores);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

/**
 * Get viewport information
 */
export const getViewportInfo = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    orientation: window.screen.orientation?.type || 'unknown',
    touchSupport: 'ontouchstart' in window,
  };
};

/**
 * Test responsive breakpoints
 */
export const testBreakpoints = () => {
  const width = window.innerWidth;
  const breakpoints = {
    mobile: width < 768,
    tablet: width >= 768 && width < 1024,
    laptop: width >= 1024 && width < 1440,
    desktop: width >= 1440,
  };

  const current = Object.entries(breakpoints).find(([, value]) => value)?.[0] || 'unknown';

  return { width, current, breakpoints };
};
