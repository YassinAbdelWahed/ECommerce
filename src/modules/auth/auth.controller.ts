import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import {
  confirmEmailDto,
  LoginBodyDto,
  resendConfirmEmailDto,
  SignupBodyDto,
} from './dto/signup.dto';
import { LoginResponse } from './entities/auth.entity';
import { IResponse, successResponse } from 'src/common';

@UsePipes(
  new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signup(
    @Body()
    body: SignupBodyDto,
  ): Promise<IResponse> {
    console.log({ body });

    await this.authenticationService.signup(body);
    return successResponse({ status: 201 });
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginBodyDto): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authenticationService.login(body);
    return successResponse<LoginResponse>({
      message: 'Done',
      data: { credentials },
    });
  }

  @Post('resend-confirm-email')
  async resendConfirmEmail(
    @Body()
    body: resendConfirmEmailDto,
  ): Promise<IResponse> {
    console.log({ body });

    await this.authenticationService.resendConfirmEmail(body);
    return successResponse();
  }

  @Patch('confirm-email')
  async confirmEmail(
    @Body()
    body: confirmEmailDto,
  ): Promise<IResponse> {
    console.log({ body });

    await this.authenticationService.confirmEmail(body);
    return successResponse();
  }
}
