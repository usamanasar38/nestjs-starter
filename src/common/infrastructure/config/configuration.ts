export default () => ({
  application: {
    port: parseInt(process.env.PORT as string, 10) || 3000,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  apiToken: process.env.API_AUTH_TOKEN,
});
