# react-fast-scheduler

A lightweight React scheduling library scaffold with CI/CD publishing.

## Install

```bash
npm i react-fast-scheduler
```

## Usage

```tsx
import { Scheduler, useScheduler } from "react-fast-scheduler";

export function Example() {
  const { title } = useScheduler("Team Calendar");
  return <Scheduler title={title} />;
}
```

## Development

```bash
npm install
npm run lint
npm run test
npm run build
```

## Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) and GitHub Actions.

1. Create a changeset: `npx changeset`
2. Merge to `main`
3. The `Release` workflow opens/updates a release PR
4. Merging that PR publishes to npm (requires `NPM_TOKEN` secret)

