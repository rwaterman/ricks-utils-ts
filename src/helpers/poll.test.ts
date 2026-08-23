import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { poll } from './poll.ts';
import { TimeoutError } from './timeout.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('poll resolves with the first result that satisfies until', async () => {
  let count = 0;
  const pending = poll({
    fn: async () => ++count,
    until: (n) => n === 3,
    everyMs: 100,
    timeoutMs: 1000,
  });
  await vi.advanceTimersByTimeAsync(200);

  await expect(pending).resolves.toBe(3);
  expect(count).toBe(3);
});

test('poll rejects with TimeoutError once timeoutMs elapses', async () => {
  let count = 0;
  const pending = poll({
    fn: async () => ++count,
    until: () => false,
    everyMs: 100,
    timeoutMs: 250,
  });
  const assertion = expect(pending).rejects.toThrow(TimeoutError);
  await vi.advanceTimersByTimeAsync(300);

  await assertion;
  expect(count).toBe(4);
});
