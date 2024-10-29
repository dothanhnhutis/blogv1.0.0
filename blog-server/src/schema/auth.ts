import * as z from "zod";

export const signUpSchema = z.object({
  body: z
    .object({
      fullName: z.string({
        required_error: "fullName là trường bắt buộc",
        invalid_type_error: "fullName phải là chuỗi",
      }),
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email không hợp lệ"),
      password: z
        .string({
          required_error: "Mật khẩu là bắt buộc",
          invalid_type_error: "Mật khẩu phải là chuỗi",
        })
        .min(8, "Mật khẩu quá ngắn")
        .max(40, "Mật khẩu quá dài")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Mật khẩu phải có ký tự hoa, thường, sô và ký tự đặc biệt"
        ),
      confirmPassword: z.string({
        required_error: "Xác nhận mật khẩu là bắt buộc",
        invalid_type_error: "Xác nhận mật khẩu phải là chuỗi",
      }),
    })
    .strict()
    .refine((data) => data.confirmPassword == data.password, {
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmPassword"],
    }),
});

export const signInSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email hay mật khẩu không đúng"),
      password: z
        .string({
          required_error: "Mật khẩu là trường bắt buộc",
          invalid_type_error: "Mật khẩu phải là chuỗi",
        })
        .min(8, "Email hay mật khẩu không đúng")
        .max(40, "Email hay mật khẩu không đúng"),
    })
    .strict(),
});

export const recoverSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be string",
        })
        .email("Invalid email address"),
    })
    .strict(),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be string",
        })
        .email("Invalid email address"),
    })
    .strict(),
});

export type SignUpReq = z.infer<typeof signUpSchema>;
export type SignInReq = z.infer<typeof signInSchema>;
export type RecoverReq = z.infer<typeof recoverSchema>;
export type ResetPasswordReq = z.infer<typeof resetPasswordSchema>;
