# Bugs & Improvements Tracker

Here's some of the bugs and changes I've noted from my review, I know you were working on some of these so flagged the specific pages for you.

---

## Bug #1 — Flowchart layout order (instructions vs chart)

**Description:** Interactive flowchart drops to instructions then flowchart is above, its confusing behaviour as instinct is to scroll down to view more. Change the layout of the page to have the instructions at the top then the flowchart that way users default behaviour will bring them to the chart.

**Action:** In `components/FlowchartPage.jsx` (~line 514-718), move the `<div className="fc-content">` block (the "How the flowchart works" instructional section + example outcomes) **above** the `<div className="fc-canvas">` ReactFlow canvas. Keep the header and legend at the top, then instructions, then the flowchart canvas + path legend at the bottom.

**Complexity:** 🟢 SIMPLE — Automated. Reorder JSX blocks in FlowchartPage.jsx.

---

## Bug #2 — Relink all internal content on specific pages

**Description:** Relink all internal content on:
- Homepage - Pathways
- Getting Started
- Translation > Recommendations
- Fine-tuning
- Fine-tuning > Quality

**Action:** Audit and fix internal `[→ Link Text](/playbook/...)` links in these markdown files and JSX components. The routes are defined in `main.jsx`. Cross-reference each internal link in these pages against the actual route paths:
- **Homepage Pathways:** `components/PlaybookIntro.jsx` — path-card `onClick` handlers use `navigate('/playbook/...')`. Verify each route matches `main.jsx` routes.
- **Getting Started:** `public/chapters/00-introduction.md` — check all `/playbook/...` links in the markdown.
- **Translation > Recommendations:** `public/chapters/02-vi-recommendations.md` — verify internal links.
- **Fine-tuning:** `public/chapters/04-fine-tuning.md` — verify internal links.
- **Fine-tuning > Quality:** `public/chapters/04-v-quality.md` — verify internal links.

**Complexity:** 🟡 SYSTEMATIC — Requires page-by-page audit. Each page's links need to be checked against the route table in `main.jsx`. Can be semi-automated with a script that extracts all `/playbook/` links from markdown and checks them against defined routes.

---

## Bug #3 — Button style mismatch on Getting Started page

**Description:** Comprehensive Safety Assessments Button on Getting Started page should have the same style as the Synthetic Data Generation Framework one below it.

**Action:** In `public/chapters/00-introduction.md` (~line 162), the Safety button uses `.md-button .md-button--primary` (filled style) while the Synthetic Data button (~line 199) uses `.md-button` (outlined style). Change the Safety button class to match:
```
[→ Comprehensive Safety Assessments](/playbook/05-safety-overview){ .md-button }
```
(Remove `--primary` to match the outlined style of the Synthetic Data button.)

**Complexity:** 🟢 SIMPLE — Automated. Single line change in `public/chapters/00-introduction.md`.

---

## Bug #4 — Images not rendering on Evaluation > Eval in Practice

**Description:** Images not rendering on Evaluation > Eval in Practice.

**Action:** The image glob in `components/MarkdownPage.jsx` line 399 is `import.meta.glob('/assets/chapters/*', ...)` but the images for evaluation are in `/assets/01_evaluation/` (e.g., `Guidelines_PairWiseEvaluations.png`, `Instructions_DirectAssessment.png`). The glob pattern needs to be widened to include all asset subdirectories:
```js
const imageModules = import.meta.glob('/assets/**/*', { as: 'url', eager: true });
```
Also verify the markdown image paths in `public/chapters/01-ii-pipeline.md` match the actual file locations under `/assets/`.

**Complexity:** 🟢 SIMPLE — Automated. Change the glob pattern in MarkdownPage.jsx.

---

## Bug #5 — References missing on Fine-tuning > Implementation

**Description:** References missing at the bottom of Fine-tuning > Implementation.

**Action:** The file `public/chapters/04-vi-implementation.md` has a `## References` heading (line 317+) but needs its content verified. Check if the references section has actual content or is empty/incomplete. Compare against `public/chapters/Backup/04-fine-tuning.md` which has a References section that may have the original content to copy over.

**Complexity:** 🟡 SYSTEMATIC — Requires content review to identify which references should be listed. Check backup files and other chapter reference sections for the expected format and content.

---

## Bug #6 — Table header text color should be white

**Description:** Tables - change colour of text in header row to white. Affected pages:
- Evaluation > Eval in Practice
- Evaluation > Low Resource MT
- Evaluation > Scenarios
- Evaluation > Datasets
- Evaluation > Challenges
- Translation
- Translation > Crossroads
- Safety > Red Teaming
- Safety > Toolkits
- Culture > Frameworks
- Culture > Prompt engineering
- Culture > Evaluation

