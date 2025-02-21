declare namespace Express {
  export interface Request {
    currentUser: UserPayload;
    paging: PagingDTO;
  }
}

interface UserPayload {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
}

interface JwtPayloadType {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;
}
