/* The six family pages of the interface kit share one shape: a hero, the live
   gallery for the family, an essay, six rules, and an ending of their own. This
   builds that shape from what each page says, so a page file holds words, not
   structure. (It lives beside the page files, not in them, so the page loader does
   not mistake it for a page.) */
import { kitByFamily } from './kit';

export function familyPage({ family, key, title, aliases, code, hero, gallery, essay, rules, closer }) {
  const items = kitByFamily(family);
  return {
    key,
    title,
    accent: '#ff3333',
    aliases,
    hero: {
      scene: hero.scene,
      intensity: 'hero',
      eyebrow: `Development / Components / ${hero.crumb}`,
      title: hero.title,
      intro: hero.intro,
      code,
      status: `${items.length} COMPONENTS`,
      actions: [
        { label: 'Open the gallery', to: `/${key}#gallery` },
        { label: 'All components', to: '/north/components', variant: 'outline' },
      ],
    },
    blocks: [
      {
        type: 'signature',
        kind: 'componentGallery',
        anchor: 'gallery',
        railLabel: 'The gallery',
        scene: 'privacy-quiet-grid',
        minHeight: 1000,
        eyebrow: gallery.eyebrow,
        title: gallery.title,
        intro: gallery.intro,
        items,
        note: 'Every example runs in your browser, with sample data that says so. Nothing typed, chosen or dropped here is sent anywhere.',
      },
      {
        type: 'split',
        anchor: 'why',
        railLabel: essay.rail,
        scene: essay.scene,
        eyebrow: essay.eyebrow,
        code: essay.code,
        title: essay.title,
        body: essay.body,
        asideLabel: essay.asideLabel,
        asideCode: essay.asideCode,
        points: essay.points,
      },
      {
        type: 'modules',
        anchor: 'rules',
        railLabel: 'Six rules',
        scene: rules.scene,
        eyebrow: 'Six rules',
        title: rules.title,
        rows: rules.rows,
      },
      { type: 'closer', anchor: closer.anchor, ...closer },
    ],
  };
}
