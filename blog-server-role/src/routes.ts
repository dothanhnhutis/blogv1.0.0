import { type Application } from "express";
import healthRouter from "@/routes/health";
const BASE_PATH = "/api/v1";

export function appRoutes(app: Application) {
  app.use(BASE_PATH, healthRouter);
}
