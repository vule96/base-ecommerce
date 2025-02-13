import { Request, Response } from 'express';
import { authService } from '~/services/db/auth.service';
import logger from '~/utils/logger';
import { OkResponse } from '~/utils/success';

class AuthController {
  public login = async (req: Request, res: Response) => {
    logger.info(`AuthController.login - request received`);
    const { username, password } = req.body;
    const data = await authService.login(username, password);
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
