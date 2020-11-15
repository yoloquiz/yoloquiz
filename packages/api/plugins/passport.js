import fastifyPassportModule from 'fastify-passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from '../config/index.js';
import * as usersService from '../modules/users/users.service.js';

const fastifyPassport = fastifyPassportModule.default;

export default async function (app) {
  const jwtStrategyOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  fastifyPassport.use('jwt', new JwtStrategy(jwtStrategyOptions, async function (jwtPayload, done) {
    const { userId } = jwtPayload;

    const user = await usersService.findOneById({ userId });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  }));
}