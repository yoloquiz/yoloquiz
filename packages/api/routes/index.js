import fastifyPassportModule from 'fastify-passport';
import securityRoutes from '../modules/security/security.routes.js';
import gamesRoutes from '../modules/games/games.routes.js';
import usersRoutes from '../modules/users/users.routes.js';

const fastifyPassport = fastifyPassportModule.default;

async function publicRoutes(app) {
  app.register(securityRoutes, { prefix: '/security' });
}

/**
 * Private routes
 */
async function privateRoutes(app) {
  app.addHook(
    'preValidation',
    fastifyPassport.authorize('jwt'),
  );

  app.register(gamesRoutes, { prefix: '/games' });
  app.register(usersRoutes, { prefix: '/users' });
}

export default async function routes(app) {
  app.register(publicRoutes);
  app.register(privateRoutes);
}