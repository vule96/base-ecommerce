import { config } from '~/config';

export const isProduction = config.NODE_ENV === 'production';
