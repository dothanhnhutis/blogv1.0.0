import { type Application } from "express";
import healthRouter from "@/routes/health";
import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";
import taskRouter from "@/routes/task";

const BASE_PATH = "/api/v1";

export function appRoutes(app: Application) {
  app.use("", healthRouter);
  app.use(BASE_PATH, authRouter);
  app.use(BASE_PATH, userRouter);
  app.use(BASE_PATH, taskRouter);
}
