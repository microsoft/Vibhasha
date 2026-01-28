import React from 'react';
import { useTheme, brandPalettes, iconByBrand } from '../theme/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Open24Regular } from '@fluentui/react-icons';
import './styles/SiteFooter.css';

export default function SiteFooter() {
  const { colors, theme, appName, setAppName } = useTheme();
  const navigate = useNavigate();

  const { allApps } = useTheme();

  const promos = allApps.filter(a => a.title.toLowerCase() !== (appName || '').toLowerCase());

  return (
    <div className="promo-footer" role="contentinfo">
      <div className="promo-bar">
        <div className="promo-left">
          <span className="promo-lead">Learn about the Microsoft Research work behind our playbooks</span>
          <a
            href="https://www.microsoft.com/en-us/research/project/project-gecko/"
            className="promo-link"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://www.microsoft.com/en-us/research/project/project-gecko/', '_blank');
            }}
          >
            <strong>Project Gecko</strong>
            <Open24Regular />
          </a>
        </div>
        <div className="promo-right">
          {promos.map(p => {
            const pal = brandPalettes[p.brand] || brandPalettes.teal;
            const c = pal[theme] || pal.light;
            const Icon = iconByBrand[p.brand] || iconByBrand.teal;
            const brandClass = p.brand ? `promo-cta promo-cta--${p.brand}` : 'promo-cta';
            return (
              <a
                key={p.key}
                className={brandClass}
                href={p.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!p.url) {
                    e.preventDefault();
                    setAppName(p.key);
                    navigate('/playbook');
                  }
                }}
              >
                <span className="promo-icon"><Icon fontSize={24} /></span>
                {p.title} Playbook
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
