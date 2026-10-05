import styles from './data.module.css';

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

/**
 * A person, a team or a system as its initials in a circle (or square). There are
 * no photographs here on purpose: initials need no consent, load instantly and
 * cannot be the wrong face. The full name is the accessible name.
 */
export function Avatar({ name, size = '2.4rem', shape = 'circle', tone, className }) {
  return (
    <span className={`${styles.avatar} ${className || ''}`} style={{ '--s': size }} data-shape={shape} data-tone={tone} role="img" aria-label={name}>
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}

/** Avatars overlapping in a row, with "+3" for the rest. */
export function AvatarGroup({ names = [], max = 4, size, className }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className={`${styles.avatars} ${className || ''}`} role="group" aria-label={`${names.length} people: ${names.join(', ')}`}>
      {shown.map((n) => <Avatar key={n} name={n} size={size} />)}
      {rest > 0 && <span className={styles.avatar} style={size ? { '--s': size } : undefined} aria-hidden="true">+{rest}</span>}
    </span>
  );
}

export default Avatar;
