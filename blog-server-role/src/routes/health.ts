import { health } from "@/controllers/health";
import express, { type Router } from "express";

const router: Router = express.Router();
function planRouter(): Router {
  router.get("/health", health);
  return router;
}

export default planRouter();
