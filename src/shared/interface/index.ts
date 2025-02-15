export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface TokenResponse {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}
