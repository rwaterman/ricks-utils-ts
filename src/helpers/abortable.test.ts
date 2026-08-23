import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { abortable } from './abortable.ts';
import { delay } from './delay.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('abortable resolves with the value when not aborted and removes its listener', async () => {
  const controller = new AbortController();
  const removeListener = vi.spyOn(controller.signal, 'removeEventListener');

  await expect(abortable(Promise.resolve('ok'), controller.signal)).resolves.toBe('ok');
  expect(removeListener).toHaveBeenCalledTimes(1);
});

test('abortable rejects with the abort reason when aborted mid-flight', async () => {
  const controller = new AbortController();
  const pending = abortable(delay(500), controller.signal);
  const assertion = expect(pending).rejects.toThrow('stop');

  controller.abort(new Error('stop'));

  await assertion;
});

test('abortable rejects immediately for an already-aborted signal', async () => {
  const controller = new AbortController();
  controller.abort();

  await expect(abortable(delay(500), controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
});

test('abortable composes with AbortSignal.timeout', async () => {
  vi.useRealTimers();

  await expect(abortable(delay(200), AbortSignal.timeout(10))).rejects.toMatchObject({ name: 'TimeoutError' });
});
