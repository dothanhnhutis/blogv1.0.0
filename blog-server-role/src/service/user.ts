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
  email_verified: true,
  roles: {
    select: {
      role: {
        select: {
          role_id: true,
          role_name: true,
          read_only: true,
          permission: true,
          created_at: true,
          updated_at: true,
        },
      },
    },
  },
  status: true,
  password: true,
  username: true,
  gender: true,
  picture: true,
  phone_number: true,
  birth_date: true,
  mfa: {
    select: {
      backup_code: true,
      backup_codes_used: true,
      last_access: true,
      secret_key: true,
      created_at: true,
      updated_at: true,
    },
  },
  oauth_providers: {
    select: {
      provider_id: true,
      provider: true,
    },
  },
  created_at: true,
  updated_at: true,
};

export async function getUserByEmail(email: string) {
  const userCache = await getUserCacheByEmail(email);
  if (userCache) return userCache;

  const user = await prisma.users.findUnique({
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
  const user = await prisma.users.findUnique({
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
    user = await prisma.users.findUnique({
      where: {
        email_verification_token: token.session,
        email_verification_expires: { gte: new Date() },
      },
      select: userSelectDefault,
    });
  } else if (token.type == "recover") {
    user = await prisma.users.findUnique({
      where: {
        password_reset_token: token.session,
        password_reset_expires: { gte: new Date() },
      },
      select: userSelectDefault,
    });
  } else if (token.type == "reActivate") {
    await prisma.users.findUnique({
      where: {
        reActive_token: token.session,
        reActive_expires: { gte: new Date() },
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

  const data: Prisma.UsersCreateInput = {
    ...rest,
    password: hashData(password),
    email_verification_expires: new Date(expires * 1000),
    email_verification_token: session,
  };

  const user = await prisma.users.create({
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
      fullName: rest.username,
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

  let data: Prisma.UsersUpdateInput = {
    ...rest,
  };

  if (input.password) {
    data.password = hashData(input.password);
  }

  if (mfa) {
    await prisma.mFA.create({
      data: {
        user_id: userId,
        backup_code: mfa.backupCodes,
        secret_key: mfa.secretKey,
      },
    });
  }

  const newUser = await prisma.users.update({
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
      user_id: userId,
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
