# Vibhasha Playbook — Formatting & Style Guidelines

> **Purpose:** This document defines the canonical formatting rules for every Markdown chapter/section file in `/public/chapters/`. It is intended to be machine-readable so that automated tooling (or an LLM agent) can apply these rules across the entire playbook in a single pass.

---

## 1. Admonition Consolidation

### 1.1 Problem

Too many admonition types are used across the playbook (13 types: note, info, tip, success, warning, danger, failure, important, quote, example, question, abstract, bug). The different colours are overwhelming and the meaning is unclear from page to page.

### 1.2 Rule — Three Semantic Categories Only

Consolidate all admonitions into **three categories** mapped to three colour families. Every admonition in the playbook must use one of these and no others.

| Category | Semantic Meaning | Admonition Types to Use | Colour Palette |
|---|---|---|---|
| **Blue — Informational** | Information, things to note, important text, principles, definitions, context | `!!! info "Title"` | Background `#EAEAFF`, header bg `#D1D1FF`, left-border `#8F8FFF`, header text `#312A9A` |
| **Amber — Cautionary** | Challenges, risks, limitations, considerations, warnings, dangers, failures | `!!! warning "Title"` | Background `#FFF3E2`, header bg `#FFE4BE`, left-border `#FFB357`, header text `#AE5606` |
| **Green — Positive** | Opportunities, checklists, best practices, success criteria, recommendations, tips | `!!! success "Title"` | Background `#EDFDE6`, header bg `#C8F5B7`, left-border `#88E06C`, header text `#197123` |

### 1.3 Migration Map

Replace all current admonition types as follows:

| Current Type | Maps To | Rationale |
|---|---|---|
| `note` | `info` | Blue — informational |
| `info` | `info` | Blue — no change |
| `abstract` | `info` | Blue — informational summary |
| `quote` | `info` | Blue — informational reference |
| `question` | `info` | Blue — informational prompt |
| `example` | `info` | Blue — informational illustration |
| `important` | `info` | Blue — key information |
| `tip` | `success` | Green — positive/helpful |
| `success` | `success` | Green — no change |
| `warning` | `warning` | Amber — no change |
| `danger` | `warning` | Amber — cautionary |
| `failure` | `warning` | Amber — cautionary |
| `bug` | `warning` | Amber — cautionary |

### 1.4 Admonition Density

- **Maximum:** No more than **3 admonitions per H2 section** (i.e., per major content block). This cap includes both standard (`!!!`) and collapsible (`???` / `???+`) admonitions.
- **Minimum spacing:** At least **2 paragraphs of prose** between consecutive admonitions.
- **No stacking:** Never place two admonitions directly adjacent with no prose in between.
- Files with zero admonitions are acceptable — do not add admonitions artificially. A file can satisfy the layout variety rule (§14.4) using non-admonition patterns (grid cards, tables, content tabs, collapsible details, bold lead-ins).

### 1.5 Admonition Content Formatting

- Always provide a **custom descriptive title** in quotes: `!!! info "Why This Matters"` — never use bare `!!! info` with default titles.
- The admonition body is indented **4 spaces** from the `!!!` marker (this is structural, required by the `!!!` syntax). Within that body, bullet nesting follows §8.2 (first-level bullets at the 4-space base, second-level at 6 spaces, third-level at 8 spaces).
- Keep admonition content concise: maximum **5–7 bullet points** or **3 short paragraphs**.

---

## 2. Heading Conventions

### 2.1 Heading Case — Sentence Case

All headings across the entire playbook must use **sentence case** (capitalize only the first word and proper nouns).

- ✅ `## Core evaluation methodologies`
- ✅ `### Why traditional metrics fall short`
- ✅ `## Fine-tuning translation systems`
- ❌ `## Core Evaluation Methodologies` (Title Case — do not use)
- ❌ `### Fine-Tuning Translation Systems` (Title Case — do not use)

**Exception:** Proper nouns (e.g., "BLEU", "BERTScore", "Azure", "LLM") remain capitalised.

### 2.2 Heading Hierarchy

- **`#` (H1):** Used ONLY in chapter overview files (e.g., `01-evaluation.md`, `02-translation.md`). Each chapter overview gets exactly one H1.
- **`##` (H2):** Top-level heading in all sub-section files (e.g., `01-i-methodologies.md`). Also used for major sections within chapter overviews.
- **`###` (H3):** Sub-sections within an H2 block.
- **`####` (H4):** Use sparingly for fine-grained sub-points.
- **Never skip levels** (e.g., H2 → H4 without an H3 in between).

