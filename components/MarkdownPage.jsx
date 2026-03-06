import React, { useEffect, useMemo, useState } from 'react';
import './styles/MarkdownPage.css'
import './styles/MkDocsMaterial.css'
import { useLocation, useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy16Regular, ArrowDownload16Regular, Checkmark16Regular as CopyCheck16Regular } from '@fluentui/react-icons';
import { docOrder as generatedDocOrder, docEntries } from './docs/docIndex.js';
import Hero from './Hero.jsx';
import { useTheme } from '../theme/ThemeContext.jsx'
import { ChevronLeft24Regular, ChevronRight24Regular, Checkmark16Regular, Link16Regular } from '@fluentui/react-icons'

// MkDocs Material syntax transformers
import { preprocessAdmonitions } from '../plugins/remark-admonitions.js';
import { preprocessIcons } from '../plugins/remark-icons.js';
import { preprocessAttrList } from '../plugins/remark-attr-list.js';
import { preprocessContentTabs } from '../plugins/remark-content-tabs.js';

/**
 * Preprocess markdown content to transform MkDocs Material syntax
 * This runs before react-markdown parses the content
 */
export function preprocessMarkdown(rawContent) {
  let content = rawContent;

  // Strip MkDocs-style code block attributes (e.g., ```py linenums="1" -> ```python)
  // Map common short language names to full names for better syntax highlighting
  const langMap = { py: 'python', js: 'javascript', ts: 'typescript', sh: 'bash', yml: 'yaml' };
  content = content.replace(/```(\w+)\s+[^\n]*\n/g, (match, lang) => {
    const mappedLang = langMap[lang] || lang;
    return '```' + mappedLang + '\n';
  });

  // Order matters: process content tabs first, then admonitions (they may contain icons/buttons)
  content = preprocessContentTabs(content);
  content = preprocessAdmonitions(content);
  content = preprocessIcons(content);
  content = preprocessAttrList(content);
  return content;
}

// Preload all markdown files using Vite's glob import (raw content)
const mdModules = import.meta.glob('/public/chapters/*.md', { as: 'raw' });

function slugify(str = '') { return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80); }

const docOrder = generatedDocOrder;

