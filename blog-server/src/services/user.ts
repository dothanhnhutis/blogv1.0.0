import prisma from "@/utils/db";

export const userSelectDefault = {
  id: true,
  email: true,
  emailVerified: true,
  emailVerificationExpires: true,
  emailVerificationToken: true,
  role: true,
  status: true,
  password: true,
  passwordResetToken: true,
  passwordResetExpires: true,
  reActiveToken: true,
  reActiveExpires: true,
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
  createdAt: true,
  updatedAt: true,
};

export async function getUserByEmail(email: string) {
  /**
   * TODO: get from cache
   */

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: userSelectDefault,
  });
  /**
   * TODO: save to cache
   */
  return user;
}
