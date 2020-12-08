import fastifyPassportModule from 'fastify-passport';

import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import config from '../config/index.js';
import * as usersService from '../modules/users/users.service.js';

const fastifyPassport = fastifyPassportModule.default;

export default async function (app) {
  const jwtStrategyOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ExtractJwt.fromUrlQueryParameter('token'),
    ])
  };

  fastifyPassport.use('jwt', new JwtStrategy(jwtStrategyOptions, async function (jwtPayload, done) {
    const { userId } = jwtPayload;

    const user = await usersService.findOneById({ userId });

    if (!user) {
      return done(null, false);
    }

    return done(null, {
      userId,
    });
  }));

  const googleStrategyOptions = {
    clientID: config.auth.google.clientId,
    clientSecret: config.auth.google.clientSecret,
    callbackURL: `${config.apiUrl}/api/auth/google/callback`
  };
  fastifyPassport.use('google', new GoogleStrategy(googleStrategyOptions, async function (accessToken, refreshToken, googleProfile, done) {
    const user = await usersService.findOneOrCreateFromGoogleProfile({ googleProfile, accessToken, refreshToken });

    if (!user) {
      app.log.warn({ googleProfile }, '[oauth#google] Unable to authenticate user');
      return done(null, false);
    }

    app.log.info({ userId: user._id }, '[oauth#google] User successfully authenticate');
    return done(null, {
      userId: user._id.toString(),
    });
  }));

  const facebookStrategyOptions = {
    clientID: config.auth.facebook.clientId,
    clientSecret: config.auth.facebook.clientSecret,
    callbackURL: `${config.apiUrl}/api/auth/facebook/callback`
  };
  fastifyPassport.use('facebook', new FacebookStrategy(facebookStrategyOptions, async function (accessToken, refreshToken, facebookProfile, done) {
    const user = await usersService.findOneOrCreateFromFacebookProfile({ facebookProfile, accessToken, refreshToken });

    if (!user) {
      app.log.warn({ facebookProfile }, '[oauth#facebook] Unable to authenticate user');
      return done(null, false);
    }

    app.log.info({ userId: user._id }, '[oauth#facebook] User successfully authenticate');
    return done(null, {
      userId: user._id.toString(),
    });
  }));
}