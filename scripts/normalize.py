"""
Multilingual Evaluation Survey — Normalize V2 extraction data.

Reads all 51 V2 benchmark extractions + language_registry.json,
flattens to deduplicated (dataset, language) rows, and writes
normalized_benchmarks.json.

Design:
  - Primary key: (dataset, language) — each dataset appears once regardless
    of how many benchmarks include it.
  - Language metadata sourced from language_registry.json (Glottolog/CLDR/Joshi).
  - Dataset metadata sourced from step2_datasets.json (task_type, source).
  - Assessments sourced from step4_assessments.json (translated, native_annotators,
    culturally_grounded).
  - step3_languages.json is the authority for which languages are in which datasets.

Usage:
    python analysis/normalize.py
"""

import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mappings import TASK_CATEGORIES

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
V2_EXTRACTED_DIR = DATA_DIR / "benchmarks"
OUTPUT_DIR = DATA_DIR / "generated"
REGISTRY_PATH = OUTPUT_DIR / "language_registry.json"
OVERRIDES_PATH = DATA_DIR / "reference" / "language_metadata_overrides.json"
OUTPUT_PATH = OUTPUT_DIR / "normalized_benchmarks.json"
LOG_PATH = OUTPUT_DIR / "normalization_log.txt"

# ─── Seed aliases (same as registry) ─────────────────────────────────────────
# Duplicated here to avoid circular import; must stay in sync with registry.
SEED_ALIASES = {
    "isiZulu": "Zulu", "isiXhosa": "Xhosa", "chiShona": "Shona",
    "Setswana": "Tswana", "Xitsonga": "Tsonga", "Kikongo": "Kongo",
    "Kiswahili": "Swahili", "Sesotho": "Southern Sotho", "Kirundi": "Rundi",
    "Yorùbá": "Yoruba", "Éwé": "Ewe", "Ghomálá'": "Ghomala'",
    "Kabiyè": "Kabiye", "Oriya": "Odia", "Panjabi": "Punjabi",
    "Eastern Panjabi": "Punjabi", "Modern Standard Arabic": "Standard Arabic",
    "Simplified Chinese": "Chinese", "Traditional Chinese": "Chinese",
    "Chinese (Simplified)": "Chinese", "Chinese (Traditional)": "Chinese",
    "Norwegian Bokmål": "Norwegian", "Modern Greek": "Greek",
    "Mandarin": "Chinese", "Mandarin Chinese": "Chinese",
    "Filipino (Tagalog)": "Filipino", "Standard Latvian": "Latvian",
    "Standard Malay": "Malay", "Northern Uzbek": "Uzbek",
    "North Azerbaijani": "Azerbaijani", "Tosk Albanian": "Albanian",
    "Plateau Malagasy": "Malagasy", "Halh Mongolian": "Mongolian",
    "Standard Tibetan": "Tibetan", "West Central Oromo": "Oromo",
    "Western Persian": "Persian", "Southern Pashto": "Pashto",
    "Meiteilon (Manipuri)": "Manipuri", "Sorani Kurdish": "Central Kurdish",
    "Ganda": "Luganda", "Nyanja": "Chichewa", "Boro": "Bodo",
    "Ateso": "Teso", "Runyankole": "Runyankore", "Tamasheq": "Tamashek",
    "Luba-Kasai": "Ciluba", "Northern Ndebele": "Ndebele",
    "Nigerian Fulfulde": "Fulfulde", "Wixarika": "Huichol",
    "Rarámuri": "Tarahumara", "Mossi": "Mooré", "N'Ko": "NKo",
    "Haitian": "Haitian Creole", "Portuguese (Brazil)": "Brazilian Portuguese",
    "Spanish (Latin America)": "Latin American Spanish",
    "Serbian (Cyrillic)": "Serbian", "Serbian (Latin)": "Serbian",
    "Luo (Kenya)": "Luo", "Meerut": "Meeruti", "Bhatner": "Bhatnair",
    "Kurdish": "Central Kurdish", "Tagalog": "Filipino",
}


