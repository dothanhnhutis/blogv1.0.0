import { type Application } from "express";
import healthRouter from "@/routes/health";
import taskRouter from "@/routes/task";

const BASE_PATH = "/api/v1";

export function appRoutes(app: Application) {
  app.use("", healthRouter);
  app.use(BASE_PATH, taskRouter);
}
