import fastifyPassportModule from 'fastify-passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import * as usersService from '../modules/users/users.service.js';
import config from '../config/index.js';

const fastifyPassport = fastifyPassportModule.default;

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function (app) {
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());

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