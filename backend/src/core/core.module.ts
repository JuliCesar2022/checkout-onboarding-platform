import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { validateEnv } from '../config/env.validation';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * CoreModule — transversal infrastructure
 * Groups all cross-cutting concerns: config, security, database.
 * Imported once in AppModule; keeps AppModule clean.
 */
@Module({
  imports: [
    // Env validation at startup (global — available everywhere)
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    // Rate limiting — default 60 req / 60s per IP (OWASP A05)
    // Override per endpoint using decorators:
    //   @PublicEndpoint() → 100 req/min (GET operations)
    //   @ApiEndpoint() → 60 req/min (default CRUD)
    //   @StrictEndpoint() → 10 req/min (payment, auth, sensitive)
    //   @NoThrottle() → bypass (health checks, webhooks)
    // See: src/common/decorators/throttle.decorators.ts
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    // Database — global Prisma service
    PrismaModule,
  ],
  providers: [
    // Apply ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ConfigModule, PrismaModule],
})
export class CoreModule {}
