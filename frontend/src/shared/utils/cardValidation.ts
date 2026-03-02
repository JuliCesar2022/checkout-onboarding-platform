import type { CardBrand } from "../interfaces";

/** Detects Visa or Mastercard brand from the card number BIN */
export function detectCardBrand(number: string): CardBrand {
  const cleaned = number.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return "VISA";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "MASTERCARD";
  return null;
}

/** Luhn algorithm — validates card number checksum */
export function isValidLuhn(number: string): boolean {
  const cleaned = number.replace(/\s/g, "");
  if (!/^\d+$/.test(cleaned)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/** Formats card number with spaces every 4 digits */
export function formatCardNumber(number: string): string {
  const cleaned = number.replace(/\D/g, "").slice(0, 16);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

/** Validates that expiry date is not in the past */
export function isValidExpiry(month: string, year: string): boolean {
  const now = new Date();
  const expYear = parseInt(year.length === 2 ? `20${year}` : year, 10);
  const expMonth = parseInt(month, 10);
  if (isNaN(expYear) || isNaN(expMonth)) return false;
  const expDate = new Date(expYear, expMonth - 1);
  return expDate > now;
}
