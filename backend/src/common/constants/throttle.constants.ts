/** Default rate-limit window in milliseconds (60 seconds) */
export const THROTTLE_TTL_MS = 60_000;

/** Default max requests per window for standard endpoints */
export const THROTTLE_LIMIT_DEFAULT = 60;

/** Max requests per window for public read-only endpoints (GET) */
export const THROTTLE_LIMIT_PUBLIC = 100;

/** Max requests per window for sensitive endpoints (payment, auth) */
export const THROTTLE_LIMIT_STRICT = 10;
