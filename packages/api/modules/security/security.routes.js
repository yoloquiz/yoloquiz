import * as securityService from './security.service.js';
import * as schema from './security.schema.js';

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

        const user = await securityService.getUserFromAuthPayload({ email, password });

        if (!user) {
          return reply.unauthorized();
        }

        const token = securityService.getAccessToken({ user });

        return {
          token,
        };
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

      const user = await User.findOne({
        email,
      });

      if (!user) {
        return reply.badRequest();
      }

      const token = securityService.getAccessToken({ user });

      return { token };
    },
  }
}

export default async (app) => {
  app.route(loginRoute(app));
  app.route(registerRoute(app));
}
