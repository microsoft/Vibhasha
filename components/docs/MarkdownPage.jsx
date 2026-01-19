import React, { useEffect, useMemo, useState } from 'react';
import '../styles/MarkdownPage.css'
import { useLocation, useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { docOrder as generatedDocOrder, docEntries } from './docIndex';
import Hero from '../Hero';
import { useTheme } from '../../theme/ThemeContext.jsx'
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons'

// Preload all markdown files using Vite's glob import (raw content)
const mdModules = import.meta.glob('/public/chapters/*.md', { as: 'raw' });

function slugify(str = '') { return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80); }

const docOrder = generatedDocOrder;

export default function MarkdownPage({ filePath }) {
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { appSubtitle, colors } = useTheme();

  const groupInfo = useMemo(() => {
    const full = location.pathname || '';
    const seg = full.replace(/^\/playbook\//, '');
    const m = seg.match(/^(\d{2})-/);
    if (!m) return null;
    const prefix = m[1];
    const current = docEntries.find(e => e.path === full);
    const isChild = current ? current.isSub : false;
    const items = docEntries.filter(e => e.isSub && e.prefix === prefix).map(e => ({ path: e.path, label: e.label }));
    if (items.length === 0) return null;
    const rootEntry = docEntries.find(e => !e.isSub && e.prefix === prefix);
    const label = rootEntry ? rootEntry.label : 'Chapter';
    return { label, items, prefix, isChild, root: rootEntry ? { path: rootEntry.path, label: rootEntry.label } : null };
  }, [location.pathname]);

  // Derive hero title: prefer root label for grouped pages; otherwise current entry label.
  const currentEntry = useMemo(() => docEntries.find(e => e.path === location.pathname), [location.pathname]);
  function prettyTitle(label){
    if (!label) return '';
    return label.replace(/\b(Guidelines|Intro)\b/i, '').replace(/\s{2,}/g,' ').trim() || label;
  }
  const heroTitle = prettyTitle(groupInfo?.label || currentEntry?.label);
  const heroSubtitle = appSubtitle;

  function onSelectSub(e){
    const to = e.target.value;
    if (to) navigate(to);
  }

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
        {groupInfo && (
          <div className="subchapter-menu" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <select id="subchapter-select" onChange={onSelectSub} defaultValue={location.pathname} style={{ padding:'8px 10px', borderRadius:8 }}>
              {groupInfo.root && (
                <option key={groupInfo.root.path} value={groupInfo.root.path}>{groupInfo.root.label}</option>
              )}
              {groupInfo.items.map(it => (
                <option key={it.path} value={it.path}>{it.label}</option>
              ))}
            </select>
          </div>
        )}
        {/* Themed hero at top of each page */}
        <Hero title={heroTitle} subtitle={heroSubtitle} />
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
                style={{ backgroundColor: colors.headerBg, color: colors.headerText }}
              >
                <ChevronLeft24Regular />
                <span>{prev.label}</span>
              </button>
            ) : <div />}

            {next ? (
              <button
                onClick={() => navigate(next.path)}
                className="btn-primary"
                style={{ backgroundColor: colors.headerBg, color: colors.headerText }}
              >
                <span>{next.label}</span>
                <ChevronRight24Regular />
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
