import { detectCardBrand, isValidLuhn, formatCardNumber, isValidExpiry } from './cardValidation';

describe('detectCardBrand', () => {
  it('detects Visa from BIN starting with 4', () => {
    expect(detectCardBrand('4111111111111111')).toBe('VISA');
  });

  it('detects Mastercard from BIN 51-55', () => {
    expect(detectCardBrand('5500005555555559')).toBe('MASTERCARD');
  });

  it('detects Mastercard from 2xxx range', () => {
    expect(detectCardBrand('2221000000000009')).toBe('MASTERCARD');
  });

  it('returns null for unknown BIN', () => {
    expect(detectCardBrand('3714496353984312')).toBeNull(); // Amex
  });
});

describe('isValidLuhn', () => {
  it('validates a correct Visa test number', () => {
    expect(isValidLuhn('4111111111111111')).toBe(true);
  });

  it('invalidates a wrong checksum', () => {
    expect(isValidLuhn('4111111111111112')).toBe(false);
  });

  it('handles spaces in number', () => {
    expect(isValidLuhn('4111 1111 1111 1111')).toBe(true);
  });

  it('returns false for non-numeric input', () => {
    expect(isValidLuhn('abcd')).toBe(false);
  });
});

describe('formatCardNumber', () => {
  it('adds spaces every 4 digits', () => {
    expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('trims to 16 digits max', () => {
    expect(formatCardNumber('12345678901234567890')).toBe('1234 5678 9012 3456');
  });
});

describe('isValidExpiry', () => {
  it('returns false for past date', () => {
    expect(isValidExpiry('01', '2020')).toBe(false);
  });

  it('returns true for future date', () => {
    expect(isValidExpiry('12', '2099')).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(isValidExpiry('aa', 'bb')).toBe(false);
  });
});
