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
 *
 * Usage:
 *   return unwrap(result);                          // → throws BadRequestException on failure
 *   return unwrap(result, 'not_found');             // → throws NotFoundException on failure
 *   return unwrap(result, 'conflict');              // → throws ConflictException on failure
 *   return unwrap(result, 'server_error');          // → throws InternalServerErrorException on failure
 */
export function unwrap<T>(
  result: Result<T>,
  errorType: HttpErrorType = 'bad_request',
): T {
  if (result.isSuccess) {
    return result.getValue();
  }

  const message = result.getError();

  switch (errorType) {
    case 'not_found':
      throw new NotFoundException(message);
    case 'conflict':
      throw new ConflictException(message);
    case 'forbidden':
      throw new ForbiddenException(message);
    case 'unauthorized':
      throw new UnauthorizedException(message);
    case 'server_error':
      throw new InternalServerErrorException(message);
    default:
      throw new BadRequestException(message);
  }
}
