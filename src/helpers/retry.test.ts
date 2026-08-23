import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { retry } from './retry.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('retry calls the async function n times based on the parameter (default)', async () => {
  let count = 0;
  await retry({
    numTimes: 3,
    yourAsyncFn: () => Promise.reject(++count),
  });

  expect(count).toBe(3);
});

test('retry calls the async function n times based on the parameter (non-default)', async () => {
  let count = 0;
  await retry({
    numTimes: 1,
    yourAsyncFn: () => Promise.reject(++count),
  });

  expect(count).toBe(1);
});

test('retry returns all errors and the response if it eventually succeeds', async () => {
  let callCount = 0;
  let errorSet = false;
  const res = await retry({
    numTimes: 3,
    yourAsyncFn: () => {
      callCount++;
      if (!errorSet) {
        errorSet = true;
        return Promise.reject('mocked error');
      }

      return Promise.resolve('success');
    },
  });

  expect(res.errors).toEqual(['mocked error']);
  expect(res.res).toBe('success');
  expect(callCount).toBe(2);
});

test('retry treats falsy resolved values as success', async () => {
  let count = 0;
  const res = await retry({ yourAsyncFn: () => Promise.resolve(++count && 0) });

  expect(res).toEqual({ res: 0, errors: [] });
  expect(count).toBe(1);
});

test('retry backs off exponentially between attempts, capped at maxDelayMs', async () => {
  const calledAt: number[] = [];
  const pending = retry({
    numTimes: 4,
    delayMs: 100,
    factor: 2,
    maxDelayMs: 300,
    yourAsyncFn: () => {
      calledAt.push(Date.now());
      return Promise.reject(new Error('nope'));
    },
  });
  await vi.runAllTimersAsync();
  await pending;

  expect(calledAt.map((t) => t - calledAt[0])).toEqual([0, 100, 300, 600]);
});

test('retry stops early when shouldRetry returns false', async () => {
  let count = 0;
  const res = await retry({
    numTimes: 5,
    shouldRetry: (err) => err !== 'fatal',
    yourAsyncFn: () => Promise.reject(++count === 2 ? 'fatal' : 'transient'),
  });

  expect(count).toBe(2);
  expect(res.errors).toEqual(['transient', 'fatal']);
});
