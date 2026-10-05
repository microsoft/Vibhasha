## Benchmark update

### Summary

Describe the benchmark being added or changed and link to the supporting paper or source.

### Source files

- [ ] I updated all applicable files under `data/benchmarks/<BenchmarkName>/`.
- [ ] Subjective assessments include evidence from the source.
- [ ] Dataset and language names are consistent across the five step files.
- [ ] Every new language resolves to complete Glottolog, ISO, family, script, region, and resource-level metadata.
- [ ] Any language metadata override is minimal, verified, and includes a rationale.
- [ ] Any intentional duplicate Glottocode group is documented.

### Generated analysis

- [ ] I ran `pip install -r scripts/requirements.txt`.
- [ ] I ran `npm run update-evals`.
- [ ] I committed the regenerated files under `data/generated/` and `public/data/`.
- [ ] I ran `npm run check-evals`.

CI validates the formal schemas and rejects the pull request if any derived `/evals`
analysis is stale or any language metadata is unresolved, ambiguous, incomplete,
or silently defaulted.
