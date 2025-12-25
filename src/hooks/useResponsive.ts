import { useState, useEffect } from 'react';
import { responsive } from '@/utils/responsive';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(responsive.isMobile());
  const [isTablet, setIsTablet] = useState(responsive.isTablet());
  const [isDesktop, setIsDesktop] = useState(responsive.isDesktop());
  const [breakpoint, setBreakpoint] = useState(responsive.getCurrentBreakpoint());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(responsive.isMobile());
      setIsTablet(responsive.isTablet());
      setIsDesktop(responsive.isDesktop());
      setBreakpoint(responsive.getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop, breakpoint };
}
