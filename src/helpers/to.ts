export type ToSuccess<T> = { res: T; err: null };
export type ToError<E> = { res: null; err: E };

export async function to<R = never, E = Error>(promise: Promise<R>): Promise<ToSuccess<R> | ToError<E>> {
  try {
    return { err: null, res: await promise };
  } catch (err) {
    return { err: err as E, res: null };
  }
}

export function toSync<R, E = Error>(fn: () => R): ToSuccess<R> | ToError<E> {
  try {
    return { err: null, res: fn() };
  } catch (err) {
    return { err: err as E, res: null };
  }
}
