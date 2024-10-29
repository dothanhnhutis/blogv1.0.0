import { health } from "@/controllers/health";
import { currentUser, sendConfirmEmail } from "@/controllers/user";
import { rateLimitUserId } from "@/middleware/rateLimit";
import { authMiddleware } from "@/middleware/requiredAuth";
import express, { type Router } from "express";

const router: Router = express.Router();

function userRouter(): Router {
  router.get(
    "/users/me",
    authMiddleware({ emailVerified: false }),
    currentUser
  );

  router.post(
    "/users/confirm-email/send",
    rateLimitUserId,
    authMiddleware({ emailVerified: false }),
    sendConfirmEmail
  );

  return router;
}

export default userRouter();
