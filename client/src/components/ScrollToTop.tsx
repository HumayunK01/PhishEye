import { useEffect } from "react";
import { useLocation } from "wouter";

interface ScrollToTopProps {
  /** Whether to use smooth scrolling animation (default: true) */
  smooth?: boolean;
  /** Delay in milliseconds before scrolling (default: 0) */
  delay?: number;
}

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This ensures users always start at the top
 * when navigating to a new page.
 * 
 * @param smooth - Whether to use smooth scrolling animation (default: true)
 * @param delay - Delay in milliseconds before scrolling (default: 0)
 */
export default function ScrollToTop({ smooth = true, delay = 0 }: ScrollToTopProps = {}) {
  const [location] = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [location, smooth, delay]); // Re-run effect when location changes

  return null; // This component doesn't render anything
}
