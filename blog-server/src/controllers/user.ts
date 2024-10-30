import config from "@/config";
import { BadRequestError } from "@/error-handler";
import { sendEmailProducer } from "@/rabbit/send-email";
import {
  deleteSessionByKey,
  deleteSessions,
  getAllSession,
} from "@/redis/session";
import {
  deleteMFASetup,
  deleteUserCacheOTP,
  generateMFASetup,
  getMFASetup,
  getUserCacheOTP,
  saveUserCache,
  saveUserCacheByToken,
  saveUserCacheOTP,
} from "@/redis/user.cache";
import {
  ChangeEmailByOTPReq,
  ChangePasswordReq,
  EnableMFAReq,
  SendOTPChangeEmailReq,
  SetupMFAReq,
} from "@/schema/user";
import { deleteMFA, editUserById, getUserByEmail } from "@/services/user";
import { compareData, generateOTP, randId } from "@/utils/helper";
import { signJWT } from "@/utils/jwt";
import { validateMFA } from "@/utils/mfa";
import { emaiEnum } from "@/utils/nodemailer";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import qrcode from "qrcode";

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
  const token = signJWT(
    {
      type: "emailVerification",
      session,
      iat: expires,
    },
    config.JWT_SECRET
  );

  await Promise.all([
    editUserById(id, {
      emailVerificationToken: session,
      emailVerificationExpires: new Date(expires * 1000),
    }),
    await saveUserCacheByToken(
      { type: "emailVerification", session },
      id,
      new Date(expires * 1000).getTime() - Date.now()
    ),
    sendEmailProducer({
      template: emaiEnum.SIGNUP,
      receiver: email,
      locals: {
        fullName,
        verificationLink: config.CLIENT_URL + "/confirm-email?token=" + token,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).json({
    message: "Đã gửi lại email xác minh",
  });
}

export async function signOut(req: Request, res: Response) {
  if (req.sessionKey) await deleteSessionByKey(req.sessionKey);
  res
    .status(StatusCodes.OK)
    .clearCookie(config.SESSION_KEY_NAME)
    .json({
      message: "Đăng xuất thành công",
    })
    .end();
}

export async function readAllSession(req: Request, res: Response) {
  const { id } = req.user!;
  const sessions = await getAllSession(id);
  res.status(StatusCodes.OK).json(sessions);
}

export async function removeSession(
  req: Request<{ sessionId: string }>,
  res: Response
) {
  const { id } = req.user!;

  if (req.sessionData!.id == req.params.sessionId)
    throw new BadRequestError("Không thể xoá phiên hiện tại");
  await deleteSessionByKey(
    `${config.SESSION_KEY_NAME}:${id}:${req.params.sessionId}`
  );
  res.status(StatusCodes.OK).json({
    message: "Xoá phiên thành công",
  });
}

export async function disactivate(
  req: Request<{ sessionId: string }>,
  res: Response
) {
  const { id } = req.user!;
  await Promise.all([
    editUserById(id, {
      status: "SUSPENDED",
    }),
    deleteSessions(id),
  ]);
  res.status(StatusCodes.OK).clearCookie(config.SESSION_KEY_NAME).json({
    message:
      "Tài khoản của bạn đã bị vô hiệu hóa. Bạn có thể kích hoạt lại bất cứ lúc nào!",
  });
}

export async function sendOTPChangeEmail(
  req: Request<{}, {}, SendOTPChangeEmailReq["body"]>,
  res: Response
) {
  const { newEmail } = req.body;
  const { id, email } = req.user!;

  if (newEmail == email)
    throw new BadRequestError("Email mới không thể giống với email hiện tại");

  const checkNewEmail = await getUserByEmail(newEmail);
  if (checkNewEmail) throw new BadRequestError("Email đã tồn tại");

  const otp: string = generateOTP();
  await Promise.all([
    saveUserCacheOTP(id, newEmail, otp),
    sendEmailProducer({
      template: emaiEnum.OTP_VERIFY_ACCOUNT,
      receiver: newEmail,
      locals: {
        otp,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).json({
    message: "Mã xác minh đã được gửi đến email của bạn",
  });
}

export async function changeEmailByOTP(
  req: Request<{}, {}, ChangeEmailByOTPReq["body"]>,
  res: Response
) {
  const { newEmail, otp } = req.body;

  const { id, email } = req.user!;

  const hashOTP = await getUserCacheOTP(id, newEmail);

  if (!hashOTP || !(await compareData(hashOTP, otp)))
    throw new BadRequestError("Mã xác nhận không hợp lệ");

  await Promise.all([
    editUserById(id, {
      email: newEmail,
    }),
    deleteUserCacheOTP(id, newEmail, email),
  ]);

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật email thành công",
  });
}

export async function changePassword(
  req: Request<{}, {}, ChangePasswordReq["body"]>,
  res: Response
) {
  const { id, password: hashOldPassword } = req.user!;
  const { newPassword, oldPassword, isSignOut } = req.body;

  if (hashOldPassword) {
    if (!oldPassword)
      throw new BadRequestError("Mật khẩu cũ là trường bắt buộc");

    if (!(await compareData(hashOldPassword, oldPassword)))
      throw new BadRequestError("Mật khẩu cũ không đúng");

    await editUserById(id, {
      password: newPassword,
    });

    if (isSignOut == "ALL") {
      await deleteSessions(id);
      res.clearCookie(config.SESSION_KEY_NAME);
    } else if (isSignOut == "EXCEPT_CURRENT") {
      await deleteSessions(id, [req.sessionData!.id]);
    }

    return res.status(StatusCodes.OK).json({
      message: "Cập nhật mật khẩu thành công",
    });
  } else {
    await editUserById(id, {
      password: newPassword,
    });
    return res.status(StatusCodes.OK).json({
      message: "Cập nhật mật khẩu thành công",
    });
  }
}

export async function setupMFA(
  req: Request<{}, {}, SetupMFAReq["body"]>,
  res: Response
) {
  const { id, mfa } = req.user!;
  const { deviceName } = req.body;
  if (mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) đã được bật");

  const generateMFA = await generateMFASetup(id, deviceName);
  if (!generateMFA) throw new BadRequestError("Tạo MFA thất bại");

  qrcode.toDataURL(generateMFA.totp.oauth_url, async (err, imageUrl) => {
    if (err) {
      throw new BadRequestError("Tạo MFA thất bại");
    }

    return res.status(StatusCodes.OK).json({
      message: "Quét mã QR này bằng ứng dụng xác thực của bạn",
      data: {
        backupCodes: generateMFA.backupCodes,
        totp: generateMFA.totp,
        qrCodeUrl: imageUrl,
      },
    });
  });
}

export async function enableMFA(
  req: Request<{}, {}, EnableMFAReq["body"]>,
  res: Response
) {
  const { id, mfa } = req.user!;
  const { mfa_code1, mfa_code2 } = req.body;

  if (mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) đã được bật");
  const totpData = await getMFASetup(id);
  if (!totpData)
    throw new BadRequestError("Phiên xác thực đa yếu tố (MFA) đã hết hạn");

  if (
    validateMFA({ secret: totpData.totp.base32, token: mfa_code1 }) == null ||
    validateMFA({ secret: totpData.totp.base32, token: mfa_code2 }) == null
  )
    throw new BadRequestError("Mã xác thực đa yếu tố (MFA) 1 và 2 đã hết hạn");

  await Promise.all([
    editUserById(id, {
      mfa: {
        secretKey: totpData.totp.base32,
        backupCodes: totpData.backupCodes,
      },
    }),
    deleteMFASetup(id),
  ]);

  res.status(StatusCodes.OK).json({
    message: "Xác thực đa yếu tố (MFA) đã được bật",
    data: {
      backupCodes: totpData.backupCodes,
    },
  });
}

export async function disableMFA(req: Request, res: Response) {
  const { id, mfa } = req.user!;
  const { mfa_code1, mfa_code2 } = req.body;

  if (!mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) chưa được bật");
  if (
    validateMFA({ secret: mfa.secretKey, token: mfa_code1 }) == null ||
    validateMFA({ secret: mfa.secretKey, token: mfa_code2 }) == null
  )
    throw new BadRequestError("Mã xác thực đa yếu tố (MFA) 1 và 2 đã hết hạn");
  await deleteMFA(id);

  return res
    .status(StatusCodes.OK)
    .json({ message: "Xác thực đa yếu tố (MFA) đã được tắt" });
}
