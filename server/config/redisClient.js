import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// no emojis here, just pure pain if fails now error are aded in server js too so double check
redisClient.on('error', (err) => console.log('redis client error again now no internship becouse', err));

await redisClient.connect();

export default redisClient;
