import { google } from "googleapis";
import nodemailer from "nodemailer";
import config from "@/config";
import Email from "email-templates";
import path from "path";

const oAuth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: config.GOOGLE_REFRESH_TOKEN });

export enum emaiEnum {
  VERIFY_EMAIL = "verifyEmail",
  SIGNUP = "signup",
  RECOVER_ACCOUNT = "recoverAccount",
  REACTIVATE_ACCOUNT = "reactivateAccount",
  OTP_VERIFY_ACCOUNT = "otpVerifyAccount",
}

type LocalsPayload = {
  [emaiEnum.VERIFY_EMAIL]: {
    username: string;
    verificationLink: string;
  };
  [emaiEnum.SIGNUP]: {
    verificationLink: string;
  };
  [emaiEnum.RECOVER_ACCOUNT]: {
    username: string;
    recoverLink: string;
  };
  [emaiEnum.REACTIVATE_ACCOUNT]: {
    username: string;
    reactivateLink: string;
  };
  [emaiEnum.OTP_VERIFY_ACCOUNT]: {
    otp: string;
  };
};

type BuilMap<T extends { [index: string]: any }> = {
  [Key in keyof T]: T[Key] extends object
    ? {
        template: Key;
        receiver: string;
        locals: T[Key];
      }
    : { template: Key };
};

export type SendMailType = BuilMap<LocalsPayload>[keyof LocalsPayload];

export const sendMail = async ({
  template,
  receiver,
  locals,
}: SendMailType) => {
  try {
    const accessToken = (await oAuth2Client.getAccessToken()) as string;
    const smtpTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.SENDER_EMAIL,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
        accessToken,
      },
    });
    const email: Email = new Email({
      message: {
        from: `I.C.H App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        applyStyleTags: true,
        // preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "..", "/emails"),
        },
      },
    });
    await email.send({
      template: path.join(__dirname, "..", "/emails", template),
      message: { to: receiver },
      locals: {
        appIcon: config.APP_ICON,
        appLink: config.CLIENT_URL,
        ...locals,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    console.log(error);
  }
};
