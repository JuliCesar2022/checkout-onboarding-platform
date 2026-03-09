/**
 * Interface for UUID generation.
 * Abstracting this enables testing and platform-independence.
 * Using an abstract class as a token for NestJS injection.
 */
export abstract class IUuidGenerator {
  abstract generate(): string;
}
