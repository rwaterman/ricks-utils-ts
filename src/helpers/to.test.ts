import { expect, test } from 'vitest';
import { to } from './to.ts';

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
