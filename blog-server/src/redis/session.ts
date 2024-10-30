import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";

import { redisClient } from "@/redis/connection";
import { CookieOptions } from "express";
import config from "@/config";
import { MFASetup } from "./user.cache";

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

type MFASession = {
  userId: string;
  secretKey: string;
  backupCodes: string[];
};

export async function createMFASession(data: MFASession) {
  try {
    const sessionId = uuidv4();
    await redisClient.set(
      `${config.SESSION_KEY_NAME}:mfa:${sessionId}`,
      JSON.stringify(data),
      "EX",
      5 * 60
    );
    return sessionId;
  } catch (error: unknown) {
    console.log(`createMFASession() method error: `, error);
  }
}

export async function getMFASession(mfaSessionId: string) {
  try {
    const mfaData = await redisClient.get(
      `${config.SESSION_KEY_NAME}:mfa:${mfaSessionId}`
    );
    if (!mfaData) return;

    return JSON.parse(mfaData) as MFASession;
  } catch (error: unknown) {
    console.log(`getMFASession() method error: `, error);
  }
}

export async function deleteMFASession(mfaSessionId: string) {
  try {
    await redisClient.del(`${config.SESSION_KEY_NAME}:mfa:${mfaSessionId}`);
  } catch (error: unknown) {
    console.log(`deleteMFASession() method error: `, error);
  }
}

export async function createSession(input: CreateSession) {
  try {
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
  } catch (error: unknown) {
    console.log(`createSession() method error: `, error);
  }
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

export async function getAllSession(userId: string) {
  try {
    const keys = await redisClient.keys(
      `${config.SESSION_KEY_NAME}:${userId}:*`
    );
    const data: SessionData[] = [];
    for (const id of keys) {
      const session = await getSessionByKey(id);
      if (!session) continue;
      data.push(session);
    }
    return data;
  } catch (error: unknown) {
    console.log(`getAllSession() method error: `, error);
    return [];
  }
}

export async function sessionLastAccess(sessionKey: string) {
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
}

export async function deleteSessionByKey(sessionKey: string) {
  try {
    await redisClient.del(sessionKey);
  } catch (error) {
    console.log(`deleteSessionByKey() method error: `, error);
  }
}

export async function deleteSessions(
  userId: string,
  exceptSessionId?: string[]
) {
  try {
    const keys = await redisClient.keys(
      `${config.SESSION_KEY_NAME}:${userId}:*`
    );
    if (!exceptSessionId) {
      await Promise.all(keys.map(async (key) => redisClient.del(key)));
    } else {
      const safeSession = exceptSessionId.map(
        (id) => `${config.SESSION_KEY_NAME}:${userId}:${id}`
      );
      await Promise.all(
        keys
          .filter((keys) => !exceptSessionId.includes(keys))
          .map(async (key) => redisClient.del(key))
      );
    }
  } catch (error) {
    console.log(`deleteSessions() method error: `, error);
  }
}
