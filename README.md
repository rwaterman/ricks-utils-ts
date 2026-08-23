# ricks-utils

[![npm](https://img.shields.io/npm/v/ricks-utils)](https://www.npmjs.com/package/ricks-utils) [![CI](https://github.com/rwaterman/ricks-utils-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/rwaterman/ricks-utils-ts/actions/workflows/ci.yml)

Typed, small, dependency-free, lightweight async helper/utility functions we use all the time.

```sh
npm install ricks-utils
```

## Functions

- `to(promise)` — resolves to `{ res, err }` instead of throwing
- `delay(ms)` — promise that resolves after `ms`
- `retry({ yourAsyncFn, numTimes })` — retries an async function, returns `{ res, errors }`

## Development

Node 24+, TypeScript 7 (native compiler), Vitest, oxlint.

```sh
npm ci
npm test
npm run lint
npm run build
```