# ═══════════════════════════════════════════════════════════════════════════════
# Language Registry
# ═══════════════════════════════════════════════════════════════════════════════

def load_registry():
    """Load the complete language registry and build alias → canonical lookup."""
    with open(REGISTRY_PATH, encoding="utf-8") as f:
        data = json.load(f)
    registry = data["languages"]
    with open(OVERRIDES_PATH, encoding="utf-8") as f:
        external_aliases = json.load(f)["aliases"]

    alias_to_canonical = {}
    errors = []
    required_fields = (
        "iso_code",
        "glottocode",
        "family",
        "script",
        "continent",
        "joshi_level",
        "joshi_level_name",
    )
    for canonical, entry in registry.items():
        missing = [
            field for field in required_fields
            if entry.get(field) is None or entry.get(field) == "" or entry.get(field) == "Unknown"
        ]
        if missing:
            errors.append(f"{canonical}: missing {', '.join(missing)}")
        alias_to_canonical[canonical] = canonical
        for alias in entry.get("aliases", []):
            alias_to_canonical[alias] = canonical
    # Also add SEED_ALIASES
    for raw, canonical in SEED_ALIASES.items():
        alias_to_canonical[raw] = canonical
    for raw, canonical in external_aliases.items():
        alias_to_canonical[raw] = canonical

    if errors:
        raise ValueError(
            "Language registry is incomplete. Run `npm run update-evals` after resolving:\n  - "
            + "\n  - ".join(errors)
        )

    print(f"  Registry: {len(registry)} languages, {len(alias_to_canonical)} alias mappings")
    return registry, alias_to_canonical


# ═══════════════════════════════════════════════════════════════════════════════
# Task Categorization
# ═══════════════════════════════════════════════════════════════════════════════

def categorize_task(task_type_str):
    """Map a free-text task_type string to canonical category."""
    if not task_type_str:
        return "Other"
    tl = task_type_str.lower()
    for cat, keywords in TASK_CATEGORIES.items():
        for kw in keywords:
            if kw.startswith("r:"):
                if re.search(kw[2:], tl):
                    return cat
            else:
                if kw in tl:
                    return cat
    return "Other"


# ═══════════════════════════════════════════════════════════════════════════════
# Dataset Name Resolution (step2 ↔ step3/step4)
# ═══════════════════════════════════════════════════════════════════════════════

def build_step2_lookup(step2_data):
    """Build a lookup from display-name → step2 dataset info.

    For each dataset in step2, we index by:
    1. variant_name (if present)
    2. dataset_name
    3. Both lowercased
    """
    lookup = {}
    for ds in step2_data.get("datasets", []):
        dn = ds.get("dataset_name", "")
        vn = ds.get("variant_name")
        display = vn if vn else dn
        lookup[display] = ds
        lookup[dn] = ds
        if vn:
            lookup[vn] = ds
        # Also index lowercased
        lookup[display.lower()] = ds
        lookup[dn.lower()] = ds
        if vn:
            lookup[vn.lower()] = ds
    return lookup


# Language-code suffixes used in per-language dataset names (e.g. copa_ca, belebele_cat_Latn)
_LANG_SUFFIX_RE = re.compile(
    r"_(?:[a-z]{2,3})(?:_[A-Za-z]{4})?$"   # _xx or _xx_Xxxx (iso + optional script)
)

# Normalise a name for "skeleton" comparison: strip hyphens, underscores, spaces, lowercase.
_SKELETON_RE = re.compile(r"[-_ ]+")

# Explicit aliases for dataset stems that can't be resolved by substring or
# skeleton matching (e.g. IberoBench: step3 'flores_ca' → step2 'FLORES-200').
_STEM_ALIASES = {
    "flores": "flores-200",
    "paws":   "paws-x",
    "siqa":   "social iqa",
}


def _skeleton(name):
    """Lower-case name with hyphens/underscores/spaces removed."""
    return _SKELETON_RE.sub("", name).lower()


