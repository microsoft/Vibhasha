/**
 * Remark plugin to transform MkDocs Material admonition syntax to HTML
 * 
 * Supports:
 * - !!! type "title" - Standard admonitions
 * - ??? type "title" - Collapsible (closed by default)
 * - ???+ type "title" - Collapsible (open by default)
 * 
 * Types: note, info, tip, success, warning, danger, failure, important, quote, example, question, abstract
 */

// Regex to match admonition start: !!! type "optional title" or ??? type "optional title" or ???+ type "optional title"
const ADMONITION_START = /^(!{3}|\?{3}\+?)\s+(\w+)(?:\s+"([^"]*)")?$/;

/**
 * Get the default title for an admonition type
 */
function getDefaultTitle(type) {
  const titles = {
    note: 'Note',
    info: 'Info',
    tip: 'Tip',
    success: 'Success',
    warning: 'Warning',
    danger: 'Danger',
    failure: 'Failure',
    important: 'Important',
    quote: 'Quote',
    example: 'Example',
    question: 'Question',
    abstract: 'Abstract',
    bug: 'Bug',
  };
  return titles[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Get the icon for an admonition type
 */
function getAdmonitionIcon(type) {
  const icons = {
    note: '📝',
    info: 'ℹ️',
    tip: '💡',
    success: '✅',
    warning: '⚠️',
    danger: '🔴',
    failure: '❌',
    important: '❗',
    quote: '💬',
    example: '📋',
    question: '❓',
    abstract: '📄',
    bug: '🐛',
  };
  return icons[type.toLowerCase()] || '📌';
}

/**
 * Transform admonition blocks in markdown content
 */
export function transformAdmonitions(content) {
  // Normalize line endings to LF (fixes Windows CRLF issues)
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedContent.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(ADMONITION_START);

    if (match) {
      const [, syntax, type, customTitle] = match;
      const isCollapsible = syntax.startsWith('???');
      const isOpenByDefault = syntax === '???+';
      const title = customTitle || getDefaultTitle(type);
      const icon = getAdmonitionIcon(type);
      const typeLower = type.toLowerCase();

      // Collect indented content (4 spaces or 1 tab)
      const contentLines = [];
      i++;
      while (i < lines.length) {
        const contentLine = lines[i];
        // Check if line is indented (part of admonition) or empty
        if (contentLine.match(/^(    |\t)/) || contentLine.trim() === '') {
          // Remove the 4-space or tab indent
          contentLines.push(contentLine.replace(/^(    |\t)/, ''));
          i++;
        } else {
          // Non-indented, non-empty line - end of admonition
          break;
        }
      }

      // Trim trailing empty lines from content
      while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === '') {
        contentLines.pop();
      }

      const innerContent = contentLines.join('\n');

      // Generate HTML
      if (isCollapsible) {
        const openAttr = isOpenByDefault ? ' open' : '';
        result.push(`<details class="admonition admonition-${typeLower}"${openAttr}>`);
        result.push(`<summary class="admonition-title"><span class="admonition-icon">${icon}</span>${title}</summary>`);
        result.push(`<div class="admonition-content">`);
        result.push('');
        result.push(innerContent);
        result.push('');
        result.push(`</div>`);
        result.push(`</details>`);
      } else {
        result.push(`<div class="admonition admonition-${typeLower}">`);
        result.push(`<p class="admonition-title"><span class="admonition-icon">${icon}</span>${title}</p>`);
        result.push(`<div class="admonition-content">`);
        result.push('');
        result.push(innerContent);
        result.push('');
        result.push(`</div>`);
        result.push(`</div>`);
      }
      result.push('');
    } else {
      result.push(line);
      i++;
    }
  }

  return result.join('\n');
}

/**
 * Remark plugin that transforms MkDocs admonition syntax
 * This is a "pre-processing" plugin that operates on the raw markdown string
 */
export default function remarkAdmonitions() {
  return (tree, file) => {
    // This plugin works by transforming the raw content before parsing
    // It's called from the markdown processing pipeline
  };
}

// Export the transformer for use in preprocessing
export const preprocessAdmonitions = transformAdmonitions;
