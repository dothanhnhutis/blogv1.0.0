import config from "@/config";
import { sendEmailProducer } from "@/rabbit/send-email";
import { deleteSessions } from "@/redis/session";
import {
  getUserCacheByEmail,
  getUserCacheById,
  getUserCacheByToken,
  saveUserCache,
  saveUserCacheByToken,
} from "@/redis/user.cache";
import { SignUpReq } from "@/schema/auth";
import { User, UserToken } from "@/schema/user";
import prisma from "@/utils/db";
import { hashData, randId } from "@/utils/helper";
import { signJWT } from "@/utils/jwt";
import { emaiEnum, sendMail } from "@/utils/nodemailer";
import { Prisma } from "@prisma/client";

export const userSelectDefault = {
  id: true,
  email: true,
  emailVerified: true,
  // emailVerificationExpires: true,
  // emailVerificationToken: true,
  role: true,
  status: true,
  password: true,
  // passwordResetToken: true,
  // passwordResetExpires: true,
  // reActiveToken: true,
  // reActiveExpires: true,
  fullName: true,
  gender: true,
  birthDate: true,
  picture: true,
  phoneNumber: true,
  mfa: {
    select: {
      backupCodes: true,
      backupCodesUsed: true,
      lastAccess: true,
      secretKey: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  oauthProviders: {
    select: {
      providerId: true,
      provider: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

export async function getUserByEmail(email: string) {
  const userCache = await getUserCacheByEmail(email);
  if (userCache) return userCache;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: userSelectDefault,
  });
  if (user) await saveUserCache(user);
  return user;
}

export async function getUserById(id: string) {
  const userCache = await getUserCacheById(id);
  if (userCache) return userCache;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: userSelectDefault,
  });
  if (!user) return;
  await saveUserCache(user);
  return user;
}

export async function getUserByToken(token: UserToken) {
  const userCache = await getUserCacheByToken(token);
  if (userCache) return userCache;

  let user: User | null = null;
  if (token.type == "emailVerification") {
    user = await prisma.user.findUnique({
      where: {
        emailVerificationToken: token.session,
        emailVerificationExpires: { gte: new Date() },
      },
      select: userSelectDefault,
    });
  } else if (token.type == "recover") {
    user = await prisma.user.findUnique({
      where: {
        passwordResetToken: token.session,
        passwordResetExpires: { gte: new Date() },
      },
      select: userSelectDefault,
    });
  } else if (token.type == "reActivate") {
    await prisma.user.findUnique({
      where: {
        reActiveToken: token.session,
        reActiveExpires: { gte: new Date() },
      },
      select: userSelectDefault,
    });
  }
  if (!user) return;
  await saveUserCache(user);
  return user;
}

export async function insertUserWithPassword({
  password,
  ...rest
}: Omit<SignUpReq["body"], "confirmPassword">) {
  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);
  const session = await randId();
  const token = signJWT(
    {
      type: "emailVerification",
      session,
      exp: expires,
    },
    config.JWT_SECRET
  );

  const data: Prisma.UserCreateInput = {
    ...rest,
    password: hashData(password),
    emailVerificationExpires: new Date(expires * 1000),
    emailVerificationToken: session,
  };

  const user = await prisma.user.create({
    data,
    select: userSelectDefault,
  });

  await saveUserCacheByToken(
    { type: "emailVerification", session },
    user.id,
    expires
  );
  await saveUserCache(user);

  await sendEmailProducer({
    template: emaiEnum.SIGNUP,
    receiver: rest.email,
    locals: {
      fullName: rest.fullName,
      verificationLink: config.CLIENT_URL + "/confirm-email?token=" + token,
    },
  });

  return user;
}

export async function editUserById(
  userId: string,
  input: {
    fullName?: string;
    emailVerified?: boolean;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: Date;
    email?: string;
    password?: string;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date;
    status?: User["status"];
    reActiveToken?: string | null;
    reActiveExpires?: Date;
  }
) {
  let data: Prisma.UserUpdateInput = {
    ...input,
  };
  const user = await getUserCacheById(userId);

  if (input.password) {
    data.password = hashData(input.password);
  }

  if (input.passwordResetExpires && input.passwordResetToken) {
    const token = signJWT(
      {
        type: "recover",
        session: input.passwordResetToken,
        iat: input.passwordResetExpires.getTime() / 1000,
      },
      config.JWT_SECRET
    );
    const recoverLink = `${config.CLIENT_URL}/reset-password?token=${token}`;

    await saveUserCacheByToken(
      { type: "recover", session: input.passwordResetToken },
      userId,
      input.passwordResetExpires.getTime() - Date.now()
    );

    await sendEmailProducer({
      template: emaiEnum.RECOVER_ACCOUNT,
      receiver: user!.email,
      locals: {
        username: user!.fullName,
        recoverLink,
      },
    });
  }

  if (input.reActiveToken && input.reActiveExpires) {
    const token = signJWT(
      {
        type: "reActivate",
        session: input.reActiveToken,
        iat: input.reActiveExpires.getTime() / 1000,
      },
      config.JWT_SECRET
    );
    const recoverLink = `${config.CLIENT_URL}/reactivate?token=${token}`;

    await saveUserCacheByToken(
      { type: "reActivate", session: input.reActiveToken },
      userId,
      input.reActiveExpires.getTime() - Date.now()
    );

    await sendEmailProducer({
      template: emaiEnum.RECOVER_ACCOUNT,
      receiver: user!.email,
      locals: {
        username: user!.fullName,
        recoverLink,
      },
    });
  }

  if (input.email) {
    const expires: number = Math.floor(
      (Date.now() + 4 * 60 * 60 * 1000) / 1000
    );
    const session = await randId();
    const token = signJWT(
      {
        type: "emailVerification",
        session,
        iat: expires,
      },
      config.JWT_SECRET
    );
    await saveUserCacheByToken(
      { type: "emailVerification", session },
      userId,
      expires
    );
    await sendMail({
      template: emaiEnum.VERIFY_EMAIL,
      receiver: input.email,
      locals: {
        username: input.fullName || user!.fullName || "",
        verificationLink: config.CLIENT_URL + "/confirm-email?token=" + token,
      },
    });
  }

  if (input.status && input.status != "ACTIVE") {
    await deleteSessions(userId);
  }

  const newUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: userSelectDefault,
  });

  await saveUserCache(newUser);

  return newUser;
}
