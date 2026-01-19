import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import './components/styles/Playbook.css'

export default function Playbook() {
  return (
    <div className="playbook-page">
      <aside>
        <Sidebar />
      </aside>
      <div className="playbook-content">
        <Outlet />
      </div>
    </div>
  )
}