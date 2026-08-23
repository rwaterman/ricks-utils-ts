# ricks-utils

[![npm](https://img.shields.io/npm/v/ricks-utils)](https://www.npmjs.com/package/ricks-utils) [![CI](https://github.com/rwaterman/ricks-utils-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/rwaterman/ricks-utils-ts/actions/workflows/ci.yml)

Typed, small, dependency-free, lightweight async helper/utility functions we use all the time.

```sh
npm install ricks-utils
```

## Functions

- `to(promise)` — resolves to `{ res, err }` instead of throwing
- `delay(ms)` — promise that resolves after `ms`
- `timeout(promise, ms)` — rejects with `TimeoutError` if the promise takes longer than `ms`
- `retry({ yourAsyncFn, numTimes, delayMs, factor, maxDelayMs, shouldRetry })` — retries with optional exponential backoff, returns `{ res, errors }`
- `poll({ fn, until, everyMs, timeoutMs })` — calls `fn` every `everyMs` until `until(res)` is true; rejects with `TimeoutError` after `timeoutMs`
- `debounce(fn, ms)` — trailing-edge debounce with `.cancel()` and `.flush()`
- `memoize(fn, { ttlMs, key })` — caches by arguments; async-aware (shares in-flight promises, never caches rejections)
- `requireEnv(name)` — returns `process.env[name]` or throws naming the missing variable

## Development

Node 24+, TypeScript 7 (native compiler), Vitest, oxlint.

```sh
npm ci
npm test
npm run lint
npm run build
```
