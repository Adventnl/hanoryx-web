import clsx from 'clsx';

/** A visible keyboard key. `pressed` gives it the depressed, lit state. */
export function KeyCap({ children, pressed = false, className, ...rest }) {
  return (
    <kbd className={clsx('keycap', className)} data-pressed={pressed ? 'true' : 'false'} {...rest}>
      {children}
    </kbd>
  );
}

export default KeyCap;
