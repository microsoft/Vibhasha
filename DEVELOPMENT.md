# Development

## Run locally

Vibhasha requires Node.js 20 and Python 3.11 or later.

```bash
npm ci
pip install -r scripts/requirements.txt
npm run dev
```

The development server prints the local URL after it starts.

## Validate and build

Run the checks used by pull request CI:

```bash
npm run test-evals
npm run validate-evals
npm run check-evals
npm run build
```

When benchmark source data changes, regenerate the derived dashboard data before
running the freshness check:

```bash
npm run update-evals
npm run check-evals
```

Commit generated files alongside the benchmark source files. Do not edit files
under `data/generated/` or `public/data/benchmark_data.json` manually.

## Project structure

- `public/chapters/` contains the Markdown playbook content.
- `components/` contains the React user interface.
- `data/benchmarks/` contains evidence-backed benchmark metadata.
- `data/schemas/` contains the benchmark JSON Schemas.
- `data/generated/` and `public/data/` contain generated dashboard data.
- `scripts/` contains validation and data-generation tooling.
