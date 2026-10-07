"""
Validate benchmark sources and regenerate every derived evals data artifact.

Use --check in CI to verify that committed generated files match their sources.
Check mode restores the working tree after comparison.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PIPELINE = [
    ROOT / "scripts" / "validate_submission.py",
    ROOT / "scripts" / "build_language_registry.py",
    ROOT / "scripts" / "normalize.py",
    ROOT / "scripts" / "generate_web_data.py",
]
GENERATED_FILES = [
    ROOT / "data" / "generated" / "language_registry.json",
    ROOT / "data" / "generated" / "normalization_log.txt",
    ROOT / "data" / "generated" / "normalized_benchmarks.json",
    ROOT / "data" / "generated" / "registry_review.txt",
    ROOT / "public" / "data" / "benchmark_data.json",
]


def run_pipeline() -> None:
    for script in PIPELINE:
        command = [sys.executable, str(script)]
        if script.name == "validate_submission.py":
            command.append("--all")
        print(f"\n==> {' '.join(command)}", flush=True)
        subprocess.run(command, cwd=ROOT, check=True)


def stable_content(path: Path, content: bytes | None) -> str | None:
    if content is None:
        return None

    text = content.decode("utf-8")
    if path.suffix == ".json":
        document = json.loads(text)
        metadata = document.get("metadata")
        if isinstance(metadata, dict):
            metadata.pop("generated_at", None)
        return json.dumps(
            document,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )

    return "\n".join(
        line for line in text.splitlines()
        if not line.strip().startswith("Generated:")
    )


def restore_files(snapshots: dict[Path, bytes | None]) -> None:
    for path, content in snapshots.items():
        if content is None:
            if path.exists():
                path.unlink()
        else:
            path.write_bytes(content)


def check_generated_files() -> list[Path]:
    snapshots = {
        path: path.read_bytes() if path.exists() else None
        for path in GENERATED_FILES
    }
    expected = {
        path: stable_content(path, content)
        for path, content in snapshots.items()
    }

    try:
        run_pipeline()
        return [
            path
            for path in GENERATED_FILES
            if stable_content(path, path.read_bytes() if path.exists() else None)
            != expected[path]
        ]
    finally:
        restore_files(snapshots)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Regenerate all data used by the /evals dashboard."
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Fail when generated data is stale, without changing the working tree.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        if not args.check:
            run_pipeline()
            print("\nAll /evals data artifacts were regenerated.")
            return 0

        stale_files = check_generated_files()
    except subprocess.CalledProcessError as error:
        print(
            f"\nEvals data pipeline failed while running: {' '.join(error.cmd)}",
            file=sys.stderr,
        )
        return error.returncode or 1

    if stale_files:
        print("\nGenerated /evals data is stale. Run `npm run update-evals` and commit:")
        for path in stale_files:
            print(f"  - {path.relative_to(ROOT)}")
        return 1

    print("\nGenerated /evals data matches the benchmark sources.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
