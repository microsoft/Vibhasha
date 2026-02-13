import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/PlaybookIntro.css';
import Hero from './Hero';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import SidebarIcon from './SidebarIcon';
import { docEntries } from './docs/docIndex';

export default function PlaybookIntro(){
  const { appName, appSubtitle, brandImage } = useTheme();
  const navigate = useNavigate();

  // Build overview from sidebar tabs
  const overviewChapters = useMemo(() => (
    docEntries.filter(e => !e.isSub).map(e => ({ label: e.label, to: e.path, icon: e.icon }))
  ), []);


  return (
  <div  className="intro-root">
      <div>
      <Hero
        title={`${appName} Playbook`}
        subtitle={appSubtitle}
        isOverview={true}
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
      </section>
    </div>
  </div>
  );
}