### 2.3 Section Numbering

Add **hierarchical section numbers** to all `##` and `###` headings in sub-section files. The numbering scheme follows the file naming convention:

- File `01-i-methodologies.md` → headings numbered `1.1`, `1.1.1`, `1.1.2`, etc.
- File `01-ii-pipeline.md` → headings numbered `1.2`, `1.2.1`, `1.2.2`, etc.
- File `02-iii-adaptation.md` → headings numbered `2.3`, `2.3.1`, `2.3.2`, etc.
- File `04-ii-methodologies.md` → headings numbered `4.2`, `4.2.1`, `4.2.2`, etc.

**Chapter overview files** (e.g., `01-evaluation.md`) do NOT get section numbers — only their sub-section files do.

**Format:** `## 1.1 Core evaluation methodologies` — number followed by a space, then the heading text in sentence case.

---

## 3. Dividers (`---`)

### 3.1 Rule

- Use `---` (horizontal rule) **only** to separate major thematic blocks within a single file — typically between `##`-level sections.
- Do **not** place a trailing `---` at the end of a file.
- Do **not** use `---` after every heading or between every paragraph.
- **Guideline:** A typical sub-section file should have **0–2** dividers. Chapter overview files may have more (up to 1 per `##` section transition).

---

## 4. References and Citations

### 4.1 Rule — Remove All References

Remove all reference sections, footnotes, and citation markers from every file:

- Delete any `## References` section and its contents.
- Delete all footnote definitions (lines like `[^1]: ...`).
- Delete all inline footnote markers (e.g., `[^1]`, `[^72][^73]`).
- Delete all bracket-style citations (e.g., `[1, 2]`, `[7, 8, 10, 11]`).

The playbook is a practical guide, not an academic paper. External sources may be acknowledged in the Attribution page (`100-attribution.md`) if needed.

---

## 5. Buttons

### 5.1 Rule

- All buttons must use the format: `[Button Text →](#target){ .md-button }` — text first, then right-arrow `→`.
- Primary (filled) buttons: `{ .md-button .md-button--primary }`.
- Secondary (outlined) buttons: `{ .md-button }`.
- Every button **must have visible text** (not empty or icon-only).
- Remove any buttons inside HTML comments (`<!-- -->`).

---

## 6. Tables

### 6.1 Header Formatting

- All table headers must use **bold text**: `| **Column A** | **Column B** |`.
- Ensure consistent alignment indicators: use `|---|` for default, `|:---|` for left, `|---:|` for right, `|:---:|` for center.

### 6.2 Table Legibility

- Table header rows must be clearly visible in both light and dark themes — do not rely on background colour alone for contrast.
- Keep tables to a maximum of **5–6 columns** for readability.

---

## 7. Terminology

### 7.1 Organisational Terms

Use these terms consistently across the entire playbook:

| Term | Usage | Example |
|---|---|---|
| **Chapter** | A top-level topic (corresponds to a chapter overview file like `01-evaluation.md`) | "This chapter covers evaluation approaches." |
| **Section** | A sub-topic within a chapter (corresponds to a sub-section file like `01-i-methodologies.md`) | "This section explains core methodologies." |
| **Playbook** | The entire document/application | "This playbook is designed to be a practical guide." |

- Do **not** use: "subsection", "module", "part", "unit", "page" when referring to content divisions.

### 7.2 Compound Word Hyphenation

Use these hyphenated forms consistently everywhere:

- `fine-tuning` (not "finetuning" or "fine tuning")
- `low-resource` (not "lowresource" or "low resource")
- `high-resource` (not "highresource")
- `non-English` (not "nonEnglish" or "non English")
- `pre-translation` (not "pretranslation")
- `code-switching` / `code-switched` (not "codeswitching")
- `multi-lingual` → prefer `multilingual` (one word, no hyphen — this is the standard form)
- `real-world` (hyphenated when used as an adjective)

---

## 8. Bullet Points

### 8.1 Character

- Use `-` (dash) for all bullet points. Do **not** use `*` or `+`.

### 8.2 Nesting

- First level: no indent (column 0).
- Second level: 2-space indent.
- Third level: 4-space indent.
- Maximum nesting depth: **3 levels**.

### 8.3 Consistency Within Admonitions

- Inside admonition bodies, all content is indented 4 spaces from the `!!!` / `???` marker (see §1.5). Within that 4-space base, bullet nesting follows the same relative offsets as §8.2 (i.e., +2 spaces per level).

