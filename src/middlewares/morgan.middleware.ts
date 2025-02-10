import morgan, { StreamOptions } from 'morgan';
import os from 'os';
import { config } from '~/config';
import logger from '~/utils/logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message.replace(os.EOL, ''))
};

const skip = () => {
  return config.NODE_ENV !== 'development';
};

export const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream,
  skip
});
