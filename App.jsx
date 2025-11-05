import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'

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
      <SiteHeader theme={theme} toggleTheme={toggleTheme} />
      <main className="app-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
