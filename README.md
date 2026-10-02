# AI Prompt Vault ✨

A little prompt. Limitless possibility.

🚀 **AI Prompt Vault is a growing collection of powerful, creative, and practical AI prompts for image generation, video creation, coding, productivity, education, research, automation, and more.** Explore ready-to-use prompts, customize them for your needs, experiment with AI, and unlock new possibilities for creativity and innovation.

The repository includes a responsive React application and a browsable Markdown vault. Both use one shared, curated catalog.

## Inside the vault

| Category         | Ready-to-use prompts | Browse in Markdown                              |
| ---------------- | -------------------: | ----------------------------------------------- |
| Image generation |                    6 | [Image prompts](prompts/image.md)               |
| Video creation   |                    6 | [Video prompts](prompts/video.md)               |
| Coding           |                    6 | [Coding prompts](prompts/coding.md)             |
| Productivity     |                    6 | [Productivity prompts](prompts/productivity.md) |
| Education        |                    6 | [Education prompts](prompts/education.md)       |
| Research         |                    6 | [Research prompts](prompts/research.md)         |
| Automation       |                    6 | [Automation prompts](prompts/automation.md)     |
| Writing          |                    6 | [Writing prompts](prompts/writing.md)           |
| Marketing        |                    6 | [Marketing prompts](prompts/marketing.md)       |
| **Total**        |               **54** |                                                 |

Every prompt has a complete template, example values, editable fields, compatible AI tools, tags, an experience level, and a practical tip.

## Features

- **Explore:** full-text metadata search, nine category filters, AI-tool filtering, handpicked prompts, sorting, grid/list layouts, progressive loading, and a random inspiration picker.
- **Customize:** a live prompt playground with editable variables, extra direction, full-text editing, a blank canvas, draft persistence, word/character counts, and unfilled-field warnings.
- **Experiment:** copy your customized prompt and open a compatible external AI tool. Try an output, change one detail, and repeat.
- **Collect:** bookmarks, personal named collections, and three curated starter collections. Add and remove prompts; rename or delete personal collections.
- **Create:** add, edit, and delete your own prompts. `{{variable_name}}` fields automatically become customization inputs.
- **Keep your work:** download individual prompts as text, collections as Markdown, and your personal vault as JSON. Validate and merge imported backups without discarding existing data.
- **Accessible & responsive:** keyboard shortcuts, focus-trapped dialogs, labeled inputs, reduced-motion support, empty states, and mobile navigation.
- **Private by default:** no sign-in, backend, analytics, API keys, or cloud account. Personal data stays in your browser.

### What this app does not do

The playground **builds prompts; it does not run an AI model or generate images, videos, or responses**. External tools may require their own account, subscription, and permissions. “Copy and open” copies your prompt and opens the selected tool; you paste the prompt yourself. Compatibility labels are guidance, not a guarantee of an identical result across models.

The image artwork included in the app is AI-generated illustration, not live prompt output.

## Run locally

Requires **Node.js 22+** and npm.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The development and preview servers bind to `0.0.0.0` and accept sandbox preview hosts. Browser-facing code uses relative asset URLs and does not call localhost services.

```bash
npm run build       # production files in dist/
npm run preview     # preview production build on port 4173
```

Deploy `dist/` to any static host at its root. Navigation uses hash routes, so no server-side route fallback is required. If deploying under a subdirectory, set Vite’s `base` and adjust root-relative public asset paths first.

## Use a prompt

1. Search an idea or pick a category.
2. Open a card for the filled-in example and reusable template.
3. Choose **Make it yours** or **Use prompt** to open the playground.
4. Change the fields, add context, or edit the full text.
5. Copy the prompt into your preferred AI tool and review the result.
6. Bookmark the original or save your customized version to your personal vault.

`Ctrl/⌘ + K` focuses search. `Escape` closes a dialog.

## Local storage and backups

Favorites, personal prompts, collections, and the current playground draft are stored under `ai-prompt-vault:v1` in browser local storage. They are not shared between browsers or devices. Clearing site data removes them.

Open **A little help & tips → Export my vault** to download a backup. **Import a backup** validates a version-1 JSON file (up to 5 MB), merges favorites and collection membership, and replaces matching personal prompt IDs with the imported version. The exported backup excludes the temporary playground draft. Unknown fields and imported image URLs are discarded. Storage failures are reported so you can export your work.

Do not include secrets or sensitive personal data in prompts. Review generated code before running it, test automation on copies or in dry-run mode, and independently verify research citations.

## Add to the shared catalog

The canonical catalog lives in `src/data/prompts.js`. Categories and tool links are in `src/data/categories.js`.

1. Add a prompt with a unique ID and the correct category.
2. Include a complete, useful template and concise description.
3. Define each `{{variable}}` with a label and example default value.
4. Add practical tags, appropriate tools, and any limitations or tips.
5. Run:

```bash
npm run generate:docs
npm test
npm run build
```

`generate:docs` updates the nine files in `prompts/` from the same data the app displays. Adding a prompt through the UI adds it to your **personal browser vault**, not the repository’s shared catalog.

## Tests

```bash
npm test                    # catalog, templates, filters, validation, backup merging
npx playwright install chromium
npm run test:e2e             # browser workflows, accessibility, and mobile layout
```

The browser suite starts Vite automatically, or reuses an existing server on port 5173. In environments with an existing Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its path.

## Project structure

```text
src/
  App.jsx                   # routing, local vault state, actions
  components/               # explore, collections, playground, dialogs, layout
  data/                     # shared prompt catalog and categories
  lib/vault.js              # template, search, persistence, import/export utilities
  styles.css                # responsive design system
prompts/                    # generated, ready-to-use Markdown library
public/images/              # optimized AI-generated artwork
scripts/                    # catalog-to-Markdown generator
tests/                      # unit and end-to-end tests
```

Built with React, Vite, Lucide icons, and CSS. Make something uniquely yours.
