# Development

## Local setup

```bash
npm install
```

## Demo app

Run the local demo:

```bash
npm run dev:demo
```

`dev/main.tsx` contains the runnable scheduler demo used for local development.

When working inside this repo, the demo imports the Tailwind v4 source stylesheet directly:

```tsx
import "../src/global.css";
```

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

Useful extra check:

```bash
npm run typecheck
```

Tailwind v4 source styles live in `src/global.css`.

## Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) and GitHub Actions.

1. Create a changeset with `npx changeset`.
2. Merge changes into `main`.
3. The `Release` workflow opens or updates the release PR.
4. Merging that PR publishes the package to npm via Trusted Publishing and GitHub OIDC.
