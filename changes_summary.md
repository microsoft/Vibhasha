# Vibhasha Playbook - Migration Changes Summary

This document summarizes all changes made while migrating the Vibhasha Playbook from **MkDocs Material** to **React + Vite**.

---

## Table of Contents

1. [MkDocs Material Syntax Support](#1-mkdocs-material-syntax-support)
2. [Interactive Flowchart Migration](#2-interactive-flowchart-migration)
3. [Files Overview](#3-files-overview)

---

# 1. MkDocs Material Syntax Support

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

## Solution Overview

We implemented a **preprocessing pipeline** that transforms MkDocs Material syntax into standard HTML before `react-markdown` processes the content. This approach:

1. Keeps the original markdown files unchanged
2. Transforms syntax at runtime before rendering
3. Applies Material-inspired CSS styling

---

## Files Created for MkDocs Syntax

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

---

## Files Modified for MkDocs Syntax

### `components/MarkdownPage.jsx`

**Changes:**

1. Added imports for preprocessing plugins and CSS
2. Added `preprocessMarkdown()` function to chain all transformers
3. Added state for processed content
4. Updated ReactMarkdown to use `rehype-raw` for HTML passthrough

---

## MkDocs Syntax Support Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Admonitions (`!!!`) | ✅ Working | 13 types supported |
| Collapsible (`???`) | ✅ Working | With animation |
| Material Icons | ✅ Working | 23 icons mapped to SVG |
| Octicons | ✅ Working | Arrow icon supported |
| Button Links | ✅ Working | Primary and default styles |
| Image Attributes | ✅ Working | Width attribute supported |
| Grid Layouts | ✅ Working | CSS styling applied |
| Dark Mode | ✅ Working | All components |

---

# 2. Interactive Flowchart Migration

## Problem Statement

The original MkDocs site had an interactive flowchart (`public/chapters/interactive/flowchart.md`) built with **Cytoscape.js** embedded via `<script>` tags in markdown. This approach doesn't work in React because:

1. `<script>` tags in markdown are not executed for security reasons
2. Direct DOM manipulation conflicts with React's virtual DOM
3. `window.location.href` navigation causes full page reloads instead of SPA routing

## Solution Overview

We replaced the Cytoscape.js implementation with **React Flow** (`@xyflow/react`), a modern React-native library for node-based UIs that provides:

- ✨ Modern, polished design out of the box
- 🎨 Custom React components as nodes with icons and gradients
- 🗺️ Built-in MiniMap for navigation overview
- 🎛️ Smooth controls panel for zoom/fit
- 💫 Animated edges with bezier curves
- 🔗 Native React Router integration for SPA navigation

---

## Files Created for Flowchart

### 1. `components/FlowchartPage.jsx`

**Purpose:** React Flow-based interactive flowchart component

**Features:**
- **6 Custom Node Types** with unique styling:
  - `StartNode` - Green gradient, initiates the workflow
  - `EndNode` - Red gradient, deployment goal
  - `DecisionNode` - Amber gradient, branching decision points
  - `StrategyNode` - Indigo gradient (brand color), core strategies
  - `ProcessNode` - Cyan gradient, action steps
  - `IterateNode` - Purple gradient, feedback loop

- **Interactive Controls:**
  - Click any node to navigate via React Router (no page reload)
  - Scroll to zoom in/out smoothly
  - Drag to pan around the flowchart
  - Built-in Controls panel (zoom in, zoom out, fit view)
  - MiniMap for navigation overview

- **Visual Features:**
  - Gradient backgrounds on all nodes
  - Hover animations with lift effect
  - Animated edge from Start node
  - Edge labels for decision outcomes (Yes/No, Pass/Fail)
  - Dashed line for iteration loop

**Node Configuration:**
```javascript
const initialNodes = [
  // Start
  { id: 'start', type: 'start', position: { x: 400, y: 0 },
    data: { label: 'Define Your Multilingual Task', chapter: '/playbook/00-introduction' } },
  
  // Evaluation Phase
  { id: 'eval', type: 'process', position: { x: 400, y: 120 },
    data: { label: 'Evaluation Strategy', icon: '📊', chapter: '/playbook/01-evaluation-overview' } },
  // ... more nodes
];
```

**Edge Configuration:**
```javascript
const initialEdges = [
  { id: 'e-start-eval', source: 'start', target: 'eval', animated: true },
  { id: 'e-data-synthetic', source: 'eval-data', target: 'synthetic-data', sourceHandle: 'left', label: 'No' },
  // ... more edges
];
```

---

### 2. `components/styles/FlowchartPage.css`

**Purpose:** Complete styling for the flowchart page

**Includes:**

- **Page Layout:**
  - Centered header with title and subtitle
  - 700px height container with rounded corners and shadow
  - Legend section explaining node types
  - Instruction cards for user guidance

- **Node Styles:**
  ```css
  .node-start {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-color: #047857;
  }
  
  .node-strategy {
    background: linear-gradient(135deg, var(--color-header-bg, #312A9A) 0%, #1e1b4b 100%);
    /* Uses brand color from ThemeContext */
  }
  ```

- **Hover Effects:**
  ```css
  .flowchart-node:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  }
  ```

- **React Flow Overrides:**
  - Custom styled Controls panel
  - Custom styled MiniMap
  - Handle styling for connection points

- **Responsive Design:**
  - Mobile-friendly adjustments at 768px breakpoint
  - Smaller nodes and fonts on mobile
  - Vertical instruction cards

- **Dark Mode Ready:**
  - CSS media query for `prefers-color-scheme: dark`

---

## Files Modified for Flowchart

### `main.jsx`

**Changes:**

1. Added import for FlowchartPage component:
```javascript
import FlowchartPage from './components/FlowchartPage'
```

2. Added route for flowchart:
```javascript
<Route path="/playbook/flowchart" element={<FlowchartPage />} />
```

---

### `package.json`

**Added dependency:**
```json
"@xyflow/react": "^12.x.x"
```

---

## Flowchart Navigation Mapping

| Node | Chapter Link |
|------|--------------|
| Start | `/playbook/00-introduction` |
| Evaluation Strategy | `/playbook/01-evaluation-overview` |
| Create Synthetic Dataset | `/playbook/06-synthetic-data-overview` |
| Run Evaluation Protocol | `/playbook/01-evaluation-overview` |
| Translation Strategy | `/playbook/02-translation-overview` |
| Check MT Quality | `/playbook/02-translation-overview` |
| Assess Cultural Loss | `/playbook/02-v-cultural-nuance` |
| Fine-Tune Model | `/playbook/04-fine-tuning-overview` |
| Collect Multilingual Data | `/playbook/04-iii-data-engineering` |
| Apply PEFT Techniques | `/playbook/04-ii-methodologies` |
| Align with Cultural Values | `/playbook/07-culture-overview` |
| Off-the-Shelf Prompting | `/playbook/02-translation-overview` |
| Design Multilingual Prompts | `/playbook/07-iv-prompt-engineering` |
| Test Prompt Sensitivity | `/playbook/01-i-methodologies` |
| Safety Assessment | `/playbook/05-safety-overview` |
| Safety Validation | `/playbook/05-safety-overview` |

---

## Usage

Access the flowchart at:
```
http://localhost:5173/playbook/flowchart
```

---

# 3. Files Overview

## New Files Created

| File | Purpose |
|------|---------|
| `plugins/remark-admonitions.js` | MkDocs admonition syntax transformer |
| `plugins/remark-icons.js` | Material icons to SVG converter |
| `plugins/remark-attr-list.js` | Attribute list syntax handler |
| `components/styles/MkDocsMaterial.css` | MkDocs Material component styling |
| `components/FlowchartPage.jsx` | React Flow interactive flowchart |
| `components/styles/FlowchartPage.css` | Flowchart styling |

## Files Modified

| File | Changes |
|------|---------|
| `components/MarkdownPage.jsx` | Added preprocessing pipeline, rehype-raw |
| `main.jsx` | Added FlowchartPage import and route |
| `package.json` | Added `rehype-raw` and `@xyflow/react` dependencies |

## Files That Can Be Deleted

| File | Reason |
|------|--------|
| `public/chapters/interactive/flowchart.md` | Replaced by React component |
| `test-admonitions.cjs` | Test file, no longer needed |
| `test-admonitions.mjs` | Test file, no longer needed |

---

## Technical Notes

### Processing Pipeline Order
The MkDocs syntax preprocessing order matters:
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

### React Flow vs Cytoscape.js
| Feature | Cytoscape.js (Old) | React Flow (New) |
|---------|-------------------|------------------|
| Integration | Script injection in MD | Native React component |
| Navigation | `window.location.href` | React Router `useNavigate` |
| Styling | CSS variables in JS | CSS with gradients |
| Controls | Custom DIY | Built-in polished |
| MiniMap | Not included | Built-in |
| Maintenance | DOM manipulation | React state |

---

## Branch Information

- **Branch Name:** `feature/mkdocs-admonitions`
- **Based On:** `develop`
- **Last Updated:** January 28, 2026
