export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
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

export interface KeyValue {
  id: string;
  name: string;
  value: string;
}
