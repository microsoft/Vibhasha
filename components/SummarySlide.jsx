import React from 'react'
import { useTheme } from '../theme/ThemeContext.jsx'
import './styles/SummarySlide.css'

export default function SummarySlide() {
  const { colors, brandImage } = useTheme()

  return (
    <div className="summary-slide" style={{ '--slide-accent': colors.headerBg }}>
      {/* ---- LEFT COLUMN ---- */}
      <div className="slide-left">
        <div className="slide-title-block">
          <h1 className="slide-title">Vibhasha</h1>
          <p className="slide-subtitle">
            A Comprehensive Guide for Building Language Model Applications in
            Multilingual &amp; Multicultural Settings
          </p>
        </div>
        <div className="slide-hero-image">
          {brandImage && (
            <img src={brandImage} alt="Vibhasha illustration" />
          )}
        </div>
      </div>

      {/* ---- RIGHT COLUMN — 2×2 grid ---- */}
      <div className="slide-right">
        {/* The Challenge */}
        <div className="slide-card">
          <div className="slide-card-header">
            <span className="slide-card-icon" aria-hidden="true">
              {/* target / challenge icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </span>
            <h2>The Challenge</h2>
          </div>
          <div className="slide-card-body">
            <p>
              <strong>7,000+</strong> languages exist worldwide, yet LLMs are{' '}
              <strong>~90 %+ English-trained</strong>. Non-English tasks suffer
              dramatically lower accuracy, cultural misalignment, and{' '}
              <strong>3× higher harmful-content rates</strong>. Without structured
              guidance, teams face wasted iterations, hidden costs, and safety
              gaps.
            </p>
          </div>
        </div>

        {/* The Solution */}
        <div className="slide-card">
          <div className="slide-card-header">
            <span className="slide-card-icon" aria-hidden="true">
              {/* lightbulb / solution icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>
            </span>
            <h2>The Solution</h2>
          </div>
          <div className="slide-card-body">
            <p>
              Vibhasha is a <strong>research-grounded decision framework</strong>{' '}
              by <strong>Microsoft Research India</strong>, offering three
              implementation strategies —{' '}
              <strong>Translation-Based, Prompt Engineering, and Fine-Tuning</strong>{' '}
              — with cross-cutting guidance on evaluation, safety, synthetic data,
              and cultural alignment for multilingual LLM applications.
            </p>
          </div>
        </div>

        {/* Key Outcomes & Impact */}
        <div className="slide-card">
          <div className="slide-card-header">
            <span className="slide-card-icon" aria-hidden="true">
              {/* bar-chart / impact icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>
            </span>
            <h2>Key Outcomes &amp; Impact</h2>
          </div>
          <div className="slide-card-body">
            <ul>
              <li>
                <strong>7 comprehensive chapters</strong> covering Evaluation,
                Translation, Fine-Tuning, Safety, Synthetic Data, Culture &amp;
                Strategic Decision-Making.
              </li>
              <li>
                <strong>3 clear implementation pathways</strong> with trade-off
                analysis for every resource level.
              </li>
              <li>
                Cross-cutting <strong>safety &amp; evaluation frameworks</strong>{' '}
                applicable to all strategies.
              </li>
              <li>
                Practical guidance for <strong>ML engineers, researchers &amp;
                product teams</strong> building global AI.
              </li>
            </ul>
          </div>
        </div>

        {/* Quote */}
        <div className="slide-card slide-card-quote">
          <div className="slide-card-header">
            <span className="slide-card-icon" aria-hidden="true">
              {/* quote / chat icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            <h2>Core Principle</h2>
          </div>
          <div className="slide-card-body">
            <blockquote>
              "The most impactful multilingual systems are not the ones that
              simply work across languages. They are the ones that feel{' '}
              <strong>native</strong>, <strong>reliable</strong>, and{' '}
              <strong>aligned</strong> with the people who use them."
            </blockquote>
            <p className="slide-quote-attr">— Vibhasha Playbook, Microsoft Research India</p>
          </div>
        </div>
      </div>
    </div>
  )
}
