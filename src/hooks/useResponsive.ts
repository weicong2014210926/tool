import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useResponsive() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    let ticking = false;

    function handleResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        ticking = false;
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
}
