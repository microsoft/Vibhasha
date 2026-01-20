#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const chaptersDir = path.join(root, 'public', 'chapters');
const docsDir = path.join(root, 'components', 'docs');
const docIndexFile = path.join(docsDir, 'docIndex.js');
const mainFile = path.join(root, 'main.jsx');

if (!fs.existsSync(chaptersDir)) {
  console.error('chapters directory not found:', chaptersDir);
  process.exit(1);
}
if (!fs.existsSync(mainFile)) {
  console.error('main.jsx not found:', mainFile);
  process.exit(1);
}

function titleize(str) {
  return str.split(/[-_]/).map(s => s.replace(/\b\w/g, ch => ch.toUpperCase())).join(' ').replace(/\bAsr\b/i, 'ASR');
}

// Read chapters
const mdFiles = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md'));

if (mdFiles.length === 0) {
  console.log('No chapters found.');
  process.exit(0);
}

// Build entries
const ACRONYMS = ['ASR', 'NLP', 'API', 'HTTP', 'URL', 'ID'];
// Default icon map for common roots (can be edited later in docIndex)
const DEFAULT_ICON_BY_BASE = {
  '02-evolution-of-asr': 'Branch24Regular',
  '04-dataset-creation-guidelines': 'Add24Regular',
  '08-model-finetuning-intro': 'Options24Regular',
  '09-inference': 'PlugConnected24Regular',
  '10-data-augmentation': 'Wand24Regular'
};

let entries = mdFiles.map(f => {
  const base = f.replace(/\.md$/, '');
  // label: remove leading digits and dash
  const labelPart = base.replace(/^[0-9]+-/, '');
  // if starts with a small roman or letter segment like i-, ii- treat as simple
  const label = titleize(labelPart.replace(/^i-/, '').replace(/^ii-/, '').replace(/^iii-/, '').replace(/^iv-/, ''));
  // build component name but honor known acronyms (ASR -> ASR)
  const rawParts = labelPart.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const pascalParts = rawParts.map(s => {
    const up = s.toUpperCase();
    if (ACRONYMS.includes(up)) return up;
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  const compName = (pascalParts.join('') || 'Doc') + 'Doc';
  const prefixMatch = base.match(/^(\d{2})-/);
  const prefix = prefixMatch ? prefixMatch[1] : null;
  const isSub = /^\d+-(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)-/.test(base);
  const icon = !isSub ? (DEFAULT_ICON_BY_BASE[base] || 'Document24Regular') : null;
  return { file: f, base, route: `/playbook/${base}`, compName, label, isSub, prefix, icon };
});

// Ensure ordering places root chapter before its sub-items and respects roman order
const ROMAN_ORDER = ['i','ii','iii','iv','v','vi','vii','viii','ix','x'];
function romanIndex(base) {
  const m = base.match(/^\d+-(i|ii|iii|iv|v|vi|vii|viii|ix|x)-/);
  return m ? ROMAN_ORDER.indexOf(m[1]) : -1;
}
entries = entries.sort((a, b) => {
  const pa = a.prefix ? parseInt(a.prefix, 10) : 9999;
  const pb = b.prefix ? parseInt(b.prefix, 10) : 9999;
  if (pa !== pb) return pa - pb;
  if (a.isSub !== b.isSub) return a.isSub ? 1 : -1; // root first
  if (!a.isSub && !b.isSub) return a.base.localeCompare(b.base);
  const ra = romanIndex(a.base);
  const rb = romanIndex(b.base);
  if (ra !== rb) return ra - rb;
  return a.base.localeCompare(b.base);
});

// Generate import block and route block for main.jsx
const importLines = entries.map(e => `import ${e.compName} from './components/docs/${e.base}'`).join('\n');
const routeLines = entries.map(e => `            <Route path="${e.base}" element={<${e.compName} />} />`).join('\n');

// Update main.jsx
let mainSrc = fs.readFileSync(mainFile, 'utf8');
const importMarker = '// Docs markdown components';
const createRootIdx = mainSrc.indexOf('createRoot(');
if (createRootIdx === -1) { console.error('createRoot not found in main.jsx'); process.exit(1); }
const importMarkerIdx = mainSrc.indexOf(importMarker);
if (importMarkerIdx === -1) {
  console.error('Import marker not found in main.jsx:', importMarker);
  process.exit(1);
}
// Replace between importMarker and createRootIdx
const before = mainSrc.slice(0, importMarkerIdx + importMarker.length);
const after = mainSrc.slice(createRootIdx);
const newImportBlock = importMarker + '\n' + importLines + '\n\n';
mainSrc = before + '\n' + importLines + '\n\n' + after;

// Replace routes inside the playbook Route: find the docs routes marker
const routesMarker = '{/* Docs markdown routes */}';
const routesIdx = mainSrc.indexOf(routesMarker);
if (routesIdx === -1) { console.error('Routes marker not found in main.jsx'); process.exit(1); }
// find the end of the playbook route: the next line that matches "          </Route>" after routesIdx
const closingPlaybook = mainSrc.indexOf('\n          </Route>', routesIdx);
if (closingPlaybook === -1) { console.error('Cannot find closing </Route> for playbook in main.jsx'); process.exit(1); }
const routesStart = routesIdx + routesMarker.length;
const routesEnd = closingPlaybook;
mainSrc = mainSrc.slice(0, routesStart) + '\n' + routeLines + '\n' + mainSrc.slice(routesEnd);

fs.writeFileSync(mainFile, mainSrc, 'utf8');
console.log('Updated main.jsx with', entries.length, 'routes.');

// Generate docIndex.js for Sidebar and MarkdownPage consumption
const docEntries = entries.map(e => ({ path: e.route, label: e.label, base: e.base, prefix: e.prefix, isSub: e.isSub, icon: e.icon }));
const docOrder = docEntries.map(e => ({ path: e.path, label: e.label }));
const indexSrc = `// Auto-generated by scripts/sync-routes-sidebar.js\n// Do not edit manually; run the sync script after changing chapters.\n\nexport const docEntries = ${JSON.stringify(docEntries, null, 2)};\n\nexport const docOrder = ${JSON.stringify(docOrder, null, 2)};\n`;
fs.writeFileSync(docIndexFile, indexSrc, 'utf8');
console.log('Wrote doc index:', docIndexFile);
console.log('Sidebar uses docIndex dynamically. Sync complete.');
