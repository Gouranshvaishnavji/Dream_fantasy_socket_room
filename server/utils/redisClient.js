import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // Important! Redis Cloud requires TLS
    reconnectStrategy: retries => {
      if (retries > 5) {
        console.error('Too many Redis reconnection attempts!');
        return new Error('Redis reconnection limit reached');
      }
      return 500; // retry after 500ms
    },
  },
});

redis.on('error', err => console.error(' Redis Client Error', err));
redis.on('connect', () => console.log(' Redis connected'));
redis.on('reconnecting', () => console.log(' Redis reconnecting...'));

await redis.connect();

export default redis;
