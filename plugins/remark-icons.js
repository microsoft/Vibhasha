/**
 * Remark plugin to transform MkDocs Material icon syntax to HTML/SVG
 * 
 * Supports:
 * - :material-icon-name:{ .lg .middle } - Material Design Icons
 * - :octicons-icon-name-24: - GitHub Octicons
 * 
 * Transforms to inline SVG or Unicode fallback
 */

// Material Design Icons SVG paths (subset used in the docs)
const MATERIAL_ICONS = {
  'compare': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>',
    fallback: '⇄'
  },
  'trophy': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M18 2c-.9 0-2 1-2 2H8c0-1-1.1-2-2-2H2v9c0 1 1 2 2 2h2.2c.4 2 1.5 3.5 3.8 4.1V20H6v2h12v-2h-4v-2.9c2.3-.6 3.4-2.1 3.8-4.1H20c1 0 2-1 2-2V2h-4zM6 11H4V4h2v7zm14 0h-2V4h2v7z"/></svg>',
    fallback: '🏆'
  },
  'check-circle': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    fallback: '✓'
  },
  'chart-line': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>',
    fallback: '📈'
  },
  'chart-multiple': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3m-5 7a7 7 0 1 1-4-1.27V8.54a9 9 0 1 0 5.82 5.82h-2.19A7 7 0 0 1 17 12z"/></svg>',
    fallback: '📊'
  },
  'chart-bell-curve': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9.96 11.31C10.82 8.1 11.5 6 13 6c.79 0 1.37.42 2.09 1.34.24.3.5.66.77 1.06l.23.35a19.8 19.8 0 0 0 2.16 2.7c.64.64 1.34 1.18 2.15 1.55.33.15.68.26 1.06.34.56.11 1.07-.32 1.07-.89 0-.47-.35-.84-.81-.93-.32-.06-.63-.16-.93-.3-.63-.29-1.2-.72-1.75-1.27a18.05 18.05 0 0 1-2.54-3.27c-.77-1.18-1.38-2.04-2-2.58C13.8 3.41 12.87 3 12 3c-3 0-4.1 3.5-5.04 7.69-.94 4.19-1.88 8.31-4.96 8.31v3c5.38 0 6.74-5.49 7.96-10.69z"/></svg>',
    fallback: '📉'
  },
  'bug': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M14 12h-4v-2h4v2m0 4h-4v-2h4v2m6-6h-2.81a5.985 5.985 0 0 0-1.82-1.96L17 4.41 15.59 3l-2.17 2.17a6.002 6.002 0 0 0-2.83 0L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8z"/></svg>',
    fallback: '🐛'
  },
  'account-group': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9 3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3 3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3 3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.536 5.536 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13v-1.75M0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9-.59.68-.95 1.62-.95 2.65V20H0m24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65 2.56.34 4.45 1.51 4.45 2.9V20z"/></svg>',
    fallback: '👥'
  },
  'shield-check': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9m-6-8L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>',
    fallback: '🛡️'
  },
  'stethoscope': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 8c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V15a3 3 0 0 1-6 0v-1.17c2.84-.47 5-2.94 5-5.83V3h-2v5a4 4 0 0 1-8 0V3H5v5c0 2.89 2.16 5.36 5 5.83V15a5 5 0 0 0 10 0v-1.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>',
    fallback: '🩺'
  },
  'sync': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
    fallback: '🔄'
  },
  'text-box-check': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17 21L14.25 18l1.41-1.41L17 17.84l3.34-3.34 1.41 1.41L17 21M5 3c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H5V5h14v7.08c.71.1 1.38.35 2 .73V5c0-1.11-.89-2-2-2H5m2 4v2h10V7H7m0 4v2h10v-2H7m0 4v2h5.29c.34-.74.81-1.41 1.39-2H7z"/></svg>',
    fallback: '📄'
  },
  'scale-balance': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 3c-1.27 0-2.4.8-2.82 2H3v2h1.95L2 14c-.47 2 1 3 3.5 3s4.06-1 3.5-3L6.05 7h3.12c.33.85.98 1.5 1.83 1.83V20H7v2h10v-2h-4V8.82c.85-.32 1.5-.97 1.82-1.82h3.13L15 14c-.47 2 1 3 3.5 3s4.06-1 3.5-3l-2.95-7H21V5h-6.17C14.4 3.8 13.27 3 12 3z"/></svg>',
    fallback: '⚖️'
  },
  'refresh': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 0 0-8 8 8 8 0 0 0 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18a6 6 0 0 1-6-6 6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
    fallback: '🔄'
  },
  'quality-high': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M14.5 13.5h2v-3h-2m-5 3h2v-3h-2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8z"/></svg>',
    fallback: '🔊'
  },
  'format-list-bulleted': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7 5h14v2H7V5m0 8v-2h14v2H7M4 4.5A1.5 1.5 0 0 1 5.5 6 1.5 1.5 0 0 1 4 7.5 1.5 1.5 0 0 1 2.5 6 1.5 1.5 0 0 1 4 4.5m0 6A1.5 1.5 0 0 1 5.5 12 1.5 1.5 0 0 1 4 13.5 1.5 1.5 0 0 1 2.5 12 1.5 1.5 0 0 1 4 10.5M7 19v-2h14v2H7m-3-2.5A1.5 1.5 0 0 1 5.5 18 1.5 1.5 0 0 1 4 19.5 1.5 1.5 0 0 1 2.5 18 1.5 1.5 0 0 1 4 16.5z"/></svg>',
    fallback: '📋'
  },
  'file-sync': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 12v-2h-2v2h2m0 4v-2h-2v2h2m-3.5 4H5V4h9v4h4v3h2V7l-5-5H5c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h9.81c-.35-.61-.59-1.28-.72-2M19 16h2v3c0 1.11-.89 2-2 2h-3v-2h3v-3m-5 5v-2h-3v2h3m5-11V7h-4V4l5 5z"/></svg>',
    fallback: '📄'
  },
  'file-document-check': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M23.5 17l-5 5-3.5-3.5 1.5-1.5 2 2 3.5-3.5 1.5 1.5M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v4.08c.33-.05.67-.08 1-.08.34 0 .67.03 1 .08V8l-6-6H6m2 8v2h5v-2H8m0 4v2h3.08c.18-.72.47-1.39.85-2H8z"/></svg>',
    fallback: '📋'
  },
  'earth': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1a2 2 0 0 0 2 2v1.93M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/></svg>',
    fallback: '🌍'
  },
  'compass': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m.5-13H11v6l4.75 2.85.75-1.23-4-2.37V7z"/></svg>',
    fallback: '🧭'
  },
  'wrench': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>',
    fallback: '🔧'
  },
  'tune': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 17v2h6v-2H3M3 5v2h10V5H3m10 16v-2h8v-2h-8v-2h-2v6h2M7 9v2H3v2h4v2h2V9H7m14 4v-2H11v2h10m-6-4h2V7h4V5h-4V3h-2v6z"/></svg>',
    fallback: '🎛️'
  },
  'tune-vertical': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7 3v2H3v2h4v2h2V3H7m4 0v8h2V3h-2m6 0v4h-2v2h6V7h-4V3h-2M3 13v2h10v-2H3m10 0v8h2v-4h4v-2h-4v-2h-2M3 19v2h6v-2H3z"/></svg>',
    fallback: '🎚️'
  },
};

