import { ErrorCode } from '../constants/error-codes.constants';

/**
 * Railway Oriented Programming — Result<T, E>
 *
 * Inspired by functional programming's Either monad.
 * Use cases return Result instead of throwing exceptions.
 *
 * Usage:
 *   return Result.ok(data);
 *   return Result.fail(ErrorCode.NOT_FOUND);
 *
 *   if (result.isFailure) { ... }
 *   const value = result.getValue();
 */
export class Result<T, E = ErrorCode | string> {
  private readonly _isSuccess: boolean;
  private readonly _error: E | null;
  private readonly _value: T | null;

  private constructor(isSuccess: boolean, value: T | null, error: E | null) {
    this._isSuccess = isSuccess;
    this._value = value;
    this._error = error;
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  getValue(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value of a failed Result');
    }
    return this._value as T;
  }

  getError(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error of a successful Result');
    }
    return this._error as E;
  }

  /** Chain: if success, transform the value */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isSuccess) {
      return Result.ok<U, E>(fn(this._value as T));
    }
    return Result.fail<U, E>(this._error as E);
  }

  /** Chain: if success, run another Result-returning fn */
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isSuccess) {
      return fn(this._value as T);
    }
    return Result.fail<U, E>(this._error as E);
  }

  static ok<T, E = string>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, null);
  }

  static fail<T, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, null, error);
  }

  /** Combine multiple Results — fails fast on first failure */
  static combine<E = string>(results: Result<unknown, E>[]): Result<void, E> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<void, E>(result.getError());
      }
    }
    return Result.ok<void, E>(undefined);
  }
}
