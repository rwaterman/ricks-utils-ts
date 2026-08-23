export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  cancel(): void;
  flush(): void;
}

export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: A | undefined;

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

  const debounced = (...args: A): void => {
    pending = args;
    clearTimeout(timer);
    timer = setTimeout(flush, ms);
  };

  return Object.assign(debounced, { cancel, flush });
}
