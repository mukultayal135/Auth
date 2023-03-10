const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
});
redisClient.connect();

redisClient.on('error', (err) => {
  console.log('Redis Connection error: ', err.message);
});
const storeToken = async (token, username) => {
  await redisClient.set(username, token, 'EX', 3600);
  // redisClient.disconnect();
};
const getToken = async (username) => {
  const token = await redisClient.get(username);
  // redisClient.disconnect();
  return token;
};

module.exports = { storeToken, getToken };
