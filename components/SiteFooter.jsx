import React from 'react';
import { useTheme, brandPalettes, iconByBrand } from '../theme/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Open24Regular } from '@fluentui/react-icons';
import './styles/SiteFooter.css';

export default function SiteFooter() {
  const { appName, setAppName, allApps } = useTheme();
  const navigate = useNavigate();

  const externalLinks = allApps.filter(a => a.title.toLowerCase() !== (appName || '').toLowerCase());

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
          {externalLinks.map(playbook => {
            const Icon = iconByBrand[playbook.brand] || iconByBrand.teal;
            const brandClass = playbook.brand ? `promo-cta promo-cta--${playbook.brand}` : 'promo-cta';
            return (
              <button
                key={playbook.key}
                className={brandClass}
                onClick={(e) => {
                  e.preventDefault();
                  if (playbook.externalUrl) {
                    window.open(playbook.externalUrl, '_blank', 'noopener,noreferrer');
                    return;
                  }
                  setAppName(playbook.key);
                  navigate('/playbook');
                }}
              >
                <span className="promo-icon"><Icon fontSize={24} /></span>
                {playbook.title} Playbook
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
