export default {
  secret: process.env.APP_SECRET || 'default',
  port: process.env.APP_PORT || 3000,
  plugins: {
    mongoose: {
      mongoUri: process.env.APP_MONGO_URI || 'mongodb://localhost:27017/yoloquiz',
    },
  },
}; 