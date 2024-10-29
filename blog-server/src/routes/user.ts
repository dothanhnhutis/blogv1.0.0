import { sendReactivateAccount } from "@/controllers/auth";
import { health } from "@/controllers/health";
import {
  currentUser,
  disactivate,
  readAllSession,
  removeSession,
  sendConfirmEmail,
  signOut,
} from "@/controllers/user";
import { rateLimitEmail, rateLimitUserId } from "@/middleware/rateLimit";
import { authMiddleware } from "@/middleware/requiredAuth";
import validateResource from "@/middleware/validateResource";
import { sendReActivateAccountSchema } from "@/schema/auth";
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
    "/auth/reactivate",
    rateLimitEmail,
    validateResource(sendReActivateAccountSchema),
    sendReactivateAccount
  );

  router.delete("/users/disactivate", authMiddleware(), disactivate);
  router.delete("/users/sessions/:sessionId", authMiddleware(), removeSession);
  router.delete("/users/signout", signOut);

  return router;
}

export default userRouter();
