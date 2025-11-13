import React from 'react';
import './styles/SiteFooter.css'

const footerGroups = [
  {
    heading: 'Explore',
    links: [
      { label: 'Blog', href: 'https://www.microsoft.com/en-us/research/blog' },
      { label: 'Publications', href: 'https://www.microsoft.com/en-us/research/publications' },
      { label: 'News & Awards', href: 'https://www.microsoft.com/en-us/research/news-and-awards' }
    ]
  },
  {
    heading: 'Products & Platforms',
    links: [
      { label: 'Microsoft Azure', href: 'https://azure.microsoft.com/en-us/' },
      { label: 'Power Platform', href: 'https://www.microsoft.com/en-us/power-platform' },
      { label: 'Visual Studio', href: 'https://visualstudio.microsoft.com/' },
      { label: 'Microsoft Learn', href: 'https://learn.microsoft.com/' }
    ]
  },
  {
    heading: 'For Developers',
    links: [
      { label: 'Microsoft Developer', href: 'https://developer.microsoft.com/en-us/' },
      { label: 'Tech Community', href: 'https://techcommunity.microsoft.com/' },
      { label: 'Marketplace', href: 'https://marketplace.microsoft.com/' },
      { label: 'ISV Success', href: 'https://www.microsoft.com/software-development-companies/offers-benefits/isv-success' }
    ]
  },
  {
    heading: 'Company',
    links: [
      { label: 'Careers', href: 'https://careers.microsoft.com/' },
      { label: 'About Microsoft', href: 'https://www.microsoft.com/about' },
      { label: 'Diversity & Inclusion', href: 'https://www.microsoft.com/en-us/diversity/default' },
      { label: 'Accessibility', href: 'https://www.microsoft.com/en-us/accessibility' }
    ]
  },
  {
    heading: 'Legal & Privacy',
    links: [
      { label: 'Privacy', href: 'https://go.microsoft.com/fwlink/?LinkId=521839' },
      { label: 'Terms of Use', href: 'https://go.microsoft.com/fwlink/?LinkID=206977' },
      { label: 'Trademarks', href: 'https://go.microsoft.com/fwlink/?linkid=2196228' },
      { label: 'About Our Ads', href: 'https://choice.microsoft.com/' }
    ]
  }
];

const socialLinks = [
  { label: 'X', href: 'https://x.com/MSFTResearch' },
  { label: 'Facebook', href: 'https://www.facebook.com/microsoftresearch/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/showcase/microsoftresearch/' },
  { label: 'YouTube', href: 'https://www.youtube.com/user/MicrosoftResearch' },
  { label: 'Instagram', href: 'https://www.instagram.com/msft_research/' }
];

export default function SiteFooter(){
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        <div className="site-footer-grid" aria-label="Footer navigation">
          {footerGroups.map(group => (
            <nav key={group.heading} className="site-footer-group" aria-label={group.heading}>
              <h3 className="site-footer-heading">{group.heading}</h3>
              <ul className="site-footer-links">
                {group.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <nav className="site-footer-legal" aria-label="Legal and privacy">
          <a href="https://www.microsoft.com/en-us/privacy/your-privacy-choices" target="_blank" rel="noopener noreferrer">Your Privacy Choices</a>
          <a href="https://www.microsoft.com/en-us/privacy/consumer-health-data-privacy" target="_blank" rel="noopener noreferrer">Consumer Health Privacy</a>
          <a href="https://www.microsoft.com/en-us/sitemap.aspx" target="_blank" rel="noopener noreferrer">Sitemap</a>
          <a href="https://support.microsoft.com/contactus" target="_blank" rel="noopener noreferrer">Contact Microsoft</a>
          <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noopener noreferrer">Privacy</a>
          <a href="https://privacy.microsoft.com/en-us/privacystatement#maincookiessimilartechnologies-module" target="_blank" rel="noopener noreferrer">Manage cookies</a>
          <a href="https://go.microsoft.com/fwlink/?LinkID=206977" target="_blank" rel="noopener noreferrer">Terms of use</a>
          <a href="https://go.microsoft.com/fwlink/?linkid=2196228" target="_blank" rel="noopener noreferrer">Trademarks</a>
          <a href="https://www.microsoft.com/en-us/legal/compliance" target="_blank" rel="noopener noreferrer">Safety &amp; eco</a>
          <a href="https://www.microsoft.com/en-us/legal/compliance/recycling" target="_blank" rel="noopener noreferrer">Recycling</a>
          <a href="https://choice.microsoft.com/" target="_blank" rel="noopener noreferrer">About our ads</a>
          <a href='https://www.microsoft.com/en-us/research/lab/microsoft-research-lab-africa-nairobi/'> © {new Date().getFullYear()} Paza • Microsoft Research Africa</a>
          <span className="legal-copyright">© Microsoft {new Date().getFullYear()}</span>
        </nav>
        <div className="site-footer-bottom">
          <div className="site-footer-social" aria-label="Social links">
            <span className="site-footer-social-label">Follow Microsoft:</span>
            {socialLinks.map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="site-footer-social-link">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
