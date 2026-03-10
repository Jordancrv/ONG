export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-this',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-this-too',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    name: process.env.DB_NAME ?? 'investiga_ods',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
    synchronize: (process.env.DB_SYNC ?? 'false') === 'true',
  },
});
