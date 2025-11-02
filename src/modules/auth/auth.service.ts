import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IUser,
  LoginCredentialsResponse,
  SecurityService,
  TokenService,
} from 'src/common';
import { OtpRepository, UserDocument, UserRepository } from 'src/DB';
import {
  confirmEmailDto,
  LoginBodyDto,
  resendConfirmEmailDto,
  SignupBodyDto,
} from './dto/signup.dto';

import { generateNumericalOtp } from 'src/common/utils/security/otp.security';
import { Types } from 'mongoose';
import { OtpEnum, ProviderEnum } from 'src/common/enums';

@Injectable()
export class AuthenticationService {
  private user: IUser[] = [];
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityService: SecurityService,
    private readonly otpRepository: OtpRepository,
    private readonly tokenService: TokenService,
  ) {}

  private async createConfirmEmailOtp(userId: Types.ObjectId) {
    await this.otpRepository.create({
      data: [
        {
          code: generateNumericalOtp(),
          expiredAt: new Date(Date.now() + 2 * 60 * 1000),
          createdBy: userId,
          type: OtpEnum.ConfirmEmail,
        },
      ],
    });
  }

  async signup(data: SignupBodyDto): Promise<string> {
    const { username, email, password } = data;
    const checkEmailExists = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkEmailExists) {
      throw new ConflictException('Email Exists');
    }

    const [user] = await this.userRepository.create({
      data: [
        {
          username,
          email,
          password,
          // password: await this.securityService.generateHash(password),
        },
      ],
    });
    if (!user) {
      throw new BadRequestException('Fail To Signup This Account');
    }

    await this.createConfirmEmailOtp(user._id);
    return 'Done';
  }

  async confirmEmail(data: confirmEmailDto): Promise<string> {
    const { email, code } = data;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmAt: { $exists: false },
      },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException('Account Not Exists');
    }

    console.log(user.otp);
    if (
      !(
        user.otp?.length &&
        (await this.securityService.compareHash(code, user.otp[0].code))
      )
    ) {
      throw new BadRequestException('Invalid Code');
    }

    user.confirmAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({
      filter: { _id: user.otp[0]._id },
    });
    return 'Done';
  }

  async resendConfirmEmail(data: resendConfirmEmailDto): Promise<string> {
    const { email } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    console.log({ user });

    if (!user) {
      throw new NotFoundException('Account Not Exists');
    }

    if (user.otp?.length) {
      throw new ConflictException('Sorry Please Try Again Late');
    }
    await this.createConfirmEmailOtp(user._id);
    return 'Done';
  }

  async login(data: LoginBodyDto): Promise<LoginCredentialsResponse> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmAt: { $exists: true },
        provide: ProviderEnum.SYSTEM,
      },
    });
    if (!user) {
      throw new NotFoundException('Fail To Find Matching Account');
    }

    if (!(await this.securityService.compareHash(password, user.password))) {
      throw new NotFoundException('Fail To Find Matching Account');
    }

    return await this.tokenService.createLoginCredentials(user as UserDocument);
  }
}
