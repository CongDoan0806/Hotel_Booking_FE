import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing UPSTASH Redis credentials");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
export const connectRedis = () => {
  try {
    const client = redis;
    console.log("[Redis] Connected:", client !== undefined);
    return client;
  } catch (error) {
    console.error("[Redis] Connection error:", error);
    throw new Error("Failed to connect to Redis");
  }
};