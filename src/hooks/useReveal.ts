import { useEffect, useRef, useState } from 'react';

/**
 * True once the referenced element has scrolled into view — used to trigger a
 * one-time fade/slide-in transition. Falls back to already-visible when
 * IntersectionObserver is unavailable, and never triggers a second time once
 * visible (a landing page's sections should not re-animate on scroll-back).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
