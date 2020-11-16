import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifySensible from 'fastify-sensible';
import multer from 'fastify-multer';
import fastifyPassportModule from 'fastify-passport';
import fastifySecureSession from 'fastify-secure-session';
import fastifyWebsocket from 'fastify-websocket';

import config from './config/index.js';
import mongoose from './plugins/mongoose.js';
import passport from './plugins/passport.js';
import routes from './routes/index.js';

const fastifyPassport = fastifyPassportModule.default;

function websocketHandler(conn) {
  conn.pipe(conn);
}

async function start() {
  const app = fastify({
    logger: true,
  });

  try {
    /**
     * Community plugins
     */
    app.register(fastifyWebsocket, {
      handle: websocketHandler,
      options: { maxPayload: 1048576 }
    });
    app.register(fastifySecureSession, { key: config.secret });
    app.register(fastifyPassport.initialize());
    app.register(fastifyPassport.secureSession());
    app.register(passport);
    app.register(fastifySensible);
    app.register(multer.contentParser);
    app.register(fastifyCors);
    app.register(mongoose, config.plugins.mongoose);

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
