import fastifyPassportModule from 'fastify-passport';

import securityRoutes from '../modules/security/security.routes.js';
import quizzesRoutes from '../modules/quizzes/quizzes.routes.js';
import usersRoutes from '../modules/users/users.routes.js';

const fastifyPassport = fastifyPassportModule.default;

export default async function routes(app) {
  // PUBLIC Routes
  app.register(securityRoutes, { prefix: '/security' });
  
  // PRIVATE Routes
  app.addHook(
    'preValidation',
    fastifyPassport.authorize('jwt'),
  );
  app.register(quizzesRoutes, { prefix: '/quizzes' });
  app.register(usersRoutes, { prefix: '/users' });
}