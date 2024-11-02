import * as z from "zod";

export const sendOTPChangeEmailSchema = z.object({
  body: z
    .object({
      newEmail: z
        .string({
          required_error: "newEmail là trường bắt buộc",
          invalid_type_error: "newEmail phải là chuỗi",
        })
        .email("newEmail không hợp lệ"),
    })
    .strict(),
});

export const changeEmailByOTPSchema = z.object({
  body: sendOTPChangeEmailSchema.shape.body
    .extend({
      otp: z
        .string({
          required_error: "Mã xác thực là trường bắt buộc",
          invalid_type_error: "Mã xác thực phải là chuỗi",
        })
        .length(6, "Mã xác thực không hợp lệ"),
    })
    .strict(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string({
          invalid_type_error: "Mật khẩu cũ phải là chuỗi",
        })
        .optional(),
      isSignOut: z.enum(["ALL", "NONE", "EXCEPT_CURRENT"]).default("NONE"),
      newPassword: z
        .string({
          required_error: "Mật khẩu mới là trường bắt buộc",
          invalid_type_error: "Mật khẩu mới phải là chuỗi",
        })
        .min(8, "Mật khẩu mới quá ngắn")
        .max(40, "Mật khẩu mới quá dài")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Mật khẩu mới phải có ký tự hoa, thường, sô và ký tự đặc biệt"
        ),
      confirmNewPassword: z.string(),
    })
    .strict()
    .refine(
      (data) => !data.oldPassword || data.oldPassword !== data.newPassword,
      {
        message: "Mật khẩu mới phải khác với mật khẩu cũ",
        path: ["newPassword"],
      }
    )
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmNewPassword"],
    }),
});

export const setupMFASchema = z.object({
  body: z
    .object({
      deviceName: z
        .string({
          invalid_type_error: "Tên thiết ghi nhớ phải là chuỗi",
          required_error: "Tên thiết ghi nhớ phải bắt buộc",
        })
        .max(128, "Tên thiết ghi nhớ tối đa 128 ký tự")
        .regex(
          /^[\d\w+=,.@\-_][\d\w\s+=,.@\-_]*$/,
          "Tên thiết ghi nhớ không được chứa các ký tự đăc biệt ngoài ký tự này '=,.@-_'"
        ),
    })
    .strict(),
});

export const enableMFASchema = z.object({
  body: z
    .object({
      mfa_code1: z
        .string({
          invalid_type_error: "Xác thực đa yếu tố (MFA) 1 là chuỗi",
          required_error: "Xác thực đa yếu tố (MFA) 1 phải bắt buộc",
        })
        .length(6, "Xác thực đa yếu tố (MFA) 1 không hợp lệ"),
      mfa_code2: z
        .string({
          invalid_type_error: "Xác thực đa yếu tố (MFA) 2 là chuỗi",
          required_error: "Xác thực đa yếu tố (MFA) 2 phải bắt buộc",
        })
        .length(6, "Xác thực đa yếu tố (MFA) 2 không hợp lệ"),
    })
    .strict(),
});

export type SendOTPChangeEmailReq = z.infer<typeof sendOTPChangeEmailSchema>;
export type ChangeEmailByOTPReq = z.infer<typeof changeEmailByOTPSchema>;
export type ChangePasswordReq = z.infer<typeof changePasswordSchema>;
export type SetupMFAReq = z.infer<typeof setupMFASchema>;
export type EnableMFAReq = z.infer<typeof enableMFASchema>;

type Role = "SUPER_ADMIN" | "ADMIN" | "BUSINESS_PARTNER" | "CUSTOMER";
type UserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;
type UserMFA = {
  secret_key: string;
  last_access: Date;
  backup_code: string[];
  backup_codes_used: string[];
  created_at: Date;
  updated_at: Date;
};

type OauthProvider = {
  provider: string;
  provider_id: string;
};

export type User = {
  id: string;
  email: string;
  email_verified: boolean;
  roles: {
    role: {
      role_id: string;
      role_name: string;
      read_only: boolean;
      permission: string[];
      created_at: Date;
      updated_at: Date;
    };
  }[];
  users_plan_roles: {
    plan_role: {
      plan_id: string;
      plan_role_name: string;
      plan_permission: string[];

      create_at: Date;
      update_at: Date;
    };
  }[];
  status: UserStatus;
  password: string | null;
  username: string;
  birth_date: Date | null;
  gender: UserGender;
  picture: string | null;
  phone_number: string | null;
  mfa: UserMFA | null;
  oauth_providers: OauthProvider[];
  created_at: Date;
  updated_at: Date;
};

export type UserToken = {
  type: "emailVerification" | "recover" | "reActivate";
  session: string;
};
