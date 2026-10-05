# AGENTS.md — Benchmark Metadata Extraction Agent

This file gives an AI coding agent everything it needs to turn a multilingual
evaluation benchmark **paper** into a complete, schema-valid contribution
under `data/benchmarks/<BenchmarkName>/`, following
[CONTRIBUTING_BENCHMARKS.md](/CONTRIBUTING_BENCHMARKS.md).

## When to use this

Invoke this workflow whenever the user gives you a benchmark paper (PDF, URL,
arXiv/ACL ID, or pasted text) and asks you to add/extract/register it as a
Vibhasha benchmark.

## Inputs you need before starting

Ask the user only if these are missing:

1. The paper itself — a file path, URL, arXiv ID, or pasted full text.
2. Optionally, the benchmark's canonical name if it differs from the paper title.

Do not proceed on a title/abstract alone — you need the full paper (methodology,
data collection, and annotation sections in particular) to fill in
evidence-backed fields faithfully. If only an abstract is available, tell the
user which sections you're missing and ask them to supply the full text/PDF.

## Step-by-step procedure

### 1. Read the paper thoroughly

Read (or fetch, e.g. with `web_fetch` for an arXiv/ACL URL) the full paper.
Pay special attention to:

- Title, venue, year, and any dataset/benchmark naming
- Dataset construction and data sources (original vs. translated vs. adapted)
- Number and list of languages, and which dataset each language appears in
- Annotator/creator descriptions (who, affiliation, demographics, pay, IRB)
- Any statements about translation methodology, native speakers, or cultural
  grounding
- Geographic/regional framing of the benchmark

### 2. Check for duplicates and canonical names

- List existing benchmarks: `data/benchmarks/`. If a directory with the same
  or a very similar name exists, tell the user and ask whether this is an
  update instead of a new benchmark.
- For every dataset mentioned in the paper, check whether it already exists
  under another benchmark's `step2_datasets.json` / the language registry in
  `data/generated/`. Reuse the **canonical dataset name** already used in the
  repo (e.g., `"XNLI"`, not `"AfriXNLI"`) so cross-benchmark deduplication
  keeps working.
- Look at 1–2 existing benchmark directories in `data/benchmarks/` (e.g.
  `AfroBench`) as concrete formatting references.

### 3. Create the benchmark directory

```
data/benchmarks/<BenchmarkName>/
├── step1_identity.json
├── step2_datasets.json
├── step3_languages.json
├── step4_assessments.json
└── step5_cultural.json
```

Use PascalCase for `<BenchmarkName>`.

### 4. Fill in each step file

The **authoritative field list is the JSON Schema in `data/schemas/`**, not
just the examples in CONTRIBUTING_BENCHMARKS.md — schemas are stricter
(`additionalProperties: false` and some fields the markdown doc omits, e.g.
`benchmark_type_evidence` in step1). Always open the matching schema file
before writing a step file:

| File | Schema |
|---|---|
| `step1_identity.json` | `data/schemas/step1_identity.schema.json` |
| `step2_datasets.json` | `data/schemas/step2_datasets.schema.json` |
| `step3_languages.json` | `data/schemas/step3_languages.schema.json` |
| `step4_assessments.json` | `data/schemas/step4_assessments.schema.json` |
| `step5_cultural.json` | `data/schemas/step5_cultural.schema.json` |

Rules while extracting:

- **Extract only what the paper says — never infer or guess.** If the paper
  doesn't state something, use `null` (or `false`/empty list only where the
  schema requires a non-null default and the paper is genuinely silent).
- **Every subjective judgment (step4, and parts of step5) must carry a
  supporting quote from the paper** in its `evidence` field, plus a
  `confidence` of `"high"`, `"medium"`, or `"low"` reflecting how directly the
  quote supports the judgment.
- **`dataset_name` values must be identical (verbatim) across
  `step2_datasets.json`, `step3_languages.json` (`datasets_present_in`), and
  `step4_assessments.json` keys.** The validator's cross-file check will flag
  duplicate `(dataset_name, variant_name)` pairs, and downstream tooling
  depends on exact string matches.
- **`step1.dataset_names` must list every dataset that appears in
  `step2.datasets`.**
- Use standard, capitalized English language names in `step3.languages` keys
  (e.g., `"Amharic"`, `"Hindi"`), with `iso_code` in ISO 639-3 whenever the
  paper or a quick lookup makes it unambiguous.
- Language metadata is resolved from Glottolog, CLDR, and the Joshi taxonomy.
  If generation reports an unresolved, ambiguous, or incomplete language, do
  not accept an `Unknown` or implicit level-0 fallback. Add the smallest
  verified exception to `data/reference/language_metadata_overrides.json`,
  include a non-empty rationale, and follow
  `data/schemas/language_metadata_overrides.schema.json`. Use aliases for name
  variants and document intentional duplicate Glottocodes in
  `duplicate_glottocode_exceptions`.
- For `step5_cultural.json`, only populate lists (`datasets_from_scratch_no_english_source`,
  `datasets_translated_from_english`, etc.) with datasets you can support with
  a quote — leave a list empty with honest `evidence` text (e.g., "not
  discussed in the paper") rather than fabricating entries.

### 5. Validate locally

Run, from the repo root:

```
pip install -r scripts/requirements.txt
npm run validate-evals
```

Fix every reported error (`python scripts/validate_submission.py data/benchmarks/<BenchmarkName>`
gives the same output scoped to just this benchmark and is faster to iterate
on). Do not proceed to step 6 until validation is clean.

### 6. Regenerate derived data

```
npm run update-evals
```

This regenerates the language registry, normalized dataset-language rows,
review reports, dashboard summaries, distributions, cross-tabulations, and
insights under `data/generated/` and `public/data/`. Then run:

If language metadata validation fails, use the emitted language, benchmark,
candidate, and remediation information to update
`data/reference/language_metadata_overrides.json`. Do not continue until the
registry reports zero fatal metadata errors, zero unresolved names, zero
ambiguous names, zero missing scripts, and zero unreviewed resource levels.

```
npm run check-evals
```

to confirm the generated output is not stale. Commit the generated files
alongside the source `step*.json` files — do not hand-edit anything under
`data/generated/` or `public/data/benchmark_data.json`.

### 7. Summarize for the user

Report back:

- The benchmark directory created and a one-line description of the benchmark
- Counts: datasets added, languages added/matched to existing ones
- Any fields you left `null`/empty because the paper didn't cover them, so the
  user can double-check before opening a PR
- Confirmation that `validate-evals`, `update-evals`, and `check-evals` all
  passed

Do not open a pull request automatically — leave that to the user, per
[CONTRIBUTING_BENCHMARKS.md](/CONTRIBUTING_BENCHMARKS.md) (title format
`Add benchmark: <BenchmarkName>`, one benchmark per PR, using the benchmark PR
template in `.github/PULL_REQUEST_TEMPLATE/benchmark-update.md`).

## Non-negotiable guardrails

- Never fabricate quotes, statistics, or language lists. If unsure, mark the
  field `null`/low confidence and say so in your summary.
- Never edit files under `data/generated/` or `public/data/` by hand — only
  via `npm run update-evals`.
- Never treat missing language metadata as `Unknown` or silently classify it as
  `Left-Behinds`; resolve it from authoritative references or add a reviewed
  override with rationale.
- Never merge or push directly — this workflow only prepares local changes.
