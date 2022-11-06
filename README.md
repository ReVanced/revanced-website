# ReVanced Website

The official ReVanced Website.

## Documentation

The documentation you see on the live website is generated from a collection of markup files found in [this git repository](https://github.com/revanced/revanced-documentation). The documentation "generator" currently supports asciidoc and markdown.

It looks for markup files in the `testing-docs` folder by default, but you can specify a different path by changing the `REVANCED_DOCS_FOLDER` environment variable.

## Developing

Install dependencies with `npm install` (or `pnpm install`).

Start a development server by running:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production build, run:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
