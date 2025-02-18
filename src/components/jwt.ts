/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from 'fs';
import { sign, verify } from 'jsonwebtoken';
import path from 'path';
import { promisify } from 'util';

/*
 * issuer    — Software organization who issues the token.
 * subject   — Intended user of the token.
 * audience  — Basically identity of the intended recipient of the token.
 * expiresIn — Expiration time after which the token will be invalid.
 * algorithm — Encryption algorithm to be used to protect the token.
 */

export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;

  constructor(issuer: string, audience: string, subject: string, param: string, validity: number) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000); // thời gian tạo token
    this.exp = this.iat + validity; // thời gian hết hạn token
    this.prm = param;
  }
}

// Hàm đọc khóa công khai
async function readPublicKey(): Promise<string> {
  try {
    return await promisify(readFile)(path.join(__dirname, '../../keys/public.pem'), 'utf8');
  } catch (e) {
    throw new Error('Failed to read public key');
  }
}

// Hàm đọc khóa riêng tư
async function readPrivateKey(): Promise<string> {
  try {
    return await promisify(readFile)(path.join(__dirname, '../../keys/private.pem'), 'utf8');
  } catch (e) {
    throw new Error('Failed to read private key');
  }
}

// Hàm mã hóa (sign) JWT với payload
async function encode(payload: JwtPayload): Promise<string> {
  const privateKey = await readPrivateKey();
  if (!privateKey) throw new Error('Token generation failure');
  // @ts-expect-error
  return promisify(sign)({ ...payload }, privateKey, { algorithm: 'RS256' });
}

/**
 * Phương thức này kiểm tra token và trả về dữ liệu giải mã khi token hợp lệ
 */
async function validate(token: string): Promise<JwtPayload> {
  const publicKey = await readPublicKey();
  try {
    // @ts-expect-error
    return (await promisify(verify)(token, publicKey)) as JwtPayload;
  } catch (e: any) {
    if (e && e.name === 'TokenExpiredError') throw new Error();
    // throws error if the token has not been encrypted by the private key
    throw new Error('Invalid token');
  }
}

/**
 * Trả về payload đã giải mã nếu chữ ký hợp lệ, ngay cả khi token đã hết hạn
 */
async function decode(token: string): Promise<JwtPayload> {
  const publicKey = await readPublicKey();
  try {
    // @ts-expect-error
    return (await promisify(verify)(token, publicKey, {
      ignoreExpiration: true
    })) as JwtPayload;
  } catch (e: any) {
    throw new Error('Invalid token');
  }
}

export default {
  encode,
  validate,
  decode
};
