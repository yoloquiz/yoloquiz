import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  secret: process.env.APP_SECRET || 'default',
  port: process.env.APP_PORT || 3000,
  plugins: {
    client: {
      staticFolder: join(__dirname, '../app/dist'),
    },
    mongoose: {
      mongoUri: process.env.APP_MONGO_URI || 'mongodb://localhost:27017/yoloquiz',
    },
  },
}; 