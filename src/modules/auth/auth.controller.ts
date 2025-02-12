import { Request, Response } from 'express';
import { authService } from '~/services/db/auth.service';
import logger from '~/utils/logger';
import { successResponse } from '~/utils/success';

class AuthController {
  public login = async (req: Request, res: Response) => {
    logger.info(`AuthController.login - request received`);
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(username, password);
    successResponse({ accessToken, refreshToken }, res);
  };
  public register = async (req: Request, res: Response) => {
    logger.info(`AuthController.register - request received`);
    const user = await authService.register(req.body);
    successResponse(user, res);
  };
}

export const authController: AuthController = new AuthController();
