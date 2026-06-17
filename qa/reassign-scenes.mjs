/* Deterministically reassigns the `scene:` value of every block across the
   data-driven page files to thematically-distinct presets from the expanded
   library, so no page reuses the same handful of scenes. Replaces scene
   strings in document order (hero first, then blocks) from each page's pool. */
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(new URL('../src/data/pages', import.meta.url).pathname);

// thematic scene pool per page file (in block order)
const POOLS = {
  'systems.js': ['hex-tunnel', 'orbital-command', 'dashboard-tiles', 'isometric-infra', 'status-pulse-grid', 'architecture-layer', 'contact-transmission'],
  'systems-operational-management.js': ['workflow-river', 'permission-orbit', 'scheduling-grid', 'musebase-coordination', 'status-pulse-grid', 'data-interface-wave', 'contact-transmission'],
  'systems-commerce-infrastructure.js': ['commerce-pipeline', 'transaction-wave', 'dashboard-tiles', 'secure-boundary', 'data-stream-ribbons', 'node-compression', 'contact-transmission'],
  'systems-automation.js': ['trigger-action-pulse', 'dependency-graph', 'build-pipeline', 'node-compression', 'workflow-river', 'status-pulse-grid', 'contact-transmission'],
  'systems-internal-platforms.js': ['dashboard-tiles', 'status-pulse-grid', 'heatmap-control', 'data-interface-wave', 'architecture-layer', 'tooling-console', 'contact-transmission'],
  'systems-data-interfaces.js': ['data-interface-wave', 'data-stream-ribbons', 'signal-spectrum-field', 'heatmap-control', 'transaction-wave', 'dashboard-tiles', 'contact-transmission'],
  'systems-client-portals.js': ['client-portal-gate', 'secure-boundary', 'permission-orbit', 'radar-cutaway', 'status-pulse-grid', 'concentric-gate', 'contact-transmission'],
  'systems-research-systems.js': ['research-blackout', 'unknown-silhouette', 'glyph-compiler', 'redaction-matrix', 'blackout-silhouette', 'magnetic-vector', 'contact-transmission'],
  'north.js': ['dependency-graph', 'architecture-layer', 'build-pipeline', 'tooling-console', 'interface-lab-shape', 'isometric-infra', 'contact-transmission'],
  'north-engineering.js': ['build-pipeline', 'dependency-graph', 'isometric-infra', 'architecture-layer', 'tooling-console', 'node-compression', 'contact-transmission'],
  'north-interface-lab.js': ['interface-lab-shape', 'split-prism', 'glyph-compiler', 'dashboard-tiles', 'magnetic-vector', 'liquid-glass-operational', 'contact-transmission'],
  'north-motion-systems.js': ['motion-curve-field', 'radial-audio-core', 'signal-spectrum-field', 'compass-vector', 'magnetic-vector', 'vector-compass', 'contact-transmission'],
  'north-architecture.js': ['architecture-layer', 'isometric-infra', 'dependency-graph', 'hex-tunnel', 'secure-boundary', 'topology-pulse', 'contact-transmission'],
  'north-tooling.js': ['tooling-console', 'build-pipeline', 'command-terminal', 'glyph-compiler', 'dependency-graph', 'status-pulse-grid', 'contact-transmission'],
  'work.js': ['node-compression', 'orbital-command', 'isometric-infra', 'research-blackout', 'dashboard-tiles', 'redacted-timeline-branch', 'contact-transmission'],
  'work-commerce-system-i.js': ['commerce-pipeline', 'transaction-wave', 'dashboard-tiles', 'secure-boundary', 'data-stream-ribbons', 'status-pulse-grid', 'contact-transmission'],
  'work-musebase.js': ['musebase-coordination', 'scheduling-grid', 'permission-orbit', 'data-interface-wave', 'status-pulse-grid', 'liquid-glass-operational', 'contact-transmission'],
  'work-north-console.js': ['tooling-console', 'dashboard-tiles', 'command-terminal', 'build-pipeline', 'status-pulse-grid', 'dependency-graph', 'contact-transmission'],
  'work-unknown-system-03.js': ['unknown-silhouette', 'research-blackout', 'blackout-silhouette', 'redaction-matrix', 'glyph-compiler', 'magnetic-vector', 'contact-transmission'],
  'work-experimental-interface-program.js': ['interface-lab-shape', 'split-prism', 'glyph-compiler', 'liquid-glass-operational', 'magnetic-vector', 'motion-curve-field', 'contact-transmission'],
  'company.js': ['orbital-command', 'architecture-layer', 'topology-pulse', 'status-pulse-grid', 'isometric-infra', 'compass-vector', 'contact-transmission'],
  'company-principles.js': ['compass-vector', 'orbital-command', 'vector-compass', 'topology-pulse', 'motion-curve-field', 'magnetic-vector', 'contact-transmission'],
  'company-security.js': ['secure-boundary', 'client-portal-gate', 'permission-orbit', 'radar-cutaway', 'concentric-gate', 'status-pulse-grid', 'contact-transmission'],
  'company-status.js': ['status-pulse-grid', 'dashboard-tiles', 'heatmap-control', 'polar-status', 'data-interface-wave', 'radar-cutaway', 'contact-transmission'],
  'legal-privacy.js': ['privacy-quiet-grid', 'architectural-grid', 'topology-pulse', 'status-pulse-grid'],
  'legal-terms.js': ['privacy-quiet-grid', 'architectural-grid', 'topology-pulse', 'status-pulse-grid'],
};

const sceneRe = /scene:\s*'([^']+)'/g;
let totalFiles = 0;
let totalReplaced = 0;

for (const [file, pool] of Object.entries(POOLS)) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) {
    console.warn('MISSING', file);
    continue;
  }
  let src = fs.readFileSync(fp, 'utf8');
  let i = 0;
  const before = src;
  src = src.replace(sceneRe, (_m, old) => {
    const next = pool[i % pool.length];
    i += 1;
    return `scene: '${next}'`;
  });
  if (src !== before) {
    fs.writeFileSync(fp, src);
    totalFiles += 1;
    totalReplaced += i;
    console.log(`${file.padEnd(42)} ${i} scenes -> [${pool.slice(0, i).join(', ')}]`);
  } else {
    console.log(`${file.padEnd(42)} (no scene: keys found)`);
  }
}

console.log(`\nrewrote ${totalReplaced} scene assignments across ${totalFiles} files`);
