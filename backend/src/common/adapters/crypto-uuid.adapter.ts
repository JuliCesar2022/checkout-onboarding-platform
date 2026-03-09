import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUuidGenerator } from '../interfaces/uuid-generator.interface';

/**
 * Node-based implementation of UUID generation (Adapter).
 * Decouples the application from the specific choice of UUID library.
 */
@Injectable()
export class CryptoUuidAdapter implements IUuidGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
