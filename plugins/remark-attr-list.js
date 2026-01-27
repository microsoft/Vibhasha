/**
 * Plugin to transform MkDocs Material attribute list syntax
 * 
 * Supports:
 * - [Link text](url){ .md-button } - Button-styled links
 * - [Link text](url){ .md-button .md-button--primary } - Primary button links
 * - ![alt](src){ width="480" } - Image with width attribute
 * - ![alt](src){ .class1 .class2 } - Image with classes
 */

/**
 * Transform attribute list syntax in markdown content
 */
export function transformAttrList(content) {
  let result = content;

  // Transform link buttons: [text](url){ .md-button .md-button--primary }
  // Must handle both .md-button and .md-button--primary variants
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)\{\s*\.md-button(?:\s+\.md-button--primary)?\s*\}/g,
    (match, text, url, offset) => {
      const isPrimary = match.includes('--primary');
      const classes = isPrimary ? 'md-button md-button--primary' : 'md-button';
      return `<a href="${url}" class="${classes}">${text}</a>`;
    }
  );

  // Transform images with width attribute: ![alt](src){ width="480" }
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)\{\s*width="(\d+)"\s*\}/g,
    (match, alt, src, width) => {
      return `<img src="${src}" alt="${alt}" width="${width}" />`;
    }
  );

  // Transform images with class attributes: ![alt](src){ .class1 .class2 }
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)\{\s*((?:\.[a-zA-Z0-9_-]+\s*)+)\}/g,
    (match, alt, src, classStr) => {
      const classes = classStr.trim().replace(/\./g, '').replace(/\s+/g, ' ');
      return `<img src="${src}" alt="${alt}" class="${classes}" />`;
    }
  );

  return result;
}

export default function remarkAttrList() {
  return (tree, file) => {
    // Plugin hook - transformation happens in preprocessing
  };
}

export const preprocessAttrList = transformAttrList;
