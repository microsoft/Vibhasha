import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

export default function App(){
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('paza_theme') || 'light'
    } catch (e) {
      return 'light'
    }
  })

  useEffect(() => {
    const body = document.body
    if (theme === 'dark') body.classList.add('dark')
    else body.classList.remove('dark')
    try { localStorage.setItem('paza_theme', theme) } catch (e) {}
  }, [theme])

  function toggleTheme(){
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  // Determine current page for dynamic logo colors
  const location = useLocation();
  const pageKey = (location.pathname.split('/')[1] || 'home').toLowerCase();
  const logoColors = {
    home: ['#7c3aed', '#06b6d4'],
    sr: ['#F8A277', '#F59B6C'],
    tts: ['#BEBBFF', '#8E8AFF'],
    bench: ['#B2E5FF', '#92D7FC'],
    playbook: ['#99F2B3', '#78EB97']
  };
  const [c1, c2] = logoColors[pageKey] || logoColors.home;
  const logoStyle = { '--logo-bg': `linear-gradient(135deg, ${c1}, ${c2})` };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-left">
          <div className="logo bubble-logo" style={logoStyle} aria-label="Paza chat logo">
            <span aria-hidden>💬</span>
          </div>
          <div className="title">
            <h1>Paza Speech Playbook</h1>
            <p className="subtitle">Guides, best practices and playbooks for training end to end Automatic Speech Recognition(ASR) models</p>
          </div>
        </div>

        <nav className="header-nav">
          <NavLink to="/playbook" className={({isActive}) => isActive ? 'nav-link active nav-playbook' : 'nav-link nav-playbook'}>Speech Playbook</NavLink>

          <div className="header-controls">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? (
                <svg className="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg className="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <small>© Paza</small>
      </footer>
    </div>
  )
}
