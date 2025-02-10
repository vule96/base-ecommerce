import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public PORT: number;
  public NODE_ENV: string | undefined;
  public APP_NAME: string | undefined;
  public LOG_FOLDER_PATH: string;
  public LOG_FILE_MAX_SIZE: string;
  public TZ: string | undefined;
  public POSTGRES_HOST: string | undefined;
  public POSTGRES_PORT: number;
  public POSTGRES_USER: string | undefined;
  public POSTGRES_PASSWORD: string | undefined;
  public POSTGRES_DB: string | undefined;
  public REDIS_HOST: string | undefined;
  public REDIS_PORT: number;
  public REDIS_PASSWORD: string | undefined;
  public REDIS_URL: string;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.PORT = parseInt(process.env.PORT as string) || 4000;
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.APP_NAME = process.env.APP_NAME || 'base-ecommerce';
    this.LOG_FOLDER_PATH = process.env.LOG_FOLDER_PATH || 'logs';
    this.LOG_FILE_MAX_SIZE = process.env.LOG_FILE_MAX_SIZE || '10485760';
    this.TZ = process.env.TZ || 'Asia/Ho_Chi_Minh';
    this.POSTGRES_HOST = process.env.POSTGRES_HOST || '';
    this.POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT as string) || 5432;
    this.POSTGRES_USER = process.env.POSTGRES_USER || '';
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
    this.POSTGRES_DB = process.env.POSTGRES_DB || '';
    this.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
    this.REDIS_PORT = parseInt(process.env.REDIS_PORT as string) || 6379;
    this.REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

    let redisUrl = 'redis://';
    if (this.REDIS_PASSWORD) {
      redisUrl += `:${this.REDIS_PASSWORD}@`;
    }
    redisUrl += `${this.REDIS_HOST}:${this.REDIS_PORT}/0`;

    this.REDIS_URL = process.env.REDIS_URL || redisUrl;
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }
}

export const config: Config = new Config();
