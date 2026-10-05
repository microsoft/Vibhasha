import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build_language_registry
import normalize
import validate_submission


def complete_entry(**changes):
    entry = {
        "glottocode": "test1234",
        "iso_code": "tst",
        "family": "Test family",
        "script": "Latin",
        "continent": "Test region",
        "joshi_level": 0,
        "joshi_level_name": "Left-Behinds",
        "joshi_source": "metadata_override",
    }
    entry.update(changes)
    return entry


class LanguageMetadataValidationTests(unittest.TestCase):
    def validate(
        self,
        *,
        resolved=None,
        unresolved=None,
        ambiguous=None,
        duplicates=None,
        overrides=None,
    ):
        resolved = resolved or {"Test": complete_entry()}
        overrides = overrides or {
            "aliases": {},
            "languages": {},
            "duplicate_glottocode_exceptions": {},
        }
        return build_language_registry.validate_metadata(
            set(resolved) | set(unresolved or []) | set(ambiguous or {}),
            resolved,
            unresolved or [],
            ambiguous or {},
            duplicates or {},
            overrides,
            {"Test": {"ExampleBench"}},
        )

    def test_complete_metadata_passes(self):
        self.assertEqual(self.validate(), [])

    def test_unresolved_language_fails_with_action(self):
        errors = self.validate(resolved={}, unresolved=["Test"])
        self.assertIn("No exact or unambiguous", errors[0]["problem"])
        self.assertIn("language_metadata_overrides.json", errors[0]["action"])

    def test_ambiguous_language_lists_candidates(self):
        errors = self.validate(resolved={}, ambiguous={"Test": ["test1234", "test5678"]})
        self.assertIn("test1234, test5678", errors[0]["problem"])

    def test_missing_secondary_metadata_fails(self):
        errors = self.validate(resolved={"Test": complete_entry(script=None)})
        self.assertTrue(any("Missing a script" in error["problem"] for error in errors))

    def test_unreviewed_joshi_fallback_fails(self):
        errors = self.validate(
            resolved={"Test": complete_entry(joshi_source="fallback")}
        )
        self.assertTrue(any("No Joshi taxonomy match" in error["problem"] for error in errors))

    def test_explicit_level_zero_passes(self):
        entry = complete_entry(joshi_level=0, joshi_source="metadata_override")
        self.assertEqual(self.validate(resolved={"Test": entry}), [])

    def test_unreviewed_duplicate_glottocode_fails(self):
        resolved = {
            "Test": complete_entry(),
            "Test Variant": complete_entry(),
        }
        errors = self.validate(
            resolved=resolved,
            duplicates={"test1234": ["Test", "Test Variant"]},
        )
        self.assertTrue(any("Unreviewed duplicate" in error["problem"] for error in errors))

    def test_reviewed_duplicate_glottocode_passes(self):
        resolved = {
            "Test": complete_entry(),
            "Test Variant": complete_entry(),
        }
        overrides = {
            "aliases": {},
            "languages": {},
            "duplicate_glottocode_exceptions": {
                "test1234": {
                    "languages": ["Test", "Test Variant"],
                    "rationale": "Intentional benchmark variants.",
                }
            },
        }
        self.assertEqual(
            self.validate(
                resolved=resolved,
                duplicates={"test1234": ["Test", "Test Variant"]},
                overrides=overrides,
            ),
            [],
        )


class NormalizationGuardTests(unittest.TestCase):
    def test_incomplete_registry_fails(self):
        registry = {
            "languages": {
                "Test": {
                    "iso_code": None,
                    "glottocode": "test1234",
                    "family": "Test family",
                    "script": "Latin",
                    "continent": "Test region",
                    "joshi_level": 0,
                    "joshi_level_name": "Left-Behinds",
                    "aliases": [],
                }
            }
        }
        overrides = {
            "aliases": {},
            "languages": {},
            "duplicate_glottocode_exceptions": {},
        }
        with tempfile.TemporaryDirectory() as directory:
            registry_path = Path(directory) / "registry.json"
            overrides_path = Path(directory) / "overrides.json"
            registry_path.write_text(json.dumps(registry), encoding="utf-8")
            overrides_path.write_text(json.dumps(overrides), encoding="utf-8")
            with (
                patch.object(normalize, "REGISTRY_PATH", registry_path),
                patch.object(normalize, "OVERRIDES_PATH", overrides_path),
            ):
                with self.assertRaisesRegex(ValueError, "missing iso_code"):
                    normalize.load_registry()


class CrossFileConsistencyTests(unittest.TestCase):
    def test_unknown_dataset_reference_fails(self):
        documents = {
            "step1_identity.json": {
                "benchmark_type": "single_dataset",
                "total_datasets": 1,
                "dataset_names": ["Missing"],
            },
            "step2_datasets.json": {
                "datasets": [
                    {
                        "dataset_name": "Known",
                        "variant_name": None,
                    }
                ]
            },
            "step3_languages.json": {"languages": {}},
            "step4_assessments.json": {"assessments": {}},
            "step5_cultural.json": {"cultural_flags": {}},
        }
        errors = validate_submission.validate_cross_file_consistency(documents)
        self.assertTrue(any("does not resolve" in error for error in errors))

    def test_partial_aggregation_allows_unenumerated_datasets(self):
        documents = {
            "step1_identity.json": {
                "benchmark_type": "aggregation",
                "total_datasets": 500,
                "dataset_names": ["Unenumerated"],
            },
            "step2_datasets.json": {
                "datasets": [
                    {
                        "dataset_name": "Representative",
                        "variant_name": None,
                    }
                ]
            },
            "step3_languages.json": {"constructed_benchmarks": {}},
            "step4_assessments.json": {"assessments": {}},
            "step5_cultural.json": {"cultural_flags": {}},
        }
        self.assertEqual(
            validate_submission.validate_cross_file_consistency(documents),
            [],
        )


if __name__ == "__main__":
    unittest.main()
