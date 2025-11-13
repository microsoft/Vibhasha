import React from 'react';
import './styles/MarkdownCard.css';

/**
 * MarkdownCard
 * Props:
 *  - title: string (card heading)
 *  - excerpt: string (short preview text)
 *  - href: optional link or hash target
 *  - onClick: optional handler (receives event)
 *  - expanded: boolean (show children content)
 *  - children: optional detailed markdown rendering when expanded
 */
export default function MarkdownCard({ title, excerpt, href, onClick, expanded = false, children }) {
  return (
    <div className={`md-card${expanded ? ' expanded' : ''}`}>      
      <div className="md-card-header">
        {href ? (
          <a
            href={href}
            className="md-card-title"
            onClick={e => {
              if (onClick) {
                e.preventDefault();
                onClick(e);
              }
            }}
          >
            {title}
          </a>
        ) : (
          <div className="md-card-title">{title}</div>
        )}
      </div>
      {excerpt && <p className="md-card-excerpt">{excerpt}</p>}
      {expanded && (
        <div className="md-card-body">{children}</div>
      )}
      <div className="md-card-footer">
        <button
          className="md-card-toggle"
          onClick={e => {
            if (onClick) {
              e.preventDefault();
              onClick(e);
            }
          }}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
    </div>
  );
}
