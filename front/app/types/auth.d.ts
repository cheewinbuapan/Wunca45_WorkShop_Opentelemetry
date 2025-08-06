export {
  Password,
  PasswordConfirmation,
  Email,
  Login,
  ChangePassword,
  Authentication,
  Me,
  Otp,
  OtpExpire,
  Verify,
};

declare global {
  interface Password {
    password: string;
  }
  interface PasswordConfirmation extends Password {
    confirmPassword: string;
  }
  interface Email {
    email: string;
  }
  interface Username {
    username: string;
  }
  interface Login extends Username, Password {}

  interface Otp {
    otp: string;
  }
  interface OtpExpire {
    otp_expire_at: string;
    reference_otp: string;
  }

  interface Verify extends Otp, Token {}

  interface ChangePassword extends PasswordConfirmation {
    old_password: string;
  }
  interface Authentication {
    access_token?: string;
    refresh_token?: string;
  }

  interface Me extends Username {
    fullName?: string;
    phone?: string;
    role: Role;
  }
}