def _fuzzy_match_keys(ds_name, key_dict):
    """Fuzzy-match a step3 dataset name against a dict of step2/step4 keys.

    Strategies (tried in order):
    1. Substring: check if any key is a case-insensitive substring of ds_name
       (picks longest match — handles 'FLEURS (ASR)' → 'FLEURS').
    2. Suffix-strip + exact/case-insensitive: 'copa_ca' → 'copa' → 'COPA'.
    3. Suffix-strip + skeleton: 'eus_exams' → 'eusexams' matches 'EusExams'.
    4. Suffix-strip + stem alias: 'flores' → 'flores-200' via _STEM_ALIASES.
    """
    ds_lower = ds_name.lower()

    # Strategy 1: substring match (either direction, longest wins)
    best_key, best_len = None, 0
    for key in key_dict:
        kl = key.lower()
        if (kl in ds_lower or ds_lower in kl) and len(kl) > best_len:
            best_key, best_len = key, len(kl)
    if best_key and best_len >= 3:          # avoid trivial 1-2 char matches
        return key_dict[best_key]

    # Strategy 2: strip language suffix, then exact/case-insensitive
    stripped = _LANG_SUFFIX_RE.sub("", ds_name)
    if stripped != ds_name:
        if stripped in key_dict:
            return key_dict[stripped]
        sl = stripped.lower()
        for key, val in key_dict.items():
            if key.lower() == sl:
                return val

    # Strategy 3: skeleton comparison (remove -_SPACE, lowercase)
    stem = stripped if stripped != ds_name else ds_name
    stem_skel = _skeleton(stem)
    for key, val in key_dict.items():
        if _skeleton(key) == stem_skel:
            return val

    # Strategy 4: explicit stem alias lookup
    alias_target = _STEM_ALIASES.get(stem.lower())
    if alias_target:
        for key, val in key_dict.items():
            if key.lower() == alias_target:
                return val

    return None


def resolve_step2(ds_name, s2_lookup):
    """Try to find step2 metadata for a dataset name from step3."""
    # Exact or case-insensitive
    if ds_name in s2_lookup:
        return s2_lookup[ds_name]
    if ds_name.lower() in s2_lookup:
        return s2_lookup[ds_name.lower()]
    # Fuzzy
    return _fuzzy_match_keys(ds_name, s2_lookup)


def resolve_step4(ds_name, assessments):
    """Try to find step4 assessment for a dataset name from step3."""
    if ds_name in assessments:
        return assessments[ds_name]
    # Case-insensitive
    ds_lower = ds_name.lower()
    for key, val in assessments.items():
        if key.lower() == ds_lower:
            return val
    # Fuzzy
    return _fuzzy_match_keys(ds_name, assessments)


def parse_assessment_value(assessment_dict, field):
    """Extract a value from step4 assessment structure.

    Returns: bool, "partial", or None.
    """
    if not assessment_dict:
        return None
    field_data = assessment_dict.get(field)
    if not field_data:
        return None
    val = field_data.get("value")
    if val is None:
        return None
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        vl = val.lower().strip()
        if vl in ("true", "yes"):
            return True
        if vl in ("false", "no"):
            return False
        if vl == "partial":
            return "partial"
        if "insufficient" in vl:
            return None
    return None


def parse_assessment_confidence(assessment_dict, field):
    """Extract confidence from step4 assessment."""
    if not assessment_dict:
        return None
    field_data = assessment_dict.get(field)
    if not field_data:
        return None
    return field_data.get("confidence")


# ═══════════════════════════════════════════════════════════════════════════════
# Translation status labeling
# ═══════════════════════════════════════════════════════════════════════════════

def translate_status_label(is_translated, source_field):
    """Map translated bool/partial + source field to a readable label.

    Priority: step4 assessment > step2 source field.
    """
    if is_translated is True:
        return "Translated"
    if is_translated is False:
        return "Native"
    if is_translated == "partial":
        return "Partial"
    # Fall back to step2 source
    if source_field:
        sl = source_field.lower()
        if sl == "translated":
            return "Translated"
        if sl == "original":
            return "Native"
        if sl in ("adapted", "mixed"):
            return "Partial"
    return "Unknown"


