import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import jwt, { JwtPayload } from '~/components/jwt';
import { env } from '~/core/config';
import { AppError, ErrUnauthorized } from '~/core/error';
import { ErrInvalidUsernameAndPassword } from '~/modules/auth/auth.error';
import type { UserRegistrationDTO } from '~/modules/user/user.schema';
import { tokenService } from '~/services/db/token.service';
import { userService } from '~/services/db/user.service';

class AuthService {
  public login = async (usernameOrEmail: string, password: string, ipAddress: string, userAgent: string) => {
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
      ipAddress,
      userAgent,
      expiresAt: new Date(refreshTokenExpiresIn * 1000)
    };

    await tokenService.create(tokenData);

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

  public logout = async (token: string) => {
    const refreshToken = await tokenService.findByCond({ token, isBlacklisted: false });
    if (refreshToken) {
      await tokenService.delete({ id: refreshToken.id });
    }
  };

  public refresh = async (req: Request, ipAddress: string, userAgent: string) => {
    if (!req.cookies?.refresh_token) {
      throw ErrUnauthorized.withLog('Refresh token not found in cookies');
    }

    let rfToken: string;
    try {
      const parsedToken = JSON.parse(req.cookies.refresh_token);
      rfToken = parsedToken?.token;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw ErrUnauthorized.withLog('Invalid refresh token format');
    }

    if (!rfToken) throw ErrUnauthorized.withLog('Refresh token is missing');

    const payload = await jwt.decode(rfToken);
    if (!payload) throw ErrUnauthorized.withLog('Invalid refresh token');

    const storedToken = await tokenService.findByCond({ token: rfToken, isBlacklisted: false });
    if (!storedToken) throw ErrUnauthorized.withLog('Refresh token is invalid or has been revoked');

    const user = await userService.findById(payload.sub);
    if (!user) throw ErrUnauthorized.withLog('User not found');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await this.createTokens(
      user,
      accessTokenKey,
      refreshTokenKey
    );

    await tokenService.delete({ id: storedToken.id });

    const tokenData = {
      token: refreshToken,
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt: new Date(refreshTokenExpiresIn * 1000)
    };

    await tokenService.create(tokenData);

    return {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn
    };
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

  // private validateTokenData = (payload: JwtPayload) => {
  //   if (
  //     !payload ||
  //     !payload.iss ||
  //     !payload.sub ||
  //     !payload.aud ||
  //     !payload.prm ||
  //     payload.iss !== env.TOKEN_ISSUER ||
  //     payload.aud !== env.TOKEN_AUDIENCE
  //     // !Types.ObjectId.isValid(payload.sub)
  //   )
  //     throw ErrUnauthorized.withLog('Access token is invalid');
  //   return true;
  // };
}

export const authService = new AuthService();
