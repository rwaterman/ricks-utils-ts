import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { delay } from './delay.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test.each([100, 500])('delay resolves only after %i ms', async (ms) => {
  let resolved = false;
  const pending = (async () => {
    await delay(ms);
    resolved = true;
  })();

  await vi.advanceTimersByTimeAsync(ms - 1);
  expect(resolved).toBe(false);

  await vi.advanceTimersByTimeAsync(1);
  await pending;
  expect(resolved).toBe(true);
});
