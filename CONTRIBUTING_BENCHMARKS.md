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

### 4. Validate locally

```bash
pip install -r scripts/requirements.txt
python scripts/validate_submission.py data/benchmarks/<YourBenchmark>
```

### 5. Open a Pull Request

- Title: `Add benchmark: <BenchmarkName>`
- CI will automatically validate your submission
- A maintainer will review and merge

Once merged, the dashboard data will be automatically regenerated.

---

## Schema Reference

### step1_identity.json

```json
{
  "benchmark_name": "BenchmarkName",
  "paper_id": "arxiv or ACL anthology ID (optional)",
  "year": 2025,
  "benchmark_type": "single | mixed | aggregation",
  "total_languages_claimed": 64,
  "total_datasets": 22,
  "dataset_names": ["Dataset1", "Dataset2", "..."],
  "task_categories": ["NER", "QA", "Machine Translation", "..."],
  "brief_description": "One-sentence description of the benchmark."
}
```

- `benchmark_type`: `"single"` = one dataset, `"mixed"` = multiple original datasets, `"aggregation"` = collection of existing datasets
- `dataset_names`: Use canonical dataset names (e.g., "XNLI" not "AfriXNLI") for deduplication

### step2_datasets.json

```json
{
  "datasets": [
    {
      "dataset_name": "DatasetName",
      "task_type": "Named Entity Recognition",
      "source": "original | translated | hybrid | unknown",
      "source_language": null,
      "annotation_method": "How was the data created/annotated?",
      "num_languages": 20,
      "data_creator_info": {
        "creator_type": "researchers | crowdsource | community | automated",
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

- `source`: Where the data originates — `"original"` (created natively), `"translated"` (from English or another language), `"hybrid"` (mix), `"unknown"`
- `source_language`: If translated, from which language? (e.g., `"English"`)

### step3_languages.json

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

```json
{
  "assessments": [
    {
      "dataset_name": "DatasetName",
      "translated": false,
      "native_annotators": true,
      "culturally_grounded": true,
      "evidence_translated": "Quote from paper supporting judgment",
      "evidence_annotators": "Quote from paper",
      "evidence_cultural": "Quote from paper",
      "confidence": "high | medium | low"
    }
  ]
}
```

- One entry per dataset
- All judgments should be evidence-backed (quote the paper)
- `confidence`: How certain are you about this assessment?

### step5_cultural.json

```json
{
  "geographic_representation": {
    "regions_covered": ["Sub-Saharan Africa", "South Asia"],
    "notes": "Context about geographic scope"
  },
  "datasets_from_scratch": ["Dataset1", "Dataset3"],
  "datasets_translated_from_english": ["Dataset2"],
  "annotator_workforce": {
    "all_native_speakers": true,
    "annotators_from_target_regions": true,
    "evidence": "Quote from paper"
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
