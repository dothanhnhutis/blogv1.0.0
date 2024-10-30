import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, NotFoundError } from "@/error-handler";
import {
  RecoverReq,
  ResetPasswordReq,
  SendReActivateAccountReq,
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
import { deleteUserCacheToken, saveUserCacheByToken } from "@/redis/user.cache";
import { UserToken } from "@/schema/user";

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

  const tokenVerify = verifyJWT<UserToken>(token, config.JWT_SECRET);

  if (!tokenVerify || tokenVerify.type != "emailVerification")
    throw new BadRequestError("Phiên của bạn đã hết hạn.");
  const user = await getUserByToken(tokenVerify);
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

  await Promise.all([
    editUserById(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: new Date(),
    }),
    deleteUserCacheToken(tokenVerify),
  ]);

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
    throw new BadRequestError("Email và mật khẩu không hợp lệ.");

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
  const user = await getUserByEmail(email);
  if (!user) throw new BadRequestError("Email không tồn tại");

  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);
  const session = await randId();

  const token = signJWT(
    {
      type: "recover",
      session,
      iat: expires,
    },
    config.JWT_SECRET
  );
  const recoverLink = `${config.CLIENT_URL}/reset-password?token=${token}`;

  await Promise.all([
    editUserById(user.id, {
      passwordResetToken: session,
      passwordResetExpires: new Date(expires * 1000),
    }),
    saveUserCacheByToken(
      { type: "recover", session },
      user.id,
      new Date(expires * 1000).getTime() - Date.now()
    ),
    sendEmailProducer({
      template: emaiEnum.RECOVER_ACCOUNT,
      receiver: user!.email,
      locals: {
        username: user!.fullName,
        recoverLink,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Email đổi mật khẩu đã được gửi",
  });
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordReq["body"], ResetPasswordReq["query"]>,
  res: Response
) {
  const { token } = req.query;

  if (typeof token != "string") throw new NotFoundError();

  const tokenVerify = verifyJWT<UserToken>(token, config.JWT_SECRET);

  if (!tokenVerify || tokenVerify.type != "recover")
    throw new BadRequestError("Phiên của bạn đã hết hạn.");

  const { password } = req.body;

  const user = await getUserByToken(tokenVerify);
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

  await Promise.all([
    editUserById(user.id, {
      password,
      passwordResetExpires: new Date(),
      passwordResetToken: null,
    }),
    deleteUserCacheToken(tokenVerify),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Đặt lại mật khẩu thành công",
  });
}

export async function sendReactivateAccount(
  req: Request<{}, {}, SendReActivateAccountReq["body"]>,
  res: Response
) {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) throw new BadRequestError("Email không tồn tại");
  if (user.status == "ACTIVE")
    throw new BadRequestError("Tài khoản của bạn đang hoạt động");
  if (user.status == "DISABLED")
    throw new BadRequestError("Tài khoản của bạn đã bị vô hiệu hoá vĩnh viễn");

  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);
  const session = await randId();

  const token = signJWT(
    {
      type: "reActivate",
      session,
      iat: expires,
    },
    config.JWT_SECRET
  );
  const reactivateLink = `${config.CLIENT_URL}/reactivate?token=${token}`;

  await Promise.all([
    editUserById(user.id, {
      reActiveToken: session,
      reActiveExpires: new Date(expires * 1000),
    }),
    saveUserCacheByToken(
      { type: "reActivate", session },
      user.id,
      new Date(expires * 1000).getTime() - Date.now()
    ),
    sendEmailProducer({
      template: emaiEnum.REACTIVATE_ACCOUNT,
      receiver: user.email,
      locals: {
        username: user.fullName,
        reactivateLink,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Gửi email thành công",
  });
}

export async function reActivateAccount(
  req: Request<{}, {}, {}, { token?: string | string[] | undefined }>,
  res: Response
) {
  const { token } = req.query;
  if (typeof token != "string") throw new NotFoundError();

  const tokenVerify = verifyJWT<UserToken>(token, config.JWT_SECRET);

  if (!tokenVerify || tokenVerify.type != "reActivate")
    throw new BadRequestError("Phiên của bạn đã hết hạn");
  console.log(tokenVerify);
  const user = await getUserByToken(tokenVerify);
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn");

  await Promise.all([
    editUserById(user.id, {
      status: "ACTIVE",
      reActiveExpires: new Date(),
      reActiveToken: null,
    }),
    deleteUserCacheToken(tokenVerify),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Tài khoản đã được kích hoạt",
  });
}
