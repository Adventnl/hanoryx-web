/**
 * Text for assistive technology that is not drawn: the "Close" on an icon-only
 * button, the "(current page)" after a link. It stays in the reading order and
 * out of the layout. Prefer a visible label wherever there is room for one.
 */
export default function VisuallyHidden({ children, as: Tag = 'span' }) {
  return <Tag className="sr-only">{children}</Tag>;
}
