import 'express-async-errors';
import '~/jobs/token';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { type Application, json, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import http, { Server } from 'http';
import RedisStore from 'rate-limit-redis';

import { RedisClient } from '~/components/cached/redis';
import passport from '~/components/passport';
import { connectPrisma, disconnectPrisma } from '~/components/prisma';
import { env } from '~/core/config';
import { ErrNotFound } from '~/core/error';
import logger from '~/core/logger';
import { errorHandler } from '~/middlewares/error.middleware';
import { morganMiddleware } from '~/middlewares/morgan.middleware';
import { appRoutes } from '~/routes';

let server: Server;
const SERVER_PORT = env.PORT;

const start = (app: Application): void => {
  connectDependencies()
    .then(() => {
      standardMiddleware(app);
      securityMiddleware(app);
      routesMiddleware(app);
      globalErrorHandler(app);
      startServer(app);
    })
    .catch((error) => {
      logger.error(`Failed to start application: ${error}`);
      process.exit(1);
    });
};

async function connectDependencies(): Promise<void> {
  await connectPrisma();
  await RedisClient.init();
}

async function standardMiddleware(app: Application): Promise<void> {
  app.use(morganMiddleware);
  app.use(cookieParser());
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));

  const redisInstance = RedisClient.getInstance().redisClient;

  const ratelimitOptions = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warning(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: 'Too many requests' });
    },
    store: redisInstance
      ? new RedisStore({
          sendCommand: (...args: string[]) => redisInstance.sendCommand(args)
        })
      : undefined
  });

  app.use(ratelimitOptions);
}

function securityMiddleware(app: Application): void {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  // jwt authentication
  app.use(passport.initialize());
}

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

const globalErrorHandler = (app: Application): void => {
  app.all('*', (req, _res, next) => {
    return next(ErrNotFound.withLog(`The url ${req.originalUrl} not found`));
  });

  app.use(errorHandler);
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.success(`Server has started with process id ${process.pid}`);
    server = httpServer.listen(SERVER_PORT, () => {
      logger.success(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.error(`An error occurred while starting server: ${error}`);
    process.exit(1); // Ensure application exits if server fails to start
  }
};

const closeResources = async (): Promise<void> => {
  try {
    // Close server
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error(`Error during server close: ${(err as Error).message}`);
            reject(err);
          } else {
            logger.info('Server closed successfully');
            resolve();
          }
        });
      });
    }

    // Close Redis connection
    try {
      await RedisClient.close();
    } catch (error) {
      logger.error(`Error during Redis disconnect: ${(error as Error).message}`);
    }

    // Close Prisma connection
    try {
      await disconnectPrisma();
    } catch (error) {
      logger.error(`Error during Prisma disconnect: ${(error as Error).message}`);
    }
  } catch (error) {
    logger.error(`Error during resource closure: ${(error as Error).message}`);
  }
};

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal} signal. Disconnecting...`);
  await closeResources();
  process.exit(0);
};

const unexpectedErrorHandler = (error: unknown) => {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  };

  logger.error(`Unexpected error: ${errorInfo}`);
  closeResources().finally(() => process.exit(1));
};

// Global error handling for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Graceful shutdown for SIGINT and SIGTERM
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export { start };
