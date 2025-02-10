import compression from 'compression';
import cors from 'cors';
import { type Application, json, urlencoded } from 'express';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import RedisStore from 'rate-limit-redis';
import { RedisClient } from '~/cached/redis';
import { config } from '~/config';
import { Database } from '~/database';
import { errorHandler } from '~/middlewares/error.middleware';
import morgan from '~/middlewares/morgan.middleware';
import { appRoutes } from '~/routes';
import logger from '~/utils/logger';

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
  await Database.init();
  await RedisClient.init();
}

async function standardMiddleware(app: Application): Promise<void> {
  app.use(morgan);
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
    httpServer.listen(SERVER_PORT, () => {
      logger.success(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.error(`An error occurred while starting server: ${error}`);
  }
};

export { start };