export default function MarkdownPage({ filePath }) {
  const [content, setContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
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
  function prettyTitle(label) {
    if (!label) return '';
    return label.replace(/\b(Guidelines|Intro)\b/i, '').replace(/\s{2,}/g, ' ').trim() || label;
  }
  const heroTitle = prettyTitle(groupInfo?.label || currentEntry?.label);
  const heroSubtitle = appSubtitle;

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
      // For public folder files, strip /public prefix since Vite serves them at root
      const fetchPath = normalized.replace(/^\/public/, '');
      try {
        const res = await fetch(fetchPath);
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

  // Preprocess markdown content for MkDocs Material syntax
  useEffect(() => {
    if (content) {
      const processed = preprocessMarkdown(content);
      setProcessedContent(processed);
    } else {
      setProcessedContent('');
    }
  }, [content]);

  // Always scroll to top when the route (page) changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // On new page, default TOC active to the first heading
  useEffect(() => {
    if (headings && headings.length > 0) {
      setActiveId(headings[0].id);
    } else {
      setActiveId(null);
    }
  }, [location.pathname, headings]);

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
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the heading closest to the top of the viewport
          visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
          setActiveId(visible[0].target.id);
        }
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
    setActiveId(id);
  }


  // Handle content tabs interactivity
  useEffect(() => {
    if (!processedContent) return;
    
    // Update scroll button visibility for a tab nav
    const updateScrollButtons = (tabGroup) => {
      const nav = tabGroup.querySelector('.content-tabs-nav');
      const leftBtn = tabGroup.querySelector('.scroll-left');
      const rightBtn = tabGroup.querySelector('.scroll-right');
      
      if (!nav || !leftBtn || !rightBtn) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = nav;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
      
      leftBtn.classList.toggle('visible', canScrollLeft);
      rightBtn.classList.toggle('visible', canScrollRight);
    };
    
    // Initialize scroll buttons for all tab groups
    const initScrollButtons = () => {
      document.querySelectorAll('.content-tabs').forEach(tabGroup => {
        updateScrollButtons(tabGroup);
        
        const nav = tabGroup.querySelector('.content-tabs-nav');
        if (nav) {
          nav.addEventListener('scroll', () => updateScrollButtons(tabGroup));
        }
      });
    };
    
    // Handle scroll button clicks
    const handleScrollClick = (e) => {
      const scrollBtn = e.target.closest('.content-tabs-scroll-btn');
      if (!scrollBtn) return;
      
      const tabGroup = scrollBtn.closest('.content-tabs');
      const nav = tabGroup?.querySelector('.content-tabs-nav');
      if (!nav) return;
      
      const scrollAmount = nav.clientWidth * 0.6;
      const direction = scrollBtn.dataset.scrollDir === 'left' ? -1 : 1;
      nav.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };
    
    const handleTabClick = (e) => {
      const btn = e.target.closest('.content-tab-btn');
      if (!btn) return;
      
      const tabGroup = btn.closest('.content-tabs');
      if (!tabGroup) return;
      
      const tabIndex = parseInt(btn.dataset.tabIndex, 10);
      
      // Update button states
      tabGroup.querySelectorAll('.content-tab-btn').forEach((b, i) => {
        b.classList.toggle('active', i === tabIndex);
        b.setAttribute('aria-selected', i === tabIndex ? 'true' : 'false');
      });
      
      // Update panel states
      tabGroup.querySelectorAll('.content-tab-panel').forEach((panel, i) => {
        panel.classList.toggle('active', i === tabIndex);
        if (i === tabIndex) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
      
      // Scroll active tab into view
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };
    
    // Initialize after a short delay to ensure DOM is ready
    setTimeout(initScrollButtons, 100);
    
    document.addEventListener('click', handleTabClick);
    document.addEventListener('click', handleScrollClick);
    window.addEventListener('resize', initScrollButtons);
    
    return () => {
      document.removeEventListener('click', handleTabClick);
      document.removeEventListener('click', handleScrollClick);
      window.removeEventListener('resize', initScrollButtons);
    };
  }, [processedContent]);

  // Render headings (h1-h3) with clickable anchors
  const renderHeading = (Tag) => ({ node, ...props }) => {
    const id = slugify(String(props.children));
    return (
      <Tag id={id} {...props}>
        <a
          href={`#${id}`}
          className="heading-anchor"
          onClick={(e) => { e.preventDefault(); scrollToId(id); }}
        >
          {props.children}
          <span className="heading-link-icon" aria-hidden="true">
            <Link16Regular />
          </span>
        </a>
      </Tag>
    );
  };

  const mdHeadingComponents = {
    h1: renderHeading('h1'),
    h2: renderHeading('h2'),
    h3: renderHeading('h3'),
  };

  // Custom code block renderer with syntax highlighting
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
      const ext = language || 'txt';
      const blob = new Blob([codeString], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    };

    if (!inline && language) {
      return (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-block-language">{language}</span>
            <div className="code-block-actions">
              <button onClick={handleCopy} className="code-action-btn" title="Copy code">
                {copied ? <CopyCheck16Regular /> : <Copy16Regular />}
              </button>
              <button onClick={handleDownload} className="code-action-btn" title="Download code">
                <ArrowDownload16Regular />
              </button>
            </div>
          </div>
          <SyntaxHighlighter
            style={oneLight}
            language={language}
            PreTag="div"
            className="code-block"
            showLineNumbers={false}
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code or code without language
    if (!inline && !language) {
      return (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-block-language">code</span>
            <div className="code-block-actions">
              <button onClick={handleCopy} className="code-action-btn" title="Copy code">
                {copied ? <CopyCheck16Regular /> : <Copy16Regular />}
              </button>
            </div>
          </div>
          <pre className="code-block-plain">
            <code {...props}>{children}</code>
          </pre>
        </div>
      );
    }

    return <code className={className} {...props}>{children}</code>;
  };

  const mdComponents = {
    ...mdHeadingComponents,
    code: CodeBlock,
  };

  // Images expected to be referenced with absolute `/assets/chapters/...` paths in markdown
  const imageModules = import.meta.glob('/assets/chapters/*', { as: 'url', eager: true });

  return (
    <div className="intro-root">
      <div className="doc-container">
          <div className="doc-layout">
            <main className="doc-main markdown-body doc-main-inner">
              <Hero title={heroTitle} subtitle={heroSubtitle} />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  ...mdComponents,
                  img: ({ node, ...props }) => {
                    const src = props.src || '';
                    const key = src.replace(/^\/+/, '');
                    const mapped = imageModules[`/${key}`] || imageModules[key];
                    return <img {...props} src={mapped || src} />;
                  },
                }}
              >
                {processedContent}
              </ReactMarkdown>
              {(prev || next) && (
                <nav className="prev-next-nav" aria-label="Page navigation">
                  {prev ? (
                    <button
                      onClick={() => navigate(prev.path)}
                      className="btn-primary"
                    >
                      <ChevronLeft24Regular />
                      <span>{prev.label}</span>
                    </button>
                  ) : <div />}

                  {next ? (
                    <button
                      onClick={() => navigate(next.path)}
                      className="btn-primary"
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
                        <button
                          onClick={() => scrollToId(h.id)}
                          className={activeId === h.id ? 'active' : ''}
                          aria-current={activeId === h.id ? 'true' : undefined}
                        >
                          <span>{h.text}</span>
                          {activeId === h.id && <Checkmark16Regular className="toc-active-icon" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
      </div>
    </div>
  );
}
