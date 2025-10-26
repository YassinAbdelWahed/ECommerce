import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import {
  OtpModel,
  OtpRepository,
  TokenModel,
  UserModel,
  UserRepository,
} from 'src/DB';
import { SecurityService, TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/DB/repository/token.repository';

@Module({
  imports: [UserModel, OtpModel, TokenModel],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRepository,
    SecurityService,
    OtpRepository,
    JwtService,
    TokenService,
    TokenRepository,
  ],
})
export class AuthenticationModule {}