**Action:** The CSS in `components/styles/MarkdownPage.css` line 160-163 already sets `color: var(--color-header-text)` and the theme in `theme/ThemeContext.jsx` defines `headerText: '#ffffff'` for all palettes. The issue is likely that the `<th>` elements have their own color rule overriding the `thead tr` rule, OR the variable isn't being applied. Add an explicit rule to force white on `<th>`:
```css
.markdown-body th {
    color: #ffffff;
}
```
Or ensure `var(--color-header-text)` is actually resolving. Inspect the rendered DOM to confirm whether the CSS variable is set on the root element.

**Complexity:** 🟢 SIMPLE — Automated. Add/fix CSS rule in `components/styles/MarkdownPage.css`.

---

## Bug #7 — Broken links on Evaluation > Eval in Practice

**Description:** Broken links on Evaluation > Eval in Practice under Pairwise comparison and Elo ratings.

**Action:** In `public/chapters/01-ii-pipeline.md` (~lines 47-54), the links use fragment anchors:
- `[:octicons-arrow-right-24: Implementation Details](#pairwise-details)`
- `[:octicons-arrow-right-24: Calculate Elo Scores](#elo-calculation)`

These reference `#pairwise-details` and `#elo-calculation` anchors which may not exist as heading IDs in the rendered page. Verify these anchor targets exist in the markdown, and if not, add matching heading IDs or change the links to point to the correct section headings.

**Complexity:** 🟡 SYSTEMATIC — Need to audit the target anchors in the rendered page and fix the links or add corresponding heading IDs.

---

## Bug #8 — Tab behavior shifts page on last item

**Description:** Bug on tab behavior - on last item it shifts page contents. Affected pages:
- Evaluation > Advisory
- Evaluation > Scenarios
- Evaluation > Datasets
- Evaluation > Challenges
- Translation > Adaptation

**Action:** In `components/MarkdownPage.jsx` (~line 278), when switching tabs it calls `btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })`. On the last tab, this `scrollIntoView` can cause the page to jump/shift since the browser tries to scroll the button into view. Fix by either:
1. Removing the `scrollIntoView` call entirely (tab nav already has horizontal scroll buttons).
2. Wrapping it in a check to only scroll within the tab nav container, not the whole page.
3. Using `scrollIntoView` only on the tab nav's scroll container, not on the page level.

Additionally, the tab panels use `display: none`/`display: block` toggling which can cause layout shifts if panels have different heights. Consider adding `min-height` to `.content-tabs-panels` based on the tallest panel.

**Complexity:** 🟢 SIMPLE — Automated. Fix the `scrollIntoView` call in MarkdownPage.jsx and optionally add CSS to prevent layout shift.

---

## Bug #9 — Code snippets: collapse to 5 lines with expand

**Description:** For code snippets can we have 5 lines appear and click to expand interaction to see anything more. Affected pages:
- Evaluation > Scenarios

**Action:** Modify the `CodeBlock` component in `components/MarkdownPage.jsx` (~line 350-390) to:
1. Count lines in the code content.
2. If > 5 lines, render collapsed (max-height ~5 lines) with a "Show more" / "Expand" button.
3. On click, expand to full height.

Add corresponding CSS to `components/styles/MarkdownPage.css` for `.code-block-collapsed` and `.code-block-expand-btn` classes.

**Complexity:** 🟡 SYSTEMATIC — Requires new JSX logic + state management in CodeBlock component + new CSS. Moderate implementation effort but well-scoped.

---

## Bug #10 — Black box around some code snippets

**Description:** Black box appearing around some code-snippets. Affected pages:
- Evaluation > Scenarios
- Safety > Red Teaming
- Safety > Toolkits

**Action:** The `.code-block-wrapper` has `border: 1px solid var(--border-color, #e1e4e8)` and `.code-block-plain` has a background. The "black box" likely comes from a fallback or missing CSS variable in certain contexts, OR from `<pre>` blocks rendered inside content-tab-panels or admonitions where different styles cascade. Inspect the specific pages to identify whether:
1. The issue is with code blocks inside tab panels (`.content-tab-panel pre`) inheriting unwanted borders.
2. The issue is with inline code blocks that get the `.code-block-wrapper` treatment incorrectly.
3. The dark theme border color `#30363d` is rendering as too dark in light mode due to a theme variable issue.

