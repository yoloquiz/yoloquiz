import * as schema from './users.schema.js';
import * as usersService from '../users/users.service.js';

export function meRoute(app) {
  return {
    method: 'GET',
    url: '/me',
    handler: async (request) => {
      const { userId } = request.account;

      return usersService.findOneById({ userId });
    },
  }
}

export function updateProfileRoute(app) {
  return {
    method: 'PATCH',
    url: '/me',
    schema: schema.updateProfile,
    handler: async (request, reply) => {
      const { userId } = request.account;
      const { firstName, lastName } = request.body;

      await usersService.updateProfile({ userId, firstName, lastName });
      
      reply.code(204).send();
    }
  }
}

export default async (app) => {
  app.route(meRoute(app));
  app.route(updateProfileRoute(app));
}
