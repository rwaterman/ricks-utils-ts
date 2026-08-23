import { delay } from './delay.ts';
import { to } from './to.ts';

export interface RetryParams<T = unknown> {
  numTimes?: number; // default is 3
  delayMs?: number; // wait before each retry, default 0
  factor?: number; // backoff multiplier applied per retry, default 2
  maxDelayMs?: number; // cap on the backoff delay
  shouldRetry?: (err: unknown) => boolean; // return false to stop retrying early
  yourAsyncFn: () => Promise<T>; // the async function that you are calling, like this, before passing yourAsyncFn(param1, ...)
}

export async function retry<T>(params: RetryParams<T>): Promise<{ res: T | null; errors: unknown[] }> {
  const { numTimes = 3, delayMs = 0, factor = 2, maxDelayMs = Infinity, shouldRetry = () => true } = params;
  const errors: unknown[] = [];

  for (let attempt = 0; attempt < numTimes; ++attempt) {
    if (attempt > 0 && delayMs > 0) await delay(Math.min(delayMs * factor ** (attempt - 1), maxDelayMs));

    const { err, res } = await to(params.yourAsyncFn());

    if (err === null) return { res, errors };
    errors.push(err);
    if (!shouldRetry(err)) break;
  }

  return { res: null, errors };
}
