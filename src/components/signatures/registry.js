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
  identityCard: lazy(() => import('./IdentityCard')),
  splitFlap: lazy(() => import('./SplitFlap')),
  tensionDials: lazy(() => import('./TensionDials')),
  systemMap: lazy(() => import('./SystemMap')),
  northCompass: lazy(() => import('./NorthCompass')),
  liveBudget: lazy(() => import('./LiveBudget')),
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
  surfaceCompare: lazy(() => import('./SurfaceCompare')),
  principleStack: lazy(() => import('./PrincipleStack')),
  boundaryReview: lazy(() => import('./BoundaryReview')),
  chronologyScrubber: lazy(() => import('./ChronologyScrubber')),
  areasExplorer: lazy(() => import('./AreasExplorer')),
  systemIndex: lazy(() => import('./SystemIndex')),
  needsFinder: lazy(() => import('./NeedsFinder')),
  opsFlow: lazy(() => import('./OpsFlow')),
  orderPath: lazy(() => import('./OrderPath')),
  ruleChain: lazy(() => import('./RuleChain')),
  consoleComposer: lazy(() => import('./ConsoleComposer')),
  viewShift: lazy(() => import('./ViewShift')),
  boundaryMembrane: lazy(() => import('./BoundaryMembrane')),
  researchBench: lazy(() => import('./ResearchBench')),
  accordionList: lazy(() => import('./AccordionList')),
  gateWalk: lazy(() => import('./GateWalk')),
  componentBench: lazy(() => import('./ComponentBench')),
  easingStudio: lazy(() => import('./EasingStudio')),
  toolchainMap: lazy(() => import('./ToolchainMap')),
  architectureExplorer: lazy(() => import('./ArchitectureExplorer')),
  sceneLab: lazy(() => import('./SceneLab')),
  contactStudio: lazy(() => import('./ContactStudio')),
  siteDirectory: lazy(() => import('./SiteDirectory')),
  dataJourney: lazy(() => import('./DataJourney')),
  clauseFinder: lazy(() => import('./ClauseFinder')),
  storageInspector: lazy(() => import('./StorageInspector')),
  keyboardMap: lazy(() => import('./KeyboardMap')),
  document: lazy(() => import('./DocumentReader')),
  legalCentre: lazy(() => import('./LegalCentre')),
  claimsLedger: lazy(() => import('./ClaimsLedger')),
  liveStatus: lazy(() => import('./LiveStatus')),
  serviceMap: lazy(() => import('./ServiceMap')),
  licenceTable: lazy(() => import('./LicenceTable')),
};
