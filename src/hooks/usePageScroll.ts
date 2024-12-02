import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of page with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
}