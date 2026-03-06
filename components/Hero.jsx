import React from 'react'
import './styles/Hero.css'

export default function Hero({ title, subtitle, isOverview = false }) {

  return (
    <section className={isOverview ? 'overview-hero' : 'hero'}>
      <div className="hero-text">
        {title && <h1 className="hero-title">{title}</h1>}
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        <div className="hero-meta">
          <p className="hero-created">
            <a
              href="https://www.microsoft.com/en-us/research/project/project-gecko/"
              className="promo-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Created by Microsoft Research
            </a>
          </p>
          {!isOverview && (
            <p className="hero-created">
              Updated 5 days ago
            </p>
          )}

        </div>
      </div>
    </section>
  )
}
