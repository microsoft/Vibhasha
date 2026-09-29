"""
Validate benchmark source files against the formal JSON Schemas.

The validator also applies consistency checks that span multiple step files.
It is used locally and by pull request CI.

Usage:
    python scripts/validate_submission.py data/benchmarks/<BenchmarkName>
    python scripts/validate_submission.py --all
"""

import argparse
import json
import sys
from functools import lru_cache
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parent.parent
BENCHMARKS_DIR = ROOT / "data" / "benchmarks"
SCHEMAS_DIR = ROOT / "data" / "schemas"

STEP_SCHEMAS = {
    "step1_identity.json": "step1_identity.schema.json",
    "step2_datasets.json": "step2_datasets.schema.json",
    "step3_languages.json": "step3_languages.schema.json",
    "step4_assessments.json": "step4_assessments.schema.json",
    "step5_cultural.json": "step5_cultural.schema.json",
}


@lru_cache(maxsize=None)
def load_validator(schema_name: str) -> Draft202012Validator:
    schema_path = SCHEMAS_DIR / schema_name
    with schema_path.open(encoding="utf-8") as schema_file:
        schema = json.load(schema_file)
    Draft202012Validator.check_schema(schema)
    return Draft202012Validator(schema)


def load_json(path: Path) -> tuple[object | None, str | None]:
    try:
        with path.open(encoding="utf-8") as source_file:
            return json.load(source_file), None
    except json.JSONDecodeError as error:
        return None, f"invalid JSON at line {error.lineno}, column {error.colno}: {error.msg}"
    except OSError as error:
        return None, f"could not read file: {error}"


def format_json_path(file_name: str, path_parts) -> str:
    location = file_name
    for part in path_parts:
        if isinstance(part, int):
            location += f"[{part}]"
        else:
            location += f".{part}"
    return location


def validate_schema(
    file_name: str,
    schema_name: str,
    data: object,
) -> list[str]:
    validator = load_validator(schema_name)
    schema_errors = sorted(
        validator.iter_errors(data),
        key=lambda error: format_json_path(file_name, error.absolute_path),
    )
    return [
        f"{format_json_path(file_name, error.absolute_path)}: {error.message}"
        for error in schema_errors
    ]


def validate_cross_file_consistency(documents: dict[str, object]) -> list[str]:
    errors = []
    step2 = documents.get("step2_datasets.json")
    if not isinstance(step2, dict):
        return errors

    datasets = step2.get("datasets")
    if not isinstance(datasets, list):
        return errors

    first_index_by_key = {}
    for index, dataset in enumerate(datasets):
        if not isinstance(dataset, dict) or "dataset_name" not in dataset:
            continue
        key = (dataset["dataset_name"], dataset.get("variant_name"))
        if key in first_index_by_key:
            first_index = first_index_by_key[key]
            errors.append(
                "step2_datasets.json.datasets"
                f"[{index}]: duplicate (dataset_name, variant_name) also used at index {first_index}: {key}"
            )
        else:
            first_index_by_key[key] = index

    return errors


def validate_benchmark(benchmark_dir: Path) -> list[str]:
    if not benchmark_dir.is_dir():
        return [f"not a directory: {benchmark_dir}"]

    errors = []
    documents = {}

    for file_name, schema_name in STEP_SCHEMAS.items():
        source_path = benchmark_dir / file_name
        if not source_path.exists():
            errors.append(f"{file_name}: missing required file")
            continue

        data, load_error = load_json(source_path)
        if load_error is not None:
            errors.append(f"{file_name}: {load_error}")
            continue

        documents[file_name] = data
        errors.extend(validate_schema(file_name, schema_name, data))

    if len(documents) == len(STEP_SCHEMAS):
        errors.extend(validate_cross_file_consistency(documents))

    return errors


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate Vibhasha benchmark source files."
    )
    parser.add_argument(
        "benchmark_dirs",
        nargs="*",
        type=Path,
        help="One or more benchmark directories to validate.",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Validate every directory under data/benchmarks.",
    )
    args = parser.parse_args(argv)

    if args.all and args.benchmark_dirs:
        parser.error("use either --all or explicit benchmark directories, not both")
    if not args.all and not args.benchmark_dirs:
        parser.error("provide at least one benchmark directory or use --all")

    return args


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if args.all:
        benchmark_dirs = sorted(
            (path for path in BENCHMARKS_DIR.iterdir() if path.is_dir()),
            key=lambda path: path.name,
        )
    else:
        benchmark_dirs = [path.resolve() for path in args.benchmark_dirs]

    total_errors = 0
    for benchmark_dir in benchmark_dirs:
        errors = validate_benchmark(benchmark_dir)
        if errors:
            print(f"\n[FAIL] {benchmark_dir.name} ({len(errors)} errors)")
            for error in errors:
                print(f"  - {error}")
            total_errors += len(errors)
        else:
            print(f"[OK] {benchmark_dir.name}")

    print(f"\nValidated: {len(benchmark_dirs)} benchmarks | Errors: {total_errors}")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.exit(main())
