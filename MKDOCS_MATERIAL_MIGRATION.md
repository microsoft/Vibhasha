# MkDocs Material Theme Migration

This document summarizes the changes made in the `feature/mkdocs-admonitions` branch to add support for MkDocs Material theme syntax in the React-based Vibhasha Playbook.

## Problem Statement

The Vibhasha Playbook documentation was originally written using **MkDocs Material theme** syntax, which includes special components like admonitions, grid layouts, Material icons, and styled buttons. When migrating to a React-based template using `react-markdown`, these components rendered as raw text instead of styled elements.

### Components That Didn't Work

| Component | Syntax | Issue |
|-----------|--------|-------|
| Admonitions | `!!! danger "Title"` | Rendered as literal text |
| Collapsible Admonitions | `??? example "Title"` | Rendered as literal text |
| Material Icons | `:material-compare:` | Rendered as literal text |
| Octicons | `:octicons-arrow-right-24:` | Rendered as literal text |
| Button Links | `[Link](url){ .md-button }` | Showed `{ .md-button }` after link |
| Image Attributes | `![alt](src){ width="480" }` | Showed attributes as text |
| Grid Layouts | `<div class="grid" markdown>` | No styling applied |

---

## Solution Overview

We implemented a **preprocessing pipeline** that transforms MkDocs Material syntax into standard HTML before `react-markdown` processes the content. This approach:

1. Keeps the original markdown files unchanged
2. Transforms syntax at runtime before rendering
3. Applies Material-inspired CSS styling

---

## Files Created

### 1. `plugins/remark-admonitions.js`

**Purpose:** Transform MkDocs admonition syntax to styled HTML

**Handles:**
- `!!! type "title"` → Standard admonitions
- `??? type "title"` → Collapsible admonitions (closed by default)
- `???+ type "title"` → Collapsible admonitions (open by default)

**Supported Types:** note, info, tip, success, warning, danger, failure, important, quote, example, question, abstract, bug

**Key Implementation Details:**
```javascript
// Regex pattern for matching admonition start
const ADMONITION_START = /^(!{3}|\?{3}\+?)\s+(\w+)(?:\s+"([^"]*)")?$/;

// Line ending normalization (critical fix for Windows files)
const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
```

**Output Example:**
```html
<div class="admonition admonition-danger">
  <p class="admonition-title"><span class="admonition-icon">🔴</span>The Real-World Impact</p>
  <div class="admonition-content">
    Content here...
  </div>
</div>
```

---

### 2. `plugins/remark-icons.js`

**Purpose:** Convert Material Design icon syntax to inline SVG

**Handles:**
- `:material-icon-name:{ .lg .middle }` → Inline SVG
- `:octicons-icon-name-24:` → Inline SVG

**Supported Icons:** 23 Material icons and 1 Octicon commonly used in the docs

**Key Implementation:**
```javascript
// Example transformation
':material-compare:{ .lg .middle }' 
  → '<span class="md-icon md-icon-material"><svg>...</svg></span>'
```

---

### 3. `plugins/remark-attr-list.js`

**Purpose:** Handle MkDocs attribute list syntax

**Handles:**
- `[Link](url){ .md-button }` → `<a href="url" class="md-button">Link</a>`
- `[Link](url){ .md-button .md-button--primary }` → Primary styled button
- `![alt](src){ width="480" }` → `<img src="src" alt="alt" width="480" />`

---

### 4. `components/styles/MkDocsMaterial.css`

**Purpose:** Complete CSS styling for all MkDocs Material components

**Includes:**
- **Admonition Styles:** 13 color schemes (note, info, tip, success, warning, danger, failure, important, quote, example, question, abstract, bug)
- **Collapsible Admonitions:** `<details>`/`<summary>` styling with arrow animation
- **Grid Layouts:** Responsive 2-column grid with card styling
- **Button Links:** Outlined and primary button styles
- **Material Icons:** Icon sizing and positioning
- **Dark Mode:** Complete dark mode color overrides for all components
- **Responsive Design:** Mobile-friendly adjustments

