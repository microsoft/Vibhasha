import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext.jsx';
import './styles/PlaybookIntro.css';
import Hero from './Hero';
import PageSearch from './PageSearch';

export default function PlaybookIntro(){
  const { appName, appSubtitle, colors, brandImage } = useTheme();
  const navigate = useNavigate();

  const chapters = useMemo(() => ([
    { label: 'Evolution of ASR', to: '/playbook/02-evolution-of-asr' },
    { label: 'Dataset Creation', to: '/playbook/04-dataset-creation-guidelines' },
    { label: 'Model Finetuning', to: '/playbook/08-model-finetuning-intro' },
    { label: 'Inference', to: '/playbook/09-inference' },
    { label: 'Dataset Augmentation', to: '/playbook/10-data-augmentation' },
  ]), []);


  return (
    <div>
    <PageSearch containerSelector=".intro-root" />
    <div className="intro-root">
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
          {chapters.map(c => (
            <button
              key={c.to}
              className="chapter-btn"
              onClick={(e)=>{e.preventDefault(); navigate(c.to);}}
            >
              {c.label}
              <span className="chapter-arrow" aria-hidden>›</span>
            </button>
          ))}
        </div>
      </section>
    </div>
        </div>
  );
}
