"""
Generate compact JSON data for the Vibhasha Evals Dashboard (V2).
Reads normalized_benchmarks.json and produces a web-friendly summary.

The V2 normalized data uses flat (dataset, language) rows with richer fields.
Output schema is backward-compatible with V1 so the EvalsDashboard still works.
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
        families = set()
        scripts = set()
        continents = set()
        task_cats = set()
        all_native = True

        for ds in b.get("datasets", []):
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
            "num_tasks": sm.get("num_datasets", b.get("total_datasets", 0)),
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
            "citation": {
                "paper_title": cite.get("paper_title", ""),
                "authors": cite.get("authors", ""),
                "year": cite.get("year"),
                "venue": cite.get("venue", ""),
                "paper_url": cite.get("paper_url", ""),
                "arxiv_id": cite.get("arxiv_id", ""),
            } if cite else None,
        })

    # ---------- 2. Language index ----------
    # Build from flat rows — group by canonical language name
    lang_index = defaultdict(lambda: {
        "family": None, "script": None, "resource_level": None,
        "joshi_level": None, "joshi_level_name": None,
        "continents": set(), "benchmarks": [], "tasks": set(),
        "task_categories": set(), "translated_count": 0, "native_count": 0,
        "grounded_count": 0, "iso_code": None, "glottocode": None,
        "dialect_of": None, "_bench_set": set(),
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

        # Track per-benchmark (deduplicate by benchmark name)
        bench = r["home_benchmark"]
        if bench not in entry["_bench_set"]:
            entry["_bench_set"].add(bench)
            entry["benchmarks"].append({
                "benchmark": bench,
                "translated": r.get("translated", "Unknown"),
                "culturally_grounded": r.get("culturally_grounded", False),
            })

        # Count translation/grounding per (language, dataset, benchmark) row
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
            "num_benchmarks": len(entry["benchmarks"]),
            "benchmarks": entry["benchmarks"],
            "tasks": sorted(entry["tasks"]),
            "task_categories": sorted(entry["task_categories"]),
            "translated_count": entry["translated_count"],
            "native_count": entry["native_count"],
            "grounded_count": entry["grounded_count"],
        })

    # ---------- 3. Distributions ----------
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

    # ---------- 4. Cross-tabulations (from flat rows) ----------
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

    # ---------- 5. Insights ----------
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
    print(f"  {len(languages_list)} languages")
    print(f"  {len(rows)} dataset-language rows processed")
    print(f"  File size: {DST.stat().st_size / 1024:.1f} KB")


def _rows_for(rows, benchmark, dataset):
    """Get all rows matching a specific benchmark + dataset."""
    return [r for r in rows if r["home_benchmark"] == benchmark and r["dataset"] == dataset]


if __name__ == "__main__":
    run()
