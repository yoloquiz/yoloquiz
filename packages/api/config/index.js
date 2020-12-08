import 'dotenv/config.js';

export default {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  appUrl: process.env.APP_URL || 'http://localhost:8080',
  secret: process.env.SECRET || '9lzytxj5w91i9279czk15qovs5d76fuufprx4y5h2b5he9tb',
  port: process.env.PORT || 3000,
  auth: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
    },
  },
  mailgun: {
    domain: process.env.MAILGUN_DOMAIN || 'yoloquiz.skyloud.app',
    apiKey: process.env.MAILGUN_API_KEY,
    webhookKey: process.env.MAILGUN_WEBHOOK_KEY || 'fake',
    from: process.env.MAILGUN_FROM || 'YoloQuiz <noreply@yoloquiz.skyloud.app>',
  },
  plugins: {
    mongoose: {
      mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/yoloquiz',
    },
  },

};