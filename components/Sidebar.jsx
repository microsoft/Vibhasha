import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const sections = [
  {
    heading: null,
    items: [
      // { to: '/playbook', label: 'Playbook Overview', end: true },
      { to: '/playbook/01-intro', label: 'Playbook Intro' },
      { to: '/playbook/02-evolution-of-asr', label: 'Evolution of ASR' },
      { to: '/playbook/03-background-of-asr', label: 'Background of ASR' }
    ]
  },
  {
    heading: 'Dataset Creation',
    items: [
      { to: '/playbook/04-dataset-creation-guidelines', label: 'Guidelines' },
      { to: '/playbook/04-i-metadata', label: 'Metadata', sub: true },
      { to: '/playbook/04-ii-curation-for-diverty', label: 'Curation for Diversity', sub: true },
      { to: '/playbook/04-iii-generalization-vs-domain', label: 'Generalization vs Domain', sub: true },
      { to: '/playbook/04-iv-quality-control', label: 'Quality Control', sub: true }
    ]
  },
  {
    heading: null,
    items: [
      { to: '/playbook/05-data-formats-structures', label: 'Data Formats & Structures' },
      { to: '/playbook/06-data-preprocessing', label: 'Data Preprocessing' },
      { to: '/playbook/07-data-compression', label: 'Data Compression' }
    ]
  },
  {
    heading: 'Model Finetuning',
    items: [
      { to: '/playbook/08-model-finetuning-intro', label: 'Finetuning Intro' },
      { to: '/playbook/08-i-model-selection', label: 'Model Selection' },
      { to: '/playbook/08-ii-full-finetuning', label: 'Full Finetuning' },
      { to: '/playbook/08-iii-peft', label: 'PEFT' },
      { to: '/playbook/08-iv-decision-matrix', label: 'Decision Matrix' }
    ]
  },
  {
    heading: null,
    items: [
      { to: '/playbook/09-inference', label: 'Inference', end: true },
      { to: '/playbook/10-data-augmentation', label: 'Data Augmentation' },
      { to: '/playbook/11-common-finetuning-challenges', label: 'Common Finetuning Challenges' },
      { to: '/playbook/12-conclusion', label: 'Conclusion' },
      { to: '/playbook/13-coming-soon', label: 'Coming Soon' }
    ]
  }
];

export default function Sidebar(){
  const [visibleHeading, setVisibleHeading] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Scroll spy only on playbook doc pages
    const container = document.querySelector('.playbook-page');
    if (!container) return;
    const headings = container.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    if (!headings.length) return;
    const observer = new IntersectionObserver((entries) => {
      // Find first fully / mostly visible heading
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) {
        const text = visible.target.textContent.trim();
        setVisibleHeading(text);
      }
    }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0.1, 0.25, 0.5] });
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [location.pathname]);

  function isScrollActive(item){
    if (!visibleHeading) return false;
    // Simple match: heading text contains item label words (case-insensitive)
    const normHead = visibleHeading.toLowerCase();
    const normLabel = item.label.toLowerCase();
    return normHead.includes(normLabel) && !location.pathname.endsWith('/playbook');
  }

  return (
    <nav className="sidebar" aria-label="Playbook navigation">
      <ul className="sidebar-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sections.map((section, si) => (
          <React.Fragment key={si}>
            {section.heading && (
              <li className="sidebar-section-heading" style={{ marginTop: '1.25rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', opacity: .7 }}>
                {section.heading}
              </li>
            )}
            {section.items.map(item => (
              <li key={item.to} className={item.sub ? 'sidebar-sub-item' : 'sidebar-item'} style={{ margin: 0 }}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({isActive}) => {
                    let cls = 'sidebar-link';
                    if (isActive) cls += ' active';
                    if (item.sub) cls += ' sidebar-link--sub';
                    if (!isActive && isScrollActive(item)) cls += ' scroll-active';
                    return cls;
                  }}
                  style={{ display: 'block', padding: '.45rem .6rem', borderRadius: 4, position: 'relative' }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}
