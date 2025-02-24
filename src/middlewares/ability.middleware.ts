import { NextFunction, Request, Response } from 'express';

import { type Actions, AppSubjects, defineAbilityFor } from '~/core/ability';
import { ErrForbidden, ErrUnauthorized } from '~/core/error';
import { UserRole } from '~/shared/interface';

export const checkPermission = (action: Actions, resourceType: AppSubjects) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(ErrUnauthorized.withLog('Please authenticate'));
    }

    const ability = defineAbilityFor(req.user.role as UserRole);

    if (!ability.can(action, resourceType)) {
      return next(ErrForbidden.withLog('Access denied'));
    }

    return next();
  };
};
