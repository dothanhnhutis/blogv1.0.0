import express, { type Router } from "express";
import { createTask } from "@/controllers/task";
import validateResource from "@/middleware/validateResource";
import { createTaskSchema } from "@/schema/task";

const router: Router = express.Router();
function taskRouter(): Router {
  router.post("/tasks", validateResource(createTaskSchema), createTask);
  return router;
}

export default taskRouter();
