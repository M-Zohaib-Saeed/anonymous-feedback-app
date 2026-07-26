import {resend} from '@/lib/resend';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';



export async function  sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string

) : Promise<ApiResponse> {
    try {
      await resend.emails.send({
      from: 'Anonymous Feedback <onboarding@resend.dev>',
      to: email,
      subject: 'Anonymous feedback Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
      });

      return {success : true, message: 'verivication Email send successfuly'}

    } catch (emailError) {

       console.error("Error sending Verification Email", emailError)
       return {success : false, message: 'failded to send verivication Email'}
    }
}