export const config = {
  redis: {
    url: process.env.REDIS_URL || 'redis://:123@localhost:6379/0',
  },
  service: {
    gateway: {
      graphql: {
        host: process.env.GATEWAY_HOST || 'localhost',
        port: parseInt(process.env.GATEWAY_PORT || '3000', 10),
      },
    },
    adminpanel: {
      graphql: {
        host: process.env.ADMINPANEL_HOST || 'localhost',
        port: parseInt(process.env.ADMINPANEL_PORT || '4000', 10),
      },
    },
    identity: {
      tcp: {
        host: process.env.IDENTITY_TCP_HOST || 'localhost',
        port: parseInt(process.env.IDENTITY_TCP_PORT || '5001', 10),
      },
    },
    balance: {
      tcp: {
        host: process.env.BALANCE_TCP_HOST || 'localhost',
        port: parseInt(process.env.BALANCE_TCP_PORT || '5002', 10),
      },
    },
    games: {
      tcp: {
        host: process.env.GAMES_TCP_HOST || 'localhost',
        port: parseInt(process.env.GAMES_TCP_PORT || '3005', 10),
      },
      http: {
        host: process.env.GAMES_HTTP_HOST || 'localhost',
        port: parseInt(process.env.GAMES_HTTP_PORT || '3005', 10),
      },
    },
  },
};
