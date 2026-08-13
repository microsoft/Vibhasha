"""
Validate a benchmark submission directory.

Checks that all required step files exist and conform to the expected schema.
Used in CI to validate pull requests adding new benchmarks.

Usage:
    python scripts/validate_submission.py data/benchmarks/<BenchmarkName>
    python scripts/validate_submission.py --all   # validate all benchmarks
"""

import json
import sys
from pathlib import Path

REQUIRED_STEPS = [
    "step1_identity.json",
    "step2_datasets.json",
    "step3_languages.json",
    "step4_assessments.json",
    "step5_cultural.json",
]

# ─── Schema checks ───────────────────────────────────────────────────────────

STEP1_REQUIRED_FIELDS = ["benchmark_name", "benchmark_type", "total_languages_claimed", "total_datasets", "dataset_names"]
STEP2_REQUIRED_FIELDS = ["datasets"]
STEP2_DATASET_FIELDS = ["dataset_name", "task_type", "source", "num_languages"]
STEP3_REQUIRED_FIELDS = ["total_languages", "languages"]
STEP4_REQUIRED_FIELDS = ["assessments"]
STEP5_REQUIRED_FIELDS = ["cultural_flags"]

BENCHMARK_TYPES = ("single_dataset", "mixed", "aggregation")
DATASET_SOURCES = ("original", "translated", "adapted", "mixed", "unknown")


def validate_json_loadable(path: Path) -> tuple[bool, str]:
    """Check file is valid JSON."""
    try:
        with open(path, encoding="utf-8") as f:
            json.load(f)
        return True, ""
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"
    except Exception as e:
        return False, f"Error reading file: {e}"


def validate_step1(data: dict) -> list[str]:
    errors = []
    for field in STEP1_REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"step1: missing required field '{field}'")
    if "benchmark_type" in data and data["benchmark_type"] not in BENCHMARK_TYPES:
        errors.append(f"step1: benchmark_type must be one of {BENCHMARK_TYPES}, got '{data['benchmark_type']}'")
    if "dataset_names" in data and not isinstance(data["dataset_names"], list):
        errors.append("step1: dataset_names must be a list")
    return errors


def validate_step2(data: dict) -> list[str]:
    errors = []
    for field in STEP2_REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"step2: missing required field '{field}'")
            return errors
    if not isinstance(data["datasets"], list):
        errors.append("step2: 'datasets' must be a list")
        return errors
    for i, ds in enumerate(data["datasets"]):
        for field in STEP2_DATASET_FIELDS:
            if field not in ds:
                errors.append(f"step2: dataset[{i}] missing required field '{field}'")
        if "source" in ds and ds["source"] not in DATASET_SOURCES:
            errors.append(f"step2: dataset[{i}] source must be one of {DATASET_SOURCES}")
    return errors


def validate_step3(data: dict) -> list[str]:
    errors = []
    if "total_languages" not in data:
        errors.append("step3: missing required field 'total_languages'")
    if "languages" not in data and "constructed_benchmarks" not in data:
        errors.append("step3: missing 'languages' or aggregation field 'constructed_benchmarks'")
    if "languages" in data:
        if not isinstance(data["languages"], dict):
            errors.append("step3: 'languages' must be a dict mapping language names to objects")
        else:
            for lang_name, lang_data in data["languages"].items():
                if "datasets_present_in" not in lang_data:
                    errors.append(f"step3: language '{lang_name}' missing 'datasets_present_in'")
                elif not isinstance(lang_data["datasets_present_in"], list):
                    errors.append(f"step3: language '{lang_name}' datasets_present_in must be a list")
    return errors


def validate_step4(data: dict) -> list[str]:
    errors = []
    for field in STEP4_REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"step4: missing required field '{field}'")
            return errors
    if not isinstance(data["assessments"], (list, dict)):
        errors.append("step4: 'assessments' must be a list or dict")
    return errors


def validate_step5(data: dict) -> list[str]:
    errors = []
    for field in STEP5_REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"step5: missing required field '{field}'")
    cultural_flags = data.get("cultural_flags")
    if cultural_flags is not None:
        if not isinstance(cultural_flags, dict):
            errors.append("step5: 'cultural_flags' must be an object")
        elif "geographic_representation" not in cultural_flags:
            errors.append("step5: cultural_flags missing 'geographic_representation'")
    return errors


def validate_benchmark(benchmark_dir: Path) -> list[str]:
    """Validate a single benchmark directory. Returns list of error strings."""
    errors = []

    if not benchmark_dir.is_dir():
        return [f"Not a directory: {benchmark_dir}"]

    # Check all required files exist
    for step_file in REQUIRED_STEPS:
        path = benchmark_dir / step_file
        if not path.exists():
            errors.append(f"Missing required file: {step_file}")
            continue

        ok, msg = validate_json_loadable(path)
        if not ok:
            errors.append(f"{step_file}: {msg}")
            continue

    # If any files are missing/unreadable, skip deeper validation
    if errors:
        return errors

    # Load and validate each step
    with open(benchmark_dir / "step1_identity.json", encoding="utf-8") as f:
        errors.extend(validate_step1(json.load(f)))

    with open(benchmark_dir / "step2_datasets.json", encoding="utf-8") as f:
        errors.extend(validate_step2(json.load(f)))

    with open(benchmark_dir / "step3_languages.json", encoding="utf-8") as f:
        errors.extend(validate_step3(json.load(f)))

    with open(benchmark_dir / "step4_assessments.json", encoding="utf-8") as f:
        errors.extend(validate_step4(json.load(f)))

    with open(benchmark_dir / "step5_cultural.json", encoding="utf-8") as f:
        errors.extend(validate_step5(json.load(f)))

    # Cross-step consistency: reject duplicate dataset variants. A canonical
    # dataset may have multiple rows when each row names a distinct variant.
    with open(benchmark_dir / "step2_datasets.json", encoding="utf-8") as f:
        step2 = json.load(f)

    if "datasets" in step2 and isinstance(step2["datasets"], list):
        dataset_keys = [
            (ds["dataset_name"], ds.get("variant_name"))
            for ds in step2["datasets"]
            if "dataset_name" in ds
        ]
        duplicates = sorted({key for key in dataset_keys if dataset_keys.count(key) > 1})
        if duplicates:
            errors.append(f"Duplicate (dataset_name, variant_name) values in step2: {duplicates}")

    return errors


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_submission.py <benchmark_dir> | --all")
        sys.exit(1)

    root = Path(__file__).resolve().parent.parent
    benchmarks_dir = root / "data" / "benchmarks"

    if sys.argv[1] == "--all":
        dirs = sorted(d for d in benchmarks_dir.iterdir() if d.is_dir())
    else:
        dirs = [Path(sys.argv[1]).resolve()]

    total_errors = 0
    for benchmark_dir in dirs:
        errors = validate_benchmark(benchmark_dir)
        if errors:
            print(f"\n✗ {benchmark_dir.name} ({len(errors)} errors):")
            for e in errors:
                print(f"  - {e}")
            total_errors += len(errors)
        else:
            print(f"✓ {benchmark_dir.name}")

    print(f"\n{'='*60}")
    print(f"  Validated: {len(dirs)} benchmarks | Errors: {total_errors}")
    print(f"{'='*60}")

    sys.exit(1 if total_errors > 0 else 0)


if __name__ == "__main__":
    main()
