import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, NotFoundError } from "@/error-handler";
import { SignUpReq } from "@/schema/auth";
import {
  getUserByEmail,
  getUserByToken,
  insertUserWithPassword,
} from "@/services/user";
import { verifyJWT } from "@/utils/jwt";
import config from "@/config";

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
      "Sign up success. A confirmation email will be sent to your email address.",
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

  const newData = await editUserById(user.id, {
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: new Date(),
  });

  await setUserCache(newData);

  return res.status(StatusCodes.OK).json({
    message: "verify email success",
  });
}
function setUserCache(newData: any) {
  throw new Error("Function not implemented.");
}
