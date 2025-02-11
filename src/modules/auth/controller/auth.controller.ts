import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '~/services/db/auth.service';

class AuthController {
  public login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(username, password);
    res.status(StatusCodes.OK).json({ data: { accessToken, refreshToken } });
  };
  public register = async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    res.status(StatusCodes.OK).json({ data: user });
  };
}

export const authController: AuthController = new AuthController();
