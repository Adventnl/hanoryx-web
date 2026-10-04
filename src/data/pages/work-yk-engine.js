import { workItems, YK_ENGINE_REPO } from '../work';

const more = workItems
  .filter((w) => w.id !== 'yk-engine')
  .map((w) => ({ code: w.code, title: w.name, label: w.kind, body: w.tagline, glyph: w.glyph, to: w.to }));

const page = {
  key: 'work/yk-engine',
  title: 'YK Engine',
  accent: '#ff3333',
  aliases: ['2d engine', 'game engine', 'editor', 'player', 'proprietary engine', 'github', 'repository'],
  hero: {
    scene: 'isometric-infra',
    intensity: 'hero',
    eyebrow: 'Work / 02 · Primary project',
    title: 'A proprietary 2D engine.',
    intro:
      'YK Engine is a proprietary 2D engine with an editor, a standalone player and project export tooling.',
    code: 'WRK.02',
    status: 'CASE STUDY',
    actions: [
      { label: 'View the repository', href: YK_ENGINE_REPO },
      { label: 'All work', to: '/work', variant: 'outline' },
    ],
    aside: { kind: 'engineAside', caption: 'Illustration of an engine viewport' },
  },
  blocks: [
    {
      type: 'signature',
      kind: 'engineEditor',
      anchor: 'editor',
      railLabel: 'Editor & player',
      scene: 'architectural-grid',
      minHeight: 700,
      eyebrow: 'Editor and player',
      title: 'Author it. Then run it.',
      intro:
        'A miniature of the idea: select and drag entities in the editor, then switch to the player and the same data simply runs. This is an illustration, not the engine.',
      caption: 'The profiler graph shows real frame times measured from this demo in your browser.',
    },
    {
      type: 'signature',
      kind: 'enginePipeline',
      anchor: 'pipeline',
      railLabel: 'Pipeline',
      scene: 'build-pipeline',
      minHeight: 520,
      eyebrow: 'Pipeline',
      title: 'From scene to player.',
      intro: 'Pick a stage. The token follows.',
      stages: [
        { id: 'author', label: 'Author', glyph: 'node', title: 'Author a scene', body: 'A project is built from entities and the components that describe them.', points: ['Entities', 'Components', 'Scenes'] },
        { id: 'editor', label: 'Editor', glyph: 'terminal', title: 'Work in the editor', body: 'The editor provides scene hierarchy, inspector, debugging and profiling surfaces.', points: ['Hierarchy', 'Inspector', 'Debugging', 'Profiling'] },
        { id: 'shared', label: 'Shared data', glyph: 'database', title: 'One set of data', body: 'Entity and component data can run in both the editor and the standalone player — the same project, not a copy.', points: ['Same data', 'Editor and player'] },
        { id: 'player', label: 'Player', glyph: 'engine', title: 'Run it in the player', body: 'The standalone player runs a project without the editor around it.', points: ['Standalone', 'Runtime'] },
        { id: 'export', label: 'Export', glyph: 'stack', title: 'Export a project', body: 'Project export tooling is part of the toolset, so a project can leave the editor.', points: ['Export tooling'] },
      ],
    },
    {
      type: 'signature',
      kind: 'engineAnatomy',
      anchor: 'anatomy',
      railLabel: 'Anatomy',
      scene: 'architectural-grid',
      minHeight: 520,
      eyebrow: 'Anatomy',
      title: 'How the engine is organised.',
      intro: 'Pick a part; its block lights on the board.',
      repoUrl: YK_ENGINE_REPO,
      repoLabel: 'YK Engine on GitHub',
      parts: [
        { id: 'editor', name: 'Editor', glyph: 'terminal', line: 'Where projects are authored', detail: 'The editor provides scene hierarchy, inspector, debugging and profiling surfaces.', folders: ['editor/'] },
        { id: 'player', name: 'Player', glyph: 'engine', line: 'Where projects run', detail: 'A standalone player runs the same entity and component data as the editor.', folders: ['player/'] },
        { id: 'core', name: 'Engine core', glyph: 'cube', line: 'The shared engine code', detail: 'Engine headers and sources, written in C++20.', folders: ['include/', 'src/'] },
        { id: 'tooling', name: 'Tooling', glyph: 'ruler', line: 'Build, scripts, export', detail: 'Build configuration, scripts and the project export tools.', folders: ['cmake/', 'scripts/', 'tools/', 'packaging/'] },
        { id: 'demos', name: 'Demos', glyph: 'compass', line: 'Two data-only demos', detail: 'Two data-only demos exercise reusable engine systems.', folders: ['YK-DemoGame/', 'YK-ExplorationDemo/'] },
        { id: 'quality', name: 'Tests & docs', glyph: 'doc', line: 'Verification and notes', detail: 'Tests and documentation sit alongside the engine, with third-party code and its licences kept separate.', folders: ['tests/', 'docs/', 'third_party/', 'LICENSES/'] },
      ],
    },
    {
      type: 'modules',
      anchor: 'facts',
      railLabel: 'In short',
      scene: 'privacy-quiet-grid',
      eyebrow: 'In short',
      title: 'What it is, in four lines.',
      intro: 'Taken from the project’s own documentation.',
      rows: [
        { k: 'FOUNDATION', v: 'C++20.' },
        { k: 'SURFACES', v: 'An editor, a standalone player and project export tooling.' },
        { k: 'DATA', v: 'Entity and component data can run in both the editor and the player.' },
        { k: 'DEMOS', v: 'Two data-only demos exercise reusable engine systems.' },
      ],
    },
    {
      type: 'cards',
      variant: 'grid',
      anchor: 'more',
      railLabel: 'More work',
      scene: 'hex-tunnel',
      eyebrow: 'More work',
      title: 'Keep going.',
      intro: 'The other three case studies.',
      items: more,
    },
    {
      type: 'cta',
      scene: 'magnetic-vector',
      eyebrow: 'Next',
      title: 'Talk about an engine.',
      body: 'If you are building tools or runtimes of your own, the conversation starts on the contact page.',
      links: [{ label: 'See all work', to: '/work' }],
    },
  ],
};

export default page;
