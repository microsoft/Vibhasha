import React, { useEffect, useState } from 'react'
import './styles/Sidebar.css'
import { NavLink, useLocation } from 'react-router-dom'
import SidebarIcon from './SidebarIcon'
import { docEntries } from './docs/docIndex'

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
      <ul className="sidebar-list">
        {/* Overview */}
        <li className={'sidebar-item'}>
          <NavLink
            to="/playbook"
            end
            className={({isActive}) => {
              let cls = 'sidebar-link';
              if (isActive) cls += ' active';
              if (!isActive && isScrollActive({ label: 'Overview' })) cls += ' scroll-active';
              return cls;
            }}
          >
            <SidebarIcon name="Home24" active={location.pathname === '/playbook'} />
            <span>Overview</span>
          </NavLink>
        </li>

        {/* Auto-generated root chapters within docIndex */}
        {docEntries.filter(e => !e.isSub).map(e => (
          <li key={e.path} className={'sidebar-item'}>
            <NavLink
              to={e.path}
              className={({isActive}) => {
                let cls = 'sidebar-link';
                if (isActive) cls += ' active';
                if (!isActive && isScrollActive({ label: e.label })) cls += ' scroll-active';
                return cls;
              }}
            >
              <SidebarIcon name={e.icon} active={location.pathname === e.path} />
              <span>{e.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
