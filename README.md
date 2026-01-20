
# Playbook UI — Template

This repository is a small, Vite + React template for interactive playbooks or documentation sites that render Markdown chapters. This README explains how the project is organized, how to run it locally, and how to update the Markdown content.

## Create Your Own App (Fork & Customize)

Follow these steps to fork this template and generate your own playbook app from Markdown files only.

1) Fork the repo on GitHub
- Click "Fork" to create a copy under your account.
- Optional: rename your fork to match your project.

2) Clone and set up locally
- Clone your fork and install dependencies:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

3) Add your chapters (Markdown only)
- Place `.md` files in `public/chapters/` (e.g., `public/chapters/01-intro.md`, `04-i-metadata.md`).
- Use numeric prefixes to control order; sub-pages follow roman prefixes (`i`, `ii`, `iii`, `iv`), e.g., `04-i-...`, `04-ii-...`.

4) Generate wrappers and routes
- Create JSX wrappers for each markdown file:

```bash
npm run sync-docs
```

- Sync routes and sidebar/doc index from filenames/order:

```bash
npm run sync-routes
```

5) Run the app

```bash
npm run dev
```

6) Brand and theme (optional)
- Update app name, subtitle, colors, and favicon via `theme/ThemeContext.jsx`.
- The Overview page (root `/playbook`) lists chapters dynamically from the sidebar tabs.

7) Commit and push

```bash
git add -A
git commit -m "Add chapters and sync routes"
git push origin main
```

## Updating Your Playbook Content
- Use this template to store a sequence of Markdown-based chapters and the template will display them based on the theme settings. To add or update your playbook chapters:

Use this template to store a sequence of Markdown-based chapters; the site will render them automatically once wrappers and routes are in place. Before running the sync scripts below, make sure your environment is prepared:

### Prerequisites

- Node.js 18+ recommended and npm installed.
- Install dependencies once after cloning:

```bash
npm install
```

To add or update chapters, follow these steps in order:

1. Add or edit Markdown files in the `public/chapters/` folder (e.g. `public/chapters/02-new-chapter.md`).

2. Generate (or update) the React wrapper files for each Markdown file. This will create `components/docs/*.jsx` files that the app imports:

```bash
npm run sync-docs
```

3. Update the app routes and sidebar navigation to match the chapter order. This updates `main.jsx` and `components/docs/docIndex.js` based on numeric prefixes and roman sub-ordering:

```bash
npm run sync-routes
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
 - `npm run sync-docs` — generate JSX wrappers from markdown files in `public/chapters`
 - `npm run sync-routes` — sync routes and doc index from chapter filenames

## Project structure

- `index.html`, `main.jsx`, `App.jsx` — app entry and top-level routing
- `Playbook.jsx` — layout that keeps the sidebar visible
- `components/` — reusable UI components (header, footer, sidebar, etc.)
- `components/docs/` — auto-generated React wrappers for markdown chapters
- `public/chapters/` — source markdown files (e.g., `01-intro.md`, `04-i-metadata.md`)
- `theme/` — theming (app name, colors, favicon/title)
- `styles.css`, `components/styles/` — global and component styles

## Components to know
These components will be updated based on the design template and you don't need to worry about updating these yourself.

- `components/SiteHeader.jsx` — top navigation and brand
- `components/Sidebar.jsx` — table-of-contents / page list
- `components/MarkdownPage.jsx` — renders chapters using `react-markdown` + `remark-gfm` with heading anchors and TOC

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