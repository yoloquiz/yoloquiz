import * as securityService from './security.service.js';
import * as schema from './security.schema.js';
import * as usersService from '../users/users.service.js';

export function loginRoute() {
  return {
    method: 'POST',
    schema: schema.login,
    url: '/login',
    handler: async (request, reply) => {
      try {
        const {
          email,
          password,
        } = request.body;

        const user = await usersService.findOneByEmail({ email });

        await securityService.isUserPasswordValid({ user, password });

        const token = securityService.getAccessToken({ user });

        return { token };
      } catch (error) {
        return reply.unauthorized();
      }
    },
  };
}

export function registerRoute(app) {
  return {
    method: 'POST',
    url: '/register',
    schema: schema.register,
    handler: async (request, reply) => {
      const {
        email,
        password,
        firstName,
        lastName,
      } = request.body;

      const user = await usersService.findOneByEmail({
        email,
      });

      if (user) {
        return reply.badRequest('Email is already taken. Please try to login instead.');
      }

      const token = await securityService.createUserAndGetAccessToken({
        email,
        password,
        firstName,
        lastName,
      });

      return { token };
    },
  }
}

export default async (app) => {
  app.route(loginRoute(app));
  app.route(registerRoute(app));
}
