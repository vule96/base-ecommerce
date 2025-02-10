import express, { type Express } from 'express';
import { start } from '~/server';

const initialize = async () => {
  const app: Express = express();
  start(app);
};

initialize();
