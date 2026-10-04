import { lazy } from 'react';

/* Page-specific interactive compositions. Each is its own async chunk, so a page
   only downloads the signatures it actually renders.

   signatureRegistry — block-level (`{ type: 'signature', kind }`)
   asideRegistry     — hero-level   (`hero.aside = { kind }`)
*/
export const asideRegistry = {
  orbitNav: lazy(() => import('./OrbitNav')),
  caseDeck: lazy(() => import('./CaseDeck')),
  logoPlate: lazy(() => import('./LogoPlate')),
  engineAside: lazy(() => import('./EngineAside')),
  basketAside: lazy(() => import('./BasketAside')),
  dotField: lazy(() => import('./DotField')),
};

export const signatureRegistry = {
  workPortals: lazy(() => import('./WorkPortals')),
  layerStack: lazy(() => import('./LayerStack')),
  chronologyStrip: lazy(() => import('./ChronologyStrip')),
  coordinationLab: lazy(() => import('./CoordinationLab')),
  engineEditor: lazy(() => import('./EngineEditor')),
  enginePipeline: lazy(() => import('./EnginePipeline')),
  engineAnatomy: lazy(() => import('./EngineAnatomy')),
  experienceStoryboard: lazy(() => import('./ExperienceStoryboard')),
  dataSlab: lazy(() => import('./DataSlab')),
};
