import { sendReactivateAccount } from "@/controllers/auth";
import { health } from "@/controllers/health";
import {
  changeEmailByOTP,
  changePassword,
  currentUser,
  disableMFA,
  disactivate,
  enableMFA,
  readAllSession,
  removeSession,
  sendConfirmEmail,
  sendOTPChangeEmail,
  setupMFA,
  signOut,
} from "@/controllers/user";
import { rateLimitEmail, rateLimitUserId } from "@/middleware/rateLimit";
import { authMiddleware } from "@/middleware/requiredAuth";
import validateResource from "@/middleware/validateResource";
import {
  changeEmailByOTPSchema,
  changePasswordSchema,
  enableMFASchema,
  sendOTPChangeEmailSchema,
  setupMFASchema,
} from "@/schema/user";
import express, { type Router } from "express";

const router: Router = express.Router();

function userRouter(): Router {
  router.get(
    "/users/me",
    authMiddleware({ emailVerified: false }),
    currentUser
  );
  router.get("/users/sessions", authMiddleware(), readAllSession);

  router.post(
    "/users/confirm-email/send",
    rateLimitUserId,
    authMiddleware({ emailVerified: false }),
    sendConfirmEmail
  );

  router.post(
    "/users/change-email",
    rateLimitEmail,
    authMiddleware(),
    validateResource(sendOTPChangeEmailSchema),
    sendOTPChangeEmail
  );

  router.post(
    "/users/mfa",
    authMiddleware(),
    validateResource(setupMFASchema),
    setupMFA
  );

  router.patch(
    "/users/mfa",
    authMiddleware(),
    validateResource(enableMFASchema),
    enableMFA
  );

  router.patch(
    "/users/change-email",
    authMiddleware(),
    validateResource(changeEmailByOTPSchema),
    changeEmailByOTP
  );

  router.patch(
    "/users/password",
    authMiddleware(),
    validateResource(changePasswordSchema),
    changePassword
  );

  router.delete("/users/mfa", authMiddleware(), disableMFA);
  router.delete("/users/disactivate", authMiddleware(), disactivate);
  router.delete("/users/sessions/:sessionId", authMiddleware(), removeSession);
  router.delete("/users/signout", signOut);

  return router;
}

export default userRouter();
