import morgan, { StreamOptions } from 'morgan';
import os from 'os';

import { isDevelopment } from '~/utils';
import logger from '~/utils/logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message.replace(os.EOL, ''))
};

const skip = () => {
  return !isDevelopment;
};

export const morganMiddleware = morgan(
  ':remote-addr - :method :url :status :res[content-length] - :response-time ms - :user-agent',
  {
    stream,
    skip
  }
);
