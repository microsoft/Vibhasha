import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/PlaybookIntro.css';
import Hero from './Hero';
import PageSearch from './PageSearch';
import SidebarIcon from './SidebarIcon';
import { docEntries } from './docs/docIndex';

export default function PlaybookIntro(){
  const { appName, appSubtitle, colors, brandImage } = useTheme();
  const navigate = useNavigate();

  // Build overview from sidebar tabs
  const overviewChapters = useMemo(() => (
    docEntries.filter(e => !e.isSub).map(e => ({ label: e.label, to: e.path, icon: e.icon }))
  ), []);


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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <SidebarIcon name={c.icon} />
                {c.label}
              </span>
              <span className="chapter-arrow" aria-hidden>›</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  </div>
  );
}
