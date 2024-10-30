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
    mfa?: {
      secretKey: string;
      backupCodes: string[];
    };
  }
) {
  const { mfa, ...rest } = input;

  let data: Prisma.UserUpdateInput = {
    ...rest,
  };

  if (input.password) {
    data.password = hashData(input.password);
  }

  if (mfa) {
    await prisma.mFA.create({
      data: {
        userId,
        backupCodes: mfa.backupCodes,
        secretKey: mfa.secretKey,
      },
    });
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

export async function deleteMFA(userId: string) {
  const { user } = await prisma.mFA.delete({
    where: {
      userId,
    },
    select: {
      user: {
        select: userSelectDefault,
      },
    },
  });
  console.log(user);
  await saveUserCache(user);
}
