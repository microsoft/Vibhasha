
# Playbook UI — Template

This repository is a small, Vite + React template for interactive playbooks or documentation sites that render Markdown chapters. This README explains how the project is organized, how to run it locally, and how to update the Markdown content.

## Create Your Own App (Fork & Customize)

Follow these steps to fork this template and generate your own playbook app from Markdown files only.

1) Fork the repo on Azure Devops
- Click "Fork" to create a copy under the same devops org.

OR

2) Clone and set up locally
- Clone your fork and install dependencies:

```bash
git clone https://msr-africa@dev.azure.com/msr-africa/Gecko%20Playbooks/_git/vibhasha-playbook
cd <your-repo>

```

3. Install Node
- Node.js 18+ recommended and npm installed.
- Install dependencies once after cloning:
```bash
npm install
```

4. Rename your App on `package.json` to match your playbook name i.e Atlas, Paza or Vibhasha

5) Add your chapters (Markdown only)
- Replace `.md` files in `public/chapters/` with your own files (e.g., `public/chapters/01-intro.md`, `04-i-metadata.md`).
- Use numeric prefixes to control order; sub-pages follow roman prefixes (`i`, `ii`, `iii`, `iv`), e.g., `04-i-...`, `04-ii-...`.

6) Generate wrappers and routes
- Create JSX wrappers for each markdown file by running this script:

```bash
npm run sync-docs
```

- Sync routes and sidebar/doc index from filenames/order:

```bash
npm run sync-routes
```

7) Run the app

```bash
npm run dev
```

8) Brand and theme
- Validate that the app name, subtitle, colors, and favicon match the [Playbook Design](https://www.figma.com/design/4ft7lDctSrvhxGTxCbKs7I/Playbooks-Template?node-id=5-322&t=cJ5nUWCtTDm5b6I9-0).
- The Overview page (root `/playbook`) lists chapters dynamically from the sidebar tabs.

9) Commit and push
```bash
git add -A
git commit -m "Add chapters and sync routes"
git push origin main
```

## Updating Your Playbook Content
Use this template to store a sequence of markdown-based chapters; the site will render them automatically once wrappers and routes are in place.


### Build for production:

```bash
npm run build
```

Serve the built site locally (example using npx):

```bash
npx serve -s dist
```

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

This template does not include a license by default. Add a `LICENSE` file and update `package.json` before you publish the repository externally.