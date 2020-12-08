import passport from 'fastify-passport';
import config from '../../config/index.js';
import * as authService from './auth.service.js';
import * as schema from './auth.schema.js';
import * as usersService from '../users/users.service.js';
import * as emailsService from '../emails/emails.service.js';

const fastifyPassport = passport.default;

export function loginRoute() {
  return {
    method: 'POST',
    schema: schema.login,
    url: '/login',
    handler: async (request, reply) => {
      const {
        email,
        password,
      } = request.body;
      try {
        const user = await usersService.findOneByEmail({ email }).select('password confirmed');

        await authService.isUserPasswordValid({ user, password });

        const token = authService.getAccessToken({ userId: user._id });

        if (!user.confirmed) {
          await emailsService.sendWelcomeToApp({
            toUser: user,
            accessToken: token,
          });
          throw new Error('Email is not confirmed');
        }
        
        request.log.info({ userId: user._id }, '[login] new login token generated');
        return { token };
      } catch (err) {
        request.log.warn({ email, err }, '[login] failed to login');
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

      try {
        await authService.registerUser({
          email,
          password,
          firstName,
          lastName,
        });
        return {
          status: 'success',
          message: 'Email confirmation required',
        }
      } catch (error) {
        app.log.error(error);
        reply.badRequest(error.message);
      }
    },
  }
}

export function recoveryRoute(app) {
  return {
    method: 'POST',
    url: '/recovery',
    schema: schema.recovery,
    handler: async (request, reply) => {
      const { email } = request.body;
      try {
        await authService.sendResetPasswordEmail({ email });
        reply.code(204).send();
      } catch (error) {
        app.log.error({ data: request.body, error });
        reply.badRequest(error.message);
      }
    }
  }
}

export function confirmAccountRoute(app) {
  return {
    method: 'GET',
    url: '/confirm',
    preValidation: fastifyPassport.authorize('jwt'),
    handler: async (request, reply) => {
      const { userId } = request.account;
      await authService.confirmAccount({ userId });
      const token = authService.getAccessToken({ userId });
      reply.redirect(302, `${config.appUrl}/auth?token=${token}`);
    }
  }
}

export function resetPasswordRoute(app) {
  return {
    method: 'POST',
    url: '/reset-password',
    preValidation: fastifyPassport.authorize('jwt'),
    handler: async (request, reply) => {
      const { userId } = request.account;
      const { password } = request.body;
      try {
        await usersService.updatePassword({ userId, password });
        return {
          status: 'success',
          message: 'Password updated successfully.',
        }
      } catch (error) {
        reply.badRequest(error.message);
      }
    }
  }
}

export function googleRoute(app) {
  return {
    method: 'GET',
    url: '/google',
    preValidation: fastifyPassport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']}),
    handler: (request, reply) => {},
  }
}

export function googleCallbackRoute(app) {
  return {
    method: 'GET',
    url: '/google/callback',
    preValidation: fastifyPassport.authenticate('google', { session: false, failureRedirect: `${config.appUrl}/register?msgKey=google.error` }),
    handler: (request, reply) => {
      const { userId } = request.user;
      const token = authService.getAccessToken({ userId, provider: 'google' });
      return reply.redirect(302, `${config.appUrl}/auth?token=${token}`);
    }
  }
}

export function facebookRoute(app) {
  return {
    method: 'GET',
    url: '/facebook',
    preValidation: fastifyPassport.authenticate('facebook', { scope: ['email'] }),
    handler: () => {}
  }
}

export function facebookCallbackRoute(app) {
  return {
    method: 'GET',
    url: '/facebook/callback',
    preValidation: fastifyPassport.authenticate('facebook', { session: false, failureRedirect: `${config.appUrl}/register?msgKey=facebook.error` }),
    handler: (request, reply) => {
      const { userId } = request.user;
      const token = authService.getAccessToken({ userId, provider: 'facebook' });
      return reply.redirect(302, `${config.appUrl}/auth?token=${token}`);
    }
  }
}

export default async (app) => {
  app.route(loginRoute(app));
  app.route(registerRoute(app));
  app.route(recoveryRoute(app));
  app.route(confirmAccountRoute(app));
  app.route(resetPasswordRoute(app));
  app.route(googleRoute(app));
  app.route(googleCallbackRoute(app));
  app.route(facebookRoute(app));
  app.route(facebookCallbackRoute(app));
}
