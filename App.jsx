import React from 'react'
import { Outlet } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import BaseFooter from './components/BaseFooter.jsx'
import { ThemeProvider } from './theme/ThemeContext.jsx'
import pkg from './package.json'

export default function App() {
  // Derive brand from the app name (package.json) instead of pageKey
  const appName = (pkg && pkg.name) ? pkg.name.toLowerCase() : 'paza'

  return (
    <ThemeProvider initialAppName={appName}>
      <div className="app-root">
        <SiteHeader />
        <main className="app-main" style={{ background: 'var(--color-page-bg)', color: 'var(--color-page-text)' }}>
          <Outlet />
        </main>
        <SiteFooter />
        <BaseFooter />
      </div>
    </ThemeProvider>
  )
}