# ═══════════════════════════════════════════════════════════════════════════════
# Main Pipeline
# ═══════════════════════════════════════════════════════════════════════════════

def process_all_benchmarks(registry, alias_to_canonical):
    """Process all V2 benchmarks, producing nested + flat output.

    Returns: (benchmarks_list, dataset_language_rows, log_lines)
    """
    benchmarks_list = []
    # Keyed by (dataset_display_name, canonical_language_name)
    seen_dl_pairs = {}
    log_lines = []
    stats = Counter()

    for bm_dir in sorted(V2_EXTRACTED_DIR.iterdir(), key=lambda path: path.name):
        if not bm_dir.is_dir():
            continue

        bm_name = bm_dir.name
        step1_path = bm_dir / "step1_identity.json"
        step2_path = bm_dir / "step2_datasets.json"
        step3_path = bm_dir / "step3_languages.json"
        step4_path = bm_dir / "step4_assessments.json"

        if not step3_path.exists():
            log_lines.append(f"SKIP: {bm_name} — missing step3")
            continue

        # Load files
        step1 = json.loads(step1_path.read_text(encoding="utf-8")) if step1_path.exists() else {}
        step2 = json.loads(step2_path.read_text(encoding="utf-8")) if step2_path.exists() else {}
        step3 = json.loads(step3_path.read_text(encoding="utf-8"))
        step4 = json.loads(step4_path.read_text(encoding="utf-8")) if step4_path.exists() else {}

        assessments = step4.get("assessments", {})
        s2_lookup = build_step2_lookup(step2)
        languages = step3.get("languages", {})

        # Benchmark-level metadata
        bm_year = step1.get("year")
        bm_type = step1.get("benchmark_type", "unknown")
        bm_total_langs = step1.get("total_languages_claimed", len(languages))
        bm_desc = step1.get("brief_description", "")

        # Collect datasets for this benchmark
        bm_datasets = []
        s2_miss = set()
        s4_miss = set()

        # Collect all unique datasets referenced in step3
        all_dataset_names = set()
        for lang_info in languages.values():
            for ds_name in lang_info.get("datasets_present_in", []):
                all_dataset_names.add(ds_name)

        for ds_name in sorted(all_dataset_names):
            # Resolve step2 metadata
            s2_entry = resolve_step2(ds_name, s2_lookup)
            if not s2_entry:
                s2_miss.add(ds_name)

            # Resolve step4 assessment
            s4_entry = resolve_step4(ds_name, assessments)
            if not s4_entry:
                s4_miss.add(ds_name)

            # Extract task_type from step2
            task_type = s2_entry.get("task_type", "") if s2_entry else ""
            task_category = categorize_task(task_type)
            source = s2_entry.get("source", "") if s2_entry else ""
            is_new = s2_entry.get("is_new_in_this_paper", None) if s2_entry else None

            # Extract assessments from step4
            is_translated = parse_assessment_value(s4_entry, "translated")
            native_annotators = parse_assessment_value(s4_entry, "native_annotators")
            culturally_grounded = parse_assessment_value(s4_entry, "culturally_grounded")

            # Collect languages in this dataset
            ds_languages = []
            for lang_raw_name, lang_info in languages.items():
                if ds_name in lang_info.get("datasets_present_in", []):
                    ds_languages.append(lang_raw_name)

            # Build per-dataset record for the nested view
            bm_datasets.append({
                "dataset_name": ds_name,
                "task_type": task_type,
                "task_category": task_category,
                "source": source,
                "translated": translate_status_label(is_translated, source),
                "translated_raw": is_translated,
                "native_annotators": native_annotators,
                "culturally_grounded": culturally_grounded,
                "culturally_grounded_raw": culturally_grounded,
                "is_new_in_this_paper": is_new,
                "languages": sorted(ds_languages),
                "num_languages": len(ds_languages),
            })

            # Emit flat (dataset, language) rows
            for lang_raw_name in ds_languages:
                canonical = alias_to_canonical.get(lang_raw_name, lang_raw_name)
                reg_entry = registry.get(canonical)
                if reg_entry is None:
                    raise ValueError(
                        f"{bm_name}/step3_languages.json: language {lang_raw_name!r} "
                        f"(canonical name {canonical!r}) is missing from "
                        "data/generated/language_registry.json. Resolve it in "
                        "data/reference/language_metadata_overrides.json and run "
                        "`npm run update-evals`."
                    )

                dl_key = (ds_name, canonical)

                if dl_key in seen_dl_pairs:
                    # Deduplicate: just add this benchmark to the list
                    seen_dl_pairs[dl_key]["benchmarks_containing"].add(bm_name)
                    stats["dedup_skip"] += 1
                    continue

                # Language metadata from registry
                iso_code = reg_entry["iso_code"]
                family = reg_entry["family"]
                script = reg_entry["script"]
                continent = reg_entry["continent"]
                joshi_level = reg_entry["joshi_level"]
                joshi_level_name = reg_entry["joshi_level_name"]
                glottocode = reg_entry["glottocode"]

                row = {
                    "dataset": ds_name,
                    "language": canonical,
                    "language_raw": lang_raw_name,
                    "iso_code": iso_code,
                    "glottocode": glottocode,
                    "family": family,
                    "script": script,
                    "continent": continent,
                    "joshi_level": joshi_level,
                    "joshi_level_name": joshi_level_name,
                    "task_type": task_type,
                    "task_category": task_category,
                    "source": source,
                    "translated": translate_status_label(is_translated, source),
                    "translated_raw": is_translated,
                    "native_annotators": native_annotators,
                    "culturally_grounded": culturally_grounded,
                    "is_new_in_this_paper": is_new,
                    "home_benchmark": bm_name,
                    "benchmarks_containing": {bm_name},
                }
                if reg_entry and reg_entry.get("dialect_of"):
                    row["dialect_of"] = reg_entry["dialect_of"]
                seen_dl_pairs[dl_key] = row
                stats["rows_created"] += 1

        if s2_miss:
            log_lines.append(f"  {bm_name}: step2 miss for {len(s2_miss)} datasets: {sorted(s2_miss)}")
        if s4_miss:
            log_lines.append(f"  {bm_name}: step4 miss for {len(s4_miss)} datasets: {sorted(s4_miss)}")

        benchmarks_list.append({
            "benchmark": bm_name,
            "benchmark_type": bm_type,
            "year": bm_year,
            "brief_description": bm_desc,
            "total_languages_claimed": bm_total_langs,
            "total_languages_resolved": len(set(
                alias_to_canonical.get(ln, ln) for ln in languages
            )),
            "total_datasets": len(bm_datasets),
            "datasets": bm_datasets,
        })
        stats["benchmarks"] += 1

    # Finalize rows: convert sets to sorted lists
    flat_rows = []
    for dl_key in sorted(seen_dl_pairs.keys()):
        row = seen_dl_pairs[dl_key]
        row["benchmarks_containing"] = sorted(row["benchmarks_containing"])
        row["num_benchmarks"] = len(row["benchmarks_containing"])
        flat_rows.append(row)

    print(f"  Stats: {dict(stats)}")
    return benchmarks_list, flat_rows, log_lines


