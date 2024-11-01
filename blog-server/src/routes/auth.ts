import express, { type Router } from "express";
import validateResource from "@/middleware/validateResource";
import {
  confirmEmail,
  reActivateAccount,
  recover,
  resetPassword,
  sendReactivateAccount,
  signIn,
  signInWithMFA,
  signUp,
} from "@/controllers/auth";
import {
  recoverSchema,
  resetPasswordSchema,
  sendReActivateAccountSchema,
  signInSchema,
  signInWithMFASchema,
  signUpSchema,
} from "@/schema/auth";
import { rateLimitEmail } from "@/middleware/rateLimit";

const router: Router = express.Router();
function authRouter(): Router {
  router.get("/auth/confirm-email", confirmEmail);
  router.get("/auth/reactivate", reActivateAccount);

  router.post("/auth/signup", validateResource(signUpSchema), signUp);
  router.post("/auth/signin", validateResource(signInSchema), signIn);
  router.post(
    "/auth/signin/mfa",
    validateResource(signInWithMFASchema),
    signInWithMFA
  );

  router.post(
    "/auth/recover",
    rateLimitEmail,
    validateResource(recoverSchema),
    recover
  );
  router.post(
    "/auth/reactivate",
    rateLimitEmail,
    validateResource(sendReActivateAccountSchema),
    sendReactivateAccount
  );

  router.post(
    "/auth/reset-password",
    validateResource(resetPasswordSchema),
    resetPassword
  );

  return router;
}

export default authRouter();
