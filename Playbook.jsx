import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import './components/styles/Playbook.css'
import { useUI } from './theme/UIContext.jsx'

export default function Playbook() {
  const { sidebarOpen, closeSidebar } = useUI();
  return (
    <div className="playbook-page">
      <aside className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </aside>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} />}
      <div className="playbook-content">
        <Outlet />
      </div>
    </div>
  )
}