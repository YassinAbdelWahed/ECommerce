import { Global, Module } from '@nestjs/common';
import { TokenModel, UserModel, UserRepository } from 'src/DB';
import { TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/DB/repository/token.repository';

@Global()
@Module({
  imports: [UserModel, TokenModel],
  controllers: [],
  providers: [UserRepository, JwtService, TokenService, TokenRepository],
  exports: [
    UserRepository,
    JwtService,
    TokenRepository,
    TokenService,
    UserModel,
    TokenModel,
  ],
})
export class SharedAuthenticationModule {}