def build_summary(benchmarks_list, flat_rows):
    """Build benchmark-level summary rows."""
    summary = []
    for bm in benchmarks_list:
        n_translated = sum(1 for ds in bm["datasets"] if ds["translated"] == "Translated")
        n_native = sum(1 for ds in bm["datasets"] if ds["translated"] == "Native")
        n_grounded = sum(1 for ds in bm["datasets"] if ds["culturally_grounded"] is True)

        summary.append({
            "benchmark": bm["benchmark"],
            "benchmark_type": bm["benchmark_type"],
            "year": bm["year"],
            "num_languages_claimed": bm["total_languages_claimed"],
            "num_languages_resolved": bm["total_languages_resolved"],
            "num_datasets": bm["total_datasets"],
            "n_datasets_translated": n_translated,
            "n_datasets_native": n_native,
            "n_datasets_grounded": n_grounded,
        })
    return summary


def write_log(log_lines, flat_rows, benchmarks_list):
    """Write normalization log."""
    lines = []
    lines.append("=" * 70)
    lines.append("  V2 NORMALIZATION LOG")
    lines.append(f"  Generated: {datetime.now(timezone.utc).isoformat()}")
    lines.append("=" * 70)
    lines.append("")
    lines.append(f"  Benchmarks processed: {len(benchmarks_list)}")
    lines.append(f"  Flat (dataset, language) rows: {len(flat_rows)}")

    # Unique counts
    unique_langs = set(r["language"] for r in flat_rows)
    unique_ds = set(r["dataset"] for r in flat_rows)
    lines.append(f"  Unique languages: {len(unique_langs)}")
    lines.append(f"  Unique datasets: {len(unique_ds)}")
    lines.append("")

    # Task category distribution
    task_counts = Counter(r["task_category"] for r in flat_rows)
    lines.append("  Task category distribution (dataset-language rows):")
    for cat, n in task_counts.most_common():
        lines.append(f"    {cat}: {n}")
    lines.append("")

    # Translation status distribution
    trans_counts = Counter(r["translated"] for r in flat_rows)
    lines.append("  Translation status:")
    for status, n in trans_counts.most_common():
        lines.append(f"    {status}: {n}")
    lines.append("")

    # Dataset resolution issues
    if log_lines:
        lines.append("-" * 70)
        lines.append("  DATASET NAME RESOLUTION ISSUES")
        lines.append("-" * 70)
        for line in log_lines:
            lines.append(line)
    else:
        lines.append("  (no dataset name resolution issues)")

    lines.append("")
    lines.append("=" * 70)

    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  Log: {LOG_PATH}")


