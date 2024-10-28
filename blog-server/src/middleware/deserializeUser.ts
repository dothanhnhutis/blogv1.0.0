import { RequestHandler as Middleware } from "express";
import { User } from "@/schema/user";
import { getUserById } from "@/services/user";

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

const deserializeUser: Middleware = async (req, res, next) => {
  if (!req.sessionData || !req.sessionKey) return next();
  req.user = await getUserById(req.sessionData.userId);
  next();
};
export default deserializeUser;
