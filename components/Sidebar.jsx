import React, { useEffect, useState } from 'react'
import './styles/Sidebar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { useUI } from '../theme/UIContext.jsx'
import SidebarIcon from './SidebarIcon'
import { docEntries } from './docs/docIndex'

export default function Sidebar(){
  const [visibleHeading, setVisibleHeading] = useState(null);
  const location = useLocation();
  const { closeSidebar } = useUI();

  useEffect(() => {
    const container = document.querySelector('.playbook-page');
    if (!container) return;
    const headings = container.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    if (!headings.length) return;
    const observer = new IntersectionObserver((entries) => {
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
    const normHead = visibleHeading.toLowerCase();
    const normLabel = item.label.toLowerCase();
    return normHead.includes(normLabel) && !location.pathname.endsWith('/playbook');
  }

  return (
    <nav className="sidebar" aria-label="Playbook navigation">
      <ul className="sidebar-list">
        <li className={'sidebar-item'}>
          <NavLink
            to="/playbook"
            end
            onClick={closeSidebar}
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

        {/* Root chapters within docIndex */}
        {docEntries.filter(e => !e.isSub).map(e => (
          <li key={e.path} className={'sidebar-item'}>
            <NavLink
              to={e.path}
              onClick={closeSidebar}
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
