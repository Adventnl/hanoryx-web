import { useRef } from 'react';
import clsx from 'clsx';
import { usePointerField } from '../../hooks/usePointerField';
import styles from './TiltSurface.module.css';

/**
 * A surface that leans toward the pointer, with a specular highlight that
 * follows it. The tilt, the highlight and the return to rest are all driven by
 * the --px/--py variables from usePointerField (a CSS transition on those
 * registered properties does the easing), so there is no per-frame JS easing and
 * no React state. Touch devices and reduced motion get a still surface.
 *
 * Children may use `data-depth="n"` to drift against the tilt (parallax):
 *   <span data-depth="14">…</span>
 */
export function TiltSurface({ as: Tag = 'div', tilt = 7, glare = true, className, style, children, ...rest }) {
  const ref = useRef(null);
  usePointerField(ref);
  return (
    <Tag
      ref={ref}
      className={clsx(styles.tilt, glare && styles.glare, className)}
      style={{ '--tilt': tilt, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default TiltSurface;
