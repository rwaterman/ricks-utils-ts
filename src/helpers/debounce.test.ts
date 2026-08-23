import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { debounce } from './debounce.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('debounce calls fn once with the last arguments after the quiet period', () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 100);

  debounced(1);
  debounced(2);
  vi.advanceTimersByTime(99);
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(2);
});

test('debounce.cancel drops the pending call', () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 100);

  debounced(1);
  debounced.cancel();
  vi.advanceTimersByTime(100);

  expect(fn).not.toHaveBeenCalled();
});

test('debounce.flush invokes the pending call immediately', () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 100);

  debounced(1);
  debounced.flush();
  expect(fn).toHaveBeenCalledWith(1);

  vi.advanceTimersByTime(100);
  expect(fn).toHaveBeenCalledTimes(1);
});
