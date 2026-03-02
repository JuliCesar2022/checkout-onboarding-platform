import { Throttle, SkipThrottle } from '@nestjs/throttler';
import {
  THROTTLE_TTL_MS,
  THROTTLE_LIMIT_PUBLIC,
  THROTTLE_LIMIT_DEFAULT,
  THROTTLE_LIMIT_STRICT,
} from '../constants/throttle.constants';

/**
 * Throttle decorators for rate limiting per endpoint
 * Apply to controllers or individual route handlers
 *
 * Usage:
 *   @Controller('products')
 *   @PublicEndpoint()  // 100 req/min
 *   export class ProductsController { ... }
 *
 *   @Post()
 *   @StrictEndpoint()  // 10 req/min — for sensitive operations
 *   create() { ... }
 */

/** Public endpoint — relaxed limit (100 req/min). Use for GET operations, non-sensitive reads. */
export const PublicEndpoint = () => Throttle({ default: { limit: THROTTLE_LIMIT_PUBLIC, ttl: THROTTLE_TTL_MS } });

/** Standard API endpoint — default limit (60 req/min). Use for normal CRUD operations. */
export const ApiEndpoint = () => Throttle({ default: { limit: THROTTLE_LIMIT_DEFAULT, ttl: THROTTLE_TTL_MS } });

/** Strict endpoint — tight limit (10 req/min). Use for sensitive operations: payment, auth. */
export const StrictEndpoint = () => Throttle({ default: { limit: THROTTLE_LIMIT_STRICT, ttl: THROTTLE_TTL_MS } });

/** No throttling — bypass rate limiting. Use for health checks, webhooks, internal endpoints. */
export const NoThrottle = () => SkipThrottle();
