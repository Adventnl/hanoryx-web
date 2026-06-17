import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins once, at module load, before any trigger is created.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// House defaults so every tween shares the signature easing/feel.
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

/**
 * Top-level animation environment. Registers GSAP plugins, sets global
 * defaults, and keeps ScrollTrigger measurements honest across viewport
 * changes and font loading.
 */
export function AnimationProvider({ children }) {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // Recalculate once webfonts swap in (layout shifts).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
    };
  }, []);

  return children;
}

export default AnimationProvider;
