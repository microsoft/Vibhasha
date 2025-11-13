#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const chaptersDir = path.resolve(__dirname, '..', 'chapters');
const docsDir = path.resolve(__dirname, '..', 'components', 'docs');

if (!fs.existsSync(chaptersDir)){
  console.error('chapters directory not found:', chaptersDir);
  process.exit(1);
}
if (!fs.existsSync(docsDir)){
  console.error('components/docs directory not found:', docsDir);
  process.exit(1);
}

const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md'));
if (files.length === 0){
  console.log('No markdown files found in', chaptersDir);
  process.exit(0);
}

let created = 0;
let removed = 0;
files.forEach(file => {
  const base = path.basename(file, '.md');
  // convert to a safe JSX filename: keep original base and append .jsx
  const jsxName = `${base}.jsx`;
  const targetPath = path.join(docsDir, jsxName);
  if (fs.existsSync(targetPath)){
    console.log('Skipping existing wrapper:', jsxName);
    return;
  }

  // Create a component name from the file (drop numeric prefix, PascalCase, append 'Doc')
  const stripped = base.replace(/^[^a-zA-Z]+/, ''); // remove leading digits/punctuation
  const parts = stripped.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const pascal = parts.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const componentName = (pascal ? pascal : 'Doc') + 'Doc';

  // Use the same relative path style as existing wrappers (../../chapters/01-intro.md)
  const content = `import MarkdownPage from './MarkdownPage';\n\nexport default function ${componentName}() {\n  return <MarkdownPage filePath="../../chapters/${file}" />;\n}\n`;

  fs.writeFileSync(targetPath, content, { encoding: 'utf8' });
  console.log('Created wrapper:', jsxName);
  created += 1;
});

// Now detect and remove any JSX wrappers that don't have a matching markdown file
const existingWrappers = fs.readdirSync(docsDir).filter(f => f.endsWith('.jsx') && f !== 'MarkdownPage.jsx');
existingWrappers.forEach(w => {
  const mdName = `${w.replace(/\.jsx$/, '.md')}`;
  if (!files.includes(mdName)){
    const p = path.join(docsDir, w);
    try {
      fs.unlinkSync(p);
      console.log('Removed stale wrapper:', w);
      removed += 1;
    } catch (e) {
      console.error('Failed to remove', w, e.message);
    }
  }
});

console.log(`Done. Created ${created} new wrapper(s). Removed ${removed} stale wrapper(s).`);
