import { delay } from './delay.ts';
import { TimeoutError } from './timeout.ts';

export interface PollParams<T> {
  fn: () => Promise<T>;
  until: (res: T) => boolean;
  everyMs: number;
  timeoutMs: number;
}

export async function poll<T>(params: PollParams<T>): Promise<T> {
  const deadline = Date.now() + params.timeoutMs;

  for (;;) {
    const res = await params.fn();
    if (params.until(res)) return res;
    if (Date.now() >= deadline) throw new TimeoutError(params.timeoutMs);
    await delay(params.everyMs);
  }
}
