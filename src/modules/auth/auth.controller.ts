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
  loginBodyDto,
  resendConfirmEmailDto,
  SignupBodyDto,
} from './dtos';
import { LoginCredentialsResponse } from 'src/common';
import { LoginResponse } from './entities/auth.entity';

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
  ): Promise<{ message: string }> {
    console.log({ body });

    await this.authenticationService.signup(body);
    return { message: 'Done' };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: loginBodyDto): Promise<LoginResponse> {
    const credentials = await this.authenticationService.login(body);
    return { message: 'Done', data: { credentials } };
  }

  @Post('resend-confirm-email')
  async resendConfirmEmail(
    @Body()
    body: resendConfirmEmailDto,
  ): Promise<{ message: string }> {
    console.log({ body });

    await this.authenticationService.resendConfirmEmail(body);
    return { message: 'Done' };
  }

  @Patch('confirm-email')
  async confirmEmail(
    @Body()
    body: confirmEmailDto,
  ): Promise<{ message: string }> {
    console.log({ body });

    await this.authenticationService.confirmEmail(body);
    return { message: 'Done' };
  }
}