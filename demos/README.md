# react-fast-scheduler demo site

A single-page showcase of every view and feature of `@marco.colia/react-fast-scheduler`, running on mocked data (a clinic, a salon and a coworking space; all names are fictional).

The site imports the library exactly as an app would (`@marco.colia/react-fast-scheduler` and its `styles.css`), but resolves it to the package built from this repository (`../dist`). So it always shows the current code, including changes that are not published yet.

## Run locally

```bash
# once, at the repository root
npm install

# in demos/
npm install
npm run dev
```

`npm run dev` builds the library first, then starts Vite. After changing the library source, run `npm run build:lib` again (or restart `npm run dev`).

Useful extras:

- `npm run build`: builds the library, type-checks the site and writes the static site to `demos/dist`
- `npm run preview`: serves the built site
- `?theme=light` or `?theme=dark` in the URL forces a theme (otherwise the visitor's last choice, then the system setting)

## Deploy on Vercel

1. Import the GitHub repository in Vercel.
2. Set **Root Directory** to `demos`. Keep "Include files outside the root directory in the Build Step" enabled (the default): the build needs the library source one level up.
3. Leave the other settings empty: `demos/vercel.json` sets the install command (installs `demos/` and the repository root), the build command and the `dist` output folder.

Every push then rebuilds the library and the site together.
