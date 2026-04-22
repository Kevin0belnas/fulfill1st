import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Backup for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]); // Runs every time the path changes

  return null;
}

export default ScrollToTop;