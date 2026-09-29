import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/SiteHeader.css';
import { useTheme } from '../theme/ThemeContext.jsx';
import { useUI } from '../theme/UIContext.jsx';
import { Open24Regular, LineHorizontal324Filled, Dismiss24Filled } from '@fluentui/react-icons';

export default function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { brand, appName, appSubtitle, AppIcon } = useTheme();
  const { toggleSidebar, sidebarOpen } = useUI();
  const brandClass = brand ? ` site-header--brand-${brand}` : '';
  const isEvalsPage = /\/evals\/?$/.test(location.pathname);

  return (
    <header className={`app-header${brandClass}${isEvalsPage ? ' app-header--evals' : ''}`} role="banner">
      <button
        className="header-menu-btn"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <Dismiss24Filled /> : <LineHorizontal324Filled />}
      </button>
      {isEvalsPage ? (
        <>
          <div className="header-segment header-segment--left evals-header-brand" onClick={() => navigate('/playbook')}>
            <div className="segment-text">
              <div className="segment-title">{appName}</div>
              <span className="evals-header-divider" aria-hidden="true" />
              <div className="evals-header-context">Evaluation Survey</div>
            </div>
          </div>
          <button className="evals-header-back" onClick={() => navigate('/playbook')}>
            View playbook
          </button>
        </>
      ) : (
        <>
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
          {appName && appName.toLowerCase() === 'vibhasha' && (
            <div className="header-segment-right-group">
              <div
                className="header-segment header-segment--middle"
                onClick={() => navigate('/evals')}
                style={{ cursor: 'pointer' }}
              >
                <div className="segment-text">
                  <div className="link-subtitle">Evals Dashboard</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </header>
  );
}