**Color Examples:**
| Type | Border Color | Light Background | Dark Background |
|------|--------------|------------------|-----------------|
| danger | #ff5252 | #ffebee | rgba(255, 82, 82, 0.15) |
| success | #00c853 | #e8f5e9 | rgba(0, 200, 83, 0.15) |
| warning | #ff9100 | #fff3e0 | rgba(255, 145, 0, 0.15) |
| quote | #9e9e9e | #fafafa | rgba(158, 158, 158, 0.15) |

---

## Files Modified

### 1. `components/MarkdownPage.jsx`

**Changes:**

1. **Added imports for preprocessing plugins and CSS:**
```javascript
import './styles/MkDocsMaterial.css'
import rehypeRaw from 'rehype-raw';
import { preprocessAdmonitions } from '../plugins/remark-admonitions.js';
import { preprocessIcons } from '../plugins/remark-icons.js';
import { preprocessAttrList } from '../plugins/remark-attr-list.js';
```

2. **Added preprocessing function:**
```javascript
function preprocessMarkdown(rawContent) {
  let content = rawContent;
  content = preprocessAdmonitions(content);
  content = preprocessIcons(content);
  content = preprocessAttrList(content);
  return content;
}
```

3. **Added state for processed content:**
```javascript
const [processedContent, setProcessedContent] = useState('');
```

4. **Added useEffect for preprocessing:**
```javascript
useEffect(() => {
  if (content) {
    const processed = preprocessMarkdown(content);
    setProcessedContent(processed);
  } else {
    setProcessedContent('');
  }
}, [content]);
```

5. **Updated ReactMarkdown to use processed content and rehype-raw:**
```javascript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}  // Added for HTML passthrough
  components={mdHeadingComponents}
>
  {processedContent}  // Changed from {content}
</ReactMarkdown>
```

---

### 2. `package.json`

**Added dependency:**
```json
"rehype-raw": "^7.0.0"
```

This package allows HTML in markdown to pass through without being escaped.

---

## Technical Details

### Line Ending Normalization

A critical bug was discovered where Windows-style line endings (`\r\n`) prevented the admonition regex from matching. The fix normalizes all line endings to Unix-style (`\n`) before processing:

```javascript
const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
```

### Processing Pipeline Order

The preprocessing order matters:
1. **Admonitions first** - They may contain icons or buttons
2. **Icons second** - Convert icon syntax to SVG
3. **Attribute lists last** - Handle remaining attribute syntax

### Content Flow

```
Markdown File (with MkDocs syntax)
         ↓
    fetch() loads content
         ↓
    preprocessMarkdown()
         ├── preprocessAdmonitions()
         ├── preprocessIcons()
         └── preprocessAttrList()
         ↓
    Transformed HTML/Markdown
         ↓
    ReactMarkdown + rehype-raw
         ↓
    Rendered React components with CSS styling
```

---

## Testing

A test file was created to verify the admonition transformation works correctly:

```bash
node test-admonitions.cjs
```

This outputs the transformed HTML to verify the regex and transformation logic.

---

## Cleanup

The following test files can be deleted after verification:
- `test-admonitions.cjs`
- `test-admonitions.mjs`

---

## Usage

No special commands needed. Just run:

```bash
npm run dev
```

The preprocessing happens automatically when markdown content is loaded.

---

## Component Support Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Admonitions (`!!!`) | ✅ Working | 13 types supported |
| Collapsible (`???`) | ✅ Working | With animation |
| Material Icons | ✅ Working | 23 icons mapped to SVG |
| Octicons | ✅ Working | Arrow icon supported |
| Button Links | ✅ Working | Primary and default styles |
| Image Attributes | ✅ Working | Width attribute supported |
| Grid Layouts | ✅ Working | CSS styling applied |
| Grid Cards | ✅ Working | Hover effects included |
| Dark Mode | ✅ Working | All components |
| Footnotes | ✅ Already worked | remark-gfm handles these |
| Task Lists | ✅ Already worked | remark-gfm handles these |

---

## Future Improvements

1. **Code Block Line Numbers:** The `linenums="1"` syntax for code blocks is not yet implemented
2. **Additional Icons:** More Material icons can be added to the mapping as needed
3. **Tabbed Content:** If MkDocs `tabs` extension was used, it would need similar treatment

---

## Branch Information

- **Branch Name:** `feature/mkdocs-admonitions`
- **Based On:** `develop`
- **Created:** January 26, 2026
