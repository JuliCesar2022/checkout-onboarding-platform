import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import type { Result } from '../result/result';

import { ErrorCode } from '../constants/error-codes.constants';

type HttpErrorType =
  | 'not_found'
  | 'bad_request'
  | 'conflict'
  | 'forbidden'
  | 'unauthorized'
  | 'server_error';

/**
 * Unwrap a Result<T> and return the value, or throw the appropriate HTTP exception.
 * Keeps controllers thin — no domain logic, no if/else Result checks.
 */
export function unwrap<T>(
  result: Result<T>,
  errorType: HttpErrorType = 'bad_request',
): T {
  if (result.isSuccess) {
    return result.getValue();
  }

  const error = result.getError();

  // If the error is a standardized ErrorCode, map it automatically
  if (Object.values(ErrorCode).includes(error as ErrorCode)) {
    switch (error) {
      case ErrorCode.NOT_FOUND:
        throw new NotFoundException(error);
      case ErrorCode.CONFLICT:
        throw new ConflictException(error);
      case ErrorCode.FORBIDDEN:
        throw new ForbiddenException(error);
      case ErrorCode.UNAUTHORIZED:
        throw new UnauthorizedException(error);
      case ErrorCode.BAD_REQUEST:
      case ErrorCode.VALIDATION_ERROR:
        throw new BadRequestException(error);
      case ErrorCode.INTERNAL_ERROR:
      case ErrorCode.DATABASE_ERROR:
        throw new InternalServerErrorException(error);
    }
  }

  // Fallback to manual errorType or default
  switch (errorType) {
    case 'not_found':
      throw new NotFoundException(error);
    case 'conflict':
      throw new ConflictException(error);
    case 'forbidden':
      throw new ForbiddenException(error);
    case 'unauthorized':
      throw new UnauthorizedException(error);
    case 'server_error':
      throw new InternalServerErrorException(error);
    default:
      throw new BadRequestException(error);
  }
}
