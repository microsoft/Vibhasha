import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/PlaybookIntro.css';
import './styles/MarkdownPage.css';
import './styles/MkDocsMaterial.css';
import Hero from './Hero';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import PageSearch from './PageSearch';
import SidebarIcon from './SidebarIcon';
import { docEntries } from './docs/docIndex';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { preprocessAdmonitions } from '../plugins/remark-admonitions.js';
import { preprocessIcons } from '../plugins/remark-icons.js';
import { preprocessAttrList } from '../plugins/remark-attr-list.js';

// Preload landing page markdown
const mdModules = import.meta.glob('/public/chapters/landingpage.md', { as: 'raw' });

function preprocessMarkdown(rawContent) {
  let content = rawContent;
  content = preprocessAdmonitions(content);
  content = preprocessIcons(content);
  content = preprocessAttrList(content);
  return content;
}

export default function PlaybookIntro(){
  const { appName, appSubtitle, colors, brandImage } = useTheme();
  const navigate = useNavigate();
  const [markdownContent, setMarkdownContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');

  // Build overview from sidebar tabs
  const overviewChapters = useMemo(() => (
    docEntries.filter(e => !e.isSub).map(e => ({ label: e.label, to: e.path, icon: e.icon }))
  ), []);

  // Load landing page markdown
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const loader = mdModules['/public/chapters/landingpage.md'];
      if (loader) {
        try {
          const raw = await loader();
          if (!cancelled) setMarkdownContent(raw);
          return;
        } catch (e) {
          // fall through to fetch fallback
        }
      }
      // Fallback: network fetch
      try {
        const res = await fetch('/chapters/landingpage.md');
        if (res.ok) {
          const txt = await res.text();
          if (!cancelled) setMarkdownContent(txt);
        }
      } catch (e) {
        console.error('Error loading landing page markdown:', e);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Preprocess markdown content
  useEffect(() => {
    if (markdownContent) {
      setProcessedContent(preprocessMarkdown(markdownContent));
    }
  }, [markdownContent]);


  return (
  <div  className="intro-root">
    <PageSearch containerSelector=".intro-root" />
    <div>
      <Hero
        title={`${appName} Playbook`}
        subtitle={appSubtitle}
        imageSrc={brandImage}
        imageAlt={`${appName} brand illustration`}
      />

      <section className="intro-body">
        <h2 className="intro-heading">Best Practices</h2>
        <p className="intro-text">
          This playbook shares practical guidance for building and evaluating models, with attention to data diversity,
          generalization, and deployment considerations. Explore the chapters below or use the sidebar for section jumps.
        </p>
        <div className="intro-chapters">
          {overviewChapters.map(c => (
            <button
              key={c.to}
              className="chapter-btn"
              onClick={(e)=>{e.preventDefault(); navigate(c.to);}}
            >
              <span className="chapter-btn-text">
                <SidebarIcon name={c.icon} />
                {c.label}
              </span>
              <span className="chapter-arrow" aria-hidden>
                <ChevronRight24Regular />
              </span>
            </button>
          ))}
        </div>

        {/* Render landing page markdown content */}
        {processedContent && (
          <div className="markdown-body intro-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        )}
      </section>
    </div>
  </div>
  );
}
