import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import NotebookPng from '../assets/Paza-Illustration-Playbook.png';

export default function SiteHeader({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <header className={`home-header site-header${isHome ? '' : ' site-header--compact'}`} role="banner">
      <div className="home-header-left">
        <div className="paza-logo" aria-label="Paza"><span aria-hidden>💬</span> PAZA</div>
        <div className="home-tagline">
          <h1 className="home-title">Speech Models Playbook</h1>
          {isHome ? (
            <p className="home-subtitle">Practical guidance for dataset creation, finetuning & inference.</p>
          ) : (
            <p className="home-subtitle" style={{ opacity: .8 }}>Navigation · Theme · Explore</p>
          )}
          <nav className="header-nav" aria-label="Primary navigation" style={{ marginTop: 18 }}>
            <NavLink to="/playbook" className={({isActive}) => isActive ? 'nav-link active nav-playbook' : 'nav-link nav-playbook'}>Playbook</NavLink>
          </nav>
        </div>
      </div>
      <div className="home-header-right">
        <img
          src={NotebookPng}
          alt="Playbook notebook"
          width={isHome ? 180 : 120}
          height={isHome ? 180 : 120}
          style={{ borderRadius: isHome ? 24 : 16, transition: 'width 200ms,height 200ms' }}
        />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-primary home-cta"
            openNewTab={true}
            onClick={() => navigate('/playbook')}
            aria-label="Explore ASR Models"
            style={isHome ? undefined : { padding: '10px 16px', fontSize: '.85rem' }}
          >
            Explore Models ↗
          </button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
