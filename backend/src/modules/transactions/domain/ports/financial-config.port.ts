/**
 * Port for Financial Configuration.
 * Using an abstract class as a token for NestJS injection.
 * This decouples the domain/application logic from the framework's configuration management.
 */
export abstract class IFinancialConfig {
  abstract getTransactionFeeInCents(): number;
  abstract getDeliveryFeeInCents(): number;
}