Add explicit override: `.content-tab-panel .code-block-wrapper { border-color: var(--border-color, #e1e4e8); }`.

**Complexity:** 🟡 SYSTEMATIC — Requires inspecting the specific pages in a browser to identify the exact CSS cascade issue, then applying targeted fixes.

---

## Bug #11 — Add email to attribution page

**Description:** Add the gecko-playbooks@microsoft.com email to appear under contact on the attribution page.

**Action:** In `public/chapters/100-attribution.md` (~line 53-60), add the email to the Contact section:
```markdown
## Contact

For questions, feedback, or collaboration inquiries, please reach out to the corresponding authors:

[Prashant Kodali](mailto:kodali.prashant@gmail.com) · [Sunayana Sitaram](mailto:Sunayana.Sitaram@microsoft.com)

📧 Team contact: [gecko-playbooks@microsoft.com](mailto:gecko-playbooks@microsoft.com)

We welcome contributions, corrections, and suggestions to improve this playbook.
```

**Complexity:** 🟢 SIMPLE — Automated. Single line addition in `public/chapters/100-attribution.md`.

---

## Bug #12 — External links should open in new tab

**Description:** All links for external content should open in new tab (it's only happening on attribution page currently).

**Action:** In `components/MarkdownPage.jsx`, add a custom `a` component to the `mdComponents` object that checks if the `href` is external (starts with `http://` or `https://`) and adds `target="_blank" rel="noopener noreferrer"`:
```jsx
a: ({ node, href, children, ...props }) => {
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
},
```
Add this to the `mdComponents` object alongside the existing `code: CodeBlock` entry. This will apply globally to all markdown pages.

**Complexity:** 🟢 SIMPLE — Automated. Add a custom `a` component to MarkdownPage.jsx's ReactMarkdown components.

---

## Bug #13 — Safari mobile/tablet footer responsiveness

**Description:** Push updates Muchai made on responsiveness to fix issue with footer when using safari on mobile/tablet.

**Action:** This is a git/deployment task, not a code change. Muchai has already made the fixes — they need to be merged/pushed to the deployment branch. Check if there's a pending PR or branch with Muchai's footer responsiveness changes and merge them.

**Complexity:** 🔴 EXTERNAL — Requires coordination. Need to identify Muchai's branch/changes, review, and merge. Cannot be automated without knowing the branch name.

---

## Bug #14 — Disable search

**Description:** Disable search (we need to fix how this works).

**Action:** The `Search` component (`components/Search.jsx`) is rendered inside the Sidebar (`components/Sidebar.jsx`). To disable it:
1. In `components/Sidebar.jsx`, comment out or conditionally render the `<GlobalSearch>` component.
2. Alternatively, hide it with CSS: `.search-wrapper { display: none; }` in `components/styles/Search.css`.

Option 1 is cleaner (no wasted network requests fetching markdown for search indexing).

**Complexity:** 🟢 SIMPLE — Automated. Comment out `<GlobalSearch>` in Sidebar.jsx or add `display: none` CSS rule.

---

## Summary by Complexity

### 🟢 SIMPLE — Can be done automatically (code changes are well-defined):
| # | Bug | File(s) to change |
|---|-----|--------------------|
| 1 | Flowchart layout reorder | `components/FlowchartPage.jsx` |
| 3 | Button style mismatch | `public/chapters/00-introduction.md` |
| 4 | Images not rendering | `components/MarkdownPage.jsx` (glob pattern) |
| 6 | Table header text white | `components/styles/MarkdownPage.css` |
| 8 | Tab behavior page shift | `components/MarkdownPage.jsx` (scrollIntoView) |
| 11 | Add email to attribution | `public/chapters/100-attribution.md` |
| 12 | External links new tab | `components/MarkdownPage.jsx` (add `a` component) |
| 14 | Disable search | `components/Sidebar.jsx` or Search.css |

### 🟡 SYSTEMATIC — Requires audit/investigation before fixing:
| # | Bug | Why systematic |
|---|-----|----------------|
| 2 | Relink internal content | Page-by-page link audit against route table |
| 5 | Missing references | Content review needed |
| 7 | Broken anchor links | Need to verify anchor targets exist |
| 9 | Code collapse to 5 lines | New feature: component logic + CSS |
| 10 | Black box on code snippets | Need browser inspection to identify cascade issue |

### 🔴 EXTERNAL — Requires coordination:
| # | Bug | Why external |
|---|-----|--------------|
| 13 | Safari footer fix | Need to find and merge Muchai's branch |