# @rwaterman/utils

[![npm](https://img.shields.io/npm/v/@rwaterman/utils)](https://www.npmjs.com/package/@rwaterman/utils) [![CI](https://github.com/rwaterman/utils-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/rwaterman/utils-ts/actions/workflows/ci.yml)

Typed, small, dependency-free, lightweight async helper/utility functions we use all the time.

```sh
npm install @rwaterman/utils
```

## Functions

- `to(promise)` — resolves to `{ res, err }` instead of throwing
- `toSync(fn)` — sync sibling of `to`: `{ res, err }` from a throwing function (`JSON.parse`, `new URL()`, ...)
- `delay(ms)` — promise that resolves after `ms`
- `timeout(promise, ms)` — rejects with `TimeoutError` if the promise takes longer than `ms`
- `retry({ yourAsyncFn, numTimes, delayMs, factor, maxDelayMs, shouldRetry })` — retries with optional exponential backoff, returns `{ res, errors }`
- `poll({ fn, until, everyMs, timeoutMs })` — calls `fn` every `everyMs` until `until(res)` is true; rejects with `TimeoutError` after `timeoutMs`
- `abortable(promise, signal)` — rejects with `signal.reason` on abort; composes with `AbortSignal.timeout()` / `AbortSignal.any()`
- `debounce(fn, ms)` — trailing-edge debounce with `.cancel()` and `.flush()`
- `throttle(fn, ms)` — leading edge plus one trailing call per window, with `.cancel()` and `.flush()`
- `once(fn)` — calls `fn` at most once and returns the cached result (a throw is not cached)
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
