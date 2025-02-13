import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from '~/components/jwt';
import { config } from '~/config';
import { ErrInvalidUsernameAndPassword } from '~/modules/auth/auth.error';
import type { UserRegistrationDTO } from '~/modules/user/user.schema';
import { userService } from '~/services/db/user.service';
import { AppError } from '~/utils/error';
import { tokenService } from './token.service';

class AuthService {
  public login = async (usernameOrEmail: string, password: string) => {
    // 1. Find user with username or email
    const user = await userService.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      throw AppError.from(ErrInvalidUsernameAndPassword, StatusCodes.BAD_REQUEST).withLog('Username not found');
    }

    const { password: userPass, salt, ...userData } = user;

    // 2. Check password
    const isMatch = await bcrypt.compare(`${password}.${salt}`, userPass);
    if (!isMatch) {
      throw AppError.from(ErrInvalidUsernameAndPassword, StatusCodes.BAD_REQUEST).withLog('Password is incorrect');
    }

    // if (user.status === Status.DELETED || user.status === Status.INACTIVE) {
    //   throw AppError.from(ErrUserInactivated, 400);
    // }

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const { accessToken, refreshToken } = await this.createTokens(user, accessTokenKey, refreshTokenKey);

    const tokenData = {
      token: refreshToken,
      userId: user.id
    };

    await tokenService.create(tokenData);

    return {
      ...userData,
      accessToken,
      refreshToken
    };
  };

  public register = async (data: UserRegistrationDTO) => {
    const user = await userService.createUser(data);
    return user;
  };

  private createTokens = async (user: User, accessTokenKey: string, refreshTokenKey: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.encode(
        new JwtPayload(
          config.TOKEN_ISSUER as string,
          config.TOKEN_AUDIENCE as string,
          user.id.toString(),
          accessTokenKey,
          config.ACCESS_TOKEN_VALIDITY_SEC
        )
      ),
      jwt.encode(
        new JwtPayload(
          config.TOKEN_ISSUER as string,
          config.TOKEN_AUDIENCE as string,
          user.id.toString(),
          refreshTokenKey,
          config.REFRESH_TOKEN_VALIDITY_SEC
        )
      )
    ]);

    if (!accessToken || !refreshToken)
      throw AppError.from(new Error('An error occurred while generating tokens'), StatusCodes.INTERNAL_SERVER_ERROR);

    return { accessToken, refreshToken };
  };
}

export const authService = new AuthService();
