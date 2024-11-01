import { signIn } from "@/controllers/auth";
import validateResource from "@/middleware/validateResource";
import { signInSchema } from "@/schema/auth";
import express, { type Router } from "express";

const router: Router = express.Router();
function authRouter(): Router {
  router.post("/auth/signin", validateResource(signInSchema), signIn);
  return router;
}

export default authRouter();
