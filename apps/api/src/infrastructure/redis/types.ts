export interface SetOptions {
    key: string;
    value: string;
    expirationInSeconds?: number;
}

export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes (Spam prevention, OTPs)
  STANDARD: 3600,  // 1 hour (Default database data caching)
  LONG: 86400,     // 24 hours (Static configurations, assets)
};