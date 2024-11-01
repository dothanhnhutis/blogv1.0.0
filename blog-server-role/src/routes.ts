import { type Application } from "express";
import healthRouter from "@/routes/health";
import authRouter from "@/routes/auth";

const BASE_PATH = "/api/v1";

export function appRoutes(app: Application) {
  app.use(BASE_PATH, authRouter);
  app.use(BASE_PATH, healthRouter);
}
