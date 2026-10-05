import Dialog from './Dialog';

/**
 * A dialog that slides in from an edge and runs the full height — for a filter
 * panel, a detail view, a settings sheet — where the page behind still gives
 * context. Everything a Dialog does for focus, Escape and scrolling, it does too.
 *
 *   <Drawer open={open} onClose={…} title="Filters" side="right">…</Drawer>
 */
export default function Drawer({ side = 'right', width = '26rem', ...props }) {
  return <Dialog side={side} width={width} {...props} />;
}
