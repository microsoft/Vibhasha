import React from 'react'
import { Outlet } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import BaseFooter from './components/BaseFooter.jsx'
import { ThemeProvider } from './theme/ThemeContext.jsx'
import pkg from './package.json'

export default function App() {
  const appName = (pkg && pkg.name) ? pkg.name.toLowerCase() : 'paza'

  return (
    <ThemeProvider initialAppName={appName}>
      <div className="app-root">
        <SiteHeader />
        <main className="app-main">
          <Outlet />
        </main>
        <SiteFooter />
        <BaseFooter />
      </div>
    </ThemeProvider>
  )
}
