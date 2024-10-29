import { RequestHandler as Middleware } from "express";
// import cookie from "cookie";
import config from "@/config";
import {
  getSessionByKey,
  SessionData,
  sessionLastAccess,
} from "@/redis/session";
import { decrypt, encrypt } from "@/utils/helper";

declare global {
  namespace Express {
    interface Request {
      sessionKey?: string | undefined;
      sessionData?: SessionData | undefined;
    }
  }
}

const deserializeCookie: Middleware = async (req, res, next) => {
  const cookies = req.headers.cookie;
  if (!cookies) return next();

  const cookiesParser = cookies
    .split("; ")
    .reduce<{ [index: string]: string }>((prev, curr, idx, array) => {
      const data = curr.split("=");
      prev[data[0]] = data[1];
      return prev;
    }, {});

  if (!cookiesParser[config.SESSION_KEY_NAME]) return next();

  req.sessionKey = decrypt(
    cookiesParser[config.SESSION_KEY_NAME],
    config.SESSION_SECRET
  );

  if (!req.sessionKey) {
    res.clearCookie(config.SESSION_KEY_NAME);
    return next();
  }

  req.sessionData = await getSessionByKey(req.sessionKey);
  if (!req.sessionData) {
    res.clearCookie(config.SESSION_KEY_NAME);
    return next();
  }

  const newSession = await sessionLastAccess(req.sessionKey);
  if (newSession) {
    res.cookie(
      config.SESSION_KEY_NAME,
      encrypt(req.sessionKey, config.SESSION_SECRET),
      {
        ...newSession.cookie,
      }
    );
  }

  return next();
};
export default deserializeCookie;
