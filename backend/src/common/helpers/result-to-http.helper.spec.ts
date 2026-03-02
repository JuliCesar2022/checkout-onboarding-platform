import { unwrap } from './result-to-http.helper';
import { Result } from '../result/result';
import { ErrorCode } from '../constants/error-codes.constants';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('result-to-http helper (unwrap)', () => {
  it('should return value on success', () => {
    const value = 'success';
    const result = Result.ok(value);
    expect(unwrap(result)).toBe(value);
  });

  describe('automatic mapping from ErrorCode', () => {
    it('should throw NotFoundException for ErrorCode.NOT_FOUND', () => {
      const result = Result.fail(ErrorCode.NOT_FOUND);
      expect(() => unwrap(result)).toThrow(NotFoundException);
    });

    it('should throw ConflictException for ErrorCode.CONFLICT', () => {
      const result = Result.fail(ErrorCode.CONFLICT);
      expect(() => unwrap(result)).toThrow(ConflictException);
    });

    it('should throw BadRequestException for ErrorCode.VALIDATION_ERROR', () => {
      const result = Result.fail(ErrorCode.VALIDATION_ERROR);
      expect(() => unwrap(result)).toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for ErrorCode.INTERNAL_ERROR', () => {
      const result = Result.fail(ErrorCode.INTERNAL_ERROR);
      expect(() => unwrap(result)).toThrow(InternalServerErrorException);
    });
  });

  describe('manual mapping with errorType parameter', () => {
    it('should throw exception based on errorType when error is a string', () => {
      const result = Result.fail('Something failed');
      expect(() => unwrap(result, 'not_found')).toThrow(NotFoundException);
      expect(() => unwrap(result, 'conflict')).toThrow(ConflictException);
      expect(() => unwrap(result, 'server_error')).toThrow(
        InternalServerErrorException,
      );
    });

    it('should default to BadRequestException', () => {
      const result = Result.fail('Generic error');
      expect(() => unwrap(result)).toThrow(BadRequestException);
    });
  });
});
