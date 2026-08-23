export interface Throttled<A extends unknown[]> {
  (...args: A): void;
  cancel(): void;
  flush(): void;
}

export function throttle<A extends unknown[]>(fn: (...args: A) => void, ms: number): Throttled<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: A | undefined;

  function onWindowEnd(): void {
    timer = undefined;
    if (!pending) return;
    const args = pending;
    pending = undefined;
    fn(...args);
    timer = setTimeout(onWindowEnd, ms);
  }

  function flush(): void {
    clearTimeout(timer);
    timer = undefined;
    if (!pending) return;
    const args = pending;
    pending = undefined;
    fn(...args);
  }

  function cancel(): void {
    clearTimeout(timer);
    timer = undefined;
    pending = undefined;
  }

  const throttled = (...args: A): void => {
    if (timer) {
      pending = args;
      return;
    }
    fn(...args);
    timer = setTimeout(onWindowEnd, ms);
  };

  return Object.assign(throttled, { cancel, flush });
}