// Octicons (GitHub icons)
const OCTICONS = {
  'arrow-right-24': {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0z"/></svg>',
    fallback: '→'
  },
};

/**
 * Transform Material/Octicon syntax to HTML
 */
export function transformIcons(content) {
  // Match :material-icon-name:{ .lg .middle } or :material-icon-name:
  let result = content.replace(/:material-([a-z-]+):(?:\{[^}]*\})?/g, (match, iconName) => {
    const icon = MATERIAL_ICONS[iconName];
    if (icon) {
      return `<span class="md-icon md-icon-material">${icon.svg}</span>`;
    }
    // Fallback: return a placeholder with the icon name
    return `<span class="md-icon md-icon-material" title="${iconName}">📌</span>`;
  });

  // Match :octicons-icon-name-24: or similar
  result = result.replace(/:octicons-([a-z-]+-\d+):(?:\{[^}]*\})?/g, (match, iconName) => {
    const icon = OCTICONS[iconName];
    if (icon) {
      return `<span class="md-icon md-icon-octicon">${icon.svg}</span>`;
    }
    return `<span class="md-icon md-icon-octicon" title="${iconName}">→</span>`;
  });

  return result;
}

export default function remarkIcons() {
  return (tree, file) => {
    // Plugin hook - transformation happens in preprocessing
  };
}

export const preprocessIcons = transformIcons;
