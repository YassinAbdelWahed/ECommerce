import { EventEmitter } from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from '../email/send.email';
import { verifyEmail } from '../email/verify.template.email';
import { OtpEnum } from 'src/common/enums';
export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
}
emailEvent.on(OtpEnum.ConfirmEmail, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.ConfirmEmail;
    data.html = verifyEmail({ otp: data.otp, title: data.subject });
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail Send Email ❌`, error);
  }
});

emailEvent.on(OtpEnum.ResetPassword, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.ResetPassword;
    data.html = verifyEmail({ otp: data.otp, title: OtpEnum.ResetPassword });
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail Send Email ❌`, error);
  }
});
