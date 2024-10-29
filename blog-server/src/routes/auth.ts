import express, { type Router } from "express";
import validateResource from "@/middleware/validateResource";
import { confirmEmail, signUp } from "@/controllers/auth";
import { signUpSchema } from "@/schema/auth";

const router: Router = express.Router();
function authRouter(): Router {
  router.get("/auth/confirm-email", confirmEmail);

  router.post("/auth/signup", validateResource(signUpSchema), signUp);

  return router;
}

export default authRouter();
