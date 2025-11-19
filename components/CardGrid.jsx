import React from 'react'
import './styles/MarkdownCard.css'
import { useNavigate } from 'react-router-dom'
import NotebookPng from '../assets/Paza-Illustration-Playbook.png'

const cards = [
  { id: 'playbook', title: 'Playbook', description: 'Operational playbooks, docs and runbooks.', icon: (
    <img src={NotebookPng} alt="Playbook" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
  ) }
]

export default function CardGrid(){
  const navigate = useNavigate()
  return (
    <div className="card-grid">
      {cards.map(c => (
        <div
          className={c.id === 'playbook' ? 'card card--large' : 'card'}
          key={c.id}
          tabIndex={0}
          aria-labelledby={`title-${c.id}`}
          style={c.id === 'playbook' ? { backgroundImage: `url(${NotebookPng})` } : undefined}
        >
          {c.id === 'playbook' ? (
            <div className="card-content">
              <h3 id={`title-${c.id}`}>{c.title}</h3>
              <p>{c.description}</p>
              <div className="card-actions">
                <button className="btn-primary" onClick={() => navigate('/playbook/01-intro')}>Explore playbook</button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      ))}
    </div>
  )
}
