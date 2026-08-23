import { expect, test } from 'vitest';
import { retry } from './retry.ts';

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
