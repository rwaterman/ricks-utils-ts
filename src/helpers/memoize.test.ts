import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { memoize } from './memoize.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('memoize caches by arguments', () => {
  const fn = vi.fn((a: number, b: number) => a + b);
  const memoized = memoize(fn);

  expect(memoized(1, 2)).toBe(3);
  expect(memoized(1, 2)).toBe(3);
  expect(memoized(2, 2)).toBe(4);
  expect(fn).toHaveBeenCalledTimes(2);
});

test('memoize expires entries after ttlMs', () => {
  const fn = vi.fn(() => Date.now());
  const memoized = memoize(fn, { ttlMs: 100 });

  memoized();
  vi.advanceTimersByTime(99);
  memoized();
  expect(fn).toHaveBeenCalledTimes(1);

  vi.advanceTimersByTime(1);
  memoized();
  expect(fn).toHaveBeenCalledTimes(2);
});

test('memoize shares one in-flight promise across concurrent async calls', async () => {
  const fn = vi.fn(async (id: string) => `user:${id}`);
  const memoized = memoize(fn);

  const [a, b] = await Promise.all([memoized('1'), memoized('1')]);

  expect(a).toBe('user:1');
  expect(b).toBe('user:1');
  expect(fn).toHaveBeenCalledTimes(1);
});

test('memoize does not cache rejected promises', async () => {
  let calls = 0;
  const memoized = memoize(async () => {
    calls++;
    if (calls === 1) throw new Error('first call fails');
    return 'ok';
  });

  await expect(memoized()).rejects.toThrow('first call fails');
  await expect(memoized()).resolves.toBe('ok');
  expect(calls).toBe(2);
});

test('memoize uses a custom key function', () => {
  const fn = vi.fn((user: { id: string; name: string }) => user.name);
  const memoized = memoize(fn, { key: (user) => user.id });

  memoized({ id: '1', name: 'a' });
  memoized({ id: '1', name: 'b' });
  expect(fn).toHaveBeenCalledTimes(1);
});
