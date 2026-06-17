/* ============================================================
   NAVIGATION — routes, mega-menu previews, footer model
   ============================================================ */

export const navLinks = [
  { label: 'Systems', to: '/systems', code: 'SYS.01' },
  { label: 'Hanoryx North', to: '/north', code: 'SYS.02' },
  { label: 'Work', to: '/work', code: 'SYS.03' },
  { label: 'Timeline', to: '/timeline', code: 'SYS.04' },
  { label: 'Contact', to: '/contact', code: 'SYS.05' },
];

/* Hover preview panels shown by the desktop mega-menu. */
export const navPreviews = {
  '/systems': {
    title: 'Systems',
    blurb: 'Management platforms, commerce infrastructure, automation, and interfaces.',
    items: ['Operational management', 'Commerce infrastructure', 'Automation systems', 'Data interfaces'],
    code: 'NODE.SYS',
  },
  '/north': {
    title: 'Hanoryx North',
    blurb: 'The engineering division — architecture, interface, orchestration, tooling.',
    items: ['Platform architecture', 'Interface systems', 'Motion philosophy', 'Stack & tooling'],
    code: 'NODE.NORTH',
  },
  '/work': {
    title: 'Work',
    blurb: 'Selected systems. Some active, some withheld.',
    items: ['Commerce System I', 'Musebase', 'North Internal Console', 'Classified branches'],
    code: 'NODE.WORK',
  },
  '/timeline': {
    title: 'Timeline',
    blurb: 'The system roadmap, from first commerce layer to unannounced programs.',
    items: ['Initial systems phase', 'Operational platform phase', 'North research phase', 'Classified branch'],
    code: 'NODE.TIME',
  },
};

export const footer = {
  blurb: 'Online systems, software platforms, and digital operating environments. Built by Hanoryx North.',
  columns: [
    {
      id: 'col-sys',
      title: 'Systems',
      links: [
        { label: 'Overview', to: '/systems' },
        { label: 'Management platforms', to: '/systems' },
        { label: 'Commerce infrastructure', to: '/systems' },
        { label: 'Automation', to: '/systems' },
      ],
    },
    {
      id: 'col-north',
      title: 'Development',
      links: [
        { label: 'Overview', to: '/north' },
        { label: 'Engineering', to: '/north/engineering' },
        { label: 'Motion systems', to: '/north/motion-systems' },
        { label: 'Work', to: '/work' },
      ],
    },
    {
      id: 'col-co',
      title: 'Company',
      links: [
        { label: 'Timeline', to: '/timeline' },
        { label: 'Contact', to: '/contact' },
        { label: 'contact@hanoryx.com', href: 'mailto:contact@hanoryx.com' },
      ],
    },
  ],
  telemetry: [
    { k: 'NODE', v: 'NORTH // ONLINE' },
    { k: 'CHANNEL', v: 'SECURE' },
    { k: 'STREAM', v: 'IDLE' },
  ],
};
