import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { delay } from './delay.ts';
import { timeout, TimeoutError } from './timeout.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('timeout resolves with the value when the promise settles in time', async () => {
  const pending = timeout(
    delay(50).then(() => 'ok'),
    100,
  );
  await vi.advanceTimersByTimeAsync(50);

  await expect(pending).resolves.toBe('ok');
});

test('timeout rejects with TimeoutError when the promise is too slow', async () => {
  const pending = timeout(delay(500), 100);
  const assertion = expect(pending).rejects.toThrow(TimeoutError);
  await vi.advanceTimersByTimeAsync(100);

  await assertion;
  await expect(pending).rejects.toThrow('Timed out after 100ms');
});

test('timeout clears its timer once the promise settles', async () => {
  await timeout(Promise.resolve(1), 100);

  expect(vi.getTimerCount()).toBe(0);
});

test.each([Infinity, 2 ** 31])('timeout with %d ms never times out', async (ms) => {
  const pending = timeout(
    delay(50).then(() => 'ok'),
    ms,
  );
  await vi.advanceTimersByTimeAsync(50);

  await expect(pending).resolves.toBe('ok');
  expect(vi.getTimerCount()).toBe(0);
});
