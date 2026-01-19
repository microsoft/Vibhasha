import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/SiteHeader.css';
import { useTheme } from '../theme/ThemeContext.jsx';
import { Open24Regular } from '@fluentui/react-icons';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { colors, brand, appName, appSubtitle, AppIcon } = useTheme();

  const go = (to) => (e) => {
    e.preventDefault();
    if (typeof to === 'string' && /^https?:\/\//.test(to)) {
      window.open(to, '_blank', 'noopener,noreferrer');
    } else {
      navigate(to);
    }
  };

  const brandClass = brand ? ` site-header--brand-${brand}` : '';

  return (
    <header className={`app-header${brandClass}`} role="banner" style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
      <div className="header-segment header-segment--left" onClick={go('/playbook')}> 
          <AppIcon fontSize={24} />
        <div className="segment-text">
          <div className="segment-title">{appName}</div>
          <div className="segment-subtitle">{appSubtitle}</div>
        </div>
      </div>
      {appName && appName.toLowerCase() === 'paza' && (
        <div className="header-segment-right-group">
          <div className="header-segment header-segment--middle" onClick={go('https://huggingface.co/collections/microsoft/paza')}>
            <div className="segment-text">
              <div className="segment-title">{appName} Models</div>
            </div>
            <Open24Regular />
          </div>
          <div className="header-segment header-segment--right" onClick={go('https://huggingface.co/spaces/microsoft/paza-bench')}>
            <div className="segment-text">
              <div className="segment-title">PazaBench</div>
            </div>
            <Open24Regular />
          </div>
        </div>
      )}
    </header>
  );
}
