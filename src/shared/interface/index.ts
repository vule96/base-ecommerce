export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}
