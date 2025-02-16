import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from '~/components/jwt';
import { env } from '~/config';
import { ErrInvalidUsernameAndPassword } from '~/modules/auth/auth.error';
import type { UserRegistrationDTO } from '~/modules/user/user.schema';
import { tokenService } from '~/services/db/token.service';
import { userService } from '~/services/db/user.service';
import { AppError } from '~/utils/error';

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

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await this.createTokens(
      user,
      accessTokenKey,
      refreshTokenKey
    );

    const tokenData = {
      token: refreshToken,
      userId: user.id,
      expiresIn: refreshTokenExpiresIn as unknown as bigint
    };

    await tokenService.upsert(tokenData);

    return {
      ...userData,
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn
    };
  };

  public register = async (data: UserRegistrationDTO) => {
    const user = await userService.create(data);
    return user;
  };

  private createTokens = async (user: User, accessTokenKey: string, refreshTokenKey: string) => {
    const accessTokenPayload = new JwtPayload(
      env.TOKEN_ISSUER as string,
      env.TOKEN_AUDIENCE as string,
      user.id.toString(),
      accessTokenKey,
      env.ACCESS_TOKEN_VALIDITY_SEC
    );
    const refreshTokenPayload = new JwtPayload(
      env.TOKEN_ISSUER as string,
      env.TOKEN_AUDIENCE as string,
      user.id.toString(),
      refreshTokenKey,
      env.REFRESH_TOKEN_VALIDITY_SEC
    );

    const [accessToken, refreshToken] = await Promise.all([
      jwt.encode(accessTokenPayload),
      jwt.encode(refreshTokenPayload)
    ]);

    if (!accessToken || !refreshToken)
      throw AppError.from(new Error('An error occurred while generating tokens'), StatusCodes.INTERNAL_SERVER_ERROR);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: accessTokenPayload.exp,
      refreshTokenExpiresIn: refreshTokenPayload.exp
    };
  };
}

export const authService = new AuthService();
