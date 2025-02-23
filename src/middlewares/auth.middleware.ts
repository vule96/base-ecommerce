import type { NextFunction, Request, Response } from 'express';

import passport from '~/components/passport';
import { ErrUnauthorized } from '~/core/error';

const verifyCallback =
  (req: Request, next: NextFunction): passport.AuthenticateCallback =>
  (err: unknown, user: Express.User | false | null | undefined, info: unknown) => {
    if (err || info || !user) {
      // if (info instanceof TokenExpiredError) {
      //   return next(ErrUnauthorized.withLog('Token expired'));
      // }
      return next(ErrUnauthorized.withLog('Please authenticate'));
    }
    req.user = user as UserPayload;
    return next();
  };

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate('jwt', { session: false }, verifyCallback(req, next))(req, res, next);
};
