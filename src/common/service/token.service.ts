import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { RoleEnum, signatureLevelEnum, TokenEnum } from '../enums';
import { TokenDocument, UserDocument, UserRepository } from 'src/DB';
import { randomUUID } from 'crypto';
import { TokenRepository } from 'src/DB/repository/token.repository';
import { paresObjectId } from '../utils';
import { LoginCredentialsResponse } from '../entities';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}
  generateToken = async ({
    payload,
    options = {
      secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    },
  }: {
    payload: object;
    options?: JwtSignOptions;
  }): Promise<string> => {
    return await this.jwtService.signAsync(payload, options);
  };

  VerifyToken = async ({
    token,
    options = {
      secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
    },
  }: {
    token: string;
    options?: JwtVerifyOptions;
  }): Promise<JwtPayload> => {
    return (await this.jwtService.verifyAsync(
      token,
      options,
    )) as unknown as JwtPayload;
  };

  detectSignature = async (
    role: RoleEnum = RoleEnum.user,
  ): Promise<signatureLevelEnum> => {
    let signatureLevel: signatureLevelEnum = signatureLevelEnum.bearer;
    switch (role) {
      case RoleEnum.admin:
      case RoleEnum.superAdmin:
        signatureLevel = signatureLevelEnum.system;
        break;
      default:
        signatureLevel = signatureLevelEnum.bearer;
        break;
    }
    return signatureLevel;
  };

  getSignature = async (
    signatureLevel: signatureLevelEnum = signatureLevelEnum.bearer,
  ): Promise<{ access_signature: string; refresh_signature: string }> => {
    let signatures: { access_signature: string; refresh_signature: string } = {
      access_signature: '',
      refresh_signature: '',
    };
    switch (signatureLevel) {
      case signatureLevelEnum.system:
        signatures.access_signature = process.env
          .ACCESS_SYSTEM_TOKEN_SIGNATURE as string;
        signatures.refresh_signature = process.env
          .REFRESH_SYSTEM_TOKEN_SIGNATURE as string;
        break;
      default:
        signatures.access_signature = process.env
          .ACCESS_USER_TOKEN_SIGNATURE as string;
        signatures.refresh_signature = process.env
          .REFRESH_USER_TOKEN_SIGNATURE as string;
        break;
    }
    return signatures;
  };

  createLoginCredentials = async (
    user: UserDocument,
  ): Promise<LoginCredentialsResponse> => {
    const signatureLevel = await this.detectSignature(user.role);
    const signatures = await this.getSignature(signatureLevel);
    console.log(signatures);

    const jwtid = randomUUID();
    const access_token = await this.generateToken({
      payload: { _id: user._id },
      options: {
        secret: signatures.access_signature,
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
        jwtid,
      },
    });

    const refresh_token = await this.generateToken({
      payload: { _id: user._id },
      options: {
        secret: signatures.refresh_signature,
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
        jwtid,
      },
    });
    return { access_token, refresh_token };
  };

  decodedToken = async ({
    authorization,
    tokenType = TokenEnum.access,
  }: {
    authorization: string;
    tokenType?: TokenEnum;
  }): Promise<{ user: UserDocument; decoded: JwtPayload }> => {
    try {
      const [bearerKey, token] = authorization.split(' ');
      if (!bearerKey || !token) {
        throw new UnauthorizedException('Missing Token Parts');
      }

      const signatures = await this.getSignature(
        bearerKey as signatureLevelEnum,
      );
      const decoded = await this.VerifyToken({
        token,
        options: {
          secret:
            tokenType === TokenEnum.refresh
              ? signatures.refresh_signature
              : signatures.access_signature,
        },
      });

      if (!decoded.sub || !decoded.iat) {
        throw new BadRequestException('Invalid Token Payload');
      }
      if (
        decoded.iat &&
        (await this.tokenRepository.findOne({ filter: { jti: decoded.jti } }))
      ) {
        throw new UnauthorizedException('Invalid Or Old Login Credentials');
      }

      const user = (await this.userRepository.findOne({
        filter: { _id: decoded.sub },
      })) as UserDocument;
      if (!user) {
        throw new BadRequestException('Not Register Account');
      }

      if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
        throw new UnauthorizedException('Invalid Or Old Login Credentials');
      }

      return { user, decoded };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something Went Wrong !!!!',
      );
    }
  };

  createRevokeToken = async (decoded: JwtPayload): Promise<TokenDocument> => {
    const [result] =
      (await this.tokenRepository.create({
        data: [
          {
            jti: decoded.jti as string,
            expiredAt: new Date(
              (decoded.iat as number) +
                Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            ),
            createdBy: paresObjectId(decoded.sub as string),
          },
        ],
      })) || [];
    if (!result) {
      throw new BadRequestException('Fail To Revoke This Token');
    }
    return result;
  };
}