import * as z from "zod";

export const signUpSchema = z.object({
  body: z
    .object({
      fullName: z.string({
        required_error: "fullName is required",
        invalid_type_error: "fullName must be string",
      }),
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be string",
        })
        .email("Invalid email"),
      password: z
        .string({
          required_error: "Password is required",
          invalid_type_error: "Password must be string",
        })
        .min(8, "Password is too short")
        .max(40, "Password can not be longer than 40 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Password must include: letters, numbers and special characters"
        ),
      confirmPassword: z.string({
        required_error: "confirmPassword is required",
        invalid_type_error: "confirmPassword must be string",
      }),
    })
    .strict()
    .refine((data) => data.confirmPassword == data.password, {
      message: "confirmPassword does not match password",
      path: ["confirmPassword"],
    }),
});

export type SignUpReq = z.infer<typeof signUpSchema>;
