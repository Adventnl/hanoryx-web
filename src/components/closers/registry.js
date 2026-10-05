import { lazy } from 'react';

/* Page endings. Each is its own async chunk, so a page downloads only the one
   it ends with. A page picks one with `{ type: 'closer', kind: '…' }`; no two
   neighbouring pages share a composition, and none is a call to action. */
export const closerRegistry = {
  // legal
  receipt: lazy(() => import('./Receipt')),
  termsCard: lazy(() => import('./TermsCard')),
  purge: lazy(() => import('./Purge')),
  prefsPanel: lazy(() => import('./PrefsPanel')),
  fairLine: lazy(() => import('./FairLine')),
  markDesk: lazy(() => import('./MarkDesk')),
  finePrint: lazy(() => import('./FinePrint')),
  lifetimeRuler: lazy(() => import('./LifetimeRuler')),
  parcelTrack: lazy(() => import('./ParcelTrack')),
  linkBuilder: lazy(() => import('./LinkBuilder')),
  statusLedger: lazy(() => import('./StatusLedger')),
  // trust
  selfAudit: lazy(() => import('./SelfAudit')),
  frameTape: lazy(() => import('./FrameTape')),
  scopeTarget: lazy(() => import('./ScopeTarget')),
  hostScan: lazy(() => import('./HostScan')),
  noticeFile: lazy(() => import('./NoticeFile')),
  // company
  endCredits: lazy(() => import('./EndCredits')),
  reviewDraw: lazy(() => import('./ReviewDraw')),
  gateRun: lazy(() => import('./GateRun')),
  horizon: lazy(() => import('./Horizon')),
  fitRadar: lazy(() => import('./FitRadar')),
  prepSheet: lazy(() => import('./PrepSheet')),
  askDeck: lazy(() => import('./AskDeck')),
  askTheSite: lazy(() => import('./AskTheSite')),
  nameStyle: lazy(() => import('./NameStyle')),
  markMisuse: lazy(() => import('./MarkMisuse')),
  // insights
  takeawayDeck: lazy(() => import('./TakeawayDeck')),
  logLine: lazy(() => import('./LogLine')),
  leastPrivilege: lazy(() => import('./LeastPrivilege')),
  pagerCard: lazy(() => import('./PagerCard')),
  whichOne: lazy(() => import('./WhichOne')),
  deprecationNotice: lazy(() => import('./DeprecationNotice')),
  readmeMaker: lazy(() => import('./ReadmeMaker')),
  easePick: lazy(() => import('./EasePick')),
  randomRead: lazy(() => import('./RandomRead')),
  // resources
  readingList: lazy(() => import('./ReadingList')),
  flashDeck: lazy(() => import('./FlashDeck')),
  historyBar: lazy(() => import('./HistoryBar')),
  bundleBuilder: lazy(() => import('./BundleBuilder')),
  cheatSheet: lazy(() => import('./CheatSheet')),
  pairMatrix: lazy(() => import('./PairMatrix')),
  clampMaker: lazy(() => import('./ClampMaker')),
  dstTrap: lazy(() => import('./DstTrap')),
  launchTimeline: lazy(() => import('./LaunchTimeline')),
  preMortem: lazy(() => import('./PreMortem')),
};
