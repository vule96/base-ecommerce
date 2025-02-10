import compression from 'compression';
import cors from 'cors';
import { type Application, json, urlencoded } from 'express';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import http, { Server } from 'http';
import RedisStore from 'rate-limit-redis';
import { RedisClient } from '~/components/cached/redis';
import { connectPrisma, disconnectPrisma } from '~/components/prisma';
import { config } from '~/config';
import { errorHandler } from '~/middlewares/error.middleware';
import { morganMiddleware } from '~/middlewares/morgan.middleware';
import { appRoutes } from '~/routes';
import logger from '~/utils/logger';

let server: Server;
const SERVER_PORT = config.PORT;

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
    ...(redisInstance && {
      store: new RedisStore({
        sendCommand: function (...args: string[]) {
          return redisInstance.sendCommand(args);
        }
      })
    })
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
}

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

function globalErrorHandler(app: Application): void {
  app.use(errorHandler);
}

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.success(`Server has started with process id ${process.pid}`);
    server = httpServer.listen(SERVER_PORT, () => {
      logger.success(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.error(`An error occurred while starting server: ${error}`);
  }
};

const exitHandler = async () => {
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error(`Error during server close: ${(err as Error).message}`);
            reject(err);
          } else {
            logger.info('Disconnected from server');
            resolve();
          }
        });
      });
    }

    try {
      await RedisClient.close();
    } catch (error) {
      logger.error(`Error during redis disconnect: ${(error as Error).message}`);
    }

    try {
      await disconnectPrisma();
    } catch (error) {
      logger.error(`Error during database disconnect: ${(error as Error).message}`);
    }
  } catch (error) {
    logger.error(`Error during exitHandler: ${(error as Error).message}`);
  } finally {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  };

  logger.error(`Unexpected error: ${errorInfo}`);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal} signal. Disconnecting...`);
  try {
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

    try {
      await RedisClient.close();
    } catch (error) {
      logger.error(`Error during redis disconnect: ${(error as Error).message}`);
    }

    try {
      await disconnectPrisma();
    } catch (error) {
      logger.error(`Error during database disconnect: ${(error as Error).message}`);
    }

    process.exit(0);
  } catch (error) {
    logger.error(`Error during ${signal} disconnect: ${(error as Error).message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export { start };
