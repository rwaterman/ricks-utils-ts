import { to } from './to.ts';

export interface RetryParams {
  // timeout?: number; // default is 30s TODO
  numTimes?: number; // default is 3
  yourAsyncFn: () => Promise<any>; // the async function that you are calling, like this, before passing yourAsyncFn(param1, ...)
}

export async function retry(params: RetryParams): Promise<{ res: unknown; errors: Error[] }> {
  const errors = [];

  for (let i = 0; i < (params.numTimes || 3); ++i) {
    const { err, res } = await to(params.yourAsyncFn());

    if (res) return { res, errors };
    if (err) errors.push(err);
  }

  return { res: null, errors };
}
