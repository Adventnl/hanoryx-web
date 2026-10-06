import { familyPage } from '../kitPages';

export default familyPage({
  family: 'feedback',
  key: 'north/components/feedback',
  title: 'Feedback Components',
  aliases: ['alerts', 'toast', 'banner', 'progress bar', 'meter', 'spinner', 'skeleton', 'empty state', 'status', 'aria-live', 'announcements'],
  code: 'KIT.03',
  hero: {
    scene: 'status-pulse-grid',
    crumb: 'Feedback',
    title: 'Say what is happening.',
    intro:
      'Nine ways to tell people what a page is doing — a message, a toast, a banner, a bar, a gauge, a spinner, a skeleton, an empty page and a status — each one worded for the ear as well as the eye.',
  },
  gallery: {
    eyebrow: 'The gallery',
    title: 'Nine kinds of feedback, live.',
    intro: 'Start the import, fire a toast, drag the meter. Notice that each says what is happening in words, not only in colour or movement.',
  },
  essay: {
    rail: 'A conversation',
    scene: 'wave-interference',
    eyebrow: 'Feedback is a conversation',
    code: 'FBK.01',
    title: 'Everyone should hear it, and in time to read it.',
    body: [
      'Software is always saying something: it saved, it failed, it is working, it needs you. The only question is whether everyone hears it. A toast that vanishes in three seconds is missed by anyone reading slowly. A red border is invisible to someone who cannot see red. A spinner with no words is a mystery to a screen reader.',
      'So each component here says its piece in more than one way — words, then an icon, then colour — and chooses how loudly to say it. Confirmations wait their turn in a polite live region. Errors interrupt. Using the interrupting kind for everything means none of it is heard, which is why the difference is built in rather than left to the person using it.',
    ],
    asideLabel: 'HOW LOUD',
    asideCode: 'FBK.LIVE',
    points: [
      { k: 'POLITE', v: 'Saved, copied, loading — wait for a pause' },
      { k: 'ASSERTIVE', v: 'Failed, expiring — interrupt now' },
      { k: 'SILENT', v: 'Decoration — hidden from assistive technology' },
    ],
  },
  rules: {
    scene: 'concentric-gate',
    title: 'For telling people things.',
    rows: [
      { k: 'IN WORDS, NOT ONLY COLOUR', v: 'Every state is written out — “Degraded”, “Failed” — with an icon and a colour as reinforcement.' },
      { k: 'POLITE OR ASSERTIVE', v: 'Confirmations are a status; errors and warnings are an alert. Making everything an alert makes nothing heard.' },
      { k: 'LONG ENOUGH TO READ', v: 'A message needs about five seconds, and longer the more it says. Anything that must not be missed is not a toast.' },
      { k: 'HOLD THE SHAPE', v: 'While content loads, reserve its space with a skeleton so nothing jumps, and say what is happening with the spinner’s label.' },
      { k: 'EMPTY IS A STATE', v: 'Say why it is empty and what to do next. A blank page reads as broken.' },
      { k: 'PROGRESS NEEDS NUMBERS', v: 'If you know how far along something is, say so. If you do not, say that.' },
    ],
  },
  closer: {
    kind: 'toastBench',
    anchor: 'bench',
    scene: 'privacy-quiet-grid',
    tag: 'End of the feedback components',
    minHeight: 800,
    title: 'Fire one, and read what it says.',
    lede: 'Toasts for what needs no answer, alerts for what needs looking at. Each time you fire one, the log writes down the words a screen reader would say and whether it would wait politely or interrupt.',
    presets: [
      { id: 'saved', label: 'Saved', tone: 'success', title: 'Saved', body: 'Your changes are kept.' },
      { id: 'copied', label: 'Copied', tone: 'success', title: 'Copied', body: 'The address is on your clipboard.' },
      { id: 'sync', label: 'Syncing', tone: 'info', title: 'Syncing', body: 'This can take a moment. You can keep working.' },
      { id: 'fail', label: 'Failed', tone: 'danger', title: 'Could not save', body: 'Check your connection and try again.' },
    ],
    alerts: [
      { id: 'info', label: 'Information', tone: 'info', title: 'Maintenance window', body: 'The service is read-only from 02:00 to 02:30 UTC on Sunday.' },
      { id: 'warn', label: 'Warning', tone: 'warning', title: 'Token expires soon', body: 'Replace it before Friday.' },
      { id: 'err', label: 'Error', tone: 'danger', title: 'Export failed', body: 'Two rows had no order number.' },
    ],
    onward: [
      { label: 'Data display components', to: '/north/components/data' },
      { label: 'Runbooks people actually use', to: '/insights/runbooks' },
    ],
  },
});
