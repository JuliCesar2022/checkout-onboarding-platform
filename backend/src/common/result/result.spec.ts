import { Result } from './result';
import { ErrorCode } from '../constants/error-codes.constants';

describe('Result', () => {
  describe('ok', () => {
    it('should create a success result with a value', () => {
      const value = { name: 'test' };
      const result = Result.ok(value);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBe(value);
      expect(() => result.getError()).toThrow();
    });

    it('should create a success result with void/null', () => {
      const result = Result.ok(null);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeNull();
    });
  });

  describe('fail', () => {
    it('should create a failure result with an error code', () => {
      const error = ErrorCode.NOT_FOUND;
      const result = Result.fail(error);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(error);
      expect(() => result.getValue()).toThrow();
    });

    it('should create a failure result with a string message', () => {
      const error = 'Custom error';
      const result = Result.fail(error);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(error);
    });
  });

  describe('combine', () => {
    it('should return success if all results are successful', () => {
      const results = [Result.ok(1), Result.ok(2)];
      const combined = Result.combine(results);

      expect(combined.isSuccess).toBe(true);
    });

    it('should return the first failure if any result fails', () => {
      const results = [
        Result.ok(1),
        Result.fail(ErrorCode.BAD_REQUEST),
        Result.fail(ErrorCode.NOT_FOUND),
      ];
      const combined = Result.combine(results);

      expect(combined.isFailure).toBe(true);
      expect(combined.getError()).toBe(ErrorCode.BAD_REQUEST);
    });
  });
});
