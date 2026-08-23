export function once<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  let cached: { value: R } | undefined;

  return (...args: A): R => {
    cached ??= { value: fn(...args) };
    return cached.value;
  };
}
