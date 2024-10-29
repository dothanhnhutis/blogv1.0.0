import { redisClient } from "@/redis/connection";
import { User, UserToken } from "@/schema/user";

export async function getUserCacheByEmail(email: string) {
  try {
    const id = await redisClient.get(`user:email:${email}`);
    if (!id) return;
    const userCache = await redisClient.get(`user:${id}`);
    if (!userCache) {
      await redisClient.del(`user:email:${email}`);
      return;
    }
    return JSON.parse(userCache) as User;
  } catch (error: unknown) {
    console.log(`getUserCacheByEmail() method error: `, error);
    return;
  }
}

export async function getUserCacheById(id: string) {
  try {
    const userCache = await redisClient.get(`user:${id}`);
    if (!userCache) {
      return;
    }
    return JSON.parse(userCache) as User;
  } catch (error: unknown) {
    console.log(`getUserCacheById() method error: `, error);
    return;
  }
}

export async function getUserCacheByToken(token: UserToken) {
  try {
    const id = await redisClient.get(`user:${token.type}:${token.session}`);
    if (!id) return;
    const userCache = await redisClient.get(`user:id:${id}`);
    if (!userCache) {
      await redisClient.del(`user:${token.type}:${token.session}`);
      return;
    }
    return JSON.parse(userCache) as User;
  } catch (error: unknown) {
    console.log(`getUserCacheByToken() method error: `, error);
    return;
  }
}

export async function saveUserCacheByToken(
  token: UserToken,
  userId: string,
  milliseconds: number
) {
  try {
    await redisClient.set(
      `user:${token.type}:${token.session}`,
      userId,
      "PX",
      milliseconds
    );
  } catch (error: unknown) {
    console.log(`saveUserCacheByToken() method error: `, error);
  }
}

export async function saveUserCache(user: User) {
  try {
    await redisClient.set(`user:${user.id}`, JSON.stringify(user));
    await redisClient.set(`user:email:${user.email}`, user.id);
  } catch (error: unknown) {
    console.log(`saveUserCache() method error: `, error);
  }
}
