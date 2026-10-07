const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

async function readDocIndex() {
  // Read components/docs/docIndex.js and parse exported docEntries/docOrder arrays
  const docIndexPath = path.join(ROOT, 'components', 'docs', 'docIndex.js');
  const src = await fsp.readFile(docIndexPath, 'utf8');
  const entriesMatch = src.match(/export const docEntries =\s*(\[.*?\]);/s);
  const orderMatch = src.match(/export const docOrder =\s*(\[.*?\]);/s);
  if (!entriesMatch || !orderMatch) {
    throw new Error('Failed to parse docIndex.js exports');
  }
  const docEntries = JSON.parse(entriesMatch[1]);
  const docOrder = JSON.parse(orderMatch[1]);

  const ACRONYMS = ['ASR', 'NLP', 'API', 'HTTP', 'URL', 'ID'];
  const compNameFromBase = (base) => {
    const labelPart = base.replace(/^[0-9]+-/, '');
    const rawParts = labelPart.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const pascalParts = rawParts.map(s => {
      const up = s.toUpperCase();
      if (ACRONYMS.includes(up)) return up;
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
    return (pascalParts.join('') || 'Doc') + 'Doc';
  };

  return docOrder.map(o => {
    const fullPath = o.path || '';
    const entry = docEntries.find(e => e.path === fullPath);
    const base = entry ? entry.base : fullPath.replace(/^\/playbook\//, '');
    const componentName = compNameFromBase(base);
    return {
      routePath: fullPath, // e.g., /playbook/01-intro
      componentName,
      importPath: `./components/docs/${base}`,
    };
  });
}

const MAIN_FILE = path.join(ROOT, 'main.jsx');

/**
 * Detect if an import for a component already exists.
 */
function hasImport(content, componentName) {
  const importRegex = new RegExp(`\\bimport\\s+${componentName}\\b`);
  return importRegex.test(content);
}

/**
 * Detect if a route for a path already exists.
 */
function hasRoute(content, routePath, componentName) {
  const routeRegex = new RegExp(
    `<Route\\s+path=["'\`]${escapeRegExp(routePath)}["'\`]\\s+element=\\{<${escapeRegExp(
      componentName
    )}\\s*/?>\\}\\s*/?>`
  );
  return routeRegex.test(content);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Insert imports at the top, before first non-comment import or after last import. */
function insertImports(content, items) {
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s+/.test(lines[i])) lastImportIdx = i;
  }

  const importLines = items
    .filter(i => !hasImport(content, i.componentName))
    .map(i => `import ${i.componentName} from '${i.importPath}';`);

  if (importLines.length === 0) return content;

  const insertionIdx = lastImportIdx >= 0 ? lastImportIdx + 1 : 0;
  const before = lines.slice(0, insertionIdx);
  const after = lines.slice(insertionIdx);
  const next = [...before, ...importLines, ...after].join('\n');
  return next;
}

/** Insert routes after the last existing <Route path="..." /> in main.jsx. */
function insertRoutes(content, items) {
  const lines = content.split('\n');

  const routeLines = items
    .filter(i => !hasRoute(content, i.routePath, i.componentName))
    .map(i => `        <Route path="${i.routePath}" element={<${i.componentName} />} />`);

  if (routeLines.length === 0) return content;

  // Find the last line that declares a Route with a path attribute
  let lastPathRouteIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/\<Route\s+path=/.test(lines[i]) && !/\<\/Route\>/.test(lines[i])) {
      lastPathRouteIdx = i;
    }
  }

  // If none found, append before closing wrappers by finding </Routes> and inserting just before it
  if (lastPathRouteIdx === -1) {
    let closeRoutesIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (/<\/Routes>/.test(lines[i])) { closeRoutesIdx = i; break; }
    }
    if (closeRoutesIdx !== -1) {
      const before = lines.slice(0, closeRoutesIdx);
      const after = lines.slice(closeRoutesIdx);
      const next = [...before, ...routeLines, ...after].join('\n');
      return next;
    }
    // Fallback: append to end of file
    return content + '\n' + routeLines.join('\n') + '\n';
  }

  // Insert directly after the last existing route line
  const before = lines.slice(0, lastPathRouteIdx + 1);
  const after = lines.slice(lastPathRouteIdx + 1);
  const next = [...before, ...routeLines, ...after].join('\n');
  return next;
}

(async function main() {
  try {
    const normalized = await readDocIndex();
    if (!Array.isArray(normalized) || normalized.length === 0) {
      console.error('docIndex has no valid items.');
      process.exit(1);
    }

    if (!fs.existsSync(MAIN_FILE)) {
      throw new Error('main.jsx not found at project root.');
    }
    const original = await fsp.readFile(MAIN_FILE, 'utf8');

    // Resolve import paths with knowledge of target file location
    const itemsWithPaths = normalized.map(item => ({ ...item, __targetFile: MAIN_FILE }));

    let updated = insertImports(original, itemsWithPaths);
    updated = insertRoutes(updated, itemsWithPaths);

    if (updated !== original) {
      await fsp.writeFile(MAIN_FILE, updated, 'utf8');
      console.log(`Updated main.jsx with ${itemsWithPaths.length} routes and imports.`);
    } else {
      console.log('No changes needed.');
    }
  } catch (err) {
    console.error(err.message || String(err));
    process.exit(1);
  }
})();