import React from 'react';
import './styles/BaseFooter.css'
import msLogo from '../assets/ms-logo.svg'

export default function BaseFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-right">
        <img src={msLogo} alt="Microsoft logo" className="ms-logo" /> <p>Microsoft</p>
      </div>
        <div className="site-footer-legal" aria-label="Legal and privacy">
          <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener noreferrer">Privacy & Cookies</a>
          <a href="https://go.microsoft.com/fwlink/?linkid=2259814" target="_blank" rel="noopener noreferrer">Consumer Health Privacy</a>
          <a href="https://support.microsoft.com/contactus" target="_blank" rel="noopener noreferrer">Contact Microsoft</a>
          <a href="https://go.microsoft.com/fwlink/?linkid=2196228" target="_blank" rel="noopener noreferrer">Trademarks</a>
          <a href="https://go.microsoft.com/fwlink/?LinkID=206977" target="_blank" rel="noopener noreferrer">Terms of Use</a>
          <a href='https://www.microsoft.com/en-us/research/'> © {new Date().getFullYear()} Microsoft Research</a>
        </div>
    </footer>
  );
}
