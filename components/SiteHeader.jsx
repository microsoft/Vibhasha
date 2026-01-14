import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MicSparkle24Regular, Open24Regular } from '@fluentui/react-icons';
import './styles/SiteHeader.css';

export default function SiteHeader({ theme, toggleTheme, brand }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const go = (to) => (e) => {
    e.preventDefault();
    navigate(to);
  };

  const brandClass = brand ? ` site-header--brand-${brand}` : '';

  return (
    <header className={`app-header${brandClass}`} role="banner">
      <div className="header-segment header-segment--left" onClick={go('/')}> 
          <MicSparkle24Regular fontSize={40} />
        <div className="segment-text">
          <div className="segment-title">Paza</div>
          <div className="segment-subtitle">Speech Models Playbook</div>
        </div>
      </div>
      <div className="header-segment header-segment--middle" onClick={go('/playbook')}>
        <div className="segment-text center">
          <div className="segment-title">Paza Models</div>
        </div>
          <Open24Regular />
      </div>
      <div className="header-segment header-segment--right" onClick={go('/leaderboard')}>
        <div className="segment-text">
          <div className="segment-title">Leaderboard</div>
        </div>
          <Open24Regular />
      </div>
    </header>
  );
}
