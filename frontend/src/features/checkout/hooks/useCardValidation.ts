import { useState, useCallback } from "react";
import {
  detectCardBrand,
  formatCardNumber,
  isValidLuhn,
  isValidExpiry,
} from "../../../shared/utils/cardValidation";
import type { CardBrand } from "../../../shared/interfaces";

interface CardValidationState {
  formattedNumber: string;
  brand: CardBrand;
  isValidNumber: boolean;
  isValidExpiry: boolean;
}

/** Hook for real-time card number formatting and brand detection */
export function useCardValidation(initialNumber = "") {
  const [state, setState] = useState<CardValidationState>(() => {
    if (!initialNumber)
      return {
        formattedNumber: "",
        brand: null,
        isValidNumber: false,
        isValidExpiry: false,
      };
    const formatted = formatCardNumber(initialNumber);
    const brand = detectCardBrand(initialNumber);
    const isValidNumber = isValidLuhn(initialNumber.replace(/\s/g, ""));
    return {
      formattedNumber: formatted,
      brand,
      isValidNumber,
      isValidExpiry: false,
    };
  });

  const handleCardNumberChange = useCallback((rawValue: string) => {
    const formatted = formatCardNumber(rawValue);
    const brand = detectCardBrand(rawValue);
    const isValidNumber = isValidLuhn(rawValue.replace(/\s/g, ""));
    setState((prev) => ({
      ...prev,
      formattedNumber: formatted,
      brand,
      isValidNumber,
    }));
  }, []);

  const handleExpiryChange = useCallback((month: string, year: string) => {
    const valid = isValidExpiry(month, year);
    setState((prev) => ({ ...prev, isValidExpiry: valid }));
  }, []);

  return { ...state, handleCardNumberChange, handleExpiryChange };
}
