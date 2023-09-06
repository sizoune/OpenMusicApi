const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    tokenKey: process.env.ACCESS_TOKEN_KEY,
    tokenAge: process.env.ACCESS_TOKEN_AGE,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
    channelName: process.env.EXPORT_CHANNEL_NAME,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
