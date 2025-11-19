import React, { useEffect, useState } from 'react';
import '../styles/MarkdownPage.css'
import { useLocation, useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

// Preload all markdown files using Vite's glob import (raw content)
const mdModules = import.meta.glob('/public/chapters/*.md', { as: 'raw' });

function slugify(str = '') { return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80); }

const docOrder = [
  { path: '/playbook/01-intro', label: 'Playbook Intro' },
  { path: '/playbook/02-evolution-of-asr', label: 'Evolution of ASR' },
  { path: '/playbook/03-background-of-asr', label: 'Background of ASR' },
  { path: '/playbook/04-dataset-creation-guidelines', label: 'Guidelines' },
  { path: '/playbook/04-i-metadata', label: 'Metadata' },
  { path: '/playbook/04-ii-curation-for-diversity', label: 'Curation for Diversity' },
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
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // derive whether to show a right-hand TOC for long documents
  const showToc = headings.length >= 4 || content.length > 2200;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Normalize filePath so it matches the keys produced by import.meta.glob
      // (which are absolute like `/public/01-intro.md`). Components sometimes
      // pass relative paths like `../../public/01-intro.md` which prevents the
      // Vite loader from being used and forces a network fetch. Convert any
      // incoming path that contains `/public/` to the absolute `/public/...` form.
      if (!filePath) return;
      const normalized = filePath.includes('/public/') ? filePath.replace(/.*\/public\//, '/public/') : filePath;

      const loader = mdModules[normalized];
      if (loader) {
        try {
          const raw = await loader();
          if (!cancelled) setContent(raw);
          return;
        } catch (e) {
          // fall through to fetch fallback
        }
      }

      // Fallback: network fetch (works if files are served from public)
      try {
        const res = await fetch(normalized);
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

  // Extract headings (h2/h3) from raw markdown so we can render a TOC
  useEffect(() => {
    if (!content) return;
    const list = [];
    const re = /^(#{2,3})\s+(.*)$/gm;
    let m;
    while ((m = re.exec(content)) !== null) {
      const lvl = m[1].length; // 2 for h2, 3 for h3
      const text = m[2].trim();
      const id = slugify(text);
      list.push({ id, text, level: lvl });
    }
    setHeadings(list);
  }, [content]);

  // Scroll-spy: observe headings in the rendered DOM and update activeId
  useEffect(() => {
    if (!headings || headings.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { root: null, rootMargin: '0px 0px -65% 0px', threshold: 0.1 }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings, content]);

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // update hash without jumping
    if (history && history.replaceState) history.replaceState(null, '', `#${id}`);
  }

  return (
    <div className="doc-layout doc-container">
      <main className="doc-main markdown-body doc-main-inner">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => {
              const id = slugify(String(props.children));
              return <h1 id={id} {...props}>{props.children}</h1>;
            },
            h2: ({ node, ...props }) => {
              const id = slugify(String(props.children));
              return <h2 id={id} {...props}>{props.children}</h2>;
            },
            h3: ({ node, ...props }) => {
              const id = slugify(String(props.children));
              return <h3 id={id} {...props}>{props.children}</h3>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
        {(prev || next) && (
          <nav className="prev-next-nav" aria-label="Page navigation">
            {prev ? (
              <button
                onClick={() => navigate(prev.path)}
                className="btn-primary"
              >
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{prev.label}</span>
              </button>
            ) : <div />}

            {next ? (
              <button
                onClick={() => navigate(next.path)}
                className="btn-primary"
              >
                <span>{next.label}</span>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : <div />}
          </nav>
        )}
      </main>

      {showToc && (
        <aside className="doc-toc" aria-label="Table of contents">
          <div className="doc-toc-inner">
            <strong className="doc-toc-title">On this page</strong>
            <ul>
              {headings.map(h => (
                <li key={h.id} className={h.level === 3 ? 'toc-sub' : ''}>
                  <button onClick={() => scrollToId(h.id)} className={activeId === h.id ? 'active' : ''}>
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
