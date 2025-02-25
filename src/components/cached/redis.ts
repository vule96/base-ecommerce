import { createClient, type RedisClientType } from 'redis';

import { env } from '~/core/config';
import logger from '~/core/logger';

export class RedisClient {
  private static instance: RedisClient | null = null;
  public redisClient: RedisClientType | null = null;

  private constructor() {
    this.redisClient = createClient({ url: `${env.REDIS_URL}` });
  }

  public static async init(): Promise<void> {
    if (!this.instance) {
      const redisClient = new RedisClient();
      try {
        await redisClient._connect();
        RedisClient.instance = redisClient;
      } catch (error) {
        logger.error(`Failed to initialize Redis: ${error}`);
        throw error;
      }
    } else {
      logger.info('Redis client already initialized');
    }
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      throw new Error('RedisClient instance not initialized');
    }
    return RedisClient.instance;
  }

  private async _connect(): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client not created');
    }

    try {
      await this.redisClient.connect();
      logger.success('Connected to Redis server');
    } catch (error) {
      logger.error(`Failed to connect to Redis server: ${error}`);
      this.redisClient = null;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.redisClient) {
      try {
        await this.redisClient.disconnect();
        logger.success('Disconnected from Redis server');
      } catch (error) {
        logger.error(`Error during Redis disconnect: ${error}`);
      } finally {
        this.redisClient = null;
      }
    } else {
      logger.warning('Redis client was not initialized or already disconnected, skipping disconnect');
    }
  }

  public static async close(): Promise<void> {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.disconnect();
      } catch (error) {
        logger.error(`Error during redis disconnect: ${(error as Error).message}`);
      } finally {
        RedisClient.instance = null;
      }
    } else {
      logger.warning('Redis client instance is not initialized, nothing to close');
    }
  }
}
