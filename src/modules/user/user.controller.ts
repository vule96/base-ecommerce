import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/db/user.service';
import { ErrNotFound } from '~/utils/error';

class UserController {
  public getUserByEmail = async (req: Request, res: Response) => {
    const user = await userService.getUserByEmail(req.params.email);
    if (!user) {
      throw ErrNotFound;
    }
    res.status(StatusCodes.OK).json({ data: user });
  };
}

export const userController: UserController = new UserController();
