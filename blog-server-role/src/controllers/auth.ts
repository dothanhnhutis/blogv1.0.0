import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { SignInReq } from "@/schema/auth";
import { getUserByEmail } from "@/service/user";
import { compareData, encrypt } from "@/utils/helper";
import { BadRequestError } from "@/error-handler";
import { createMFASession, createSession } from "@/redis/session";
import config from "@/config";

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
    const sessionData = await createSession({
      userId: user.id,
      reqIp: req.ip || "",
      userAgent: req.headers["user-agent"] || "",
    });
    if (!sessionData)
      throw new BadRequestError("Email và mật khẩu không hợp lệ.");
    return res
      .status(StatusCodes.OK)
      .cookie(
        config.SESSION_KEY_NAME,
        encrypt(sessionData.sessionKey, config.SESSION_SECRET),
        {
          ...sessionData.cookieOpt,
        }
      )
      .json({
        message: "Đăng nhập thành công",
      });
  } else {
    const sessionId = await createMFASession({
      userId: user.id,
      backupCodes: user.mfa.backup_code,
      secretKey: user.mfa.secret_key,
    });
    if (!sessionId)
      throw new BadRequestError("Email và mật khẩu không hợp lệ.");

    return res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      sessionId,
    });
  }
}
