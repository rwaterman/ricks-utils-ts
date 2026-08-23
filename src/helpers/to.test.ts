import { expect, test } from 'vitest';
import { to, toSync } from './to.ts';

test('to async helper returns the appropriate response on success', async () => {
  const { err, res } = await to(Promise.resolve(true));

  expect(err).toBeNull();
  expect(res).toBe(true);
});

test('to async helper returns the appropriate response on error', async () => {
  const mockError = new Error('mocked error');

  const { err, res } = await to(Promise.reject(mockError));

  expect(err).toEqual(mockError);
  expect(res).toBeNull();
});

test('toSync returns the result when fn does not throw', () => {
  const { err, res } = toSync(() => JSON.parse('{"a":1}') as { a: number });

  expect(err).toBeNull();
  expect(res).toEqual({ a: 1 });
});

test('toSync returns the error when fn throws', () => {
  const { err, res } = toSync(() => JSON.parse('{'));

  expect(err).toBeInstanceOf(SyntaxError);
  expect(res).toBeNull();
});
