import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log('✅ Connected to Redis');
  }
  return redis; 
};

export { redis, connectRedis };
