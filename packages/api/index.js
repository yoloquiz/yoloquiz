import fastify from 'fastify';

import fastifyPassportModule from 'fastify-passport';
import multer from 'fastify-multer';
import fastifyCors from 'fastify-cors';

import config from './config/index.js';
import mongoose from './plugins/mongoose.js';
import client from './plugins/client.js';
import passport from './plugins/passport.js';
import routes from './routes/index.js';

const fastifyPassport = fastifyPassportModule.default;

async function start() {
  const app = fastify({
    logger: true,
  });

  try {
    /**
     * Community plugins
     */
    // app.register(passport);
    app.register(multer.contentParser);
    app.register(fastifyCors);
    app.register(mongoose, config.plugins.mongoose);
    app.register(client, config.plugins.client);

    /**
     * App modules
     */
    app.register(routes);

    await app.listen(config.port, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
