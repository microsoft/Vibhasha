/**
 * Remark plugin to transform MkDocs Material content tabs syntax to HTML
 * 
 * Supports:
 * - === "Tab Title" - Content tabs
 * 
 * Usage in markdown:
 * === "Tab 1"
 *     Content for tab 1
 * 
 * === "Tab 2"
 *     Content for tab 2
 */

// Regex to match tab start: === "Tab Title"
const TAB_START = /^===\s+"([^"]+)"$/;

/**
 * Generate a unique ID for tab groups based on content hash
 */
function generateTabGroupId(titles) {
  let hash = 0;
  const str = titles.join('-');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `tabgroup-${Math.abs(hash).toString(36)}`;
}

/**
 * Transform content tabs blocks in markdown content
 */
export function transformContentTabs(content) {
  // Normalize line endings to LF
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedContent.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(TAB_START);

    if (match) {
      // Found start of a tab group - collect all consecutive tabs
      const tabs = [];
      
      while (i < lines.length) {
        const tabLine = lines[i];
        const tabMatch = tabLine.match(TAB_START);
        
        if (tabMatch) {
          const [, title] = tabMatch;
          
          // Collect indented content for this tab (4 spaces or 1 tab)
          const contentLines = [];
          i++;
          
          while (i < lines.length) {
            const contentLine = lines[i];
            // Check for next tab or end of tabs
            if (contentLine.match(TAB_START)) {
              break;
            }
            // Check if line is indented (part of tab content) or empty
            if (contentLine.match(/^(    |\t)/) || contentLine.trim() === '') {
              // Remove the 4-space or tab indent
              contentLines.push(contentLine.replace(/^(    |\t)/, ''));
              i++;
            } else if (contentLine.trim() === '') {
              // Empty line - could be separator or part of content
              contentLines.push('');
              i++;
            } else {
              // Non-indented, non-empty line - end of tab group
              break;
            }
          }
          
          // Trim trailing empty lines from content
          while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === '') {
            contentLines.pop();
          }
          
          tabs.push({
            title,
            content: contentLines.join('\n')
          });
        } else {
          // Not a tab line - end of tab group
          break;
        }
      }
      
      // Generate HTML for the tab group
      if (tabs.length > 0) {
        const tabGroupId = generateTabGroupId(tabs.map(t => t.title));
        
        result.push(`<div class="content-tabs" data-tab-group="${tabGroupId}">`);
        result.push(`<div class="content-tabs-nav-wrapper">`);
        result.push(`<button class="content-tabs-scroll-btn scroll-left" aria-label="Scroll left" data-scroll-dir="left">‹</button>`);
        result.push(`<div class="content-tabs-nav" role="tablist">`);
        
        // Generate tab buttons
        tabs.forEach((tab, index) => {
          const tabId = `${tabGroupId}-tab-${index}`;
          const panelId = `${tabGroupId}-panel-${index}`;
          const isActive = index === 0 ? ' active' : '';
          const ariaSelected = index === 0 ? 'true' : 'false';
          result.push(`<button class="content-tab-btn${isActive}" role="tab" aria-selected="${ariaSelected}" aria-controls="${panelId}" id="${tabId}" data-tab-index="${index}">${tab.title}</button>`);
        });
        
        result.push(`</div>`);
        result.push(`<button class="content-tabs-scroll-btn scroll-right" aria-label="Scroll right" data-scroll-dir="right">›</button>`);
        result.push(`</div>`);
        result.push(`<div class="content-tabs-panels">`);
        
        // Generate tab panels
        tabs.forEach((tab, index) => {
          const tabId = `${tabGroupId}-tab-${index}`;
          const panelId = `${tabGroupId}-panel-${index}`;
          const isHidden = index === 0 ? '' : ' hidden';
          result.push(`<div class="content-tab-panel${index === 0 ? ' active' : ''}" role="tabpanel" aria-labelledby="${tabId}" id="${panelId}"${isHidden}>`);
          result.push('');
          result.push(tab.content);
          result.push('');
          result.push(`</div>`);
        });
        
        result.push(`</div>`);
        result.push(`</div>`);
        result.push('');
      }
    } else {
      result.push(line);
      i++;
    }
  }

  return result.join('\n');
}

/**
 * Remark plugin that transforms MkDocs content tabs syntax
 * This is a "pre-processing" plugin that operates on the raw markdown string
 */
export default function remarkContentTabs() {
  return (tree, file) => {
    // This plugin works by transforming the raw content before parsing
    // It's called from the markdown processing pipeline
  };
}

// Export the transformer for use in preprocessing
export const preprocessContentTabs = transformContentTabs;
