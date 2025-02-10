import { type RedisClientType, createClient } from 'redis';
import { config } from '~/config';
import logger from '~/utils/logger';

export class RedisClient {
  private static instance: RedisClient | null = null;
  public redisClient: RedisClientType | null = null;

  /**
   * Constructor (private để thực hiện Singleton pattern).
   */
  private constructor() {
    this.redisClient = createClient({ url: `${config.REDIS_URL}` });
  }

  /**
   * Khởi tạo RedisClient (Singleton pattern).
   * @returns {Promise<void>}
   */
  public static async init(): Promise<void> {
    if (!this.instance) {
      const redisClient = new RedisClient();
      try {
        await redisClient._connect();
        RedisClient.instance = redisClient;
      } catch (error) {
        logger.error(`Failed to initialize redis: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Lấy instance của RedisClient (Singleton pattern).
   * @returns {RedisClient}
   * @throws {Error} Nếu RedisClient chưa được khởi tạo.
   */
  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      throw new Error('RedisClient instance not initialized');
    }
    return RedisClient.instance;
  }

  /**
   * Kết nối đến Redis server.
   * @returns {Promise<void>}
   * @private
   */
  private async _connect(): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client not created');
    }

    try {
      await this.redisClient.connect();
      logger.success('Connected to redis server');
    } catch (error) {
      logger.error(`Failed to connect to Redis server: ${error}`);
      this.redisClient = null;
      throw error;
    }
  }

  /**
   * Ngắt kết nối khỏi Redis server.
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    if (this.redisClient) {
      try {
        await this.redisClient.disconnect();
        logger.info('Disconnected from redis server');
      } catch (error) {
        logger.error(`Error during Redis disconnect: ${error}`);
      } finally {
        this.redisClient = null;
      }
    } else {
      logger.warning('Redis client was not initialized, skipping disconnect');
    }
  }

  /**
   * Đóng kết nối Redis (được gọi khi ứng dụng tắt).
   * @returns {Promise<void>}
   */
  public static async close(): Promise<void> {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.disconnect();
      } catch (error) {
        logger.error(`Error during redis disconnect: ${(error as Error).message}`);
      } finally {
        RedisClient.instance = null;
      }
    }
  }
}

process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal.  Disconnecting from redis...');
  try {
    await RedisClient.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during Redis disconnect: ${(error as Error).message}`);
    process.exit(1);
  }
});
