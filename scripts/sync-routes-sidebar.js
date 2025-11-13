#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const chaptersDir = path.join(root, 'chapters');
const docsDir = path.join(root, 'components', 'docs');
const mainFile = path.join(root, 'main.jsx');
const sidebarFile = path.join(root, 'components', 'Sidebar.jsx');

if (!fs.existsSync(chaptersDir)) {
  console.error('chapters directory not found:', chaptersDir);
  process.exit(1);
}
if (!fs.existsSync(mainFile)) {
  console.error('main.jsx not found:', mainFile);
  process.exit(1);
}
if (!fs.existsSync(sidebarFile)) {
  console.error('Sidebar.jsx not found:', sidebarFile);
  process.exit(1);
}

function titleize(str){
  return str.split(/[-_]/).map(s=> s.replace(/\b\w/g,ch=>ch.toUpperCase())).join(' ').replace(/\bAsr\b/i,'ASR');
}

// Read chapters
const mdFiles = fs.readdirSync(chaptersDir).filter(f=>f.endsWith('.md'))
  .sort((a,b)=>{
    // sort by leading numeric prefix then filename
    const na = a.match(/^([0-9]+)-/); const nb = b.match(/^([0-9]+)-/);
    const ia = na ? parseInt(na[1],10) : 9999;
    const ib = nb ? parseInt(nb[1],10) : 9999;
    if (ia !== ib) return ia - ib;
    return a.localeCompare(b);
  });

if (mdFiles.length === 0){
  console.log('No chapters found.');
  process.exit(0);
}

// Build entries
const ACRONYMS = ['ASR','NLP','API','HTTP','URL','ID'];
const entries = mdFiles.map(f=>{
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
  return { file: f, base, route: `/playbook/${base}`, compName, label, sub: /^\d+-(?:i|ii|iii|iv|v)-/.test(base) };
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
if (importMarkerIdx === -1){
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
if (routesIdx === -1){ console.error('Routes marker not found in main.jsx'); process.exit(1); }
// find the end of the playbook route: the next line that matches "          </Route>" after routesIdx
const closingPlaybook = mainSrc.indexOf('\n          </Route>', routesIdx);
if (closingPlaybook === -1){ console.error('Cannot find closing </Route> for playbook in main.jsx'); process.exit(1); }
const routesStart = routesIdx + routesMarker.length;
const routesEnd = closingPlaybook;
mainSrc = mainSrc.slice(0, routesStart) + '\n' + routeLines + '\n' + mainSrc.slice(routesEnd);

fs.writeFileSync(mainFile, mainSrc, 'utf8');
console.log('Updated main.jsx with', entries.length, 'routes.');

// Generate sidebar sections: single section with all items in order, mark sub items
const items = entries.map(e => ({ to: e.route, label: e.label, sub: e.sub }));
const sidebarSections = [ { heading: null, items } ];

// Prepare JS text for sections
const sectionsJson = JSON.stringify(sidebarSections, null, 2).replace(/"to":/g,'to:').replace(/"label":/g,'label:').replace(/"sub":/g,'sub:');
const sectionsText = `const sections = ${sectionsJson};\n`;

// Read sidebar and replace the existing const sections = [...] block
let sideSrc = fs.readFileSync(sidebarFile, 'utf8');
const sectionsStart = sideSrc.indexOf('const sections =');
if (sectionsStart === -1){ console.error('const sections = not found in Sidebar.jsx'); process.exit(1); }
const sectionsEnd = sideSrc.indexOf('];', sectionsStart);
if (sectionsEnd === -1){ console.error('Cannot find end of sections array in Sidebar.jsx'); process.exit(1); }
// find the index after the closing bracket of the array
const afterSectionsEnd = sideSrc.indexOf('\n', sectionsEnd) + 1;
sideSrc = sideSrc.slice(0, sectionsStart) + sectionsText + sideSrc.slice(afterSectionsEnd);
fs.writeFileSync(sidebarFile, sideSrc, 'utf8');
console.log('Updated Sidebar.jsx with', entries.length, 'items.');

console.log('Sync complete.');
