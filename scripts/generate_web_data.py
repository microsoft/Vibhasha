"""
Generate compact JSON data for the Vibhasha Evals Dashboard (V2).
Reads normalized_benchmarks.json and produces a web-friendly summary.

The V2 normalized data uses flat (dataset, language) rows with richer fields.
The web payload keeps benchmark suites, datasets, languages, and
dataset-language analyses as separate concepts.
"""

import json
from collections import defaultdict, Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SRC = DATA_DIR / "generated" / "normalized_benchmarks.json"
CITATIONS = DATA_DIR / "benchmark_citations.json"
DST = ROOT / "public" / "data" / "benchmark_data.json"


def run():
    with open(SRC, encoding="utf-8") as f:
        raw = json.load(f)

    rows = raw["dataset_language_rows"]
    benchmarks_raw = raw["benchmarks"]         # nested (benchmark → datasets → languages)
    summary_list = raw["summary"]              # per-benchmark aggregate counts

    # Load citation mapping
    citations = {}
    if CITATIONS.exists():
        with open(CITATIONS, encoding="utf-8") as f:
            cdata = json.load(f)
        citations = cdata.get("benchmarks", {})

    # Build quick lookup: benchmark name → summary row
    summary_map = {s["benchmark"]: s for s in summary_list}

    # ---------- 1. Benchmark summaries ----------
    benchmark_summaries = []
    for b in benchmarks_raw:
        bname = b["benchmark"]
        sm = summary_map.get(bname, {})
        benchmark_datasets = []
        families = set()
        scripts = set()
        continents = set()
        task_cats = set()
        all_native = True

        for ds in b.get("datasets", []):
            benchmark_datasets.append({
                "name": ds["dataset_name"],
                "task_type": ds.get("task_type"),
                "task_category": ds.get("task_category"),
                "translated": ds.get("translated", "Unknown"),
                "culturally_grounded": ds.get("culturally_grounded", False),
                "num_languages": ds.get("num_languages", len(ds.get("languages", []))),
            })
            for row in _rows_for(rows, bname, ds["dataset_name"]):
                if row.get("family"):
                    families.add(row["family"])
                if row.get("script"):
                    scripts.add(row["script"])
                if row.get("continent"):
                    continents.add(row["continent"])
                if row.get("task_category"):
                    task_cats.add(row["task_category"])
            if ds.get("native_annotators") is not True:
                all_native = False

        cite = citations.get(bname, {})

        benchmark_summaries.append({
            "name": bname,
            "num_languages": sm.get("num_languages_resolved", b.get("total_languages_resolved", 0)),
            "num_datasets": sm.get("num_datasets", b.get("total_datasets", 0)),
            "n_translated": sm.get("n_datasets_translated", 0),
            "n_native": sm.get("n_datasets_native", 0),
            "n_grounded": sm.get("n_datasets_grounded", 0),
            "all_native_annotators": all_native,
            "benchmark_type": b.get("benchmark_type", ""),
            "year": b.get("year"),
            "description": b.get("brief_description", ""),
            "families": sorted(families),
            "scripts": sorted(scripts),
            "continents": sorted(continents),
            "task_categories": sorted(task_cats),
            "datasets": sorted(benchmark_datasets, key=lambda dataset: dataset["name"].casefold()),
            "citation": {
                "paper_title": cite.get("paper_title", ""),
                "authors": cite.get("authors", ""),
                "year": cite.get("year"),
                "venue": cite.get("venue", ""),
                "paper_url": cite.get("paper_url", ""),
                "arxiv_id": cite.get("arxiv_id", ""),
            } if cite else None,
        })

    # ---------- 2. Dataset summaries ----------
    dataset_index = defaultdict(lambda: {
        "languages": set(),
        "benchmarks": set(),
        "task_types": set(),
        "task_categories": set(),
        "sources": set(),
        "translation_statuses": set(),
        "culturally_grounded": False,
    })

    for r in rows:
        dataset = dataset_index[r["dataset"]]
        dataset["languages"].add(r["language"])
        dataset["benchmarks"].update(_benchmarks_containing(r))
        if r.get("task_type"):
            dataset["task_types"].add(r["task_type"])
        if r.get("task_category"):
            dataset["task_categories"].add(r["task_category"])
        if r.get("source"):
            dataset["sources"].add(r["source"])
        if r.get("translated"):
            dataset["translation_statuses"].add(r["translated"])
        if r.get("culturally_grounded"):
            dataset["culturally_grounded"] = True

    dataset_summaries = []
    for name, dataset in sorted(dataset_index.items(), key=lambda item: item[0].casefold()):
        dataset_summaries.append({
            "name": name,
            "num_languages": len(dataset["languages"]),
            "num_benchmarks": len(dataset["benchmarks"]),
            "benchmarks": sorted(dataset["benchmarks"]),
            "task_types": sorted(dataset["task_types"]),
            "task_categories": sorted(dataset["task_categories"]),
            "sources": sorted(dataset["sources"]),
            "translation_statuses": sorted(dataset["translation_statuses"]),
            "culturally_grounded": dataset["culturally_grounded"],
        })

    expected_dataset_count = raw.get("metadata", {}).get("num_unique_datasets")
    if expected_dataset_count is not None and expected_dataset_count != len(dataset_summaries):
        raise ValueError(
            "Generated dataset count does not match normalized metadata: "
            f"{len(dataset_summaries)} != {expected_dataset_count}"
        )

    # ---------- 3. Language index ----------
    # Build from flat rows — group by canonical language name
    lang_index = defaultdict(lambda: {
        "family": None, "script": None, "resource_level": None,
        "joshi_level": None, "joshi_level_name": None, "continents": set(),
        "benchmarks": {}, "datasets": [], "tasks": set(),
        "task_categories": set(), "translated_count": 0, "native_count": 0,
        "grounded_count": 0, "iso_code": None, "glottocode": None,
        "dialect_of": None, "_dataset_set": set(),
    })

    for r in rows:
        lang = r["language"]
        entry = lang_index[lang]
        # Fill static fields from first encounter
        if entry["family"] is None:
            entry["family"] = r.get("family")
            entry["script"] = r.get("script")
            entry["resource_level"] = r.get("joshi_level_name")
            entry["joshi_level"] = r.get("joshi_level")
            entry["joshi_level_name"] = r.get("joshi_level_name")
            entry["iso_code"] = r.get("iso_code")
            entry["glottocode"] = r.get("glottocode")
        if r.get("continent"):
            entry["continents"].add(r["continent"])
        if r.get("task_type"):
            entry["tasks"].add(r["task_type"])
        if r.get("task_category"):
            entry["task_categories"].add(r["task_category"])

        dataset_name = r["dataset"]
        benchmarks = _benchmarks_containing(r)
        if dataset_name not in entry["_dataset_set"]:
            entry["_dataset_set"].add(dataset_name)
            entry["datasets"].append({
                "dataset": dataset_name,
                "benchmarks": benchmarks,
                "task_type": r.get("task_type"),
                "task_category": r.get("task_category"),
                "translated": r.get("translated", "Unknown"),
                "culturally_grounded": r.get("culturally_grounded", False),
            })

            for benchmark in benchmarks:
                benchmark_entry = entry["benchmarks"].setdefault(benchmark, {
                    "benchmark": benchmark,
                    "_datasets": set(),
                    "native_count": 0,
                    "translated_count": 0,
                    "partial_count": 0,
                    "grounded_count": 0,
                })
                benchmark_entry["_datasets"].add(dataset_name)
                translated = r.get("translated", "Unknown")
                if translated == "Native":
                    benchmark_entry["native_count"] += 1
                elif translated == "Translated":
                    benchmark_entry["translated_count"] += 1
                elif translated == "Partial":
                    benchmark_entry["partial_count"] += 1
                if r.get("culturally_grounded"):
                    benchmark_entry["grounded_count"] += 1

        # Count translation/grounding per unique (language, dataset) row.
        t = r.get("translated", "Unknown")
        if t == "Native":
            entry["native_count"] += 1
        elif t == "Translated":
            entry["translated_count"] += 1
        if r.get("culturally_grounded"):
            entry["grounded_count"] += 1

    # Convert to sorted list
    languages_list = []
    for name, entry in sorted(lang_index.items()):
        benchmarks = []
        for benchmark_name, benchmark in sorted(entry["benchmarks"].items()):
            num_datasets = len(benchmark["_datasets"])
            if benchmark["native_count"] == num_datasets:
                translation_status = "Native"
            elif benchmark["translated_count"] == num_datasets:
                translation_status = "Translated"
            elif benchmark["native_count"] or benchmark["translated_count"] or benchmark["partial_count"]:
                translation_status = "Mixed"
            else:
                translation_status = "Unknown"
            benchmarks.append({
                "benchmark": benchmark_name,
                "num_datasets": num_datasets,
                "native_count": benchmark["native_count"],
                "translated_count": benchmark["translated_count"],
                "partial_count": benchmark["partial_count"],
                "grounded_count": benchmark["grounded_count"],
                "translation_status": translation_status,
            })

        languages_list.append({
            "name": name,
            "family": entry["family"],
            "script": entry["script"],
            "resource_level": entry["resource_level"],
            "joshi_level": entry["joshi_level"],
            "joshi_level_name": entry["joshi_level_name"],
            "iso_code": entry["iso_code"],
            "glottocode": entry["glottocode"],
            "dialect_of": entry.get("dialect_of"),
            "continents": sorted(entry["continents"]),
            "num_benchmarks": len(benchmarks),
            "num_datasets": len(entry["datasets"]),
            "benchmarks": benchmarks,
            "tasks": sorted(entry["tasks"]),
            "task_categories": sorted(entry["task_categories"]),
            "translated_count": entry["translated_count"],
            "native_count": entry["native_count"],
            "grounded_count": entry["grounded_count"],
        })

    # ---------- 4. Distributions ----------
    bench_counts = Counter(l["num_benchmarks"] for l in languages_list)
    long_tail = [{"count": k, "languages": v} for k, v in sorted(bench_counts.items())]

    family_counter = Counter(l["family"] for l in languages_list if l["family"])
    family_dist = [{"family": f, "count": c} for f, c in family_counter.most_common()]

    script_counter = Counter(l["script"] for l in languages_list if l["script"])
    script_dist = [{"script": s, "count": c} for s, c in script_counter.most_common()]

    rl_order = ["Winners", "Underdogs", "Rising Stars", "Hopefuls", "Scraping-Bys", "Left-Behinds"]
    rl_counter = Counter(l["resource_level"] for l in languages_list if l["resource_level"])
    resource_dist = [{"level": r, "count": rl_counter.get(r, 0)} for r in rl_order]

    cont_counter = Counter()
    for lang in languages_list:
        for c in lang["continents"]:
            cont_counter[c] += 1
    continent_dist = [{"continent": c, "count": n} for c, n in cont_counter.most_common()]

    tc_counter = Counter()
    for lang in languages_list:
        for tc in lang["task_categories"]:
            tc_counter[tc] += 1
    task_dist = [{"category": tc, "count": n} for tc, n in tc_counter.most_common()]

    # ---------- 5. Cross-tabulations (from flat rows) ----------
    trans_by_region = defaultdict(lambda: {"native": 0, "translated": 0, "unknown": 0, "total": 0})
    cg_by_region = defaultdict(lambda: {"grounded": 0, "not_grounded": 0, "total": 0})
    task_by_region = defaultdict(lambda: defaultdict(int))

    for r in rows:
        cont = r.get("continent")
        if not cont:
            continue
        # Translation
        trans_by_region[cont]["total"] += 1
        t = r.get("translated", "Unknown")
        if t == "Native":
            trans_by_region[cont]["native"] += 1
        elif t == "Translated":
            trans_by_region[cont]["translated"] += 1
        else:
            trans_by_region[cont]["unknown"] += 1
        # Cultural grounding
        cg_by_region[cont]["total"] += 1
        if r.get("culturally_grounded"):
            cg_by_region[cont]["grounded"] += 1
        else:
            cg_by_region[cont]["not_grounded"] += 1
        # Task × region
        tc = r.get("task_category")
        if tc:
            task_by_region[cont][tc] += 1

    translation_by_region = [
        {"region": reg, **v} for reg, v in sorted(trans_by_region.items(), key=lambda x: -x[1]["total"])
    ]
    grounding_by_region = [
        {"region": reg, **v} for reg, v in sorted(cg_by_region.items(), key=lambda x: -x[1]["total"])
    ]
    task_region_matrix = {reg: dict(cats) for reg, cats in task_by_region.items()}

    # ---------- 6. Insights ----------
    total_langs = len(languages_list)
    single_bench = sum(1 for l in languages_list if l["num_benchmarks"] == 1)
    pct_single = round(100 * single_bench / total_langs, 1)

    total_translated = sum(1 for r in rows if r.get("translated") == "Translated")
    total_native = sum(1 for r in rows if r.get("translated") == "Native")
    total_partial = sum(1 for r in rows if r.get("translated") == "Partial")
    total_grounded = sum(1 for r in rows if r.get("culturally_grounded"))
    total_known = total_translated + total_native + total_partial

    insights = {
        "total_benchmarks": len(benchmarks_raw),
        "total_datasets": len(dataset_summaries),
        "total_dataset_language_entries": len(rows),
        "total_languages": total_langs,
        "total_families": len(family_counter),
        "total_scripts": len(script_counter),
        "total_continents": len(cont_counter),
        "total_task_categories": len(tc_counter),
        "single_benchmark_languages": single_bench,
        "single_benchmark_pct": pct_single,
        "total_translated_entries": total_translated,
        "total_native_entries": total_native,
        "total_grounded_entries": total_grounded,
        "pct_translated": round(100 * total_translated / max(total_known, 1), 1),
        "pct_native": round(100 * total_native / max(total_known, 1), 1),
    }

    # ---------- Output ----------
    output = {
        "metadata": raw["metadata"],
        "insights": insights,
        "benchmarks": benchmark_summaries,
        "datasets": dataset_summaries,
        "languages": languages_list,
        "distributions": {
            "long_tail": long_tail,
            "families": family_dist,
            "scripts": script_dist,
            "resource_levels": resource_dist,
            "continents": continent_dist,
            "task_categories": task_dist,
        },
        "cross_tabs": {
            "translation_by_region": translation_by_region,
            "grounding_by_region": grounding_by_region,
            "task_by_region": task_region_matrix,
        },
    }

    DST.parent.mkdir(parents=True, exist_ok=True)
    with open(DST, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Wrote {DST}")
    print(f"  {len(benchmark_summaries)} benchmarks")
    print(f"  {len(dataset_summaries)} unique datasets")
    print(f"  {len(languages_list)} languages")
    print(f"  {len(rows)} dataset-language rows processed")
    print(f"  File size: {DST.stat().st_size / 1024:.1f} KB")


def _benchmarks_containing(row):
    """Return every benchmark suite that includes a normalized dataset row."""
    benchmarks = row.get("benchmarks_containing") or [row["home_benchmark"]]
    return sorted(set(benchmarks))


def _rows_for(rows, benchmark, dataset):
    """Get dataset rows associated with a benchmark suite."""
    return [
        row for row in rows
        if row["dataset"] == dataset and benchmark in _benchmarks_containing(row)
    ]


if __name__ == "__main__":
    run()