---

## 9. Commented-Out / Legacy Content

### 9.1 Rule

- Remove all HTML-commented-out blocks (`<!-- ... -->`) that contain legacy content, old structures, or disabled features.
- Remove all duplicate/triplicated content blocks (see known issues below).
- If commented content is needed for reference, move it to a `Backup/` directory instead.

---

## 10. Spelling and Grammar

### 10.1 Known Errors to Fix

- `01-i-methodologies.md`: "raditional" → "Traditional" (missing capital T)
- **American English** is the standard for the entire playbook. Use American spellings throughout (e.g., "optimize" not "optimise", "color" not "colour", "analyze" not "analyse").

### 10.2 General Rule

- Run a spell-check pass across all `.md` files.
- Pay special attention to technical terms: `BERTScore` (not "Bertscore"), `BLEU` (all caps), `LLM` (all caps), `NLP` (all caps).

---

## 11. Collapsible Admonitions

### 11.1 Rule

- `???` and `???+` (collapsible admonitions) are allowed but should be used **sparingly** and **consistently**.
- Collapsible admonitions must use the same three allowed types as standard admonitions (§1.2): `??? info`, `??? warning`, or `??? success` (and their `???+` variants). No other types.
- Collapsible admonitions **count toward the density cap** in §1.4 (max 3 admonitions total per H2 section).
- Use collapsible admonitions only for **supplementary/optional detail** (e.g., code examples, extended explanations) — not for core content the reader must see.
- If a chapter uses collapsible admonitions, all chapters should have the option available — but do not force them in where they're not needed.

---

## 12. Content Tabs (`=== "Tab Name"`)

### 12.1 Rule

- Content tabs are acceptable for showing **parallel alternatives** (e.g., code in different languages, comparison of approaches).
- If used, they must have **at least 2 tabs** and **no more than 5 tabs**.
- Tab names should be short (1–3 words) and in sentence case.

---

## 13. Duplicate Content — Known Issues to Resolve

| Issue | Files | Action |
|---|---|---|
| Content in `01-v-scenarios.md` duplicated from `01-vii-challenges.md` | `01-v-scenarios.md`, `01-vii-challenges.md` | Deduplicate: keep content in the more appropriate file, remove from the other |
| Triplicated tables/sections in `05-iii-red-teaming.md` | `05-iii-red-teaming.md` | Remove duplicate copies, keep one clean version |

---

## 14. Content Layout Patterns

### 14.1 Problem

Many section files follow a monotonous **heading → paragraph → bullet list** pattern repeated 10–20 times per page. This renders as a flat wall of text with no visual rhythm, making it hard to scan and easy to tune out.

### 14.2 Rule — Alternate Between Prose and Visual Elements

Never stack **3 or more bullet lists** in a row without breaking them up with a different visual element. Each `##`-level section should aim for this approximate rhythm:

```
## Section heading
  ↓ 1–2 paragraphs of prose (context-setting)
  ↓ Visual element: grid cards / table / content tabs
  ↓ 1–2 paragraphs of prose (transition)
  ↓ Visual element: admonition (key insight or warning)
  ↓ 1–2 paragraphs of prose
  ↓ Visual element: collapsible detail / content tabs
  ↓ Prose wrap-up
```

### 14.3 Available Layout Tools and When to Use Each

#### Pattern A — Grid cards for parallel concepts

When you have **2–5 peer-level items** (pillars, strategies, tools, roles), display them as a card grid instead of sequential `###` sections with bullets.

```markdown
<div class="grid cards" markdown>

-   :material-clipboard-text:{ .lg .middle } __Instruction-following data__

    ---

    Teaches the model *how* to respond to commands, prompts, and tasks across languages

-   :material-book-open:{ .lg .middle } __Domain-specific corpora__

    ---

    Teaches terminology, context, and patterns for your specific field or industry

-   :material-earth:{ .lg .middle } __Cultural grounding data__

    ---

    Makes the model feel native to the target language and region

</div>
```

**When to use:** Parallel concepts, strategy comparisons, component overviews, tool/role listings.
**Do not use for:** Sequential steps (use a numbered list or table instead).

#### Pattern B — Content tabs for contrasting or parallel lists

