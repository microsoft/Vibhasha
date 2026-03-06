import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SiteHeader.css';
import { useTheme } from '../theme/ThemeContext.jsx';
import { useUI } from '../theme/UIContext.jsx';
import { Open24Regular, LineHorizontal324Filled, Dismiss24Filled } from '@fluentui/react-icons';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { colors, brand, appName, appSubtitle, AppIcon } = useTheme();
  const { toggleSidebar, sidebarOpen } = useUI();
  const brandClass = brand ? ` site-header--brand-${brand}` : '';

  return (
    <header className={`app-header${brandClass}`} role="banner">
      <button
        className="header-menu-btn"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <Dismiss24Filled /> : <LineHorizontal324Filled />}
      </button>
      <div className="header-segment header-segment--left" onClick={() => navigate('/playbook')}> 
          <AppIcon fontSize={24} />
        <div className="segment-text">
          <div className="segment-title">{appName}</div>
          <div className="segment-subtitle">{appSubtitle}</div>
        </div>
      </div>
      {appName && appName.toLowerCase() === 'paza' && (
        <div className="header-segment-right-group">
          <a
            className="header-segment header-segment--middle"
            href="https://huggingface.co/collections/microsoft/paza"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="segment-text">
              <div className="link-subtitle">{appName} Models</div>
            </div>
            <Open24Regular />
          </a>
          <a
            className="header-segment header-segment--right"
            href="https://huggingface.co/spaces/microsoft/paza-bench"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="segment-text">
              <div className="link-subtitle">PazaBench</div>
            </div>
            <Open24Regular />
          </a>
        </div>
      )}
    </header>
  );
}
