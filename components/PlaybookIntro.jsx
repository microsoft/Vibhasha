import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/PlaybookIntro.css';
import './styles/MarkdownPage.css';
import './styles/MkDocsMaterial.css';
import Hero from './Hero';
import {
  ArrowUpRight24Regular,
  ChevronRight24Regular,
  Target24Regular,
  TaskListSquareLtr24Regular,
  TranslateAuto24Regular,
  Options24Regular,
  Shield24Regular,
  SquareHintSparkles24Regular,
  Diversity24Regular,
  TargetSparkle24Regular,
  BookmarkAdd24Regular,
} from '@fluentui/react-icons';
import SidebarIcon from './SidebarIcon';
import { docEntries } from './docs/docIndex';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { preprocessAdmonitions } from '../plugins/remark-admonitions.js';
import { preprocessIcons } from '../plugins/remark-icons.js';
import { preprocessAttrList } from '../plugins/remark-attr-list.js';
import { preprocessContentTabs } from '../plugins/remark-content-tabs.js';

// Preload landing page markdown
const mdModules = import.meta.glob('/public/chapters/landing/landingpage.md', { as: 'raw' });

function preprocessMarkdown(rawContent) {
  let content = rawContent;
  content = preprocessContentTabs(content);
  content = preprocessAdmonitions(content);
  content = preprocessIcons(content);
  content = preprocessAttrList(content);
  return content;
}

export default function PlaybookIntro(){
  const { appName, appSubtitle, brandImage } = useTheme();
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
      const loader = mdModules['/public/chapters/landing/landingpage.md'];
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
        const res = await fetch('/chapters/landing/landingpage.md');
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


  return (
  <div  className="intro-root">
      <div>
      <Hero
        title={`${appName} Playbook`}
        subtitle={appSubtitle}
        isOverview={true}
      />

      <section className="intro-body">
        {/* Render landing page markdown - split at markers */}
        {processedContent && (() => {
          const MARKERS = ['<!-- PATH_CARDS -->', '<!-- CHAPTER_CARDS -->'];
          // Split content by all markers, keeping track of which marker was found
          const segments = [];
          let remaining = processedContent;
          while (remaining) {
            let earliest = -1;
            let earliestMarker = null;
            for (const m of MARKERS) {
              const idx = remaining.indexOf(m);
              if (idx !== -1 && (earliest === -1 || idx < earliest)) {
                earliest = idx;
                earliestMarker = m;
              }
            }
            if (earliest === -1) {
              segments.push({ type: 'md', content: remaining });
              break;
            }
            if (earliest > 0) {
              segments.push({ type: 'md', content: remaining.slice(0, earliest) });
            }
            segments.push({ type: earliestMarker });
            remaining = remaining.slice(earliest + earliestMarker.length);
          }

          const chapterCards = [
            { label: 'Getting Started', icon: <Target24Regular />, path: '/playbook/00-introduction' },
            { label: 'Evaluation', icon: <TaskListSquareLtr24Regular />, path: '/playbook/01-evaluation' },
            { label: 'Translation', icon: <TranslateAuto24Regular />, path: '/playbook/02-translation' },
            { label: 'Fine-tuning', icon: <Options24Regular />, path: '/playbook/04-fine-tuning' },
            { label: 'Safety', icon: <Shield24Regular />, path: '/playbook/05-safety' },
            { label: 'Synthetic Data', icon: <SquareHintSparkles24Regular />, path: '/playbook/06-synthetic-data' },
            { label: 'Culture', icon: <Diversity24Regular />, path: '/playbook/07-culture' },
            { label: 'Moving Forward', icon: <TargetSparkle24Regular />, path: '/playbook/99-conclusion' },
            { label: 'Attribution', icon: <BookmarkAdd24Regular />, path: '/playbook/100-attribution' },
          ];

          return (
            <>
              {segments.map((seg, i) => {
                if (seg.type === 'md') {
                  return (
                    <div key={i} className="markdown-body intro-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {seg.content}
                      </ReactMarkdown>
                    </div>
                  );
                }
                if (seg.type === '<!-- PATH_CARDS -->') {
                  return (
              <div key={i} className="path-cards">
          <button
            className="path-card path-card--translation"
            onClick={() => navigate('/playbook/02-translation')}
          >
            <div className="path-card__content">
              <span className="path-card__question">Short on time?</span>
              <span className="path-card__desc">Try the translation approach for quick results with mainstream languages</span>
            </div>
            <div className="path-card__footer">
              <span className="path-card__label">Translation & Off-the-shelf LLM Path</span>
              <span className="path-card__arrow">
                <ArrowUpRight24Regular />
              </span>
            </div>
          </button>

          <button
            className="path-card path-card--finetuning"
            onClick={() => navigate('/playbook/04-fine-tuning')}
          >
            <div className="path-card__content">
              <span className="path-card__question">Keen to have high accuracy?</span>
              <span className="path-card__desc">Use fine-tuning, ideal for languages and domains with minimal data</span>
            </div>
            <div className="path-card__footer">
              <span className="path-card__label">Fine-Tuning Path</span>
              <span className="path-card__arrow">
                <ArrowUpRight24Regular />
              </span>
            </div>
          </button>

          <button
            className="path-card path-card--buildyourpath"
            onClick={() => navigate('/playbook/flowchart')}
          >
            <div className="path-card__content">
              <span className="path-card__question">Want to weigh your options?</span>
              <span className="path-card__desc">Explore our interactive chart to find the right path for your product</span>
            </div>
            <div className="path-card__footer">
              <span className="path-card__label">Build Your Path</span>
              <span className="path-card__arrow">
                <ArrowUpRight24Regular />
              </span>
            </div>
          </button>
        </div>
                  );
                }
                if (seg.type === '<!-- CHAPTER_CARDS -->') {
                  return (
                    <div key={i} className="chapter-cards-section">
                      <h2 className="chapter-cards-heading">Explore Our Chapters</h2>
                      <div className="chapter-cards">
                      {chapterCards.map((ch) => (
                        <button
                          key={ch.path}
                          className="chapter-card"
                          onClick={() => navigate(ch.path)}
                        >
                          <div className="chapter-card__header">
                            <span className="chapter-card__icon">{ch.icon}</span>
                            <span className="chapter-card__label">{ch.label}</span>
                          </div>
                          <div className="chapter-card__go">
                            <ChevronRight24Regular />
                          </div>
                        </button>
                      ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </>
          );
        })()}
      </section>
    </div>
  </div>
  );
}
