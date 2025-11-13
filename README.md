
# Playbook UI — Template

This repository is a small, Vite + React template for interactive playbooks or documentation sites that render Markdown chapters. This README explains how the project is organized, how to run it locally, and how to update the Markdown content.

## Using this Template

Before you start, create your own repository from this template so you can safely create and maintain your own content and history. There are two common workflows: fork the repo on GitHub, or create a new remote from a local clone. Pick whichever fits your workflow.

1) Fork Option
- Go to the repository page on GitHub and click the "Fork" button to create a copy under your account.
- Clone your fork locally and work as usual
- After forking or creating your own remote, update `package.json` (name, description, author) and add a `LICENSE` based on your playbook.

## Updating Your Playbook Content
- Use this template to store a sequence of Markdown-based chapters and the template will display them based on the theme settings. To add or update your playbook chapters:

Use this template to store a sequence of Markdown-based chapters; the site will render them automatically once wrappers and routes are in place. Before running the sync scripts below, make sure your environment is prepared:

### Prerequisites:

- Node.js (16+ recommended) and npm installed.
- Install project dependencies once after cloning the repo:

```bash
npm install
```

To add or update chapters, follow these steps in order:

1. Add or edit Markdown files in the `chapters/` folder (e.g. `chapters/02-new-chapter.md`).

2. Generate (or update) the React wrapper files for each Markdown file. This will create `components/docs/*.jsx` files that the app imports:

```bash
npm run sync-docs
```

3. Update the app routes and sidebar navigation to match the chapter order. This updates `main.jsx` and `components/Sidebar.jsx` based on the numeric prefixes and filename order:

```bash
npm run sync-routes-sidebar
```

4. Start the dev server and verify the site shows your new content:

```bash
npm run dev
```

Tip: keep filenames consistent and use numeric prefixes (for example `01-`, `02-`, `04-i-`) to control ordering. Sub-pages like `04-i-metadata.md` are treated as sub-items in the sidebar when the filename follows that pattern.


### Build for production:

```bash
npm run build
```

Serve the built site locally (example using npx):

```bash
npx serve -s dist
```

Note: the `package.json` includes a `start` script that runs `serve -s dist`. If you prefer, install `serve` globally (`npm i -g serve`) or use the `npx` command above.

Available scripts (from `package.json`):

- `npm run dev` — start the Vite dev server
- `npm run build` — create a production build in `dist`
- `npm run preview` — preview the build with Vite's preview server
- `npm start` — run `serve -s dist` to serve the `dist` folder (requires `serve`)

## Project structure

- `index.html`, `main.jsx`, `App.jsx` — app entry and top-level routing
- `Playbook.jsx`, `Home.jsx` — page components
- `components/` — reusable UI components (header, footer, sidebar, card grid, etc.)
- `components/docs/` — React wrappers for individual Markdown pages (JSX files that import `.md` files)
- `docs/` — the Markdown source files used by the site (e.g. `01-intro.md`, ...)
- `assets/`, `styles.css`, `styles/` — static assets and component styles

## Components to know
These components will be updated based on the design template and you don't need to worry about updating these yourself.

- `components/SiteHeader.jsx` — top navigation and brand
- `components/Sidebar.jsx` — table-of-contents / page list
- `components/MarkdownCard.jsx` / `components/MarkdownPage.jsx` — helpers that render Markdown using `react-markdown` and plugins like `remark-gfm`

If you change the way Markdown is parsed or rendered, check `react-markdown` and `remark-gfm` configuration in the relevant components.

## Development notes

- The project uses Vite with `@vitejs/plugin-react` for fast HMR.
- Markdown rendering is powered by `react-markdown` and `remark-gfm` (see `package.json` dependencies).
- If you add significant client-side logic, prefer small, focused components and add tests where appropriate.

## Troubleshooting

- If `npm run dev` fails: ensure Node/npm versions are compatible and that dependencies are installed (`npm install`).
- If `npm start` fails because `serve` is not found: either install `serve` globally (`npm i -g serve`) or use `npx serve -s dist`.

## License

This template does not include a license by default. Add a `LICENSE` file and update `package.json` if you intend to publish the project.