import fastifyPassportModule from 'fastify-passport';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import quizzesRoutes from '../modules/quizzes/quizzes.routes.js';
import uploadsRoutes from '../modules/uploads/uploads.routes.js';

const fastifyPassport = fastifyPassportModule.default;

async function publicRoutes(app) {
    app.register(authRoutes, { prefix: '/auth' });
}

/**
 * Private routes
 */
async function privateRoutes(app) {
  app.addHook(
    'preValidation',
    fastifyPassport.authorize('jwt'),
  );

  app.register(usersRoutes, { prefix: '/users' });
  app.register(quizzesRoutes, { prefix: '/quizzes' });
  app.register(uploadsRoutes, { prefix: '/uploads' });
}

export default async function routes(app) {
  app.register(publicRoutes);
  app.register(privateRoutes);
}