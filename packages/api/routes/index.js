import fastifyPassportModule from 'fastify-passport';
import securityRoutes from '../modules/security/security.routes.js';
import quizzesRoutes from '../modules/quizzes/quizzes.routes.js';
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

  app.register(quizzesRoutes, { prefix: '/quizzes' });
  app.register(usersRoutes, { prefix: '/users' });
}

export default async function routes(app) {
  app.register(publicRoutes);
  app.register(privateRoutes);
}