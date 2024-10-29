import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, NotFoundError } from "@/error-handler";
import {
  RecoverReq,
  ResetPasswordReq,
  SignInReq,
  SignUpReq,
} from "@/schema/auth";
import {
  editUserById,
  getUserByEmail,
  getUserByToken,
  insertUserWithPassword,
} from "@/services/user";
import { signJWT, verifyJWT } from "@/utils/jwt";
import config from "@/config";
import { compareData, encrypt, randId } from "@/utils/helper";
import { createSession } from "@/redis/session";
import { sendEmailProducer } from "@/rabbit/send-email";
import { emaiEnum } from "@/utils/nodemailer";

export async function signUp(
  req: Request<{}, {}, SignUpReq["body"]>,
  res: Response
) {
  const { email, password, fullName } = req.body;
  const user = await getUserByEmail(email);
  if (user) throw new BadRequestError("User already exists");
  await insertUserWithPassword({ email, password, fullName });

  return res.status(StatusCodes.CREATED).send({
    message:
      "Đăng ký thành công. Một email xác nhận sẽ được gửi đến địa chỉ email của bạn. Làm theo hướng dẫn trong email để xác minh tài khoản.",
  });
}

export async function confirmEmail(
  req: Request<{}, {}, {}, { token?: string | string[] | undefined }>,
  res: Response
) {
  const { token } = req.query;
  if (typeof token != "string") throw new NotFoundError();

  const tokenVerify = verifyJWT<{
    type: "emailVerification" | "recoverAccount" | "reActivate";
    session: string;
  }>(token, config.JWT_SECRET);

  if (!tokenVerify) throw new NotFoundError();

  const user = await getUserByToken(tokenVerify);
  if (!user) throw new NotFoundError();

  await editUserById(user.id, {
    emailVerified: true,
  });

  return res.status(StatusCodes.OK).json({
    message: "Xác thực tài khoản thành công",
  });
}

export async function signIn(
  req: Request<{}, {}, SignInReq["body"]>,
  res: Response
) {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user || !user.password || !(await compareData(user.password, password)))
    throw new BadRequestError("Email hoặc mật khẩu không hợp lệ.");

  if (user.status == "SUSPENDED")
    throw new BadRequestError(
      "Tài khoản của bạn đã tạm vô hiệu hoá. Vui lòng kích hoạt lại trước khi đăng nhập"
    );

  if (user.status == "DISABLED")
    throw new BadRequestError("Tài khoản của bạn đã vô hiệu hoá vĩnh viễn");

  if (!user.mfa) {
    const { sessionKey, cookieOpt } = await createSession({
      userId: user.id,
      reqIp: req.ip || "",
      userAgent: req.headers["user-agent"] || "",
    });

    return res
      .status(StatusCodes.OK)
      .cookie(
        config.SESSION_KEY_NAME,
        encrypt(sessionKey, config.SESSION_SECRET),
        {
          ...cookieOpt,
        }
      )
      .json({
        message: "Đăng nhập thành công",
      });
  } else {
    /**
     * TODO: implement  login with MFA
     */

    // const sessionId = await createMFASession(user);
    return res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      // sessionId,
    });
  }
}

export async function recover(
  req: Request<{}, {}, RecoverReq["body"]>,
  res: Response
) {
  const { email } = req.body;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) throw new BadRequestError("Email không tồn tại");

  const expires: Date = new Date(Date.now() + 4 * 60 * 60000);
  const session = await randId();

  await editUserById(existingUser.id, {
    passwordResetToken: session,
    passwordResetExpires: expires,
  });

  const token = signJWT(
    {
      type: "recoverAccount",
      session,
      iat: Math.floor(expires.getTime() / 1000),
    },
    config.JWT_SECRET
  );
  const recoverLink = `${config.CLIENT_URL}/reset-password?token=${token}`;

  await sendEmailProducer({
    template: emaiEnum.RECOVER_ACCOUNT,
    receiver: email,
    locals: {
      username: existingUser.fullName!,
      recoverLink,
    },
  });

  return res.status(StatusCodes.OK).send({
    message: "Email đổi mật khẩu đã được gửi",
  });
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordReq["body"]>,
  res: Response
) {}
