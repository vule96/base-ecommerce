import type { Response } from 'express';
import { TokenResponse } from '~/shared/interface';

export const accessTokenKey = 'access-token';
export const refreshTokenKey = 'refresh-token';

export function setCookies(res: Response, data: TokenResponse) {
  res.cookie(
    accessTokenKey,
    JSON.stringify({
      token: data.accessToken,
      expires: data.accessTokenExpiresIn
    }),
    {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(data.accessTokenExpiresIn * 1000)
    }
  );

  res.cookie(
    refreshTokenKey,
    JSON.stringify({
      token: data.refreshToken,
      expires: data.refreshTokenExpiresIn
    }),
    {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(data.refreshTokenExpiresIn * 1000)
    }
  );
}

export function removeCookies(res: Response) {
  res.clearCookie(accessTokenKey);
  res.clearCookie(refreshTokenKey);
}
