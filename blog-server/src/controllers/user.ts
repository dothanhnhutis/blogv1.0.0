import config from "@/config";
import { BadRequestError } from "@/error-handler";
import { sendEmailProducer } from "@/rabbit/send-email";
import { saveUserCacheByToken } from "@/redis/user.cache";
import { randId } from "@/utils/helper";
import { signJWT } from "@/utils/jwt";
import { emaiEnum } from "@/utils/nodemailer";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function currentUser(req: Request, res: Response) {
  const { password, ...noPass } = req.user!;

  return res
    .status(StatusCodes.OK)
    .json({ ...noPass, hasPassword: !!password });
}

export async function sendConfirmEmail(req: Request, res: Response) {
  const { fullName, email, emailVerified, id } = req.user!;
  if (emailVerified) throw new BadRequestError("Tài khoản đã xác thực");

  let session: string = await randId();
  let expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);

  await saveUserCacheByToken(
    { type: "emailVerification", session },
    id,
    expires
  );
  const token = signJWT(
    {
      type: "emailVerification",
      session,
      iat: expires,
    },
    config.JWT_SECRET
  );

  await sendEmailProducer({
    template: emaiEnum.SIGNUP,
    receiver: email,
    locals: {
      fullName,
      verificationLink: config.CLIENT_URL + "/confirm-email?token=" + token,
    },
  });

  return res.status(StatusCodes.OK).json({
    message: "Đã gửi lại email xác minh",
  });
}
