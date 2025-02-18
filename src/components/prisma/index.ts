import { PrismaClient } from '@prisma/client';

import logger from '~/core/logger';
import { isProduction } from '~/utils/common';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const global: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
};

export const prisma = global.prismaGlobal ?? prismaClientSingleton();

if (!isProduction) {
  global.prismaGlobal = prisma;
}

export async function connectPrisma() {
  try {
    if (!global.prismaGlobal) {
      global.prismaGlobal = prismaClientSingleton();
    }

    await global.prismaGlobal.$connect();
    logger.success('Successfully connected to the database');
  } catch (error) {
    logger.error(`Failed to connect to the database: ${(error as Error).message}`);
    throw error;
  }
}

export async function disconnectPrisma() {
  try {
    if (global.prismaGlobal) {
      await global.prismaGlobal.$disconnect();
      logger.success('Disconnected from the database');
    } else {
      logger.warning('No Prisma client to disconnect');
    }
  } catch (error) {
    logger.error(`Error during database disconnection: ${(error as Error).message}`);
  } finally {
    global.prismaGlobal = undefined;
  }
}
