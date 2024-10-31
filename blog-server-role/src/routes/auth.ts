import { health } from "@/controllers/health";
import express, { type Router } from "express";

const router: Router = express.Router();
function authRouter(): Router {
  router.post("/auth/signup", health);
  return router;
}

export default authRouter();
