import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import pkg from './package.json'

export default function App() {
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

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  // Determine current page for dynamic logo colors
  const location = useLocation();

  // Derive brand from the app name (package.json) instead of pageKey
  const appName = (pkg && pkg.name) ? pkg.name.toLowerCase() : 'playbook-template'
  const appBrandMap = {
    "playbook-template": 'teal',
    vibhasha: 'pink',
    paza: 'teal',
    atlas: 'indigo',
  }
  // find matching key in appName (allows names like "playbook-template")
  const brandKey = Object.keys(appBrandMap).find(k => appName.includes(k))
  const brand = appBrandMap[brandKey] || 'teal'

  return (
    <div className="app-root">
      <SiteHeader theme={theme} toggleTheme={toggleTheme} brand={brand} />
      <main className="app-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
