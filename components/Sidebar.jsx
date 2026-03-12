import React, { useEffect, useState, useMemo } from 'react'
import './styles/Sidebar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../theme/UIContext.jsx'
import SidebarIcon from './SidebarIcon'
import { docEntries } from './docs/docIndex'

export default function Sidebar() {
  const [visibleHeading, setVisibleHeading] = useState(null);
  const location = useLocation();
  const { closeSidebar } = useUI();
  const navigate = useNavigate();
  const groups = useMemo(() => {
    const roots = docEntries.filter(e => !e.isSub);
    return roots.map(r => ({
      ...r,
      children: docEntries.filter(c => c.isSub && c.prefix === r.prefix)
    }));
  }, []);

  const [openGroups, setOpenGroups] = useState(() => {
    const map = {};
    groups.forEach(g => {
      map[g.prefix] = location.pathname.startsWith(g.path) || g.children.some(c => location.pathname === c.path);
    });
    return map;
  });

  useEffect(() => {
    const container = document.querySelector('.playbook-page');
    if (!container) return;
    const headings = container.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    if (!headings.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) {
        const text = visible.target.textContent.trim();
        setVisibleHeading(text);
      }
    }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0.1, 0.25, 0.5] });
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [location.pathname]);

  function isScrollActive(item) {
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
            className={({ isActive }) => {
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

        {groups.map(g => {
          const groupActive = location.pathname === g.path || g.children.some(c => location.pathname === c.path || location.pathname.startsWith(c.path));
          const groupScrollActive = !groupActive && isScrollActive({ label: g.label });
          return (
            <React.Fragment key={g.path}>
            {g.path === '/playbook/100-attribution' && (
              <li className={'sidebar-item'}>
                <NavLink
                  to="/playbook/flowchart"
                  onClick={closeSidebar}
                  className={({ isActive }) => {
                    let cls = 'sidebar-link';
                    if (isActive) cls += ' active';
                    return cls;
                  }}
                >
                  <SidebarIcon name="Branch24" active={location.pathname === '/playbook/flowchart'} />
                  <span>Interactive Flowchart</span>
                </NavLink>
              </li>
            )}
            <li className={'sidebar-item'}>
              {g.children && g.children.length > 0 ? (
                <>
                  <button
                    className={`sidebar-link group-toggle ${openGroups[g.prefix] ? 'open' : ''} ${groupActive ? 'active' : ''} ${groupScrollActive ? 'scroll-active' : ''}`}
                    onClick={() => {
                      setOpenGroups(prev => ({ ...prev, [g.prefix]: !prev[g.prefix] }));
                      navigate(g.path);
                    }}
                    aria-expanded={!!openGroups[g.prefix]}
                  >
                    <SidebarIcon name={g.icon} active={groupActive} />
                    <span className="group-label">{g.label}</span>
                    <span className={`group-caret ${openGroups[g.prefix] ? 'open' : ''}`} aria-hidden>▾</span>
                  </button>

                  <ul className={`sidebar-sublist ${openGroups[g.prefix] ? 'open' : ''}`}>
                    {g.children.map(c => (
                      <li key={c.path} className="sidebar-subitem">
                        <NavLink
                          to={c.path}
                          onClick={closeSidebar}
                          className={({ isActive }) => {
                            let cls = 'sidebar-sublink';
                            if (isActive) cls += ' active';
                            if (!isActive && isScrollActive({ label: c.label })) cls += ' scroll-active';
                            return cls;
                          }}
                        >
                          <span className="sublink-label">{c.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink
                  to={g.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => {
                    let cls = 'sidebar-link';
                    if (isActive) cls += ' active';
                    if (!isActive && isScrollActive({ label: g.label })) cls += ' scroll-active';
                    return cls;
                  }}
                >
                  <SidebarIcon name={g.icon} active={location.pathname === g.path} />
                  <span>{g.label}</span>
                </NavLink>
              )}
            </li>
            </React.Fragment>
          )
        })}
      </ul>
    </nav>
  )
}
