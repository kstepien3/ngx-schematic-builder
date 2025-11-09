import { describe, it, expect } from 'vitest';
import { tryCatch } from './try-catch';

describe('tryCatch', () => {
  it('should return data on success', async () => {
    const promise = Promise.resolve('success');
    const result = await tryCatch(promise);
    expect(result).toEqual({ data: 'success', error: null });
  });

  it('should return error on failure', async () => {
    const error = new Error('test error');
    const promise = Promise.reject(error);
    const result = await tryCatch(promise);
    expect(result).toEqual({ data: null, error });
  });
});
