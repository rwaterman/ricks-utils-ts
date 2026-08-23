import { afterEach, expect, test, vi } from 'vitest';
import { requireEnv } from './requireEnv.ts';

afterEach(() => vi.unstubAllEnvs());

test('requireEnv returns the value when set', () => {
  vi.stubEnv('RICKS_UTILS_TEST', 'value');

  expect(requireEnv('RICKS_UTILS_TEST')).toBe('value');
});

test.each([undefined, ''])('requireEnv throws naming the variable when it is %j', (value) => {
  vi.stubEnv('RICKS_UTILS_TEST', value);

  expect(() => requireEnv('RICKS_UTILS_TEST')).toThrow('Missing required environment variable: RICKS_UTILS_TEST');
});
