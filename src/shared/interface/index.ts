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
