import { PrismaClient } from '@prisma/client';
import { isProduction } from '~/utils';
import logger from '~/utils/logger';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (!isProduction) {
  globalThis.prismaGlobal = prisma;
}

export async function connectPrisma() {
  try {
    if (!globalThis.prismaGlobal) {
      globalThis.prismaGlobal = prismaClientSingleton();
    }

    await (globalThis.prismaGlobal as PrismaClient).$connect();
    logger.success('Connected to database');
  } catch (error) {
    logger.error(`Failed to connect to database: ${(error as Error).message}`);
    throw error;
  }
}

export async function disconnectPrisma() {
  if (globalThis.prismaGlobal) {
    await globalThis.prismaGlobal.$disconnect();
    logger.info(`Disconnected from database`);
    globalThis.prismaGlobal = undefined;
  }
}
