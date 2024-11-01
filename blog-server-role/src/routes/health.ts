import { test } from "@/controllers/health";
import express, { type Router } from "express";

const router: Router = express.Router();
function planRouter(): Router {
  router.get("/plan", test);
  return router;
}

export default planRouter();
