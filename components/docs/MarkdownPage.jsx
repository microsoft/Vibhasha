import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

// Preload all markdown files using Vite's glob import (raw content)
const mdModules = import.meta.glob('/docs/*.md', { as: 'raw' });

function slugify(str=''){ return str.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80); }

const docOrder = [
  { path: '/playbook/01-intro', label: 'Playbook Intro' },
  { path: '/playbook/02-evolution-of-asr', label: 'Evolution of ASR' },
  { path: '/playbook/03-background-of-asr', label: 'Background of ASR' },
  { path: '/playbook/04-dataset-creation-guidelines', label: 'Guidelines' },
  { path: '/playbook/04-i-metadata', label: 'Metadata' },
  { path: '/playbook/04-ii-curation-for-diverty', label: 'Curation for Diversity' },
  { path: '/playbook/04-iii-generalization-vs-domain', label: 'Generalization vs Domain' },
  { path: '/playbook/04-iv-quality-control', label: 'Quality Control' },
  { path: '/playbook/05-data-formats-structures', label: 'Data Formats & Structures' },
  { path: '/playbook/06-data-preprocessing', label: 'Data Preprocessing' },
  { path: '/playbook/07-data-compression', label: 'Data Compression' },
  { path: '/playbook/08-model-finetuning-intro', label: 'Finetuning Intro' },
  { path: '/playbook/08-i-model-selection', label: 'Model Selection' },
  { path: '/playbook/08-ii-full-finetuning', label: 'Full Finetuning' },
  { path: '/playbook/08-iii-peft', label: 'PEFT' },
  { path: '/playbook/08-iv-decision-matrix', label: 'Decision Matrix' },
  { path: '/playbook/09-inference', label: 'Inference' },
  { path: '/playbook/10-data-augmentation', label: 'Data Augmentation' },
  { path: '/playbook/11-common-finetuning-challenges', label: 'Common Finetuning Challenges' },
  { path: '/playbook/12-conclusion', label: 'Conclusion' },
  { path: '/playbook/13-coming-soon', label: 'Coming Soon' }
];

export default function MarkdownPage({ filePath }) {
  const [content, setContent] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Support absolute /docs/... paths (as used in components)
      if (filePath && filePath.startsWith('/docs/')) {
        const loader = mdModules[filePath];
        if (loader) {
          try {
            const raw = await loader();
            if (!cancelled) setContent(raw);
            return;
          } catch (e) {
            // fall through to fetch
          }
        }
      }
      // Fallback: network fetch (works if files are served from public)
      try {
        const res = await fetch(filePath);
        if (res.ok) {
          const txt = await res.text();
          if (!cancelled) setContent(txt);
        } else if (!cancelled) {
          setContent(`Failed to load markdown: ${res.status} ${res.statusText}`);
        }
      } catch (e) {
        if (!cancelled) setContent(`Error loading markdown: ${e.message}`);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [filePath]);

  // Prev/Next calculation
  const idx = docOrder.findIndex(d => d.path === location.pathname);
  const prev = idx > 0 ? docOrder[idx - 1] : null;
  const next = idx >= 0 && idx < docOrder.length - 1 ? docOrder[idx + 1] : null;

  return (
    <div className="markdown-body" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => {
            const id = slugify(String(props.children));
            return <h1 id={id} {...props}>{props.children}</h1>;
          },
          h2: ({node, ...props}) => {
            const id = slugify(String(props.children));
            return <h2 id={id} {...props}>{props.children}</h2>;
          },
          h3: ({node, ...props}) => {
            const id = slugify(String(props.children));
            return <h3 id={id} {...props}>{props.children}</h3>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
      <nav className="prev-next-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, gap: '1rem' }} aria-label="Page navigation">
        <button
          disabled={!prev}
          onClick={() => prev && navigate(prev.path)}
          className="btn-primary"
          style={{ opacity: prev ? 1 : .45 }}
        >
          {prev ? prev.label : "Start"}
        </button>
        <button
          disabled={!next}
          onClick={() => next && navigate(next.path)}
          className="btn-primary"
          style={{ opacity: next ? 1 : .45 }}
        >
          {next ? next.label : 'The End'}
        </button>
      </nav>
    </div>
  );
}
