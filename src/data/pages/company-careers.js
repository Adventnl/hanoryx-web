const page = {
  key: 'company/careers',
  title: 'Careers',
  accent: '#ff3333',
  aliases: ['jobs', 'hiring', 'work with us', 'join', 'introduce yourself', 'openings'],
  hero: {
    scene: 'glyph-field',
    intensity: 'hero',
    eyebrow: 'Company / Careers',
    title: 'People who like hard systems.',
    intro:
      'No roles are listed right now. This page describes the kinds of work the company does, for anyone who would like to introduce themselves.',
    code: 'CMP.04',
    status: 'INTRODUCTIONS',
    actions: [{ label: 'Introduce yourself', to: '/contact?type=careers' }],
    aside: {
      kind: 'splitFlap',
      rows: [
        { label: 'Roles listed', value: 'None' },
        { label: 'Introductions', value: 'Welcome' },
      ],
      cycle: {
        label: 'Areas of work',
        values: ['Interfaces', 'Systems', 'Data at scale', 'Engines', 'Automation'],
      },
      caption: 'Press the last row to flip to the next area.',
    },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'areasExplorer',
      anchor: 'areas',
      railLabel: 'Areas of work',
      scene: 'privacy-quiet-grid',
      minHeight: 640,
      eyebrow: 'Areas of work',
      title: 'Where the work happens.',
      intro: 'Point at a strip, or press an arrow key on one. Each is a kind of work the company does today.',
      areas: [
        {
          id: 'interfaces',
          code: 'AREA.01',
          title: 'Interfaces',
          glyph: 'layers',
          summary:
            'Screens that resolve intent in a single read: layout, interaction, motion and the small details between them.',
          thinks: [
            'Layout and hierarchy that stay legible at any size',
            'Interaction that responds to a person instead of just reacting',
            'Motion that explains state and never gets in the way',
          ],
          links: [
            { label: 'Interface lab', to: '/north/interface-lab' },
            { label: 'Motion systems', to: '/north/motion-systems' },
          ],
        },
        {
          id: 'systems',
          code: 'AREA.02',
          title: 'Systems & platforms',
          glyph: 'stack',
          summary:
            'The structure under the surface: services, data models, roles and the boundaries between them.',
          thinks: [
            'Where each record lives, and who owns it',
            'What every role may reach, enforced at the boundary',
            'How a change is made, reviewed and traced',
          ],
          links: [
            { label: 'Systems', to: '/systems' },
            { label: 'Musebase', to: '/work/musebase' },
          ],
        },
        {
          id: 'data',
          code: 'AREA.03',
          title: 'Data at scale',
          glyph: 'database',
          summary:
            'Internal systems designed for very large data sets, where browsing and searching have to stay comfortable as the data grows.',
          thinks: [
            'Views that stay honest as the volume of data grows',
            'Search and filtering that people can reason about',
            'Making a very large collection feel manageable',
          ],
          links: [
            { label: 'Internal CRM', to: '/work/internal-crm' },
            { label: 'Data interfaces', to: '/systems/data-interfaces' },
          ],
        },
        {
          id: 'engines',
          code: 'AREA.04',
          title: 'Engines & graphics',
          glyph: 'engine',
          summary:
            'Work on a proprietary 2D engine: rendering, an editor, a standalone player and export tooling.',
          thinks: [
            'A render loop that stays steady',
            'Editor tools people can learn quickly',
            'A player and exports that match what the editor shows',
          ],
          links: [{ label: 'YK Engine', to: '/work/yk-engine' }],
        },
        {
          id: 'automation',
          code: 'AREA.05',
          title: 'Automation & tooling',
          glyph: 'loop',
          summary:
            'Internal tooling that removes manual drag: automation, build tooling and the checks that keep releases calm.',
          thinks: [
            'Workflows that run without hand-holding',
            'Tooling that developers actually want to use',
            'Checks that catch problems before release',
          ],
          links: [
            { label: 'Automation', to: '/systems/automation' },
            { label: 'Tooling', to: '/north/tooling' },
          ],
        },
      ],
      note: 'These are the areas the work covers. They are not a list of open positions, and none is implied.',
    },
    {
      type: 'cards',
      variant: 'grid',
      anchor: 'introduce',
      railLabel: 'Introducing yourself',
      scene: 'architectural-grid',
      eyebrow: 'Introducing yourself',
      title: 'Three things worth including.',
      intro:
        'There is no application form, because there are no listed roles. A message through the contact page is the way in.',
      items: [
        {
          code: '01',
          title: 'A short note about you',
          body: 'What you build, what you care about, and the kind of place you like to work.',
          glyph: 'doc',
        },
        {
          code: '02',
          title: 'Something you made',
          body: 'A link to work you are proud of: your own project, a write-up, or a repository.',
          glyph: 'branch',
        },
        {
          code: '03',
          title: 'The area that fits',
          body: 'Which of the areas above is closest, so your message can reach the right person.',
          glyph: 'compass',
        },
      ],
    },
    {
      type: 'cta',
      scene: 'contact-transmission',
      eyebrow: 'Introduce yourself',
      title: 'Say hello, whatever the area.',
      body: 'The contact page has a Careers type, so your message arrives with the right label.',
      primary: { label: 'Open the contact page', to: '/contact?type=careers' },
      links: [{ label: 'See the work', to: '/work' }],
    },
  ],
};

export default page;
