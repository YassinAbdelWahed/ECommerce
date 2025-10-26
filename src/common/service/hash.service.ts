import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class SecurityService {
  constructor() {}

  generateHash = async (
    plaintext: string,
    salt_round: number = parseInt(process.env.SALT as string),
  ): Promise<string> => {
    return await hash(plaintext, salt_round);
  };

  compareHash = async (
    plaintext: string,
    hashValue: string,
  ): Promise<boolean> => {
    return await compare(plaintext, hashValue);
  };
}