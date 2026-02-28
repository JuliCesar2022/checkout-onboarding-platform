import { Throttle, SkipThrottle } from '@nestjs/throttler';

/**
 * Throttle decorators for rate limiting per endpoint
 * Apply to controllers or individual route handlers
 *
 * Usage:
 *   @Controller('products')
 *   @ApiEndpoint()  // 100 req/min
 *   export class ProductsController { ... }
 *
 *   @Post()
 *   @StrictEndpoint()  // 10 req/min — for sensitive operations
 *   create() { ... }
 */

/**
 * Public endpoint — relaxed limit (100 req/min)
 * Use for GET operations, non-sensitive reads
 */
export const PublicEndpoint = () => Throttle({ default: { limit: 100, ttl: 60000 } });

/**
 * Standard API endpoint — default limit (60 req/min)
 * Use for normal CRUD operations
 */
export const ApiEndpoint = () => Throttle({ default: { limit: 60, ttl: 60000 } });

/**
 * Strict endpoint — tight limit (10 req/min)
 * Use for sensitive operations: login, payment, account changes
 */
export const StrictEndpoint = () => Throttle({ default: { limit: 10, ttl: 60000 } });

/**
 * No throttling — bypass rate limiting
 * Use for health checks, webhooks, internal endpoints
 */
export const NoThrottle = () => SkipThrottle();
