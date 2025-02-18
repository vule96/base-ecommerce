import { Pool } from 'pg';

import { env } from '~/core/config';
import logger from '~/core/logger';

export class Database {
  private pool: Pool | null = null;
  private static instance: Database | null = null;

  private constructor() {
    this.pool = new Pool({
      host: env.POSTGRES_HOST,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      port: env.POSTGRES_PORT,
      database: env.POSTGRES_DB,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
      // ...(env.NODE_ENV !== 'development' && {
      //   ssl: {
      //     rejectUnauthorized: false
      //   }
      // })
    });
  }

  public static async init(): Promise<void> {
    if (!this.instance) {
      try {
        const db = new Database();
        await db._connect();
        this.instance = db;
      } catch (error) {
        logger.error(`Failed to initialize database: ${error}`);
        this.instance = null;
        throw error;
      }
    }
  }

  public static getInstance(): Database {
    if (!this.instance) {
      throw new Error('Database instance not initialized');
    }
    return this.instance;
  }

  private async _connect(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool is not initialized');
    }
    try {
      await this.pool.connect();
      logger.success('Connected to database');
    } catch (error) {
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      logger.info('Disconnected database');
      await this.pool.end();
      this.pool = null;
    } else {
      logger.warning('Database was not initialized, skipping disconnect');
    }
  }

  public static async close(): Promise<void> {
    if (this.instance) {
      try {
        await this.instance.disconnect();
      } catch (error) {
        logger.error(`Error during database disconnect: ${(error as Error).message}`);
      } finally {
        this.instance = null;
      }
    }
  }
}

process.on('SIGINT', async () => {
  logger.info(`Received SIGINT signal.  Disconnecting from database...`);
  try {
    await Database.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during Database disconnect: ${(error as Error).message}`);
    process.exit(1);
  }
});
