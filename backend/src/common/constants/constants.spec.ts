import { PAGINATION_CONSTANTS } from './pagination.constants';
import { THROTTLE_TTL } from './throttle.constants';
import { ErrorCode } from './error-codes.constants';

describe('Common Constants', () => {
  it('should have pagination constants defined', () => {
    expect(PAGINATION_CONSTANTS.DEFAULT_LIMIT).toBe(12);
  });

  it('should have throttle constants defined', () => {
    expect(THROTTLE_TTL).toBe(60);
  });

  it('should have error codes defined', () => {
    expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
  });
});
