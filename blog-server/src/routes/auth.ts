import express, { type Router } from "express";
import validateResource from "@/middleware/validateResource";
import {
  confirmEmail,
  recover,
  resetPassword,
  signIn,
  signUp,
} from "@/controllers/auth";
import {
  recoverSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/schema/auth";
import { rateLimitEmail } from "@/middleware/rateLimit";

const router: Router = express.Router();
function authRouter(): Router {
  router.get("/auth/confirm-email", confirmEmail);
  router.post("/auth/signup", validateResource(signUpSchema), signUp);
  router.post("/auth/signin", validateResource(signInSchema), signIn);
  router.post(
    "/auth/recover",
    rateLimitEmail,
    validateResource(recoverSchema),
    recover
  );
  router.post(
    "/auth/recover",
    rateLimitEmail,
    validateResource(recoverSchema),
    recover
  );

  router.post(
    "/auth/reset-password",
    validateResource(resetPasswordSchema),
    resetPassword
  );

  return router;
}

export default authRouter();
