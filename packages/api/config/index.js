export default {
  secret: process.env.APP_SECRET || '9lzytxj5w91i9279czk15qovs5d76fuufprx4y5h2b5he9tb',
  port: process.env.APP_PORT || 3000,
  plugins: {
    mongoose: {
      mongoUri: process.env.APP_MONGO_URI || 'mongodb://localhost:27017/yoloquiz',
    },
  },
}; 