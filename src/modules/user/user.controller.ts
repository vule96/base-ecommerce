import type { Request, Response } from 'express';

import logger from '~/core/logger';
import { OkResponse } from '~/core/success';
import { userService } from '~/services/db/user.service';

class UserController {
  public findById = async (req: Request, res: Response) => {
    logger.info(`UserController.findById - request received`);
    const user = await userService.findById(req.params.id);

    new OkResponse({
      message: 'Find user by id successfully',
      metadata: user || {}
    }).send(res);
  };

  public profile = async (req: Request, res: Response) => {
    logger.info(`UserController.profile - request received`);

    new OkResponse({
      message: 'Get profile successfully',
      metadata: req.user
    }).send(res);
  };
}

export const userController: UserController = new UserController();
