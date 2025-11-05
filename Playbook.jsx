import React from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import IntroDoc from './components/docs/01-intro'

export default function Playbook() {
  const navigate = useNavigate()

  // Helper: split text and wrap parenthetical groups in a span
  function formatBrackets(text) {
    if (!text) return null
    const parts = text.split(/(\([^)]*\))/g)
    return parts.map((part, i) => {
      if (/^\(.+\)$/.test(part)) {
        return <span key={i} className="bracketed">{part}</span>
      }
      return <React.Fragment key={i}>{part}</React.Fragment>
    })
  }

  const location = useLocation();
  const atOverview = location.pathname === '/playbook';

  return (
    <div className="playbook-page" style={{ display: 'flex', gap: '2rem' }}>
      <aside style={{ flex: '0 0 250px' }}>
        <Sidebar />
      </aside>
      <div style={{ marginTop: atOverview ? '2rem' : 0, flex: 1 }}>
        {atOverview ? <IntroDoc /> : <Outlet />}
      </div>
    </div>
  )
}