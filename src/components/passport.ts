import type { Request } from 'express';
import fs from 'fs';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, type StrategyOptions } from 'passport-jwt';
import path from 'path';

import { userService } from '~/services/db/user.service';

const publicKey = fs.readFileSync(path.join(__dirname, '../../keys/public.pem'), 'utf8');

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => {
      if (!req?.cookies?.access_token) return null;
      try {
        return JSON.parse(req.cookies.access_token).token || null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return null;
      }
    }
  ]),
  secretOrKey: publicKey,
  algorithms: ['RS256'],
  ignoreExpiration: false,
  passReqToCallback: true
};

passport.use(
  new JwtStrategy(options, async (req: Request, payload: JwtPayloadType, done) => {
    try {
      const user = await userService.findById(payload.sub);
      const refreshToken = req.cookies?.refresh_token ? JSON.parse(req.cookies.refresh_token).token : null;

      if (!user) {
        return done(null, false);
      }
      done(null, { ...user, refreshToken });
    } catch (error) {
      done(error, false);
    }
  })
);

export default passport;
