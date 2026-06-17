import { useEffect, useRef } from 'react';

/**
 * Tracks the pointer without triggering re-renders.
 * Returns a ref whose `.current` holds { x, y, nx, ny, active }:
 *   x, y   — viewport pixel coordinates
 *   nx, ny — normalized [-1, 1] coordinates relative to viewport center
 *   active — whether the pointer is currently over the window
 *
 * Animation loops (canvas, magnetic buttons, parallax) read this ref
 * inside requestAnimationFrame so motion stays smooth and cheap.
 */
export function useMousePosition() {
  const position = useRef({ x: 0, y: 0, nx: 0, ny: 0, active: false });

  useEffect(() => {
    const update = (clientX, clientY) => {
      const { innerWidth: w, innerHeight: h } = window;
      position.current = {
        x: clientX,
        y: clientY,
        nx: (clientX / w) * 2 - 1,
        ny: (clientY / h) * 2 - 1,
        active: true,
      };
    };

    const onMove = (event) => update(event.clientX, event.clientY);
    const onTouch = (event) => {
      const touch = event.touches[0];
      if (touch) update(touch.clientX, touch.clientY);
    };
    const onLeave = () => {
      position.current = { ...position.current, active: false };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('mouseout', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return position;
}

export default useMousePosition;
