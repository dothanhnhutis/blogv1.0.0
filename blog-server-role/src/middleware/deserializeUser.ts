import { RequestHandler as Middleware } from "express";
import { User } from "@/schema/user";
import { getUserById } from "@/service/user";

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
  console.log(req.user);
  next();
};
export default deserializeUser;
