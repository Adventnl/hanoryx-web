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
};