def main():
    print("=" * 60)
    print("  Multilingual Evaluation Survey — Normalize V2")
    print("=" * 60)

    print("\n[1/4] Loading language registry...")
    try:
        registry, alias_to_canonical = load_registry()
    except (OSError, json.JSONDecodeError, ValueError) as error:
        print(f"\n[FAIL] {error}", file=sys.stderr)
        return 1

    print("\n[2/4] Processing benchmarks...")
    try:
        benchmarks_list, flat_rows, log_lines = process_all_benchmarks(
            registry, alias_to_canonical
        )
    except ValueError as error:
        print(f"\n[FAIL] {error}", file=sys.stderr)
        return 1

    print("\n[3/4] Building summary...")
    summary = build_summary(benchmarks_list, flat_rows)

    # Assemble output
    unique_langs = set(r["language"] for r in flat_rows)
    unique_ds = set(r["dataset"] for r in flat_rows)
    output = {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "schema_version": "2.0",
            "design_principle": "Flat (dataset, language) rows — deduplicated across benchmarks.",
            "num_benchmarks": len(benchmarks_list),
            "num_unique_languages": len(unique_langs),
            "num_unique_datasets": len(unique_ds),
            "num_dataset_language_rows": len(flat_rows),
        },
        "benchmarks": benchmarks_list,
        "dataset_language_rows": flat_rows,
        "summary": summary,
    }

    print("\n[4/4] Writing output...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"  Output: {OUTPUT_PATH}")

    write_log(log_lines, flat_rows, benchmarks_list)

    m = output["metadata"]
    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Benchmarks:             {m['num_benchmarks']}")
    print(f"  Unique languages:       {m['num_unique_languages']}")
    print(f"  Unique datasets:        {m['num_unique_datasets']}")
    print(f"  (dataset, language) rows: {m['num_dataset_language_rows']}")
    print(f"{'=' * 60}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
