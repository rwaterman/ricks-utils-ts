import { expect, test } from 'vitest';
import { delay } from './delay.ts';

test('delay waits the appropriate amount of time before returning (shorter amount of time)', async () => {
  const waitTimeMs = 100;

  const dateStart = Date.now();
  await delay(waitTimeMs);
  const dateEnd = Date.now();

  expect(dateEnd - dateStart).toBeGreaterThanOrEqual(100);
  expect(dateEnd - dateStart).toBeLessThan(200);
});

test('delay waits the appropriate amount of time before returning (shorter amount of time)', async () => {
  const waitTimeMs = 500;

  const dateStart = Date.now();
  await delay(waitTimeMs);
  const dateEnd = Date.now();

  expect(dateEnd - dateStart).toBeGreaterThanOrEqual(500);
  expect(dateEnd - dateStart).toBeLessThan(600);
});
