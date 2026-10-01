# Hanoryx Systems site audit

Audit date: 2026-10-01. Scope: entire repository. Mode: audit and implementation.

## Scorecard

| Area | Assessment |
| --- | --- |
| Architecture and layering | Needs work: scene and route layers are coherent; most legacy deep routes share one dispatcher. |
| File size and granularity | Needs work: `src/components/page/PageBlocks.jsx` combines every legacy section presentation. |
| DRY and reuse | Pass: navigation, reveals, scene hosts, and UI primitives are reusable. |
| Hardcoding and magic values | Needs work: legacy page data still contains asserted states and decorative codes. |
| Types and correctness | Needs work: JavaScript data records lack schema validation beyond the new public snapshot checks. |
| Async and error handling | Needs work: chunk loading has a fallback, but Canvas import failure handling can improve. |
| State management | Pass: scene scheduler and local explorer state avoid global rerenders. |
| Performance and complexity | Pass: lazy scenes, one RAF scheduler, visibility budget, DPR cap, and reduced motion are strong. |
| Density and clarity | Needs work: some legacy pages use many words for little verified information. |
| Naming and readability | Pass: the main layers are named by responsibility. |
| Security | Pass for the new GitHub path: public allowlist, visibility checks, and a token-free frontend. |
| Tests and quality gates | Needs work: new cross-platform suites cover routes and interactions; older scripts still have fixed platform paths. |

Overall: the scene engineering is strong, and public data is now trustworthy on the new surfaces. The whole site has not yet reached the requested production content and component scale.

## What is excellent and should be preserved

- The near-black, white, and restrained red visual language; editorial serif and technical mono pairing.
- The 67 registered Canvas scenes, scene budget, shared scheduler, pointer and audio bridges, reveal profiles, route transitions, boot, and System Synthesis.
- The route shell, responsive navigation, data-driven page model, and existing QA collection.

The design tokens and typography are good foundations. The visual language is recognizable without a new palette or library.

## Good, but limited

- The data-driven page system makes routes easy to author, but its nine block types make unrelated stories read alike.
- Navigation reaches the current route set and works responsively, but the hierarchy is still shallow for the requested systems, engineering, and update ecosystem.
- The scene catalogue is extensive, but most legacy scenes express atmosphere rather than a specific documented system relationship.
- The existing QA scripts show sustained attention to behavior and performance, but several assume one developer machine or browser installation.

## What remains repetitive or unfinished

- The nine-case block dispatcher still gives many legacy pages the same rhythm. New project, engineering, and lab pages demonstrate more specific compositions, but the legacy routes need individual review.
- “Classified,” “redacted,” and node/status language remain overused in some legacy deep pages. Public work, Company Status, the homepage, and the timeline now favor sourced information.
- Some legacy project pages still describe private or concept work without a public repository. Eleven high-risk research, work, security, platform, tooling, portal, and data-interface pages were rewritten around public evidence or explicit design-study framing; a full editorial verification pass remains.
- The new public project detail pages have source summaries, language distribution, a curated repository tree, and an interactive shared-language graph, but media and project-specific architecture visuals are still limited.
- The website has search and a command palette across all routes and public repositories, though the index does not yet include full page body text.

## Missing from the requested final state

- Verified project media, architectural diagrams, release histories, and detailed engineering decisions for every public project.
- A broader library of distinct section archetypes and the requested 100 useful components.
- A reviewed updates or engineering-notes publishing workflow. Public repository push dates alone cannot stand in for release notes.
- Server-rendered or pre-rendered route content and metadata for crawlers that do not execute JavaScript.
- Formal screen-reader, device, and performance-budget results across all interaction states.

The main architectural work is to decouple the legacy route content from one large block dispatcher while keeping the existing scene and motion runtime. Real project material should drive any new layout or visualization; the current redaction and status motifs are overused wherever they stand in for missing evidence.

## Findings

### P0

- `src/data/company.js` (fixed): an unverified operational percentage appeared as a status metric. Replaced it with generated public repository counts on the pages that used it. Legacy hero figures now require an explicit source marker before rendering.
- `src/pages/Home.jsx` (fixed): invented classified nodes were presented as work. The homepage now features verified public repositories and a public timeline.
- `src/data/pages/company-status.js` (fixed): simulated operational telemetry asserted real system health. Replaced the page with a clearly scoped public-source snapshot.

### P1

- `src/components/page/PageBlocks.jsx`: nine block families carry most deep pages. Similar composition across 26 template routes makes the information architecture repetitive. Add dedicated experiences where real data warrants them.
- `src/data/systems.js` and legacy project detail records: conceptual project copy and unsupported operational assertions still need source review. Public repositories now have a distinct verified explorer; unverified hero figures and operational labels are suppressed in the shared renderer.
- `src/data/pages/legal-privacy.js` and `src/data/pages/legal-terms.js`: statements about message retention, hosting logs, providers, and legal terms need the site owner's operational and legal review before publication. Repository code alone cannot establish those practices.
- `src/app/routeConfig.js` (fixed for new routes): public repository detail, site engineering, and Lab are now discoverable. Legacy route depth remains to be redesigned.

### P2

- `qa/all-routes.mjs`: a fixed macOS browser path and fixed route list limit portability and coverage. `qa/website-smoke.mjs` now covers generated routes and Windows/macOS Chromium; the old script remains for historical comparison.
- `src/data/navigation.js`: decorative status telemetry is visually similar to factual company information. Label decorative elements plainly or replace them with navigation and build information.
- `index.html` (fixed for client rendering): route metadata, canonical links, legitimate Organization structured data, a sitemap, robots file, and social image are present. A static SPA still depends on crawler JavaScript for per-route metadata.

## Remediation sequence

1. Generate a reviewed, public-only GitHub snapshot at build time; retain a checked-in fallback.
2. Replace homepage pseudo-metrics and invented nodes with repository, technology, and engineering evidence.
3. Add a repository explorer, individual project pages, engineering and lab surfaces using existing scene infrastructure.
4. Add global discovery, improve metadata and responsive states, and extend browser QA.

The full requested 100-component and 500-delta scale remains a long-running program. The ledger records implemented work only; no counts are inflated.
