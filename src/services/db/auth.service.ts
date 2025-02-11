import { Users } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { JwtPayload } from '~/components/jwt';
import { config } from '~/config';
import { ErrInvalidUsernameAndPassword } from '~/modules/auth/error';
import type { UserRegistrationDTO } from '~/modules/user/schema/user.schema';
import { AppError, ErrInternalServer } from '~/utils/error';
import { userService } from './user.service';

class AuthService {
  public login = async (usernameOrEmail: string, password: string) => {
    // 1. Find user with username or email
    const user = await userService.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog('Username not found');
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(`${password}.${user.salt}`, user.password);
    if (!isMatch) {
      throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog('Password is incorrect');
    }

    // if (user.status === Status.DELETED || user.status === Status.INACTIVE) {
    //   throw AppError.from(ErrUserInactivated, 400);
    // }

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const { accessToken, refreshToken } = await this.createTokens(user, accessTokenKey, refreshTokenKey);
    return {
      accessToken,
      refreshToken
    };
  };

  public register = async (data: UserRegistrationDTO) => {
    const user = await userService.createUser(data);
    return user;
  };

  private createTokens = async (user: Users, accessTokenKey: string, refreshTokenKey: string) => {
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

    if (!accessToken || !refreshToken) throw ErrInternalServer;

    return { accessToken, refreshToken };
  };
}

export const authService = new AuthService();
