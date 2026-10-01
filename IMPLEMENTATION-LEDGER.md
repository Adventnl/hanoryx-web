# Implementation ledger

Audit date: 2026-10-01. Each entry is a shipped behavior or data surface, not a CSS declaration or a claim toward the requested 500-delta target.

## Public data and privacy

1. Added a named allowlist of public repositories associated with the GitHub account owner.
2. Added a repeatable GitHub sync script that rejects private, forked, archived, or unexpected-owner records.
3. Added a checked-in snapshot so the deployed site works without GitHub API access.
4. Kept GitHub credentials and authenticated requests entirely outside browser code.
5. Captured public creation and update dates, topics, language counts, and releases where available.
6. Reviewed project summaries and highlights against public repository material.
7. Added validation for the generated snapshot and stable shared project queries.
8. Replaced invented homepage metrics with counts calculated from the public snapshot.

## Projects and site content

9. Added a searchable public project explorer with category and language filters.
10. Added a grid/index view preference that persists locally.
11. Added individual detail routes for the eight curated repositories.
12. Added language distributions and links between projects with shared verified languages.
13. Added a technology explorer that filters projects by actual repository languages.
14. Added public work previews to the homepage and existing work overview.
15. Rebuilt the timeline from public repository creation dates.
16. Replaced fabricated Company Status telemetry with a scoped public-source snapshot.
17. Removed fabricated classified work blocks from the homepage.
18. Softened unsupported operational and deployment claims on several legacy pages.
19. Added dedicated Engineering and Lab pages describing the actual site architecture and scene inventory.
20. Added a repository-derived Canvas graph scene and retained the existing scene system.

## Navigation and interaction

21. Added global route and project search with a Ctrl/Cmd+K command palette.
22. Added keyboard selection, dismissal, and result navigation to the palette.
23. Added a visible search entry point in the main navigation.
24. Added mobile-menu close and Escape controls with focus cycling.
25. Added a reading-progress indicator.
26. Improved the contact action with a copy-email button and required field validation.
27. Added useful search and project paths from the 404 page.
28. Removed automatic ambient-audio start from the boot action; audio starts only by explicit opt-in.
29. Fixed the initial-load transition overlay appearing under React StrictMode.

## Publishing and verification

30. Added route-aware document titles, descriptions, canonical URLs, and social tags.
31. Added truthful Organization structured data, robots rules, a generated sitemap, and a social image.
32. Added Windows-compatible scene smoke execution.
33. Added public snapshot validation and browser sweeps across all routes and viewport widths.
34. Added interaction checks for projects, technology, Lab, search, navigation, and boot audio.
35. Added visual review captures for key pages and responsive states.
36. Updated vulnerable dependency resolutions without a major-version force upgrade.
37. Gated legacy hero metrics behind explicit source metadata and replaced unsupported operational or classified display labels with neutral overview language.
38. Recast the unnamed-system route as a public-source boundary instead of implying a hidden live build.
39. Recast the North Console route as an explicitly conceptual architecture study.
40. Recast the experimental-interface route around inspectable site and Lab behavior.
41. Rewrote Security as design principles and review questions, without unverifiable control or certification assertions.
42. Replaced the fictional research-node catalogue with links to visible site experiments and source.
43. Replaced invented internal tooling claims with the site's actual build, scene, browser QA, and GitHub snapshot tooling.
44. Replaced invented Interface Lab component counts with examples of real site components and interactions.
45. Removed unused fictional project and research records, unsupported capability scores, and misleading active-state category labels from shared data.
46. Recast Internal Platforms as a capability model with explicit design questions instead of service coverage and refresh-rate claims.
47. Indexed every preserved deep route in the global command palette, including routes removed from promoted navigation.
48. Added an interactive repository relationship graph on the project explorer and detail pages, with edges derived only from shared GitHub language data.
49. Replaced the static Engineering layer cards with an interactive architecture view, including real inputs, outputs, and source-file links for each layer.
50. Connected every public timeline entry to its corresponding repository profile, making the chronology's source path actionable.
51. Extended the curated GitHub snapshot with a selected set of public root folders and source entry points, bounded to each reviewed repository URL.
52. Added a repository-tree view to public project profiles with source links, snapshot context, and an expandable list for larger roots.
53. Made repository languages and root entries required inputs during GitHub sync, so a failed request aborts before replacing the reviewed snapshot.
54. Reframed the Musebase detail route as a published design description without asserting a live platform or measured outcomes.
55. Reframed the Client-Facing Portals route as an access-design model with explicit implementation and test questions.
56. Reframed the Data Interfaces route as proposed patterns with explicit source, freshness, and permission questions.
57. Added a labeled combobox relationship, active-result announcement, and visible close control to the site command palette.
58. Indexed reviewed public-project summaries, highlights, languages, and topics in command search without exposing unreviewed repository content.

## Gate record

- `npm run lint`: passed.
- `npm run build`: passed, including a 40-URL sitemap.
- `npm run test:data`: passed for eight curated public repositories.
- `node qa/scene-smoke.mjs`: passed with 68 scenes and no import/runtime errors.
- `node qa/interactions.mjs`: passed.
- `node qa/website-smoke.mjs`: passed 41 routes at ten widths on both development and production preview, with no page errors, overflow, broken internal links, or duplicate titles.
- `node qa/visual-review.mjs`: passed on production preview; settled desktop and mobile screenshots were visually reviewed, including the rewritten legacy pages.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `git diff --check`: passed; Git reported only Windows line-ending conversion notices.

The brief's 100-component and 500-substantive-delta thresholds are not met. This ledger records 58 concrete changes and does not count each route, style rule, or screenshot as a separate implementation delta.
