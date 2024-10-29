type Role = "SUPER_ADMIN" | "ADMIN" | "BUSINESS_PARTNER" | "CUSTOMER";
type UserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;
type UserMFA = {
  secretKey: string;
  lastAccess: Date;
  backupCodes: string[];
  backupCodesUsed: string[];
  createdAt: Date;
  updatedAt: Date;
};

type OauthProvider = {
  provider: string;
  providerId: string;
};

export type User = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  //   emailVerificationExpires: Date | null;
  //   emailVerificationToken: string | null;
  role: Role;
  status: UserStatus;
  password: string | null;
  //   passwordResetToken: string | null;
  //   passwordResetExpires: Date | null;
  //   reActiveToken: string | null;
  //   reActiveExpires: Date | null;
  fullName: string | null;
  birthDate: string | null;
  gender: UserGender;
  picture: string | null;
  phoneNumber: string | null;
  mfa: UserMFA | null;
  oauthProviders: OauthProvider[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserToken = {
  type: "emailVerification" | "recoverAccount" | "reActivate";
  session: string;
};
