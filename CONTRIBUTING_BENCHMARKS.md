# Contributing Benchmark Metadata

Thank you for contributing to the Vibhasha multilingual evaluation benchmark registry! This guide explains how to submit metadata for a new benchmark.

## What we collect

For each multilingual evaluation benchmark, we collect structured metadata across 5 dimensions:

1. **Identity** — What is this benchmark? (name, year, type, datasets)
2. **Datasets** — What datasets does it contain? (task types, sources, annotation methods)
3. **Languages** — Which languages are covered and in which datasets?
4. **Assessments** — Per-dataset judgments (translated?, native annotators?, culturally grounded?)
5. **Cultural context** — Benchmark-level geographic and cultural representation

## How to submit

### 1. Fork this repository

### 2. Create a directory for your benchmark

```
data/benchmarks/<BenchmarkName>/
├── step1_identity.json
├── step2_datasets.json
├── step3_languages.json
├── step4_assessments.json
└── step5_cultural.json
```

Use PascalCase for the directory name (e.g., `AfroBench`, `SeaHELM`, `XNLI`).

### 3. Fill in the 5 step files

See the [schema reference](#schema-reference) below and existing benchmarks in `data/benchmarks/` for examples.
The machine-readable JSON Schemas are in `data/schemas/` and are enforced in pull request CI.

### 4. Validate locally

```bash
pip install -r scripts/requirements.txt
npm run validate-evals
npm run update-evals
npm run check-evals
```

`update-evals` validates every benchmark and regenerates the language registry,
normalized dataset-language rows, review reports, dashboard summaries, distributions,
cross-tabulations, and insights. Commit the updated files under `data/generated/` and
`public/data/` with your source changes. Do not edit generated files directly.

### 5. Open a Pull Request

- Title: `Add benchmark: <BenchmarkName>` or `Update benchmark: <BenchmarkName>`
- Use the benchmark pull request template
- CI validates all source files against the formal schemas
- CI reruns the complete data pipeline and rejects stale generated analysis
- CI builds the production site with the regenerated data
- The pull request remains unmerged until the required checks pass and a maintainer approves it
- Only a maintainer merges an approved pull request

Once merged, the deployment workflow regenerates the dashboard data from the reviewed source files and deploys the site.

### Data flow

```text
data/benchmarks/<BenchmarkName>/step*.json
  -> data/generated/language_registry.json
  -> data/generated/normalized_benchmarks.json
  -> public/data/benchmark_data.json
  -> /evals
```

`public/data/benchmark_data.json` is generated output, not the contribution surface.

---

## Schema Reference

### step1_identity.json

Formal schema: `data/schemas/step1_identity.schema.json`

```json
{
  "benchmark_name": "BenchmarkName",
  "paper_id": "arxiv or ACL anthology ID (optional)",
  "year": 2025,
  "benchmark_type": "single_dataset | mixed | aggregation",
  "total_languages_claimed": 64,
  "total_datasets": 22,
  "dataset_names": ["Dataset1", "Dataset2", "..."],
  "task_categories": ["NER", "QA", "Machine Translation", "..."],
  "brief_description": "One-sentence description of the benchmark."
}
```

- `benchmark_type`: `"single_dataset"` = one dataset, `"mixed"` = multiple original datasets, `"aggregation"` = collection of existing datasets
- `dataset_names`: Use canonical dataset names (e.g., "XNLI" not "AfriXNLI") for deduplication

### step2_datasets.json

Formal schema: `data/schemas/step2_datasets.schema.json`

```json
{
  "datasets": [
    {
      "dataset_name": "DatasetName",
      "variant_name": null,
      "variant_notes": null,
      "task_type": "Named Entity Recognition",
      "source": "original",
      "source_language": null,
      "translation_method": null,
      "annotation_method": "How was the data created/annotated?",
      "num_languages": 20,
      "language_list": null,
      "data_creator_info": {
        "creator_type": "researchers",
        "creator_affiliation": "Organization or community name",
        "creator_demographics_reported": false,
        "compensation_reported": false,
        "evidence": "Quote or citation supporting the above"
      },
      "is_new_in_this_paper": false,
      "source_reference": "Citation for pre-existing datasets",
      "notes": "Any additional context"
    }
  ]
}
```

- `source`: Where the data originates — `"original"` (created natively), `"translated"` (translated from another language), `"adapted"` (derived from an existing dataset), `"mixed"` (multiple origins), `"unknown"`
- `source_language`: If translated, from which language? (e.g., `"English"`)

### step3_languages.json

Formal schema: `data/schemas/step3_languages.schema.json`

```json
{
  "total_languages": 64,
  "languages": {
    "Amharic": {
      "iso_code": "amh",
      "datasets_present_in": ["Dataset1", "Dataset2"]
    },
    "Hindi": {
      "iso_code": "hin",
      "datasets_present_in": ["Dataset1", "Dataset3"]
    }
  }
}
```

- Use standard language names (English name, capitalized)
- `iso_code` is optional but strongly encouraged (ISO 639-3)
- `datasets_present_in` must reference names from step2

### step4_assessments.json

Formal schema: `data/schemas/step4_assessments.schema.json`

```json
{
  "assessments": {
    "DatasetName": {
      "translated": {
        "value": false,
        "evidence": "Quote from the paper supporting the judgment",
        "confidence": "high"
      },
      "native_annotators": {
        "value": true,
        "evidence": "Quote from the paper",
        "confidence": "medium"
      },
      "culturally_grounded": {
        "value": true,
        "evidence": "Quote from the paper",
        "confidence": "medium"
      },
      "annotation_quality_notes": null
    }
  }
}
```

- One entry per dataset
- All judgments should be evidence-backed (quote the paper)
- `confidence`: How certain are you about this assessment?
- `value`: Use `true`, `false`, or `null` where possible; use a short string such as `"partial"` only when a boolean would lose material information

### step5_cultural.json

Formal schema: `data/schemas/step5_cultural.schema.json`

```json
{
  "cultural_flags": {
    "datasets_from_scratch_no_english_source": {
      "list": ["Dataset1", "Dataset3"],
      "evidence": "Quote from paper"
    },
    "datasets_translated_from_english": {
      "list": ["Dataset2"],
      "evidence": "Quote from paper"
    },
    "datasets_with_cultural_grounding": {
      "list": ["Dataset1"],
      "details": {
        "Dataset1": "Why this dataset is culturally grounded"
      }
    },
    "all_annotators_native_speakers": {
      "value": "mixed",
      "evidence": "Quote from paper"
    },
    "annotator_workforce": {
      "creator_types_across_datasets": ["researchers"],
      "total_annotators_reported": null,
      "affiliations": ["Organization"],
      "demographics_reported": false,
      "compensation_reported": false,
      "compensation_details": null,
      "irb_ethics_review": null,
      "evidence": "Quote from paper"
    },
    "english_centricity_notes": "Relevant observations about English-centricity.",
    "geographic_representation": {
      "primary_region": "Sub-Saharan Africa",
      "sub_regions": ["West Africa", "East Africa"],
      "also_represented": [],
      "notably_excluded": [],
      "evidence": "Quote from paper"
    }
  }
}
```

---

## Guidelines

- **Extract only what the paper says** — don't infer or guess. If information isn't available, use `null`.
- **Use canonical dataset names** — if a dataset appears in multiple benchmarks (e.g., XNLI, FLORES), use the same name so deduplication works.
- **Evidence is critical** — for subjective assessments (step4), always include a supporting quote from the paper.
- **One benchmark per PR** — makes review easier.

## Questions?

Open an issue if you're unsure about anything.
