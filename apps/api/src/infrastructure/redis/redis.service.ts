import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { CACHE_TTL, SetOptions } from './types.js';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redisClient: RedisClientType;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6380';

    this.redisClient = createClient({
      url: redisUrl,
    });

    this.redisClient.on('error', (err) =>
      console.error('Redis Client Error', err),
    );
  }

  async onModuleInit() {
    await this.redisClient.connect();
    console.log('Connected to Redis');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    console.log('Disconnected from Redis');
  }

  async set(options: SetOptions): Promise<void> {
    let { key, value, expirationInSeconds } = options;

    if (!expirationInSeconds) {
      expirationInSeconds = CACHE_TTL.STANDARD;
    }

    await this.redisClient.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redisClient.exists(key)) > 0;
  }

  async expire(key: string, expirationInSeconds: number): Promise<boolean> {
    return (await this.redisClient.expire(key, expirationInSeconds)) > 0;
  }

  getClient(): RedisClientType {
    return this.redisClient;
  }
}
