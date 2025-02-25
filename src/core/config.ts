import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('4000'),
  APP_NAME: z.string(),
  LOG_FOLDER_PATH: z.string(),
  LOG_FILE_MAX_SIZE: z.string(),
  TZ: z.string(),
  ACCESS_TOKEN_VALIDITY_SEC: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('172800'),
  REFRESH_TOKEN_VALIDITY_SEC: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('604800'),
  TOKEN_ISSUER: z.string(),
  TOKEN_AUDIENCE: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('5432'),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('6379'),
  REDIS_PASSWORD: z.string(),
  REDIS_URL: z.string(),
  ELASTIC_SEARCH_URL: z.string()
});

export const serverEnv = envSchema.safeParse(process.env);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors: Record<string, any>
) =>
  Object.entries(errors)
    .map(([name, value]) => (value._errors?.join(', ') ? `${name}: ${value._errors.join(', ')}` : ''))
    .filter(Boolean);

if (!serverEnv.success) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(serverEnv.error.format()));
  throw new Error('Invalid environment variables');
}

export const env = serverEnv.data;
