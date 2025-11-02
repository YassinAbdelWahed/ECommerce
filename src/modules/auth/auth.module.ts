import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { OtpModel, OtpRepository } from 'src/DB';
import { SecurityService } from 'src/common';


@Module({
  imports: [OtpModel],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SecurityService, OtpRepository],
  exports: [],
})
export class AuthenticationModule {}
