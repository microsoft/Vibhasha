import React from 'react'
import './styles/Hero.css'
import { useTheme } from '../theme/ThemeContext.jsx'

/**
 * Hero component
 * Props:
 *  - title: string (required)
 *  - subtitle: string (optional)
 *  - imageSrc: string (optional image URL)
 *  - imageAlt: string (optional image alt text)
 *  - rightContent: ReactNode (optional custom media/content on right)
 */
export default function Hero({ title, subtitle, imageSrc, imageAlt = '', rightContent }){
  const { colors } = useTheme();
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          {title && <h1 className="hero-title">{title}</h1>}
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        </div>
        <div className="hero-media">
          {rightContent ? (
            rightContent
          ) : imageSrc ? (
            <img src={imageSrc} alt={imageAlt} />
          ) : null}
        </div>
      </div>
    </section>
  )
}
