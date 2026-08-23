import { expect, test, vi } from 'vitest';
import { once } from './once.ts';

test('once calls fn a single time and returns the cached result afterwards', () => {
  const fn = vi.fn((n: number) => n * 2);
  const onced = once(fn);

  expect(onced(1)).toBe(2);
  expect(onced(5)).toBe(2);
  expect(fn).toHaveBeenCalledTimes(1);
});

test('once shares the same promise across async callers', async () => {
  const fn = vi.fn(async () => 'ready');
  const init = once(fn);

  const [a, b] = await Promise.all([init(), init()]);

  expect(a).toBe('ready');
  expect(b).toBe('ready');
  expect(fn).toHaveBeenCalledTimes(1);
});

test('once does not cache a call that throws', () => {
  let calls = 0;
  const onced = once(() => {
    calls++;
    if (calls === 1) throw new Error('first call fails');
    return 'ok';
  });

  expect(() => onced()).toThrow('first call fails');
  expect(onced()).toBe('ok');
  expect(calls).toBe(2);
});
