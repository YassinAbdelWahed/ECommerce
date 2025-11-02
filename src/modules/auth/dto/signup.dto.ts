import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from 'src/common';

export class resendConfirmEmailDto {
  @IsEmail()
  email: string;
}

export class confirmEmailDto extends resendConfirmEmailDto {
  @Matches(/^\d{6}$/)
  code: string;
}

export class LoginBodyDto extends resendConfirmEmailDto {
  @IsStrongPassword()
  password: string;
}

export class SignupBodyDto extends resendConfirmEmailDto {
  @Length(2, 52)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  password: string;

  @ValidateIf((data: SignupBodyDto) => {
    return Boolean(data.password);
  })
  @IsMatch<string>(['password'])
  confirmPassword: string;
}
