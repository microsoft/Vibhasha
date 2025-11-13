import React from 'react'
import './styles/MarkdownCard.css'
import { useNavigate } from 'react-router-dom'

const cards = [
  { id: 'playbook', title: 'Playbook', description: 'Operational playbooks, docs and runbooks.', icon: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h9a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6V3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
  ) }
]

export default function CardGrid(){
  const navigate = useNavigate()
  return (
    <div className="card-grid">
      {cards.map(c => (
        <div className="card" key={c.id} tabIndex={0} aria-labelledby={`title-${c.id}`}>
          <div className="card-icon">{c.icon}</div>
          <h3 id={`title-${c.id}`}>{c.title}</h3>
          <p>{c.description}</p>
          <div className="card-actions">
            {c.id === 'asr' ? (
              <button className="btn-primary" onClick={() => navigate('/sr')}>Open</button>
            ) : (
              <button className="btn-primary" disabled>Open</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
