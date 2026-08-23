export interface MemoizeOptions<A extends unknown[]> {
  ttlMs?: number; // default: cache forever
  key?: (...args: A) => string; // default: JSON.stringify(args), with undefined and bigint made serializable
}

function defaultKey(...args: unknown[]): string {
  return JSON.stringify(args, (_, value: unknown) => {
    if (value === undefined) return '\u0000undefined';
    if (typeof value === 'bigint') return `${value}n`;
    return value;
  });
}

export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  options: MemoizeOptions<A> = {},
): (...args: A) => R {
  const cache = new Map<string, { value: R; expiresAt: number }>();
  const keyOf = options.key ?? defaultKey;

  return (...args: A): R => {
    const key = keyOf(...args);
    const hit = cache.get(key);
    if (hit && hit.expiresAt > Date.now()) return hit.value;

    const value = fn(...args);
    cache.set(key, { value, expiresAt: options.ttlMs === undefined ? Infinity : Date.now() + options.ttlMs });

    if (value instanceof Promise) {
      void (async () => {
        try {
          await value;
        } catch {
          cache.delete(key);
        }
      })();
    }

    return value;
  };
}
