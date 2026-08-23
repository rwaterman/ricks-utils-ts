import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { throttle } from './throttle.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('throttle fires on the leading edge, then at most once per window with the latest arguments', () => {
  const fn = vi.fn();
  const throttled = throttle(fn, 100);

  throttled(1);
  throttled(2);
  throttled(3);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenLastCalledWith(1);

  vi.advanceTimersByTime(100);
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith(3);

  vi.advanceTimersByTime(100);
  expect(fn).toHaveBeenCalledTimes(2);
});

test('throttle.cancel drops the pending trailing call', () => {
  const fn = vi.fn();
  const throttled = throttle(fn, 100);

  throttled(1);
  throttled(2);
  throttled.cancel();
  vi.advanceTimersByTime(100);

  expect(fn).toHaveBeenCalledTimes(1);
});

test('throttle.flush fires the pending trailing call immediately', () => {
  const fn = vi.fn();
  const throttled = throttle(fn, 100);

  throttled(1);
  throttled(2);
  throttled.flush();

  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith(2);
});
