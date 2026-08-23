export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

const MAX_TIMER_MS = 2 ** 31 - 1;

export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (ms > MAX_TIMER_MS) return promise;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
  });

  try {
    return await Promise.race([promise, expiry]);
  } finally {
    clearTimeout(timer);
  }
}
