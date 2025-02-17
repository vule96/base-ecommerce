import { Request, Response } from 'express';

import { authService } from '~/services/db/auth.service';
import { setCookies } from '~/utils/cookie';
import logger from '~/utils/logger';
import { OkResponse } from '~/utils/success';

class AuthController {
  public login = async (req: Request, res: Response) => {
    logger.info(`AuthController.login - request received`);
    const { username, password } = req.body;

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const data = await authService.login(username, password, ipAddress as string, userAgent);

    setCookies(res, {
      accessToken: data.accessToken,
      accessTokenExpiresIn: data.accessTokenExpiresIn,
      refreshToken: data.refreshToken,
      refreshTokenExpiresIn: data.refreshTokenExpiresIn
    });

    new OkResponse({
      message: 'Login successfully',
      metadata: data
    }).send(res);
  };

  public register = async (req: Request, res: Response) => {
    logger.info(`AuthController.register - request received`);
    const user = await authService.register(req.body);
    new OkResponse({
      message: 'Registered successfully',
      metadata: user
    }).send(res);
  };
}

export const authController: AuthController = new AuthController();
