import { downloads } from '../resources';

const page = {
  key: 'resources/downloads',
  title: 'Downloads',
  accent: '#ff3333',
  aliases: ['templates', 'download', 'checklists', 'runbook template', 'readme template', 'decision record template', 'csv', 'markdown', 'files'],
  hero: {
    scene: 'dashboard-tiles',
    intensity: 'hero',
    eyebrow: 'Resources / Downloads',
    title: 'Documents you can keep.',
    intro: `${downloads.length} templates, checklists and reference files. Each is built in your browser when you press the button, so nothing is fetched, and the ones made from the site's own data are always in step with it.`,
    code: 'RES.03',
    status: `${downloads.length} DOCUMENTS`,
    actions: [
      { label: 'Browse the shelf', to: '/resources/downloads#shelf' },
      { label: 'Bundle several', to: '/resources/downloads#bundle', variant: 'outline' },
    ],
  },
  blocks: [
    {
      type: 'signature',
      kind: 'downloadShelf',
      anchor: 'shelf',
      railLabel: 'The shelf',
      scene: 'privacy-quiet-grid',
      minHeight: 800,
      eyebrow: 'The shelf',
      title: 'Preview it, then keep it.',
      intro: 'Press Preview to see the first lines of any document before you save it. Press Download and your browser saves the file.',
      note: 'Templates are starting points written for this site. They are general, not legal or professional advice, and they are meant to be changed.',
    },
    {
      type: 'process',
      anchor: 'how',
      railLabel: 'How a download works',
      scene: 'architectural-grid',
      eyebrow: 'How a download works',
      title: 'Four steps, none of them over a network.',
      steps: [
        { step: '01', title: 'You press the button', body: 'That is the only request. Nothing is asked of a server.' },
        { step: '02', title: 'The page builds the file', body: 'From text it already holds, or from the site’s own data: the glossary, the page list.' },
        { step: '03', title: 'Your browser saves it', body: 'The file is made in memory and handed to a temporary link, the way any download is.' },
        { step: '04', title: 'Nothing is recorded', body: 'The site does not count downloads, and does not know which ones you chose.' },
      ],
    },
    {
      type: 'faq',
      anchor: 'questions',
      railLabel: 'Questions',
      scene: 'privacy-quiet-grid',
      eyebrow: 'Questions',
      title: 'About the downloads.',
      items: [
        { q: 'Can I use the templates in my own work?', a: ['Yes. They are starting points written for this site, and they are meant to be changed. Use a document you make from one for your own work.'] },
        { q: 'Can I pass the templates on to other people?', a: ['Please ask first through the contact page. The site does not yet say on what conditions the templates themselves may be redistributed, and until it does, asking is the safe course.'] },
        { q: 'Is anything uploaded when I press Download?', a: ['No. The file is built in your browser from text the page already holds, and your browser saves it. Nothing is sent.'] },
        { q: 'Does the site count downloads?', a: ['No. It does not know which documents you chose, or whether you chose any.'] },
        { q: 'Why are most of them Markdown?', a: ['Markdown opens in any text editor and reads well as plain text. The reference files that are not prose use the format that suits them: CSV, JSON, CSS or plain text.'] },
        { q: 'Are they legal or professional advice?', a: ['No. They are general. A template for a runbook or a decision record is a shape to fill in, not a statement of what you ought to decide.'] },
      ],
    },
    {
      type: 'closer',
      kind: 'bundleBuilder',
      anchor: 'bundle',
      scene: 'hex-lattice',
      tag: 'End of the downloads',
      minHeight: 680,
      title: 'Join several into one.',
      lede: 'Choose documents and have them joined into a single Markdown file with a contents list: a pack for a new project, a new teammate, or a handover.',
      presets: [
        { label: 'A new project', ids: ['readme', 'decision', 'handover', 'readiness'] },
        { label: 'An on-call pack', ids: ['runbook', 'incident', 'access'] },
        { label: 'Everything', ids: downloads.map((d) => d.id) },
      ],
      onward: [
        { label: 'Tools', to: '/resources/tools' },
        { label: 'Insights', to: '/insights' },
      ],
    },
  ],
};

export default page;