When you have **paired or contrasting lists** (Do/Don't, Pros/Cons, Before/After, Options A/B/C), use content tabs:

```markdown
=== "✅ Good sources"
    - Public domain corpora
    - Customer support transcripts
    - In-country writing samples
    - Synthetic examples created with native prompts

=== "❌ Sources to avoid"
    - Content purely translated from English
    - Highly formal text only (you need conversational diversity)
    - Noisy user-generated content that lacks value
    - Sources with unclear licensing
```

**When to use:** Do/Don't pairs, approach comparisons, language-specific examples, before/after.
**Constraints:** Minimum 2 tabs, maximum 5 tabs. Tab names: 1–3 words, sentence case.

#### Pattern C — Admonitions for key takeaways

Pull the single most important insight, warning, or principle out of a section into an admonition:

```markdown
!!! success "Golden rule"
    Only keep augmented samples that improve downstream evaluations. If synthetic or back-translated data doesn't measurably help, discard it.
```

**When to use:** 1–2 key-takeaway admonitions per `##` section (up to 3 total per §1.4, which includes collapsibles) — for the things the reader *must* remember.
**Do not use for:** Wrapping every bullet list in an admonition.

#### Pattern D — Tables instead of structured bullet lists

When bullet points follow a repeating structure (name → description, or step → goal → action), convert them to a table:

```markdown
| **Step** | **Goal** | **Key action** |
|---|---|---|
| 1. Collect | Gather native content | Prioritise breadth and naturalness |
| 2. Clean | Normalise raw text | Fix encoding, deduplicate, standardise |
| 3. Annotate | Add training signal | Use native speakers with clear guidelines |
| 4. Augment | Expand dataset size | Synthetic data, back-translation, paraphrase |
| 5. Split | Prevent leakage | Per-language train/dev/test with domain balance |
| 6. Evaluate | Validate quality | Fluency, distribution, bias, safety checks |
```

**When to use:** Any list where each item has 2+ attributes (name + description, step + action + outcome).
**Do not use for:** Simple, unstructured lists with no repeating pattern.

#### Pattern E — Collapsible details for deep-dive content

Long checklists, code examples, or supplementary detail that would overwhelm the main narrative:

```markdown
???+ warning "Cleaning checklist"
    - Fix encoding issues and remove corrupted text
    - Standardise punctuation, units, symbols, and numbering
    - Remove boilerplate, disclaimers, or irrelevant blocks
    - Normalise whitespace and line breaks
    - Deduplicate aggressively
    - Remove profanity or harmful content unless used for safety training
```

**When to use:** Checklists with 5+ items, code samples, extended examples, optional deep-dives.
**Syntax:** `???+` (open by default) for content most readers will want; `???` (closed) for truly supplementary detail.

#### Pattern F — Bold lead-in phrases in bullet lists

When a bullet list *must* remain as-is (none of the above patterns fit), make it scannable by bolding the lead-in keyword:

```markdown
- **Encoding** — Fix encoding issues and remove corrupted text
- **Punctuation** — Standardise units, symbols, and numbering
- **Boilerplate** — Remove disclaimers or irrelevant blocks
- **Whitespace** — Normalise line breaks and spacing
- **Duplicates** — Deduplicate aggressively
```

**When to use:** As a minimum improvement for any bullet list — gives the reader's eye anchor points to scan.

### 14.4 Minimum Visual Variety per File

- Every sub-section file (e.g., `04-iii-data-engineering.md`) should use **at least 2 different layout patterns** from A–F above, in addition to regular prose.
- Chapter overview files should use **at least 3 different patterns**.
- No file should consist solely of heading → paragraph → bullet list with no other visual element.

---

## Summary Checklist for Each File

Before considering a file "standardised", verify:

- [ ] Headings are in sentence case
- [ ] Section numbers are added (for sub-section files only)
- [ ] Admonitions use only `info`, `warning`, or `success` types
- [ ] Admonitions have custom descriptive titles
- [ ] No more than 3 admonitions per H2 section
- [ ] No adjacent/stacked admonitions without prose between them
- [ ] All bullets use `-` with correct indentation
- [ ] Tables have bold headers
- [ ] All references/footnotes/citations are removed
- [ ] No commented-out legacy content
- [ ] No duplicate content blocks
- [ ] Compound words are hyphenated per §7.2
- [ ] Terminology matches §7.1 (chapter/section/playbook)
- [ ] Dividers follow §3.1 rules
- [ ] Buttons follow §5.1 format
- [ ] Spelling errors are corrected
- [ ] At least 2 different visual layout patterns (§14) are used — no wall-of-bullets
- [ ] No 3+ consecutive bullet lists without a visual break between them   
