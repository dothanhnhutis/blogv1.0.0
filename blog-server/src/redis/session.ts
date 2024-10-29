import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";

import { redisClient } from "@/redis/connection";
import { CookieOptions } from "express";
import config from "@/config";

export type SessionData = {
  id: string;
  userId: string;
  cookie: CookieOptions;
  reqInfo: {
    ip: string;
    userAgent: UAParser.IResult;
    lastAccess: Date;
    createAt: Date;
  };
};

export type CreateSession = {
  userId: string;
  reqIp?: string;
  userAgent?: string;
};
const SESSION_MAX_AGE = 30 * 24 * 60 * 60000;

export async function createSession(input: CreateSession) {
  const sessionId = uuidv4();
  const sessionKey = `${config.SESSION_KEY_NAME}:${input.userId}:${sessionId}`;
  const now = new Date();
  const cookieOpt = {
    path: "/",
    httpOnly: true,
    secure: false,
    expires: new Date(now.getTime() + SESSION_MAX_AGE),
  };

  const sessionData: SessionData = {
    id: sessionId,
    userId: input.userId,
    cookie: cookieOpt,
    reqInfo: {
      ip: input.reqIp || "",
      userAgent: UAParser(input.userAgent),
      lastAccess: now,
      createAt: now,
    },
  };

  await redisClient.set(
    sessionKey,
    JSON.stringify(sessionData),
    "PX",
    Math.abs(cookieOpt.expires.getTime() - Date.now())
  );

  return { sessionKey, cookieOpt };
}

export async function getSessionByKey(sessionKey: string) {
  try {
    const sessionCache = await redisClient.get(sessionKey);
    if (!sessionCache) return;
    const sessionData = JSON.parse(sessionCache) as SessionData;
    return sessionData;
  } catch (error: any) {
    console.log(`getSessionByKey() method error: `, error);
  }
}

export const sessionLastAccess = async (sessionKey: string) => {
  const sessionCache = await redisClient.get(sessionKey);

  if (sessionCache == null) return;
  try {
    const sessionData = JSON.parse(sessionCache) as SessionData;
    const now = new Date();

    sessionData.reqInfo.lastAccess = now;
    sessionData.cookie.expires = new Date(now.getTime() + SESSION_MAX_AGE);
    await redisClient.set(
      sessionKey,
      JSON.stringify(sessionData),
      "PX",
      Math.abs(sessionData.cookie.expires.getTime() - Date.now())
    );

    return sessionData;
  } catch (error: any) {
    console.log(`SessionLastAccess() method error: `, error);
  }
};
